function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function Wing({
  x, y, width, height,
  markX, markY, mark,
  nameX, nameY, name,
  fieldX, fieldY, field,
  label, targetId, gate,
}) {
  const activate = () => scrollToId(targetId);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  return (
    <g
      className={gate ? "wing gate" : "wing"}
      role="link"
      tabIndex={0}
      aria-label={label}
      onClick={activate}
      onKeyDown={onKeyDown}
      style={{ cursor: "pointer" }}
    >
      <title>{label}</title>
      <rect x={x} y={y} width={width} height={height} />
      <text className="mark" x={markX} y={markY}>{mark}</text>
      <text className="name" x={nameX} y={nameY}>{name}</text>
      <text className="field" x={fieldX} y={fieldY}>{field}</text>
    </g>
  );
}

export default function FloorPlan() {
  return (
    <div className="floorplan-wrap">
      <svg
        viewBox="0 0 800 660"
        role="img"
        aria-label="Floor plan of the Asklepieion, showing four wings around a central archive, with an entrance gate at the boundary wall"
      >
        <rect className="temenos" x="20" y="20" width="760" height="560" />

        <rect className="corridor" x="390" y="170" width="20" height="50" />
        <rect className="corridor" x="390" y="340" width="20" height="50" />
        <rect className="corridor" x="460" y="270" width="130" height="20" />
        <rect className="corridor" x="210" y="270" width="130" height="20" />

        <circle className="tholos-outer" cx="400" cy="280" r="60" />
        <circle className="tholos-ring" cx="400" cy="280" r="42" />
        <circle className="tholos-ring" cx="400" cy="280" r="24" />
        <text className="tholos-label" x="400" y="277">ARCHIVE</text>
        <text className="tholos-label" x="400" y="292">index &amp; search</text>

        <Wing x={330} y={40} width={140} height={130}
          markX={400} markY={65} mark="Α"
          nameX={400} nameY={100} name="TRIKKA"
          fieldX={400} fieldY={122} field="Anatomy"
          label="Hall of Trikka — Anatomy" targetId="hall-trikka" />

        <Wing x={590} y={215} width={140} height={130}
          markX={660} markY={255} mark="Δ"
          nameX={660} nameY={290} name="PERGAMON"
          fieldX={660} fieldY={312} field="Histopathology"
          label="Hall of Pergamon — Histopathology" targetId="hall-pergamon" />

        <Wing x={330} y={390} width={140} height={130}
          markX={400} markY={425} mark="Β"
          nameX={400} nameY={460} name="EPIDAURUS"
          fieldX={400} fieldY={482} field="Physiology"
          label="Hall of Epidaurus — Physiology" targetId="hall-epidaurus" />

        <Wing x={70} y={215} width={140} height={130}
          markX={140} markY={255} mark="Γ"
          nameX={140} nameY={290} name="KOS"
          fieldX={140} fieldY={312} field="Biochemistry"
          label="Hall of Kos — Biochemistry" targetId="hall-kos" />

        <Wing gate x={320} y={560} width={160} height={54}
          markX={400} markY={578} mark="Ε"
          nameX={400} nameY={596} name="ATHENS"
          fieldX={400} fieldY={611} field="Ethics"
          label="The Propylon — Ethics, Athens" targetId="ethics" />
      </svg>
    </div>
  );
}
