import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Sanctuary' },
  { to: '/archive', label: 'Archive' },
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
    <nav
      className={`fixed top-0 left-0 right-0 z-40 px-8 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0E0C09]/95 backdrop-blur border-b border-[#1A1815] h-14'
          : 'bg-transparent h-20'
      }`}
    >
      <div className="max-w-screen-xl mx-auto h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-heading text-[#C9A84C] text-lg">⚕</span>
          <span className="label-caps text-[#7A7268] group-hover:text-[#E2DED0] text-[9px] tracking-[0.25em] transition-colors">
            Asklepieion
          </span>
        </Link>

        <div className="flex items-center gap-7">
          {LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`label-caps text-[9px] tracking-[0.2em] transition-colors ${
                pathname === link.to
                  ? 'text-[#C9A84C]'
                  : 'text-[#3A3530] hover:text-[#7A7268]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
