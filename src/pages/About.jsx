import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { base44 } from '@/api/client';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

marked.setOptions({ breaks: true });

export default function About() {
  const [state, setState] = useState({ status: 'loading', page: null });

  useEffect(() => {
    let cancelled = false;
    base44.entities.Page.filter({ slug: 'about' })
      .then((rows) => {
        if (cancelled) return;
        setState({ status: 'ready', page: rows[0] || null });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ status: 'error', page: null });
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.title = state.page ? `${state.page.title} — Asklepieion` : 'About — Asklepieion';
  }, [state.page]);

  return (
    <div className="min-h-screen text-[#E2DED0] celestial-bg">
      <SiteNav />

      <main className="max-w-2xl mx-auto px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <div className="label-caps text-[9px] tracking-[0.3em]" style={{ color: '#3F8A66' }}>
            About Asklepieion
          </div>

          {state.status === 'loading' && (
            <p className="status mt-6">Loading…</p>
          )}

          {state.status === 'error' && (
            <p className="status mt-6">Couldn't load this page — check src/api/config.js.</p>
          )}

          {state.status === 'ready' && !state.page && (
            <p className="status mt-6">
              No About page has been written yet. Run supabase/add-pages-table.sql, or create
              one at <code>/admin/about</code>.
            </p>
          )}

          {state.status === 'ready' && state.page && (
            <h1 className="font-heading font-light mt-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>
              {state.page.title}
            </h1>
          )}
        </div>

        {state.status === 'ready' && state.page && (
          <>
            <div
              className="tablet-body"
              style={{ fontSize: '1.04rem' }}
              dangerouslySetInnerHTML={{ __html: marked.parse(state.page.body || '') }}
            />

            {state.page.author_note && (
              <>
                <div className="w-16 h-px mx-auto my-16" style={{ background: '#2A2620' }} />

                <div className="text-center mb-10">
                  <div className="label-caps text-[9px] tracking-[0.3em]" style={{ color: '#3F8A66' }}>
                    The Author
                  </div>
                  <h2 className="font-heading font-light mt-3" style={{ fontSize: '1.6rem' }}>
                    Ἀσκληπιάδης
                  </h2>
                </div>

                <div
                  className="tablet-body"
                  style={{ fontSize: '1.02rem' }}
                  dangerouslySetInnerHTML={{ __html: marked.parse(state.page.author_note) }}
                />
              </>
            )}
          </>
        )}

        <p className="mt-14 text-center">
          <Link to="/archive" className="label-caps text-[9px] tracking-[0.2em]" style={{ color: '#3F8A66' }}>
            Browse the Archive →
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
