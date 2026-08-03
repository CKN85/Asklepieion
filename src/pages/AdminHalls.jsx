import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronDown, Pencil, Trash2, ArrowLeft, Check, X } from 'lucide-react';
import { base44 } from '@/api/client';
import DragReorderList from '@/components/DragReorderList';

// Only used if the halls table is somehow empty — schema.sql already seeds these.
const HALL_DEFAULTS = [
  { name: 'Trikka', greek_letter: 'Α', latin_name: 'Anatomy', slug: 'trikka', order: 1 },
  { name: 'Epidaurus', greek_letter: 'Β', latin_name: 'Physiology', slug: 'epidaurus', order: 2 },
  { name: 'Kos', greek_letter: 'Γ', latin_name: 'Biochemistry', slug: 'kos', order: 3 },
  { name: 'Pergamon', greek_letter: 'Δ', latin_name: 'Histopathology', slug: 'pergamon', order: 4 },
  { name: 'Athens', greek_letter: 'Ε', latin_name: 'Ethics', slug: 'athens', order: 5 },
];

// Gives every item in a list a fresh 1-based `order`, persisted in parallel.
// Small lists (a hall's chapters, a chapter's tablets) — no need for a bulk
// endpoint, a handful of concurrent updates is cheap and simple.
async function persistOrder(entity, items) {
  await Promise.all(items.map((item, idx) => entity.update(item.id, { order: idx + 1 })));
}

export default function AdminHalls() {
  const [halls, setHalls] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [tablets, setTablets] = useState([]);
  const [openHall, setOpenHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newChapterTitle, setNewChapterTitle] = useState({});
  const [addingChapter, setAddingChapter] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editChapterTitle, setEditChapterTitle] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [hs, secs, tbs] = await Promise.all([
        base44.entities.Hall.list(),
        base44.entities.Chapter.list(),
        base44.entities.Tablet.list(),
      ]);
      if (hs.length === 0) {
        await base44.entities.Hall.bulkCreate(HALL_DEFAULTS);
        const hs2 = await base44.entities.Hall.list();
        setHalls(hs2.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setHalls(hs.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      setChapters(secs);
      setTablets(tbs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const chaptersForHall = (hallId) =>
    chapters.filter(s => s.hall_id === hallId).sort((a, b) => (a.order || 0) - (b.order || 0));

  const tabletsFor = (hallId, chapterId) =>
    tablets
      .filter(t => t.hall_id === hallId && (t.chapter_id || null) === chapterId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

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

  // Reordering a hall's chapters only ever touches that one hall's rows —
  // everyone else's chapters are left exactly as they were.
  const reorderChapters = (hallId, reordered) => {
    setChapters(prev => {
      const others = prev.filter(c => c.hall_id !== hallId);
      return [...others, ...reordered];
    });
    persistOrder(base44.entities.Chapter, reordered).catch(err => {
      console.error(err);
      window.alert('Could not save the new chapter order — reloading.');
      load();
    });
  };

  // Same idea for a chapter's (or a hall's "Unfiled") tablets.
  const reorderTablets = (hallId, chapterId, reordered) => {
    setTablets(prev => {
      const others = prev.filter(t => !(t.hall_id === hallId && (t.chapter_id || null) === chapterId));
      return [...others, ...reordered];
    });
    persistOrder(base44.entities.Tablet, reordered).catch(err => {
      console.error(err);
      window.alert('Could not save the new tablet order — reloading.');
      load();
    });
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
        <Link to="/admin/tablets/new" className="flex items-center gap-1.5 label-caps text-[#3F8A66] text-[9px] tracking-[0.15em] border border-[#3F8A66]/40 px-4 py-1.5 hover:bg-[#3F8A66]/10 transition-all">
          <Plus size={10} /> New Tablet
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="label-caps text-[#3F8A66] text-[9px] tracking-[0.3em] mb-3">Content Structure</div>
        <h1 className="font-heading text-4xl font-light mb-3">Halls &amp; Chapters</h1>
        <p className="label-caps text-[#3A3530] text-[9px] tracking-[0.1em] mb-12">
          Drag the <span className="text-[#7A7268]">⠿</span> handle to reorder chapters within a hall, or tablets within a chapter.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border border-[#3A3530] border-t-[#3F8A66] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {halls.map(hall => {
              const hallChapters = chaptersForHall(hall.id);
              const unfiled = tabletsFor(hall.id, null);
              const isOpen = openHall === hall.id;

              return (
                <div key={hall.id} className="border border-[#1A1815]">
                  <button
                    className="w-full flex items-center justify-between px-6 py-5 text-left group"
                    onClick={() => setOpenHall(isOpen ? null : hall.id)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-heading text-2xl text-[#2A2620] group-hover:text-[#3F8A66] transition-colors" style={{ fontWeight: 300 }}>
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
                      <DragReorderList
                        items={hallChapters}
                        getId={c => c.id}
                        onReorder={reordered => reorderChapters(hall.id, reordered)}
                        renderItem={chapter => (
                          <div className="py-2.5 border-b border-[#0E0C09]">
                            <div className="flex items-center justify-between">
                              {editingChapter === chapter.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    value={editChapterTitle}
                                    onChange={e => setEditChapterTitle(e.target.value)}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') saveEditChapter(chapter.id);
                                      if (e.key === 'Escape') setEditingChapter(null);
                                    }}
                                    className="flex-1 bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#3F8A66]"
                                    style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                                    autoFocus
                                  />
                                  <button onClick={() => saveEditChapter(chapter.id)} className="text-[#3F8A66] hover:opacity-80"><Check size={13} /></button>
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

                            {/* Tablets filed under this chapter — its own small drag list. */}
                            {(() => {
                              const inChapter = tabletsFor(hall.id, chapter.id);
                              if (inChapter.length === 0) return null;
                              return (
                                <div className="mt-2 mb-1 pl-5 flex flex-col gap-0.5">
                                  <DragReorderList
                                    items={inChapter}
                                    getId={t => t.id}
                                    onReorder={reordered => reorderTablets(hall.id, chapter.id, reordered)}
                                    renderItem={tablet => (
                                      <Link
                                        to={`/admin/tablets/${tablet.id}/edit`}
                                        className="flex items-center justify-between py-1.5 group/tablet"
                                      >
                                        <span
                                          className="truncate group-hover/tablet:text-[#E2DED0] transition-colors"
                                          style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.82rem', color: '#7A7268' }}
                                        >
                                          {tablet.title}
                                        </span>
                                        <span className="flex items-center gap-2 shrink-0 ml-3">
                                          <span className={`label-caps text-[7px] px-1.5 py-0.5 border ${tablet.status === 'published' ? 'border-[#3F8A66]/30 text-[#3F8A66]' : 'border-[#2A2620] text-[#3A3530]'}`}>
                                            {tablet.status || 'draft'}
                                          </span>
                                          <Pencil size={10} className="text-[#2A2620] opacity-0 group-hover/tablet:opacity-100 transition-opacity" />
                                        </span>
                                      </Link>
                                    )}
                                  />
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      />

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
                            className="flex-1 bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#3F8A66] placeholder:text-[#2A2620]"
                            style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                            autoFocus
                          />
                          <button onClick={() => addChapter(hall.id)} className="label-caps text-[#3F8A66] text-[9px] px-3 py-1.5 border border-[#3F8A66]/40 hover:bg-[#3F8A66]/10 transition-all">Add</button>
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

                      {/* Tablets filed straight under the hall, with no chapter. */}
                      {unfiled.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-[#1A1815]">
                          <div className="label-caps text-[#3A3530] text-[8px] tracking-[0.15em] mb-2">Unfiled in this Hall</div>
                          <DragReorderList
                            items={unfiled}
                            getId={t => t.id}
                            onReorder={reordered => reorderTablets(hall.id, null, reordered)}
                            className="flex flex-col gap-0.5"
                            renderItem={tablet => (
                              <Link
                                to={`/admin/tablets/${tablet.id}/edit`}
                                className="flex items-center justify-between py-1.5 group/tablet"
                              >
                                <span
                                  className="truncate group-hover/tablet:text-[#E2DED0] transition-colors"
                                  style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.82rem', color: '#7A7268' }}
                                >
                                  {tablet.title}
                                </span>
                                <span className="flex items-center gap-2 shrink-0 ml-3">
                                  <span className={`label-caps text-[7px] px-1.5 py-0.5 border ${tablet.status === 'published' ? 'border-[#3F8A66]/30 text-[#3F8A66]' : 'border-[#2A2620] text-[#3A3530]'}`}>
                                    {tablet.status || 'draft'}
                                  </span>
                                  <Pencil size={10} className="text-[#2A2620] opacity-0 group-hover/tablet:opacity-100 transition-opacity" />
                                </span>
                              </Link>
                            )}
                          />
                        </div>
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
