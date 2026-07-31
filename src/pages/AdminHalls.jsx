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
  const [sections, setSections] = useState([]);
  const [openHall, setOpenHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState({});
  const [addingSection, setAddingSection] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [hs, secs] = await Promise.all([
        base44.entities.Hall.list(),
        base44.entities.Section.list(),
      ]);
      if (hs.length === 0) {
        await base44.entities.Hall.bulkCreate(HALL_DEFAULTS);
        const hs2 = await base44.entities.Hall.list();
        setHalls(hs2.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setHalls(hs.sort((a, b) => (a.order || 0) - (b.order || 0)));
      }
      setSections(secs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const sectionsForHall = (hallId) =>
    sections.filter(s => s.hall_id === hallId).sort((a, b) => (a.order || 0) - (b.order || 0));

  const addSection = async (hallId) => {
    const title = (newSectionTitle[hallId] || '').trim();
    if (!title) return;
    const existing = sectionsForHall(hallId);
    await base44.entities.Section.create({ title, hall_id: hallId, order: existing.length + 1 });
    setNewSectionTitle(prev => ({ ...prev, [hallId]: '' }));
    setAddingSection(null);
    setSections(await base44.entities.Section.list());
  };

  const deleteSection = async (id) => {
    if (!window.confirm('Delete this section? Chapters filed under it will remain, but lose their section.')) return;
    await base44.entities.Section.delete(id);
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const saveEditSection = async (id) => {
    if (!editSectionTitle.trim()) return;
    await base44.entities.Section.update(id, { title: editSectionTitle.trim() });
    setSections(prev => prev.map(s => (s.id === id ? { ...s, title: editSectionTitle.trim() } : s)));
    setEditingSection(null);
  };

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <div className="bg-[#0E0C09] border-b border-[#1A1815] px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <ArrowLeft size={11} /> Dashboard
          </Link>
          <span className="text-[#1A1815]">/</span>
          <span className="label-caps text-[#7A7268] text-[9px] tracking-[0.15em]">Halls &amp; Sections</span>
        </div>
        <Link to="/admin/chapters/new" className="flex items-center gap-1.5 label-caps text-[#C9A84C] text-[9px] tracking-[0.15em] border border-[#C9A84C]/40 px-4 py-1.5 hover:bg-[#C9A84C]/10 transition-all">
          <Plus size={10} /> New Chapter
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em] mb-3">Content Structure</div>
        <h1 className="font-heading text-4xl font-light mb-12">Halls &amp; Sections</h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {halls.map(hall => {
              const hallSections = sectionsForHall(hall.id);
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
                      <span className="label-caps text-[#3A3530] text-[8px]">{hallSections.length} sections</span>
                      <ChevronDown size={13} className="text-[#3A3530]" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#1A1815] px-6 py-4">
                      {hallSections.map(section => (
                        <div key={section.id} className="flex items-center justify-between py-2.5 border-b border-[#0E0C09] last:border-0">
                          {editingSection === section.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                value={editSectionTitle}
                                onChange={e => setEditSectionTitle(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') saveEditSection(section.id);
                                  if (e.key === 'Escape') setEditingSection(null);
                                }}
                                className="flex-1 bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#C9A84C]"
                                style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                                autoFocus
                              />
                              <button onClick={() => saveEditSection(section.id)} className="text-[#C9A84C] hover:opacity-80"><Check size={13} /></button>
                              <button onClick={() => setEditingSection(null)} className="text-[#3A3530] hover:text-[#7A7268]"><X size={13} /></button>
                            </div>
                          ) : (
                            <>
                              <span style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.9rem', color: '#A89880' }}>{section.title}</span>
                              <div className="flex items-center gap-3 ml-4">
                                <button
                                  onClick={() => { setEditingSection(section.id); setEditSectionTitle(section.title); }}
                                  className="text-[#3A3530] hover:text-[#7A7268] transition-colors"
                                ><Pencil size={12} /></button>
                                <button onClick={() => deleteSection(section.id)} className="text-[#3A3530] hover:text-red-500 transition-colors">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      {addingSection === hall.id ? (
                        <div className="flex items-center gap-2 mt-3">
                          <input
                            value={newSectionTitle[hall.id] || ''}
                            onChange={e => setNewSectionTitle(prev => ({ ...prev, [hall.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') addSection(hall.id);
                              if (e.key === 'Escape') setAddingSection(null);
                            }}
                            placeholder="Section title..."
                            className="flex-1 bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-1.5 text-sm focus:outline-none focus:border-[#C9A84C] placeholder:text-[#2A2620]"
                            style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                            autoFocus
                          />
                          <button onClick={() => addSection(hall.id)} className="label-caps text-[#C9A84C] text-[9px] px-3 py-1.5 border border-[#C9A84C]/40 hover:bg-[#C9A84C]/10 transition-all">Add</button>
                          <button onClick={() => setAddingSection(null)} className="text-[#3A3530] hover:text-[#7A7268]"><X size={13} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingSection(hall.id)}
                          className="flex items-center gap-2 mt-3 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors"
                        >
                          <Plus size={11} /> Add Section
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
