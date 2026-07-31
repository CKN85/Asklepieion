import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#1A1815] px-8 py-16 mt-16">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center gap-4 text-center">
        <span className="font-heading text-[#2A2620] text-2xl">⚕</span>
        <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em]">Ἀσκληπιάδαι</div>
        <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.9rem', color: '#3A3530' }}>
          For Asclepiads — those who read past the summary.
        </p>
        <Link
          to="/admin"
          className="label-caps text-[#1A1815] hover:text-[#3A3530] text-[8px] tracking-[0.2em] transition-colors mt-4"
        >
          Scribe's Chamber
        </Link>
      </div>
    </footer>
  );
}
