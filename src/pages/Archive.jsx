import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { base44 } from '@/api/client';
import useSession from '@/hooks/useSession';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { DraftBadge } from '@/components/AdminBar';

const HALL_LETTERS = { trikka: 'Α', epidaurus: 'Β', kos: 'Γ', pergamon: 'Δ', athens: 'Ε' };
const HALL_DISCIPLINES = { trikka: 'Anatomy', epidaurus: 'Physiology', kos: 'Biochemistry', pergamon: 'Histopathology', athens: 'Ethics' };

export default function Archive() {
  const { isAdmin, checking } = useSession();
  const [query, setQuery] = useState('');
  const [tablets, setTablets] = useState([]);
  const [halls, setHalls] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeHall, setActiveHall] = useState('all');

  useEffect(() => {
    if (checking) return;

    const load = async () => {
      setLoading(true);
      try {
        const [chaps, hs, secs] = await Promise.all([
          isAdmin
            ? base44.entities.Tablet.list('-updated_date', 500)
            : base44.entities.Tablet.filter({ status: 'published' }),
          base44.entities.Hall.list(),
          base44.entities.Chapter.list(),
        ]);
        setTablets(chaps);
        setHalls(hs.sort((a, b) => (a.order || 0) - (b.order || 0)));
        setChapters(secs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin, checking]);

  const chapterMap = useMemo(() => {
    const m = {}; chapters.forEach(s => { m[s.id] = s; }); return m;
  }, [chapters]);

  const hallMap = useMemo(() => {
    const m = {}; halls.forEach(h => { m[h.id] = h; }); return m;
  }, [halls]);

  const filtered = useMemo(() => {
    let result = tablets;
    if (activeHall !== 'all') {
      const hall = halls.find(h => h.slug === activeHall);
      if (hall) result = result.filter(c => c.hall_id === hall.id);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.body?.toLowerCase().includes(q) ||
        chapterMap[c.chapter_id]?.title?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tablets, query, activeHall, halls, chapterMap]);

  const grouped = useMemo(() => {
    const groups = {};
    [...filtered]
      .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
      .forEach(ch => {
        const letter = ch.title?.[0]?.toUpperCase() || '#';
        (groups[letter] = groups[letter] || []).push(ch);
      });
    return groups;
  }, [filtered]);

  const alphabet = Object.keys(grouped).sort();
  const draftCount = tablets.filter(c => c.status !== 'published').length;

  return (
    <div className="min-h-screen text-[#E2DED0]">
      <SiteNav />

      <header className="pt-32 pb-16 px-8 border-b border-[#1A1815]">
        <div className="max-w-screen-xl mx-auto">
          <div className="label-caps text-[#3F8A66] text-[9px] tracking-[0.3em] mb-4">Index &amp; Search</div>
          <h1 className="font-heading font-light mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', letterSpacing: '-0.01em' }}>
            The Archive
          </h1>

          <div className="relative max-w-xl">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A3530]" />
            <input
              type="text"
              placeholder="Search tablets, topics, disciplines..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] pl-10 pr-4 py-3 focus:outline-none focus:border-[#3F8A66] transition-colors duration-200"
              style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.9rem' }}
            />
          </div>

          {isAdmin && draftCount > 0 && (
            <p className="label-caps text-[#3F8A66] text-[8px] tracking-[0.2em] mt-4 opacity-70">
              Including {draftCount} unpublished {draftCount === 1 ? 'draft' : 'drafts'}
            </p>
          )}
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-8 py-12 pb-32">
        <div className="flex flex-wrap gap-2 mb-12">
          {[
            { slug: 'all', label: 'All Halls', letter: '·' },
            ...halls.map(h => ({ slug: h.slug, label: h.name, letter: HALL_LETTERS[h.slug] || h.greek_letter })),
          ].map(f => (
            <button
              key={f.slug}
              onClick={() => setActiveHall(f.slug)}
              className={`flex items-center gap-2 px-4 py-2 border transition-all duration-200 label-caps text-[9px] tracking-[0.15em] ${
                activeHall === f.slug
                  ? 'border-[#3F8A66] text-[#3F8A66] bg-[#3F8A66]/5'
                  : 'border-[#2A2620] text-[#3A3530] hover:border-[#3A3530] hover:text-[#7A7268]'
              }`}
            >
              <span className="font-heading text-sm">{f.letter}</span>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-6 h-6 border border-[#3A3530] border-t-[#3F8A66] rounded-full animate-spin" />
          </div>
        ) : alphabet.length === 0 ? (
          <div className="text-center py-24">
            <div className="font-heading text-[#2A2620] text-4xl mb-4">⚕</div>
            <p className="label-caps text-[#3A3530] tracking-widest">
              {query ? 'No tablets match your search' : 'No tablets published yet'}
            </p>
          </div>
        ) : (
          <div>
            {alphabet.map(letter => (
              <div key={letter} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-heading text-3xl font-light text-[#2A2620]">{letter}</span>
                  <div className="h-px bg-[#1A1815] flex-1" />
                </div>

                <div className="flex flex-col gap-1">
                  {grouped[letter].map(tablet => {
                    const h = hallMap[tablet.hall_id];
                    const s = chapterMap[tablet.chapter_id];
                    const hSlug = h?.slug || '';
                    return (
                      <Link
                        key={tablet.id}
                        to={`/tablet/${tablet.id}`}
                        className="flex items-center justify-between py-3 border-b border-[#1A1815] group gap-4"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          {h && (
                            <span className="font-heading text-[#3F8A66] text-lg shrink-0 w-6 opacity-60 group-hover:opacity-100 transition-opacity">
                              {HALL_LETTERS[hSlug] || h.greek_letter}
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5">
                              <div className="font-heading text-lg font-light text-[#A89880] group-hover:text-[#E2DED0] transition-colors truncate">
                                {tablet.title}
                              </div>
                              {isAdmin && <DraftBadge status={tablet.status} />}
                            </div>
                            {s && (
                              <div className="label-caps text-[#3A3530] text-[8px] mt-0.5">
                                {HALL_DISCIPLINES[hSlug] || h?.name} · {s.title}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-4 shrink-0">
                          {tablet.reading_time_minutes && (
                            <span className="hidden sm:block label-caps text-[#2A2620] text-[8px]">
                              {tablet.reading_time_minutes} min
                            </span>
                          )}
                          <span className="text-[#3F8A66] opacity-0 group-hover:opacity-60 transition-opacity">→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
