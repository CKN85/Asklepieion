import FloorPlan from "../components/FloorPlan.jsx";
import Footer from "../components/Footer.jsx";
import { HALLS } from "../data/halls.js";

export default function HomePage() {
  return (
    <>
      <header className="masthead">
        <span className="eyebrow">Sanctuary of Study</span>
        <h1>Asklepieion</h1>
        <span className="greek">Ἀσκληπιεῖον</span>
        <div className="meander" aria-hidden="true" />
        <p className="tagline">
          Four halls and a gate. Anatomy, physiology, biochemistry, and
          histopathology written in full — and cross-referenced exactly where
          the body itself connects them.
        </p>
      </header>

      <FloorPlan halls={HALLS} />
      <p className="plan-caption">Choose a hall to enter</p>

      <section className="creed">
        <div className="meander" aria-hidden="true" />
        <h2>Read in full</h2>
        <p>
          Most texts summarise, then send you elsewhere for the rest. The
          Asklepieion does not. It gathers the connected reading that medical
          study usually forces you to hunt across ten sources for, written to
          the depth physicians expect, and ordered so that each hall answers to
          the others.
        </p>
      </section>

      <Footer />
    </>
  );
}
