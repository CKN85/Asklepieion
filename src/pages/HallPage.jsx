import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/client';
import useSession from '@/hooks/useSession';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { DraftBadge } from '@/components/AdminBar';

const GREEK_NUMERALS = ['Α','Β','Γ','Δ','Ε','Ϛ','Ζ','Η','Θ','Ι','ΙΑ','ΙΒ','ΙΓ','ΙΔ','ΙΕ','ΙϚ'];

// Not stored in Supabase — this is stable, foundational copy that doesn't
// need admin editing, so it lives here rather than adding a schema column.
const HALL_DESCRIPTIONS = {
  trikka: "Trikka (modern Trikala) is where ancient tradition placed Asclepius's birth, and by some accounts the oldest of the healing sanctuaries — the point everything else traces back to. That made it the obvious first Hall. Anatomy occupies the same position in the curriculum that Trikka occupies in the mythology: not the most sophisticated subject, but the one everything else is built from. You cannot study how a system works, what a molecule does inside it, or how disease damages it, without first knowing what it looks like and where it sits. Origin, in both senses.",
  epidaurus: "Epidaurus was the largest and most complete Asklepieion ever built — not a single temple but an entire complex of theatre, stadium, baths, and dormitory, each part built separately but engineered to function as one working whole. That is exactly what physiology studies in the body: not any one organ in isolation, but how the cardiovascular, respiratory, renal, and every other system depend on and regulate each other to keep a person alive. Epidaurus earned the title \"mother sanctuary\" because roughly two hundred smaller Asklepieia were founded in its image. Physiology earns its Hall for the same reason — it's the discipline everything else in medicine is modeled after.",
  kos: "Kos was Hippocrates's home, and the birthplace of humoral theory — the idea, wrong in its specifics but right in its instinct, that health was a matter of internal substances in balance, and illness was that balance disturbed. That's a description of biochemistry two thousand years before the word existed. Modern biochemistry replaced blood, phlegm, and bile with hormones, enzymes, and metabolites, but the underlying claim survived intact: what happens at the molecular level inside you determines whether you're well. Kos didn't get the theory right. It got the question right, which mattered more.",
  pergamon: "Pergamon is where Galen trained, and later where he treated the wounds of gladiators — a job that gave him more direct, repeated exposure to torn and damaged tissue than almost any physician of his era. Everything he learned about the body's structure under stress, he learned from looking directly at what injury had done to it. That's histopathology's whole method, still: examine the tissue itself, and read the disease process — inflammation, infection, neoplasia — from what it has visibly done. Pergamon also held one of the ancient world's great libraries, second only to Alexandria's. Direct observation and accumulated record, side by side, is still how this Hall works.",
  athens: "Its Asklepieion sat just below the Acropolis, a short walk from the Areopagus — the court where matters of conscience were judged — and from the streets where Socrates, Plato, and Aristotle spent their lives asking what a good life actually required. A more fitting role for Athens in this analogy is not the gate alone but the wall around the whole sanctuary — the boundary that encompasses every other Hall, rather than a fifth subject standing beside them. Ethics was never a body of technical knowledge to be mastered once and filed away. It's the condition inside which anatomy, physiology, biochemistry, and pathology are all practiced — which is why it surrounds the sanctuary rather than occupying one room within it, and why every Asclepiad works inside it constantly, not just on the way through the gate.",
};

export default function HallPage() {
  const { hallSlug } = useParams();
  const { isAdmin, checking } = useSession();
  const [hall, setHall] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait until we know whether we're signed in — otherwise we'd fetch as a
    // stranger first and miss the drafts.
    if (checking) return;

    // If isAdmin resolves a second time after this effect already started
    // (a stale response arriving late), don't let it clobber a newer result.
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      let h = null;
      try {
        const halls = await base44.entities.Hall.filter({ slug: hallSlug });
        if (cancelled) return;
        h = halls[0] || null;
        setHall(h);
      } catch (err) {
        console.error('Could not look up this hall:', err);
        if (!cancelled) setHall(null);
      }

      // A failure here means the hall itself is fine but its contents
      // couldn't load — that should never blank out a hall we already found.
      if (h) {
        try {
          const tabletQuery = isAdmin
            ? { hall_id: h.id }                        // drafts included
            : { hall_id: h.id, status: 'published' };
          const [secs, chaps] = await Promise.all([
            base44.entities.Chapter.filter({ hall_id: h.id }),
            base44.entities.Tablet.filter(tabletQuery),
          ]);
          if (cancelled) return;
          setChapters(secs.sort((a, b) => (a.order || 0) - (b.order || 0)));
          setTablets(chaps);
        } catch (err) {
          console.error('Could not load this hall\'s chapters/tablets:', err);
          // Intentionally not touching `hall` here — see comment above.
        }
      }

      if (!cancelled) setLoading(false);
    };
    load();

    return () => { cancelled = true; };
  }, [hallSlug, isAdmin, checking]);

  useEffect(() => {
    document.title = hall ? `Hall of ${hall.name} — Asklepieion` : 'Asklepieion';
  }, [hall]);

  const tabletsByChapter = useMemo(() => {
    // Manual drag order (set from /admin/halls) wins; ties fall back to
    // insertion order, so tablets from before the ordering feature existed
    // still show up in a stable order rather than jumping around.
    const sorted = [...tablets].sort((a, b) => (a.order || 0) - (b.order || 0));
    const m = {};
    sorted.forEach(c => {
      const key = c.chapter_id || 'unfiled';
      (m[key] = m[key] || []).push(c);
    });
    return m;
  }, [tablets]);

  if (loading) return (
    <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center">
      <div className="w-6 h-6 border border-[#3A3530] border-t-[#3F8A66] rounded-full animate-spin" />
    </div>
  );

  if (!hall) return (
    <div className="min-h-screen bg-[#0E0C09] flex flex-col items-center justify-center gap-4">
      <span className="font-heading text-[#2A2620] text-5xl">⚕</span>
      <p className="label-caps text-[#3A3530] tracking-widest">No such hall</p>
      <Link to="/" className="label-caps text-[#3F8A66] text-[9px] tracking-[0.2em] mt-2">← The Sanctuary</Link>
    </div>
  );

  const unfiled = tabletsByChapter['unfiled'] || [];

  const TabletRow = ({ ch }) => (
    <Link
      to={`/tablet/${ch.id}`}
      className="flex items-center justify-between py-3 border-b border-[#1A1815] group gap-4"
    >
      <span className="flex items-center gap-3 min-w-0">
        <span
          style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1rem', color: '#A89880' }}
          className="group-hover:text-[#E2DED0] transition-colors truncate"
        >
          {ch.title}
        </span>
        {isAdmin && <DraftBadge status={ch.status} />}
      </span>
      <span className="flex items-center gap-4 shrink-0">
        {ch.reading_time_minutes && (
          <span className="label-caps text-[#2A2620] text-[8px] hidden sm:block">
            {ch.reading_time_minutes} min
          </span>
        )}
        <span className="text-[#3F8A66] opacity-0 group-hover:opacity-60 transition-opacity">→</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen text-[#E2DED0]">
      <SiteNav />

      <div className="max-w-screen-xl mx-auto px-8 pt-28">
        <Link to="/" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.2em] transition-colors w-fit">
          <ArrowLeft size={10} /> The Sanctuary
        </Link>
      </div>

      <header className="max-w-3xl mx-auto px-8 pt-16 pb-14">
        <div className="relative">
          <span
            aria-hidden="true"
            className="font-heading select-none pointer-events-none absolute"
            style={{
              fontSize: 'clamp(7rem, 16vw, 11.5rem)',
              color: '#191611',
              lineHeight: 1,
              left: '-0.4rem',
              top: '-1.1rem',
              zIndex: 0,
            }}
          >
            {hall.greek_letter}
          </span>
          <div className="relative pl-24 sm:pl-32" style={{ zIndex: 1 }}>
            <div className="label-caps text-[9px] tracking-[0.25em]" style={{ color: '#6B9E82' }}>
              Hall of {hall.name}
            </div>
            <h1 className="font-heading font-light mt-2" style={{ fontSize: 'clamp(2.4rem, 6vw, 3.8rem)' }}>
              {hall.latin_name}
            </h1>
            <div className="h-px w-20 mt-6 mb-6" style={{ background: '#3F8A66' }} />
            <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontStyle: 'italic', color: '#A89880', fontSize: '1.02rem', lineHeight: '1.85' }}>
              {HALL_DESCRIPTIONS[hall.slug] || ''}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-8 pb-32">
        {chapters.length === 0 && tablets.length === 0 ? (
          <p className="label-caps text-[#2A2620] tracking-widest text-center py-16">
            Nothing inscribed in this hall yet
          </p>
        ) : (
          <>
            {chapters.map((chapter, i) => {
              const inChapter = tabletsByChapter[chapter.id] || [];
              return (
                <div key={chapter.id} className="mb-12">
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="font-heading text-[#3F8A66] text-sm">{GREEK_NUMERALS[i] || i + 1}</span>
                    <h2 className="font-heading text-xl font-light">{chapter.title}</h2>
                    <div className="h-px bg-[#1A1815] flex-1" />
                  </div>

                  {inChapter.length === 0 ? (
                    <p className="label-caps text-[#2A2620] text-[9px] tracking-widest pl-9">No tablets yet</p>
                  ) : (
                    <div className="flex flex-col pl-9">
                      {inChapter.map(ch => <TabletRow key={ch.id} ch={ch} />)}
                    </div>
                  )}
                </div>
              );
            })}

            {unfiled.length > 0 && (
              <div className="mb-12">
                <div className="flex items-baseline gap-4 mb-5">
                  <h2 className="font-heading text-xl font-light text-[#7A7268]">Unfiled</h2>
                  <div className="h-px bg-[#1A1815] flex-1" />
                </div>
                <div className="flex flex-col">
                  {unfiled.map(ch => <TabletRow key={ch.id} ch={ch} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
