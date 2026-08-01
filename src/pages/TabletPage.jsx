import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { marked } from 'marked';
import { base44 } from '@/api/client';

// Every plain Enter becomes a visible line break; a blank line still starts a
// genuinely new paragraph. Any raw HTML already typed in a tablet passes
// through unchanged — Markdown only acts on the parts written in Markdown.
marked.setOptions({ breaks: true });
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ReadingProgress from '@/components/ReadingProgress';
import RelatedReadingPanel from '@/components/RelatedReadingPanel';
import { DraftNotice } from '@/components/AdminBar';

const HALL_META = {
  trikka:    { letter: 'Α', name: 'Trikka',    discipline: 'Anatomy' },
  epidaurus: { letter: 'Β', name: 'Epidaurus', discipline: 'Physiology' },
  kos:       { letter: 'Γ', name: 'Kos',       discipline: 'Biochemistry' },
  pergamon:  { letter: 'Δ', name: 'Pergamon',  discipline: 'Histopathology' },
  athens:    { letter: 'Ε', name: 'Athens',    discipline: 'Ethics' },
};

export default function TabletPage() {
  const { tabletId } = useParams();
  const [tablet, setTablet] = useState(null);
  const [hall, setHall] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setHall(null);
      setChapter(null);
      try {
        const ch = await base44.entities.Tablet.get(tabletId);
        setTablet(ch);
        if (ch.hall_id) setHall(await base44.entities.Hall.get(ch.hall_id));
        if (ch.chapter_id) setChapter(await base44.entities.Chapter.get(ch.chapter_id));
      } catch (err) {
        console.error(err);
        setTablet(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [tabletId]);

  useEffect(() => {
    document.title = tablet ? `${tablet.title} — Asklepieion` : 'Asklepieion';
  }, [tablet]);

  if (loading) return (
    <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center">
      <div className="w-6 h-6 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
    </div>
  );

  if (!tablet) return (
    <div className="min-h-screen bg-[#0E0C09] flex flex-col items-center justify-center gap-4">
      <span className="font-heading text-[#2A2620] text-5xl">⚕</span>
      <p className="label-caps text-[#3A3530] tracking-widest">Tablet not found</p>
      <Link to="/archive" className="label-caps text-[#C9A84C] text-[9px] tracking-[0.2em] mt-2">← The Archive</Link>
    </div>
  );

  const hallSlug = hall?.slug || '';
  const hallMeta = HALL_META[hallSlug];
  const hasRelated =
    (tablet.cross_references?.length > 0) || (tablet.related_reading?.length > 0);

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <ReadingProgress />
      <SiteNav />

      <div className="max-w-screen-xl mx-auto px-8 pt-24 pb-4">
        <div className="flex items-center gap-3">
          {hallSlug && (
            <Link
              to={`/hall/${hallSlug}`}
              className="flex items-center gap-2 label-caps text-[#7A7268] hover:text-[#C9A84C] transition-colors duration-200 text-[9px] tracking-[0.2em]"
            >
              <ArrowLeft size={10} />
              {hallMeta?.letter && <span className="text-[#C9A84C]">{hallMeta.letter}</span>}
              {hall?.name}
            </Link>
          )}
          {chapter && (
            <>
              <span className="text-[#2A2620]">/</span>
              <span className="label-caps text-[#3A3530] text-[9px] tracking-[0.15em]">{chapter.title}</span>
            </>
          )}
        </div>
      </div>

      <header className="max-w-screen-xl mx-auto px-8 pb-12 border-b border-[#1A1815]">
        <div className="max-w-3xl">
          {hallMeta && (
            <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em] mb-4 opacity-70">
              Hall of {hall?.name} · {hallMeta.discipline}
            </div>
          )}
          <h1 className="font-heading font-light mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1', letterSpacing: '-0.01em' }}>
            {tablet.title}
          </h1>

          <div className="flex items-center gap-6">
            {tablet.reading_time_minutes && (
              <div className="flex items-center gap-2 label-caps text-[#3A3530] text-[9px] tracking-[0.15em]">
                <Clock size={10} />
                {tablet.reading_time_minutes} min read
              </div>
            )}
            {tablet.cross_references?.length > 0 && (
              <div className="flex items-center gap-2 label-caps text-[#3A3530] text-[9px] tracking-[0.15em]">
                <BookOpen size={10} />
                {tablet.cross_references.length} cross-references
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-8 py-16 pb-32 flex gap-12">
        <article className="flex-1 min-w-0">
          {/* Only ever rendered for you — the public never receives a draft. */}
          <DraftNotice status={tablet.status} />
          <div
            className="prose-sanctum"
            dangerouslySetInnerHTML={{
              __html: tablet.body
                ? marked.parse(tablet.body)
                : '<p style="color:#3A3530;font-style:italic">This tablet has no content yet.</p>',
            }}
          />

          {/* Related reading — shown inline on narrow screens */}
          {hasRelated && (
            <div className="xl:hidden mt-16 pt-8 border-t border-[#1A1815]">
              <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.25em] mb-6">Related Reading</div>
              <div className="flex flex-col gap-3">
                {[...(tablet.related_reading || []), ...(tablet.cross_references || [])].map((ref, i) => (
                  <Link
                    key={i}
                    to={`/tablet/${ref.tablet_id}`}
                    className="flex items-center justify-between py-3 border-b border-[#1A1815] group"
                  >
                    <div>
                      <div className="label-caps text-[#3A3530] text-[8px] mb-1">{ref.hall_name}</div>
                      <div style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.9rem', color: '#A89880' }} className="group-hover:text-[#E2DED0] transition-colors">
                        {ref.label || ref.tablet_title}
                      </div>
                    </div>
                    <span className="text-[#C9A84C] opacity-0 group-hover:opacity-60 transition-opacity ml-4">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <RelatedReadingPanel
          crossReferences={tablet.cross_references}
          relatedReading={tablet.related_reading}
        />
      </div>

      <SiteFooter />
    </div>
  );
}
