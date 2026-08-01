import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Layers, FileText, LogOut, Eye } from 'lucide-react';
import { base44 } from '@/api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ halls: 0, chapters: 0, published: 0, drafts: 0 });
  const [recentTablets, setRecentTablets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // One fetch of all tablets covers both the counts and the recent list.
        const [halls, chapters, allTablets] = await Promise.all([
          base44.entities.Hall.list(),
          base44.entities.Chapter.list(),
          base44.entities.Tablet.list('-updated_date', 200),
        ]);
        setStats({
          halls: halls.length,
          chapters: chapters.length,
          published: allTablets.filter(c => c.status === 'published').length,
          drafts: allTablets.filter(c => c.status !== 'published').length,
        });
        setRecentTablets(allTablets.slice(0, 10));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout('/');
  };

  const statCards = [
    { label: 'Halls', value: stats.halls, icon: Layers, to: '/admin/halls' },
    { label: 'Chapters', value: stats.chapters, icon: BookOpen, to: '/admin/halls' },
    { label: 'Published', value: stats.published, icon: FileText, to: '/admin/tablets' },
    { label: 'Drafts', value: stats.drafts, icon: FileText, to: '/admin/tablets' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <div className="bg-[#0E0C09] border-b border-[#1A1815] px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="font-heading text-[#3F8A66] text-lg">⚕</span>
          <span className="label-caps text-[#7A7268] text-[9px] tracking-[0.2em]">Asklepieion · Scribe's Chamber</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1.5 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <Eye size={11} /> View Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors">
            <LogOut size={11} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="mb-12">
          <div className="label-caps text-[#3F8A66] text-[9px] tracking-[0.3em] mb-3">The Scribe's Chamber</div>
          <h1 className="font-heading text-4xl font-light">Content Dashboard</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1A1815] mb-12">
          {statCards.map(card => (
            <Link key={card.label} to={card.to} className="bg-[#0E0C09] p-6 group hover:bg-[#0f0d0a] transition-colors">
              <div className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] mb-2">{card.label}</div>
              <div className="font-heading text-3xl font-light text-[#E2DED0] group-hover:text-[#3F8A66] transition-colors">
                {loading ? '—' : card.value}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-16">
          <Link to="/admin/tablets/new" className="flex items-center gap-2 label-caps text-[#3F8A66] border border-[#3F8A66]/40 px-5 py-2.5 hover:bg-[#3F8A66]/10 transition-all duration-200 text-[9px] tracking-[0.2em]">
            <Plus size={11} /> New Tablet
          </Link>
          <Link to="/admin/halls" className="flex items-center gap-2 label-caps text-[#7A7268] border border-[#2A2620] px-5 py-2.5 hover:border-[#3A3530] hover:text-[#E2DED0] transition-all duration-200 text-[9px] tracking-[0.2em]">
            <Layers size={11} /> Manage Halls &amp; Chapters
          </Link>
          <Link to="/admin/tablets" className="flex items-center gap-2 label-caps text-[#7A7268] border border-[#2A2620] px-5 py-2.5 hover:border-[#3A3530] hover:text-[#E2DED0] transition-all duration-200 text-[9px] tracking-[0.2em]">
            <FileText size={11} /> All Tablets
          </Link>
        </div>

        <div>
          <div className="label-caps text-[#3F8A66] text-[9px] tracking-[0.25em] mb-6">Recently Updated</div>
          <div className="flex flex-col gap-1">
            {loading ? (
              <div className="py-8 text-center">
                <div className="w-5 h-5 border border-[#3A3530] border-t-[#3F8A66] rounded-full animate-spin mx-auto" />
              </div>
            ) : recentTablets.length === 0 ? (
              <p className="label-caps text-[#2A2620] tracking-widest py-8">No tablets yet</p>
            ) : (
              recentTablets.map(ch => (
                <div key={ch.id} className="flex items-center justify-between py-3 border-b border-[#1A1815] group">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className={`label-caps text-[8px] px-2 py-0.5 border ${
                      ch.status === 'published'
                        ? 'border-[#3F8A66]/30 text-[#3F8A66]'
                        : 'border-[#2A2620] text-[#3A3530]'
                    }`}>
                      {ch.status || 'draft'}
                    </span>
                    <span className="font-heading text-lg font-light text-[#A89880] truncate">{ch.title}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <Link to={`/tablet/${ch.id}`} className="label-caps text-[#3A3530] hover:text-[#7A7268] text-[8px] hidden sm:block transition-colors">
                      View
                    </Link>
                    <Link to={`/admin/tablets/${ch.id}/edit`} className="label-caps text-[#3F8A66] text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
