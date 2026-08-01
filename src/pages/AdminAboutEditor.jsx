import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { base44 } from '@/api/client';

export default function AdminAboutEditor() {
  const [pageId, setPageId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.entities.Page.filter({ slug: 'about' })
      .then((rows) => {
        const existing = rows[0];
        if (existing) {
          setPageId(existing.id);
          setForm({ title: existing.title || '', body: existing.body || '' });
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load the About page.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('The page needs a title before it can be saved.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (pageId) {
        await base44.entities.Page.update(pageId, form);
      } else {
        const created = await base44.entities.Page.create({ slug: 'about', ...form });
        setPageId(created.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Could not save. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center">
      <div className="w-6 h-6 border border-[#3A3530] border-t-[#3F8A66] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0] flex flex-col">
      <div className="bg-[#0E0C09] border-b border-[#1A1815] px-6 h-14 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <ArrowLeft size={11} /> Dashboard
          </Link>
          <span className="text-[#1A1815]">/</span>
          <span className="label-caps text-[#7A7268] text-[9px] tracking-[0.15em]">About Page</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="label-caps text-[#3F8A66] text-[9px] tracking-[0.15em]">Saved ✓</span>}
          <Link
            to="/about"
            target="_blank"
            className="flex items-center gap-1.5 label-caps text-[#7A7268] border border-[#2A2620] px-4 py-1.5 hover:border-[#3A3530] hover:text-[#E2DED0] transition-all text-[9px] tracking-[0.15em]"
          >
            <Eye size={10} /> View Live
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 label-caps text-[#3F8A66] border border-[#3F8A66]/40 px-4 py-1.5 hover:bg-[#3F8A66]/10 transition-all text-[9px] tracking-[0.15em] disabled:opacity-40"
          >
            <Save size={10} /> {saving ? 'Saving...' : 'Save'}
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

      <div className="flex-1 overflow-y-auto px-8 py-10 max-w-3xl mx-auto w-full">
        <div className="mb-6">
          <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Page Heading</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Why This Exists"
            className="w-full bg-transparent border-0 border-b border-[#2A2620] text-[#E2DED0] px-0 py-3 focus:outline-none focus:border-[#3F8A66] transition-colors placeholder:text-[#2A2620]"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '2rem', fontWeight: 300 }}
          />
        </div>

        <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Body</label>
        <textarea
          value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
          placeholder="Markdown supported — blank line for a new paragraph, ## for a heading, **bold**, *italic*."
          className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-4 py-4 focus:outline-none focus:border-[#3F8A66] transition-colors placeholder:text-[#2A2620] resize-none"
          style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1rem', lineHeight: '1.75', minHeight: '520px' }}
        />
      </div>
    </div>
  );
}
