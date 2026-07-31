import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, X, Search } from 'lucide-react';
import { base44 } from '@/api/client';

function CrossRefPicker({ onAdd, excludeId }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const hallMap = useRef({});

  useEffect(() => {
    base44.entities.Hall.list().then(hs => {
      hs.forEach(h => { hallMap.current[h.id] = h; });
    });
  }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        // All chapters, not just published — you often want to link a chapter
        // that's still a draft, and it'll be live by the time readers see it.
        const chapters = await base44.entities.Chapter.list('-updated_date', 200);
        const q = search.toLowerCase();
        setResults(
          chapters
            .filter(c => c.id !== excludeId && c.title?.toLowerCase().includes(q))
            .slice(0, 8)
        );
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, excludeId]);

  const selectChapter = (ch) => {
    const hall = hallMap.current[ch.hall_id];
    onAdd({
      chapter_id: ch.id,
      chapter_title: ch.title,
      hall_name: hall?.name || '',
      label: ch.title,
    });
    setSearch('');
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3A3530]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search chapters to cross-reference..."
          className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#2A2620]"
          style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
        />
      </div>
      {(results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 bg-[#1A1815] border border-[#2A2620] z-20 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-4 h-4 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
            </div>
          ) : results.map(ch => (
            <button key={ch.id} onClick={() => selectChapter(ch)}
              className="w-full text-left px-4 py-2.5 border-b border-[#0E0C09] last:border-0 hover:bg-[#2A2620] transition-colors"
            >
              <div style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.85rem', color: '#E2DED0' }}>{ch.title}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminChapterEditor() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  // The "new chapter" route carries no id at all, so both cases mean "new".
  const isNew = !chapterId || chapterId === 'new';

  const [halls, setHalls] = useState([]);
  const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    title: '',
    hall_id: '',
    section_id: '',
    body: '',
    status: 'draft',
    reading_time_minutes: '',
    cross_references: [],
    related_reading: [],
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStructure = async () => {
      const [hs, secs] = await Promise.all([
        base44.entities.Hall.list(),
        base44.entities.Section.list(),
      ]);
      setHalls(hs.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setSections(secs);
    };
    loadStructure();
  }, []);

  useEffect(() => {
    if (isNew) return;
    setLoading(true);
    base44.entities.Chapter.get(chapterId)
      .then(ch => {
        setForm({
          title: ch.title || '',
          hall_id: ch.hall_id || '',
          section_id: ch.section_id || '',
          body: ch.body || '',
          status: ch.status || 'draft',
          reading_time_minutes: ch.reading_time_minutes || '',
          cross_references: ch.cross_references || [],
          related_reading: ch.related_reading || [],
        });
      })
      .catch(() => setError('Could not load this chapter.'))
      .finally(() => setLoading(false));
  }, [chapterId, isNew]);

  const sectionsForHall = sections
    .filter(s => s.hall_id === form.hall_id)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleSave = async (publishOverride) => {
    if (!form.title.trim()) {
      setError('A chapter needs a title before it can be saved.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        // Empty dropdowns must become null, not "" — the database expects
        // either a real id or nothing at all.
        hall_id: form.hall_id || null,
        section_id: form.section_id || null,
        status: publishOverride !== undefined ? publishOverride : form.status,
        reading_time_minutes: form.reading_time_minutes
          ? Number(form.reading_time_minutes)
          : null,
      };

      if (isNew) {
        const created = await base44.entities.Chapter.create(payload);
        navigate(`/admin/chapters/${created.id}/edit`, { replace: true });
      } else {
        await base44.entities.Chapter.update(chapterId, payload);
      }
      if (publishOverride) setForm(f => ({ ...f, status: publishOverride }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Could not save. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const addRef = (type, ref) =>
    setForm(prev => ({ ...prev, [type]: [...(prev[type] || []), ref] }));

  const removeRef = (type, idx) =>
    setForm(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== idx) }));

  if (loading) return (
    <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center">
      <div className="w-6 h-6 border border-[#3A3530] border-t-[#C9A84C] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0] flex flex-col">
      <div className="bg-[#0E0C09] border-b border-[#1A1815] px-6 h-14 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/admin/chapters" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <ArrowLeft size={11} /> Chapters
          </Link>
          <span className="text-[#1A1815]">/</span>
          <span className="label-caps text-[#7A7268] text-[9px] tracking-[0.15em] truncate max-w-48">
            {isNew ? 'New Chapter' : (form.title || 'Untitled')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="label-caps text-[#C9A84C] text-[9px] tracking-[0.15em]">Saved ✓</span>}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-1.5 label-caps text-[#7A7268] border border-[#2A2620] px-4 py-1.5 hover:border-[#3A3530] hover:text-[#E2DED0] transition-all text-[9px] tracking-[0.15em] disabled:opacity-40"
          >
            <Save size={10} /> {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex items-center gap-1.5 label-caps text-[#C9A84C] border border-[#C9A84C]/40 px-4 py-1.5 hover:bg-[#C9A84C]/10 transition-all text-[9px] tracking-[0.15em] disabled:opacity-40"
          >
            <Eye size={10} /> Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="px-8 pt-4">
          <div className="px-4 py-3 border border-red-900/40 bg-red-950/20">
            <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.8rem', color: '#F87171', fontStyle: 'italic' }}>{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Hall</label>
              <select
                value={form.hall_id}
                onChange={e => setForm(f => ({ ...f, hall_id: e.target.value, section_id: '' }))}
                className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
                style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
              >
                <option value="">Select Hall</option>
                {halls.map(h => <option key={h.id} value={h.id}>{h.greek_letter} · {h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Section</label>
              <select
                value={form.section_id}
                onChange={e => setForm(f => ({ ...f, section_id: e.target.value }))}
                className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors disabled:opacity-40"
                style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                disabled={!form.hall_id}
              >
                <option value="">Select Section</option>
                {sectionsForHall.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Reading Time (min)</label>
              <input
                type="number"
                value={form.reading_time_minutes}
                onChange={e => setForm(f => ({ ...f, reading_time_minutes: e.target.value }))}
                placeholder="e.g. 25"
                className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#2A2620]"
                style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
              />
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Chapter Title"
              className="w-full bg-transparent border-0 border-b border-[#2A2620] text-[#E2DED0] px-0 py-3 focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#2A2620]"
              style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2rem', fontWeight: 300 }}
            />
          </div>

          <textarea
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Begin writing the chapter body here. HTML is supported."
            className="w-full bg-[#0E0C09] border border-[#2A2620] text-[#E2DED0] px-4 py-4 focus:outline-none focus:border-[#C9A84C] transition-colors placeholder:text-[#2A2620] resize-none"
            style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1rem', lineHeight: '1.75', minHeight: '600px' }}
          />
        </div>

        <aside className="w-80 shrink-0 border-l border-[#1A1815] overflow-y-auto px-6 py-10 hidden lg:block">
          <div className="mb-8">
            <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.2em] mb-3">Status</div>
            <div className="flex gap-2">
              {['draft', 'published'].map(s => (
                <button
                  key={s}
                  onClick={() => setForm(f => ({ ...f, status: s }))}
                  className={`label-caps text-[9px] px-3 py-1.5 border transition-all ${form.status === s ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[#2A2620] text-[#3A3530] hover:border-[#3A3530]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.2em] mb-3">Cross-References</div>
            <CrossRefPicker onAdd={ref => addRef('cross_references', ref)} excludeId={chapterId} />
            {form.cross_references.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {form.cross_references.map((ref, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 bg-[#1A1815] px-3 py-2">
                    <div>
                      <div className="label-caps text-[#3A3530] text-[8px]">{ref.hall_name}</div>
                      <div style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.8rem', color: '#A89880' }}>{ref.label || ref.chapter_title}</div>
                    </div>
                    <button onClick={() => removeRef('cross_references', i)} className="text-[#3A3530] hover:text-red-500 shrink-0 mt-0.5"><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.2em] mb-3">Related Reading Panel</div>
            <CrossRefPicker onAdd={ref => addRef('related_reading', ref)} excludeId={chapterId} />
            {form.related_reading.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {form.related_reading.map((ref, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 bg-[#1A1815] px-3 py-2">
                    <div>
                      <div className="label-caps text-[#3A3530] text-[8px]">{ref.hall_name}</div>
                      <div style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.8rem', color: '#A89880' }}>{ref.label || ref.chapter_title}</div>
                    </div>
                    <button onClick={() => removeRef('related_reading', i)} className="text-[#3A3530] hover:text-red-500 shrink-0 mt-0.5"><X size={11} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
