import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const WINGS = [
  { slug: 'trikka',    letter: 'Α', name: 'TRIKKA',    field: 'Anatomy',        x: 340, y: 95,  w: 160, h: 120 },
  { slug: 'pergamon',  letter: 'Δ', name: 'PERGAMON',  field: 'Histopathology', x: 605, y: 280, w: 150, h: 120 },
  { slug: 'epidaurus', letter: 'Β', name: 'EPIDAURUS', field: 'Physiology',     x: 340, y: 450, w: 160, h: 115 },
  { slug: 'kos',       letter: 'Γ', name: 'KOS',       field: 'Biochemistry',   x: 85,  y: 280, w: 150, h: 120 },
];

const GATE = { slug: 'athens', letter: 'Ε', name: 'ATHENS', field: 'Ethics', x: 340, y: 585, w: 160, h: 56 };

// Every wing's own "draw plinth, then reveal hatch/text" sequence is offset
// by this many ms from the one before it, so they build up left-to-right
// across the sanctuary rather than all at once.
const WING_STAGGER_MS = 180;
const WINGS_START_MS = 1300;

function Wing({ wing, gate, onEnter, delayMs }) {
  const cx = wing.x + wing.w / 2;
  const cy = wing.y + wing.h / 2;
  const rows = gate
    ? { mark: wing.y + 17, name: wing.y + 35, field: wing.y + 49 }
    : { mark: wing.y + 27, name: wing.y + 57, field: wing.y + 77, enter: wing.y + wing.h - 15 };

  return (
    <g
      className={`plan-wing${gate ? ' is-gate' : ''}`}
      style={{ '--wing-delay': `${delayMs}ms`, '--wing-detail-delay': `${delayMs + 260}ms` }}
      role="link"
      tabIndex={0}
      aria-label={`${wing.name} — ${wing.field}`}
      onClick={() => onEnter(wing.slug)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnter(wing.slug); }
      }}
    >
      <title>{`${wing.name} — ${wing.field}`}</title>
      <rect className="plinth" pathLength="1" x={wing.x} y={wing.y} width={wing.w} height={wing.h} />
      <rect className="hatch" x={wing.x} y={wing.y} width={wing.w} height={wing.h} />
      <line className="center-mark" x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} />
      <line className="center-mark" x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} />
      <text className="mark" x={cx} y={rows.mark}>{wing.letter}</text>
      <text className="name" x={cx} y={rows.name}>{wing.name}</text>
      <text className="field" x={cx} y={rows.field}>{wing.field}</text>
      {rows.enter && <text className="enter" x={cx} y={rows.enter}>Enter →</text>}
    </g>
  );
}

/** Fires once, the first time the blueprint scrolls into view. */
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // plays once — not every scroll past it
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

export default function Home() {
  const navigate = useNavigate();
  const enter = (slug) => navigate(`/hall/${slug}`);
  const [planRef, planInView] = useInView();

  return (
    <div className="min-h-screen text-[#E2DED0] celestial-bg">
      <SiteNav />

      <header className="pt-36 pb-4 px-8 text-center">
        <div className="label-caps text-[#3F8A66] text-[9px] tracking-[0.3em] mb-5">The Sanctuary</div>
        <h1 className="font-heading font-light" style={{ fontSize: 'clamp(3.5rem, 10vw, 7.5rem)', letterSpacing: '0.06em' }}>
          ASKLE
          <svg
            viewBox="0 0 58 96"
            style={{ width: '0.44em', height: '0.72em', display: 'inline-block', verticalAlign: 'baseline' }}
            aria-hidden="true"
          >
            {/* The stem — the staff. Same colour as the surrounding letters,
                so it reads as part of the word first. */}
            <rect x="10" y="2" width="8" height="94" fill="currentColor" />
            {/* The serpent — one simple curve forming the P's bowl, with a
                short tail continuing to wind below it. */}
            <path
              d="M20,6 C36,3 47,13 44,24 C41,35 27,40 18,37 C11,41 14,49 21,47"
              fill="none"
              stroke="#3F8A66"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse cx="21" cy="5" rx="4.2" ry="3.2" fill="#3F8A66" />
            <circle cx="22.5" cy="4" r="0.9" fill="#14120F" />
          </svg>
          IEION
        </h1>

        <div className="flex items-stretch justify-center gap-5 mt-5">
          <span style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#7A7268', fontStyle: 'italic', fontSize: '1rem' }}>
            Ἀσκληπιεῖον
          </span>
          <span aria-hidden="true" style={{ width: '1px', background: '#2A2620', alignSelf: 'stretch' }} />
          <span className="label-caps" style={{ color: '#6B9E82', fontSize: '10px', letterSpacing: '0.28em' }}>
            For Asclepiads
          </span>
        </div>

        <div className="mt-10">
          <p className="font-heading" style={{ fontSize: '1.05rem', color: '#6B9E82', fontWeight: 400 }}>
            Ὁ βίος βραχύς, ἡ δὲ τέχνη μακρή
          </p>
          <p
            className="mt-1.5"
            style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontStyle: 'italic', color: '#7A7268', fontSize: '0.9rem' }}
          >
            "Life is short, the art is long."
          </p>
          <p className="label-caps mt-2" style={{ color: '#3A3530', fontSize: '8px', letterSpacing: '0.2em' }}>
            — The Hippocratic Aphorisms
          </p>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-8 mt-8">
        <div ref={planRef} className={`blueprint-panel p-8 sm:p-14${planInView ? ' is-drafting' : ''}`}>
          <svg viewBox="0 0 840 700" className="w-full h-auto" aria-label="Plan of the Asklepieion — choose a hall">
            <defs>
              <pattern id="blueGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" className="blueprint-grid-line" fill="none" />
              </pattern>
              <pattern id="wallHatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5" stroke="#2E5C46" strokeWidth="1" />
              </pattern>
            </defs>

            {/* drafting grid, confined to the sanctuary interior */}
            <rect className="draft-grid" x="64" y="84" width="712" height="512" fill="url(#blueGrid)" />

            {/* sanctuary walls */}
            <rect className="temenos" pathLength="1" x="50" y="70" width="740" height="540" />
            <rect className="temenos-inner" pathLength="1" x="64" y="84" width="712" height="512" />

            {/* corner registration marks */}
            {[[50, 70, 1, 1], [790, 70, -1, 1], [50, 610, 1, -1], [790, 610, -1, -1]].map(([cx, cy, dx, dy], i) => (
              <g key={i} className="corner-mark" style={{ '--mark-delay': `${600 + i * 60}ms` }}>
                <line pathLength="1" x1={cx} y1={cy} x2={cx + 14 * dx} y2={cy} />
                <line pathLength="1" x1={cx} y1={cy} x2={cx} y2={cy + 14 * dy} />
              </g>
            ))}

            {/* dimension lines */}
            <g className="dimension-line draft-dimension">
              <line pathLength="1" x1="50" y1="40" x2="790" y2="40" />
              <line className="dimension-tick" pathLength="1" x1="50" y1="34" x2="50" y2="46" />
              <line className="dimension-tick" pathLength="1" x1="790" y1="34" x2="790" y2="46" />
            </g>
            <text className="dimension-label draft-dimension-label" x="420" y="28">120 ΠΟΔΕΣ</text>

            <g className="dimension-line draft-dimension">
              <line pathLength="1" x1="25" y1="70" x2="25" y2="610" />
              <line className="dimension-tick" pathLength="1" x1="19" y1="70" x2="31" y2="70" />
              <line className="dimension-tick" pathLength="1" x1="19" y1="610" x2="31" y2="610" />
            </g>
            <text className="dimension-label draft-dimension-label" x="16" y="340" transform="rotate(-90 16 340)">88 ΠΟΔΕΣ</text>

            {/* compass mark */}
            <g className="draft-compass" transform="translate(150, 150)">
              <line className="compass-mark" pathLength="1" x1="0" y1="14" x2="0" y2="-14" />
              <path className="compass-mark" pathLength="1" d="M -4 -8 L 0 -16 L 4 -8" fill="none" />
              <text className="compass-label" x="0" y="28">N</text>
            </g>

            {/* sacred ways from each wing to the tholos */}
            <g className="draft-corridors">
              <line className="corridor" x1="420" y1="215" x2="420" y2="282" />
              <line className="corridor" x1="420" y1="398" x2="420" y2="450" />
              <line className="corridor" x1="235" y1="340" x2="362" y2="340" />
              <line className="corridor" x1="478" y1="340" x2="605" y2="340" />
            </g>

            {/* the tholos — the Archive at the centre */}
            <g
              className="plan-wing tholos draft-tholos"
              role="link"
              tabIndex={0}
              aria-label="The Archive — index and search"
              onClick={() => navigate('/archive')}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/archive'); }
              }}
            >
              <title>The Archive — index &amp; search</title>
              <circle className="tholos-outer" pathLength="1" cx="420" cy="340" r="58" />
              <circle className="tholos-ring ring-1" pathLength="1" cx="420" cy="340" r="42" />
              <circle className="tholos-ring ring-2" pathLength="1" cx="420" cy="340" r="26" />
              <line className="center-mark" x1="420" y1="332" x2="420" y2="348" />
              <line className="center-mark" x1="412" y1="340" x2="428" y2="340" />
              <text className="tholos-label" x="420" y="338">ARCHIVE</text>
              <text className="tholos-sub" x="420" y="353">INDEX &amp; SEARCH</text>
            </g>

            {WINGS.map((w, i) => (
              <Wing key={w.slug} wing={w} onEnter={enter} delayMs={WINGS_START_MS + i * WING_STAGGER_MS} />
            ))}
            <Wing wing={GATE} gate onEnter={enter} delayMs={WINGS_START_MS + WINGS.length * WING_STAGGER_MS} />

            {/* title block */}
            <g className="draft-titleblock">
              <rect className="title-block" pathLength="1" x="600" y="558" width="190" height="44" />
              <line className="dimension-line" x1="600" y1="580" x2="790" y2="580" />
              <text className="title-block-heading" x="612" y="574" fontSize="11">ASKLEPIEION</text>
              <text className="title-block-text" x="612" y="594" fontSize="7">TEMENOS PLAN — Α ΕΩΣ Ε</text>
            </g>
          </svg>
        </div>
      </div>

      <section className="max-w-xl mx-auto px-8 py-24 text-center">
        <div className="label-caps text-[#3F8A66] text-[9px] tracking-[0.3em] mb-4">For Asclepiads</div>
        <h2 className="font-heading text-2xl font-light mb-5" style={{ letterSpacing: '0.04em' }}>Who Is an Asclepiad</h2>
        <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#A89880', lineHeight: '1.8' }}>
          In ancient Greece, the Ἀσκληπιάδαι were physicians who traced their
          craft back to Asclepius himself — sometimes by blood, more often by
          oath and training, since the guild grew far past any one family.
        </p>
        <p className="mt-5" style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#A89880', lineHeight: '1.8' }}>
          Hippocrates was one. So was every doctor who studied under him, and
          every doctor who has studied under them since. An Asclepiad was
          never a rank you were given. It was a lineage you joined by taking
          the work seriously enough to be worth admitting into it.
        </p>
        <p className="mt-5" style={{ fontFamily: 'Source Serif 4, Georgia, serif', color: '#A89880', lineHeight: '1.8' }}>
          That standard hasn't moved. It was never about arriving somewhere
          and stopping — it's the long hours spent honing a craft that never
          finishes being honed, the discipline of returning to something you
          thought you already understood and finding more in it. The
          Asclepiads before us didn't prize knowing. They prized learning:
          the reach of it, the discomfort of it, the fact that it doesn't end
          at graduation, or at thirty years of practice either.
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
