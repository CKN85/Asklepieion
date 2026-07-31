import { useNavigate } from "react-router-dom";

/* A row of columns along the edge of a wing that faces the courtyard. */
function Colonnade({ from, to, axis, at, count = 5 }) {
  const step = (to - from) / (count - 1);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const pos = from + step * i;
        const cx = axis === "x" ? pos : at;
        const cy = axis === "x" ? at : pos;
        return <circle key={i} className="column" cx={cx} cy={cy} r="2.4" />;
      })}
    </>
  );
}

function Wing({ hall, geometry, onEnter }) {
  const { x, y, w, h, colonnade } = geometry;
  const cx = x + w / 2;
  const isGate = hall.kind === "propylon";
  const label = isGate
    ? `The Propylon — ${hall.discipline}`
    : `Hall of ${hall.name} — ${hall.discipline}`;

  const activate = () => onEnter(hall.id);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  // Gate is shallower, so its type sits tighter than a full wing's.
  const rows = isGate
    ? { mark: y + 17, name: y + 35, field: y + 49, enter: null }
    : { mark: y + 27, name: y + 57, field: y + 77, enter: y + h - 15 };

  return (
    <g
      className={isGate ? "wing gate" : "wing"}
      role="link"
      tabIndex={0}
      aria-label={label}
      onClick={activate}
      onKeyDown={onKeyDown}
    >
      <title>{label}</title>
      <rect className="plinth" x={x} y={y} width={w} height={h} />
      {colonnade && <Colonnade {...colonnade} />}
      <text className="mark" x={cx} y={rows.mark}>{hall.mark}</text>
      <text className="name" x={cx} y={rows.name}>{hall.name.toUpperCase()}</text>
      <text className="field" x={cx} y={rows.field}>{hall.discipline}</text>
      {rows.enter && (
        <text className="enter" x={cx} y={rows.enter}>Enter →</text>
      )}
    </g>
  );
}

/* Where each hall sits in the sanctuary. Keyed by hall id. */
const GEOMETRY = {
  trikka: {
    x: 320, y: 55, w: 160, h: 120,
    colonnade: { from: 340, to: 460, axis: "x", at: 175 },
  },
  pergamon: {
    x: 585, y: 240, w: 150, h: 120,
    colonnade: { from: 260, to: 340, axis: "y", at: 585, count: 4 },
  },
  epidaurus: {
    x: 320, y: 410, w: 160, h: 115,
    colonnade: { from: 340, to: 460, axis: "x", at: 410 },
  },
  kos: {
    x: 65, y: 240, w: 150, h: 120,
    colonnade: { from: 260, to: 340, axis: "y", at: 215, count: 4 },
  },
  ethics: { x: 320, y: 545, w: 160, h: 56 },
};

export default function FloorPlan({ halls }) {
  const navigate = useNavigate();
  const enter = (id) => navigate(`/hall/${id}`);

  return (
    <div className="floorplan-wrap">
      <svg
        viewBox="0 0 800 640"
        role="group"
        aria-label="Plan of the Asklepieion — select a hall to enter it"
      >
        {/* sanctuary walls */}
        <rect className="temenos" x="30" y="30" width="740" height="540" />
        <rect className="temenos-inner" x="44" y="44" width="712" height="512" />

        {/* sacred ways from each wing to the tholos */}
        <line className="corridor" x1="400" y1="175" x2="400" y2="242" />
        <line className="corridor" x1="400" y1="358" x2="400" y2="410" />
        <line className="corridor" x1="215" y1="300" x2="342" y2="300" />
        <line className="corridor" x1="458" y1="300" x2="585" y2="300" />

        {/* the tholos — the Archive at the centre */}
        <circle className="tholos-outer" cx="400" cy="300" r="58" />
        <circle className="tholos-ring" cx="400" cy="300" r="42" />
        <circle className="tholos-ring" cx="400" cy="300" r="26" />
        <text className="tholos-label" x="400" y="298">ARCHIVE</text>
        <text className="tholos-sub" x="400" y="313">INDEX &amp; SEARCH</text>

        {halls.map((hall) =>
          GEOMETRY[hall.id] ? (
            <Wing
              key={hall.id}
              hall={hall}
              geometry={GEOMETRY[hall.id]}
              onEnter={enter}
            />
          ) : null
        )}
      </svg>
    </div>
  );
}
