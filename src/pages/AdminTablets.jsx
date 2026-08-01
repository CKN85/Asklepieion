import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { base44 } from '@/api/client';

const HALL_LETTERS = { trikka: 'Α', epidaurus: 'Β', kos: 'Γ', pergamon: 'Δ', athens: 'Ε' };

export default function AdminTablets() {
  const [tablets, setTablets] = useState([]);
  const [halls, setHalls] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hallFilter, setHallFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const [chaps, hs, secs] = await Promise.all([
        base44.entities.Tablet.list('-updated_date', 200),
        base44.entities.Hall.list(),
        base44.entities.Chapter.list(),
      ]);
      setTablets(chaps);
      setHalls(hs.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setChapters(secs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const hallMap = useMemo(() => {
    const m = {}; halls.forEach(h => { m[h.id] = h; }); return m;
  }, [halls]);

  const chapterMap = useMemo(() => {
    const m = {}; chapters.forEach(s => { m[s.id] = s; }); return m;
  }, [chapters]);

  const filtered = useMemo(() => {
    let result = tablets;
    if (filter !== 'all') result = result.filter(c => c.status === filter);
    if (hallFilter !== 'all') {
      const hall = halls.find(h => h.slug === hallFilter);
      if (hall) result = result.filter(c => c.hall_id === hall.id);
    }
    return result;
  }, [tablets, filter, hallFilter, halls]);

  const deleteTablet = async (id) => {
    if (!window.confirm('Delete this tablet? This cannot be undone.')) return;
    await base44.entities.Tablet.delete(id);
    setTablets(prev => prev.filter(c => c.id !== id));
  };

  const togglePublish = async (tablet) => {
    const newStatus = tablet.status === 'published' ? 'draft' : 'published';
    await base44.entities.Tablet.update(tablet.id, { status: newStatus });
    setTablets(prev => prev.map(c => (c.id === tablet.id ? { ...c, status: newStatus } : c)));
  };

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <div className="bg-[#0E0C09] border-b border-[#1A1815] px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <ArrowLeft size={11} /> Dashboard
          </Link>
          <span className="text-[#1A1815]">/</span>
          <span className="label-caps text-[#7A7268] text-[9px] tracking-[0.15em]">Tablets</span>
        </div>
        <Link to="/admin/tablets/new" className="flex items-center gap-1.5 label-caps text-[#C9A84C] text-[9px] tracking-[0.15em] border border-[#C9A84C]/40 px-4 py-1.5 hover:bg-[#C9A84C]/10 transition-all">
          <Plus size={10} /> New Tablet
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em] mb-3">Corpus</div>
        <h1 className="font-heading text-4xl font-light mb-10">All Tablets</h1>

        <div className="flex flex-wrap gap-3 mb-8">
          {['all', 'published', 'draft'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`label-caps text-[9px] tracking-[0.15em] px-4 py-1.5 border transition-all duration-200 ${filter === f ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[#2A2620] text-[#3A3530] hover:border-[#3A3530]'}`}
            >
              {f === 'all' ? 'All' : f === 'published' ? 'Published' : 'Drafts'}
            </button>
          ))}
          <div className="w-px bg-[#1A1815] mx-1" />
          {[{ slug: 'all', label: 'All Halls' }, ...halls.map(h => ({ slug: h.slug, label: h.name }))].map(f => (
            <button key={f.slug} onClick={() => setHallFilter(f.slug)}
              className={`label-caps text-[9px] tracking-[0.15em] px-4 py-1.5 border transition-all duration-200 ${hallFilter === f.slug ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[#2A2620] text-[#3A3530] hover:border-[#3A3530]'}`}
            >
              {f.slug !== 'all' && <span className="font-heading text-[#C9A84C] mr-1">{HALL_LETTERS[f.slug]}</span>}
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="label-caps text-[#2A2620] tracking-widest">No tablets found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map(ch => {
              const h = hallMap[ch.hall_id];
              const s = chapterMap[ch.chapter_id];
              return (
                <div key={ch.id} className="flex items-center justify-between py-3.5 border-b border-[#1A1815] group">
                  <div className="flex items-center gap-4 min-w-0">
                    {h && (
                      <span className="font-heading text-lg text-[#2A2620] group-hover:text-[#C9A84C] transition-colors shrink-0" style={{ fontWeight: 300 }}>
                        {HALL_LETTERS[h.slug] || h.greek_letter}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-heading text-lg font-light text-[#A89880] group-hover:text-[#E2DED0] transition-colors truncate">{ch.title}</div>
                      {s && <div className="label-caps text-[#3A3530] text-[8px] mt-0.5">{h?.name} · {s.title}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className={`label-caps text-[8px] px-2 py-0.5 border hidden sm:block ${ch.status === 'published' ? 'border-[#C9A84C]/30 text-[#C9A84C]' : 'border-[#2A2620] text-[#3A3530]'}`}>
                      {ch.status || 'draft'}
                    </span>
                    <button onClick={() => togglePublish(ch)} className="text-[#3A3530] hover:text-[#7A7268] transition-colors opacity-0 group-hover:opacity-100" title={ch.status === 'published' ? 'Unpublish' : 'Publish'}>
                      {ch.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <Link to={`/admin/tablets/${ch.id}/edit`} className="text-[#3A3530] hover:text-[#C9A84C] transition-colors opacity-0 group-hover:opacity-100">
                      <Pencil size={13} />
                    </Link>
                    <button onClick={() => deleteTablet(ch.id)} className="text-[#3A3530] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
