import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import AdminBar from '@/components/AdminBar';

// Shared with SiteFooter — kept here rather than fetched, since these five
// are foundational and this renders on every page.
export const HALLS_NAV = [
  { slug: 'trikka',    letter: 'Α', name: 'Trikka' },
  { slug: 'epidaurus', letter: 'Β', name: 'Epidaurus' },
  { slug: 'kos',       letter: 'Γ', name: 'Kos' },
  { slug: 'pergamon',  letter: 'Δ', name: 'Pergamon' },
  { slug: 'athens',    letter: 'Ε', name: 'Athens' },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-8 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0E0C09]/95 backdrop-blur border-b border-[#1A1815] h-14'
            : 'bg-transparent h-16'
        }`}
      >
        <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="font-heading text-[#3F8A66] text-base">⚕</span>
            <span className="label-caps text-[#7A7268] group-hover:text-[#E2DED0] text-[9px] tracking-[0.25em] transition-colors">
              Asklepieion
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {HALLS_NAV.map(h => {
              const active = pathname === `/hall/${h.slug}`;
              return (
                <Link
                  key={h.slug}
                  to={`/hall/${h.slug}`}
                  className={`flex items-center gap-1.5 label-caps text-[9px] tracking-[0.15em] transition-colors ${
                    active ? 'text-[#3F8A66]' : 'text-[#7A7268] hover:text-[#E2DED0]'
                  }`}
                >
                  <span className="font-heading text-[11px]">{h.letter}</span>
                  {h.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <Link
              to="/archive"
              className={`flex items-center gap-1.5 label-caps text-[9px] tracking-[0.2em] transition-colors ${
                pathname === '/archive' ? 'text-[#3F8A66]' : 'text-[#7A7268] hover:text-[#E2DED0]'
              }`}
            >
              <Search size={11} />
              Archive
            </Link>
            <Link
              to="/about"
              className={`label-caps text-[9px] tracking-[0.2em] transition-colors ${
                pathname === '/about' ? 'text-[#3F8A66]' : 'text-[#7A7268] hover:text-[#E2DED0]'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Only renders when you're signed in. */}
      <AdminBar />
    </>
  );
}
