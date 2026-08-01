import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, Pencil, Trash2, ArrowLeft, Check, X } from 'lucide-react';
import { base44 } from '@/api/client';

// Only used if the halls table is somehow empty — schema.sql already seeds these.
const HALL_DEFAULTS = [
  { name: 'Trikka', greek_letter: 'Α', latin_name: 'Anatomy', slug: 'trikka', order: 1 },
  { name: 'Epidaurus', greek_letter: 'Β', latin_name: 'Physiology', slug: 'epidaurus', order: 2 },
  { name: 'Kos', greek_letter: 'Γ', latin_name: 'Biochemistry', slug: 'kos', order: 3 },
  { name: 'Pergamon', greek_letter: 'Δ', latin_name: 'Histopathology', slug: 'pergamon', order: 4 },
  { name: 'Athens', greek_letter: 'Ε', latin_name: 'Ethics', slug: 'athens', order: 5 },
];

export default function AdminHalls() {
  const [halls, setHalls] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [openHall, setOpenHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newChapterTitle, setNewChapterTitle] = useState({});
  const [addingChapter, setAddingChapter] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editChapterTitle, setEditChapterTitle] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [hs, secs] = await Promise.all([
        base44.entities.Hall.list(),
        base44.entities.Chapter.list(),
      ]);
      if (hs.length === 0) {
        await base44.entities.Hall.bulkCreate(HALL_DEFAULTS);
        const hs2 = await base44.entities.Hall.list();
        setHalls(hs2.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setHalls(hs.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      setChapters(secs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const chaptersForHall = (hallId) =>
    chapters.filter(s => s.hall_id === hallId).sort((a, b) => (a.order || 0) - (b.order || 0));

  const addChapter = async (hallId) => {
    const title = (newChapterTitle[hallId] || '').trim();
    if (!title) return;
    try {
      const existing = chaptersForHall(hallId);
      await base44.entities.Chapter.create({ title, hall_id: hallId, order: existing.length + 1 });
      setNewChapterTitle(prev => ({ ...prev, [hallId]: '' }));
      setAddingChapter(null);
      setChapters(await base44.entities.Chapter.list());
    } catch (err) {
      console.error(err);
      window.alert(`Could not create that chapter: ${err?.message || 'unknown error'}.`);
    }
  };

  const deleteChapter = async (id) => {
    if (!window.confirm('Delete this chapter? Tablets filed under it will remain, but lose their chapter.')) return;
    try {
      await base44.entities.Chapter.delete(id);
      setChapters(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      window.alert(`Could not delete this chapter: ${err?.message || 'unknown error'}. Nothing was changed.`);
    }
  };

  const saveEditChapter = async (id) => {
    if (!editChapterTitle.trim()) return;
    try {
      await base44.entities.Chapter.update(id, { title: editChapterTitle.trim() });
      setChapters(prev => prev.map(s => (s.id === id ? { ...s, title: editChapterTitle.trim() } : s)));
      setEditingChapter(null);
    } catch (err) {
      console.error(err);
      window.alert(`Could not save that title: ${err?.message || 'unknown error'}.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <div className="bg-[#0E0C09] border-b border-[#1A1815] px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <ArrowLeft size={11} /> Dashboard
          </Link>
          <span className="text-[#1A1815]">/</span>
          <span className="label-caps text-[#7A7268] text-[9px] tracking-[0.15em]">Halls &amp; Chapters</span>
        </div>
        <Link to="/admin/tablets/new" className="flex items-center gap-1.5 label-caps text-[#C9A84C] text-[9px] tracking-[0.15em] border border-[#C9A84C]/40 px-4 py-1.5 hover:bg-[#C9A84C]/10 transition-all">
          <Plus size={10} /> New Tablet
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em] mb-3">Content Structure</div>
        <h1 className="font-heading text-4xl font-light mb-12">Halls &amp; Chapters</h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {halls.map(hall => {
              const hallChapters = chaptersForHall(hall.id);
              const isOpen = openHall === hall.id;

              return (
                <div key={hall.id} className="border border-[#1A1815]">
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    onClick={() => setOpenHall(isOpen ? null : hall.id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-2xl text-[#2A2620] group-hover:text-[#C9A84C] transition-colors" style={{ fontWeight: 300 }}>
                        {hall.greek_letter}
                      </span>
                      <div>
                        <div className="label-caps text-[#3A3530] text-[9px] mb-0.5">{hall.name}</div>
                        <div className="font-heading text-xl font-light">{hall.latin_name || hall.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="label-caps text-[#3A3530] text-[8px]">{hallChapters.length} chapters</span>
                      <ChevronDown size={13} className="text-[#3A3530]" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#1A1815] px-6 py-4">
                      {hallChapters.map(chapter => (
                        <div key={chapter.id} className="flex items-center justify-between py-2.5 border-b border-[#0E0C09] last:border-0">
                          {editingChapter === chapter.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                value={editChapterTitle}
                                onChange={e => setEditChapterTitle(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') saveEditChapter(chapter.id);
                                  if (e.key === 'Escape') setEditingChapter(null);
                                }}
                                className="flex-1 bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#C9A84C]"
                                style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                                autoFocus
                              />
                              <button onClick={() => saveEditChapter(chapter.id)} className="text-[#C9A84C] hover:opacity-80"><Check size={13} /></button>
                              <button onClick={() => setEditingChapter(null)} className="text-[#3A3530] hover:text-[#7A7268]"><X size={13} /></button>
                            </div>
                          ) : (
                            <>
                              <span style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.9rem', color: '#A89880' }}>{chapter.title}</span>
                              <div className="flex items-center gap-3 ml-4">
                                <button
                                  onClick={() => { setEditingChapter(chapter.id); setEditChapterTitle(chapter.title); }}
                                  className="text-[#3A3530] hover:text-[#7A7268] transition-colors"
                                ><Pencil size={12} /></button>
                                <button onClick={() => deleteChapter(chapter.id)} className="text-[#3A3530] hover:text-red-500 transition-colors">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      {addingChapter === hall.id ? (
                        <div className="flex items-center gap-2 mt-3">
                          <input
                            value={newChapterTitle[hall.id] || ''}
                            onChange={e => setNewChapterTitle(prev => ({ ...prev, [hall.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') addChapter(hall.id);
                              if (e.key === 'Escape') setAddingChapter(null);
                            }}
                            placeholder="Chapter title..."
                            className="flex-1 bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#C9A84C] placeholder:text-[#2A2620]"
                            style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                            autoFocus
                          />
                          <button onClick={() => addChapter(hall.id)} className="label-caps text-[#C9A84C] text-[9px] px-3 py-1.5 border border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 transition-all">Add</button>
                          <button onClick={() => setAddingChapter(null)} className="text-[#3A3530] hover:text-[#7A7268]"><X size={13} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingChapter(hall.id)}
                          className="flex items-center gap-2 mt-3 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors"
                        >
                          <Plus size={11} /> Add Chapter
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
