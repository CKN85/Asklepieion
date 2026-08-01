import React from 'react';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { Pencil, LayoutDashboard, LogOut, Eye } from 'lucide-react';
import { base44 } from '@/api/client';
import useSession from '@/hooks/useSession';

/**
 * A quiet strip along the bottom of every public page, visible only to you.
 * It exists to answer two questions at a glance: "am I signed in?" and
 * "how do I edit what I'm looking at?"
 *
 * Sits at the bottom rather than the top so it never fights the site nav.
 */
export default function AdminBar() {
  const { isAdmin, email } = useSession();
  const location = useLocation();
  const tabletMatch = useMatch('/tablet/:tabletId');

  // Don't show it inside the admin area — you're already there.
  const inAdminArea = location.pathname.startsWith('/admin');
  if (!isAdmin || inAdminArea) return null;

  const tabletId = tabletMatch?.params?.tabletId;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0C09]/95 backdrop-blur border-t border-[#C9A84C]/25">
      <div className="max-w-screen-xl mx-auto px-6 h-11 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
          <span className="label-caps text-[#C9A84C] text-[9px] tracking-[0.2em] shrink-0">
            Admin view
          </span>
          {email && (
            <span className="label-caps text-[#3A3530] text-[8px] tracking-[0.15em] truncate hidden sm:block">
              {email}
            </span>
          )}
        </div>

        <div className="flex items-center gap-5 shrink-0">
          {tabletId && (
            <Link
              to={`/admin/tablets/${tabletId}/edit`}
              className="flex items-center gap-1.5 label-caps text-[#C9A84C] text-[9px] tracking-[0.15em] hover:opacity-75 transition-opacity"
            >
              <Pencil size={10} /> Edit this tablet
            </Link>
          )}
          <Link
            to="/admin"
            className="flex items-center gap-1.5 label-caps text-[#7A7268] hover:text-[#E2DED0] text-[9px] tracking-[0.15em] transition-colors"
          >
            <LayoutDashboard size={10} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <button
            onClick={() => base44.auth.logout('/')}
            className="flex items-center gap-1.5 label-caps text-[#3A3530] hover:text-[#7A7268] text-[9px] tracking-[0.15em] transition-colors"
          >
            <LogOut size={10} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small "DRAFT" tag for tablets only you can see. */
export function DraftBadge({ status }) {
  if (status === 'published') return null;
  return (
    <span className="label-caps text-[7px] tracking-[0.15em] px-1.5 py-0.5 border border-[#C9A84C]/40 text-[#C9A84C] shrink-0">
      Draft
    </span>
  );
}

/** Banner at the top of an unpublished tablet. */
export function DraftNotice({ status }) {
  if (status === 'published') return null;
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 border border-[#C9A84C]/30 bg-[#C9A84C]/5 mb-8">
      <Eye size={11} className="text-[#C9A84C] shrink-0" />
      <span
        style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.82rem', color: '#A89880', fontStyle: 'italic' }}
      >
        Unpublished draft — visible only to you.
      </span>
    </div>
  );
}
