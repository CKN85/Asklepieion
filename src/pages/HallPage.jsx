import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import TabletList from "../components/TabletList.jsx";
import Footer from "../components/Footer.jsx";
import { HALLS_BY_ID } from "../data/halls.js";

// Α Β Γ Δ Ε … for numbering chapters within a hall.
const GREEK_NUMERALS = [
  "Α", "Β", "Γ", "Δ", "Ε", "Ϛ", "Ζ", "Η",
  "Θ", "Ι", "ΙΑ", "ΙΒ", "ΙΓ", "ΙΔ", "ΙΕ", "ΙϚ",
];

export default function HallPage() {
  const { hallId } = useParams();
  const hall = HALLS_BY_ID[hallId];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (hall) {
      document.title =
        hall.kind === "propylon"
          ? `The Propylon — Asklepieion`
          : `Hall of ${hall.name} — Asklepieion`;
    }
  }, [hall]);

  if (!hall) return <Navigate to="/" replace />;

  const heading =
    hall.kind === "propylon" ? "The Propylon" : `Hall of ${hall.name}`;

  return (
    <>
      <main className="shell hall-page">
        <Link className="back-link" to="/">← The Sanctuary</Link>

        <div className="hall-header">
          <div className="hall-sigil" aria-hidden="true">{hall.mark}</div>
          <h1>{heading}</h1>
          <p className="greek">
            {hall.greek}
            {hall.kind === "propylon" ? " · Athens" : ""}
          </p>
          <p className="discipline">{hall.discipline}</p>
          <div className="meander" aria-hidden="true" />
          <p className="hall-intro">{hall.description}</p>
        </div>

        <div className="meander wide" aria-hidden="true" style={{ margin: "3.5rem 0 2.5rem" }} />

        <h2 className="section-head">Chapters</h2>
        <ul className="chapters">
          {hall.chapters.map((chapter, i) => (
            <li key={chapter}>
              <span className="num">{GREEK_NUMERALS[i] || i + 1}</span>
              <span className="chapter-name">{chapter}</span>
            </li>
          ))}
        </ul>

        <h2 className="section-head">Tablets</h2>
        <TabletList hall={hall.id} />
      </main>

      <Footer />
    </>
  );
}
