import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { HALLS_NAV } from '@/components/SiteNav';

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#1A1815] px-8 pt-20 pb-14 mt-16">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-heading text-xl italic" style={{ color: '#3F8A66', fontWeight: 400 }}>
          Colophon
        </h2>

        <div className="flex items-center justify-center gap-4 mt-6 mb-8">
          {HALLS_NAV.map(h => (
            <span key={h.slug} className="font-heading text-lg text-[#3A3530]">{h.letter}</span>
          ))}
        </div>

        <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#A89880', fontSize: '0.98rem', lineHeight: '1.85' }}>
          The Asklepieion began out of frustration with how little detail most
          general textbooks allow themselves, and the ordinary drudgery of
          hunting across ten different sources for what the body has always
          held together as one subject. It is one Asclepiad's record of what
          seemed worth writing down in full — in the hope that the reading a
          first year is rarely given time for might feel less daunting, and
          the subject itself more alive, for the next person who opens it.
        </p>

        <div className="w-10 h-px bg-[#2A2620] mx-auto mt-10 mb-8" />

        <p className="font-heading italic" style={{ color: '#3F8A66', fontSize: '1.15rem' }}>Ἀσκληπιάδαι</p>
        <p className="label-caps text-[#7A7268] text-[9px] tracking-[0.2em] mt-2">For Asclepiads</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-14">
        {HALLS_NAV.map(h => (
          <Link
            key={h.slug}
            to={`/hall/${h.slug}`}
            className="flex items-center gap-1.5 label-caps text-[#3A3530] hover:text-[#7A7268] text-[8px] tracking-[0.15em] transition-colors"
          >
            <span className="font-heading text-[10px]" style={{ color: '#3F8A66' }}>{h.letter}</span>
            {h.name}
          </Link>
        ))}
        <Link
          to="/archive"
          className="flex items-center gap-1.5 label-caps text-[#3A3530] hover:text-[#7A7268] text-[8px] tracking-[0.15em] transition-colors"
        >
          <Search size={9} /> Archive
        </Link>
        <Link
          to="/about"
          className="label-caps text-[#3A3530] hover:text-[#7A7268] text-[8px] tracking-[0.15em] transition-colors"
        >
          About
        </Link>
      </div>

      <div className="text-center mt-10">
        <Link
          to="/admin"
          className="label-caps text-[#1A1815] hover:text-[#3A3530] text-[8px] tracking-[0.2em] transition-colors"
        >
          Scribe's Chamber
        </Link>
      </div>
    </footer>
  );
}
