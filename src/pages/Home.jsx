import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const WINGS = [
  { slug: 'trikka',    letter: 'Α', name: 'TRIKKA',    field: 'Anatomy',        x: 320, y: 55,  w: 160, h: 120 },
  { slug: 'pergamon',  letter: 'Δ', name: 'PERGAMON',  field: 'Histopathology', x: 585, y: 240, w: 150, h: 120 },
  { slug: 'epidaurus', letter: 'Β', name: 'EPIDAURUS', field: 'Physiology',     x: 320, y: 410, w: 160, h: 115 },
  { slug: 'kos',       letter: 'Γ', name: 'KOS',       field: 'Biochemistry',   x: 65,  y: 240, w: 150, h: 120 },
];

const GATE = { slug: 'athens', letter: 'Ε', name: 'ATHENS', field: 'Ethics', x: 320, y: 545, w: 160, h: 56 };

function Wing({ wing, gate, onEnter }) {
  const cx = wing.x + wing.w / 2;
  const rows = gate
    ? { mark: wing.y + 17, name: wing.y + 35, field: wing.y + 49 }
    : { mark: wing.y + 27, name: wing.y + 57, field: wing.y + 77, enter: wing.y + wing.h - 15 };

  return (
    <g
      className={`plan-wing${gate ? ' is-gate' : ''}`}
      role="link"
      tabIndex={0}
      aria-label={`${wing.name} — ${wing.field}`}
      onClick={() => onEnter(wing.slug)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnter(wing.slug); }
      }}
    >
      <title>{`${wing.name} — ${wing.field}`}</title>
      <rect className="plinth" x={wing.x} y={wing.y} width={wing.w} height={wing.h} />
      <text className="mark" x={cx} y={rows.mark}>{wing.letter}</text>
      <text className="name" x={cx} y={rows.name}>{wing.name}</text>
      <text className="field" x={cx} y={rows.field}>{wing.field}</text>
      {rows.enter && <text className="enter" x={cx} y={rows.enter}>Enter →</text>}
    </g>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const enter = (slug) => navigate(`/hall/${slug}`);

  return (
    <div className="min-h-screen bg-[#0E0C09] text-[#E2DED0]">
      <SiteNav />

      <header className="pt-36 pb-4 px-8 text-center">
        <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em] mb-5">Sanctuary of Study</div>
        <h1 className="font-heading font-light" style={{ fontSize: 'clamp(2.75rem, 7vw, 5rem)', letterSpacing: '0.06em' }}>
          ASKLEPIEION
        </h1>
        <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#7A7268', fontStyle: 'italic' }} className="mt-3">
          Ἀσκληπιεῖον
        </p>
        <p
          className="max-w-xl mx-auto mt-7"
          style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#A89880', fontSize: '1.05rem', lineHeight: '1.75' }}
        >
          Four halls and a gate. Anatomy, physiology, biochemistry, and
          histopathology written in full — and cross-referenced exactly where
          the body itself connects them.
        </p>
      </header>

      <div className="max-w-3xl mx-auto px-8 mt-8">
        <svg viewBox="0 0 800 640" className="w-full h-auto" aria-label="Plan of the Asklepieion — choose a hall">
          <rect className="temenos" x="30" y="30" width="740" height="540" />
          <rect className="temenos-inner" x="44" y="44" width="712" height="512" />

          <line className="corridor" x1="400" y1="175" x2="400" y2="242" />
          <line className="corridor" x1="400" y1="358" x2="400" y2="410" />
          <line className="corridor" x1="215" y1="300" x2="342" y2="300" />
          <line className="corridor" x1="458" y1="300" x2="585" y2="300" />

          <g
            className="plan-wing tholos"
            role="link"
            tabIndex={0}
            aria-label="The Archive — index and search"
            onClick={() => navigate('/archive')}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/archive'); }
            }}
          >
            <title>The Archive — index &amp; search</title>
            <circle className="tholos-outer" cx="400" cy="300" r="58" />
            <circle className="tholos-ring" cx="400" cy="300" r="42" />
            <circle className="tholos-ring" cx="400" cy="300" r="26" />
            <text className="tholos-label" x="400" y="298">ARCHIVE</text>
            <text className="tholos-sub" x="400" y="313">INDEX &amp; SEARCH</text>
          </g>

          {WINGS.map(w => <Wing key={w.slug} wing={w} onEnter={enter} />)}
          <Wing wing={GATE} gate onEnter={enter} />
        </svg>
      </div>

      <p className="label-caps text-[#3A3530] text-[9px] tracking-[0.25em] text-center mt-8">
        Choose a hall to enter
      </p>

      <section className="max-w-xl mx-auto px-8 py-24 text-center">
        <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.3em] mb-4">For Asclepiads</div>
        <h2 className="font-heading text-2xl font-light mb-5" style={{ letterSpacing: '0.06em' }}>READ IN FULL</h2>
        <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#A89880', lineHeight: '1.8' }}>
          Most texts summarise, then send you elsewhere for the rest. The
          Asklepieion does not. It gathers the connected reading that medical
          study usually forces you to hunt across ten sources for, written to
          the depth physicians expect, and ordered so that each hall answers to
          the others.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
