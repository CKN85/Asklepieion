import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/client';
import useSession from '@/hooks/useSession';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { DraftBadge } from '@/components/AdminBar';

const GREEK_NUMERALS = ['Α','Β','Γ','Δ','Ε','Ϛ','Ζ','Η','Θ','Ι','ΙΑ','ΙΒ','ΙΓ','ΙΔ','ΙΕ','ΙϚ'];

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
      window.scrollTo(0, 0);

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
    const m = {};
    tablets.forEach(c => {
      const key = c.chapter_id || 'unfiled';
      (m[key] = m[key] || []).push(c);
    });
    return m;
  }, [tablets]);

  if (loading) return (
    <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center">
      <div className="w-6 h-6 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
    </div>
  );

  if (!hall) return (
    <div className="min-h-screen bg-[#0E0C09] flex flex-col items-center justify-center gap-4">
      <span className="font-heading text-[#2A2620] text-5xl">⚕</span>
      <p className="label-caps text-[#3A3530] tracking-widest">No such hall</p>
      <Link to="/" className="label-caps text-[#C9A84C] text-[9px] tracking-[0.2em] mt-2">← The Sanctuary</Link>
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
        <span className="text-[#C9A84C] opacity-0 group-hover:opacity-60 transition-opacity">→</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <SiteNav />

      <div className="max-w-screen-xl mx-auto px-8 pt-28">
        <Link to="/" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.2em] transition-colors w-fit">
          <ArrowLeft size={10} /> The Sanctuary
        </Link>
      </div>

      <header className="max-w-2xl mx-auto px-8 pt-14 pb-12 text-center">
        <div className="w-16 h-16 mx-auto mb-7 border border-[#C9A84C]/40 rounded-full flex items-center justify-center">
          <span className="font-heading text-[#C9A84C] text-2xl font-light">{hall.greek_letter}</span>
        </div>
        <h1 className="font-heading font-light" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.08em' }}>
          HALL OF {hall.name.toUpperCase()}
        </h1>
        <div className="label-caps text-[#3A3530] text-[9px] tracking-[0.3em] mt-5">
          {hall.latin_name}
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
                    <span className="font-heading text-[#C9A84C] text-sm">{GREEK_NUMERALS[i] || i + 1}</span>
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
