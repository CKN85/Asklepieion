import TabletList from "./TabletList.jsx";

export default function Propylon() {
  return (
    <section className="propylon-section" id="ethics">
      <span className="eyebrow">Ε · Athens</span>
      <h2>The Propylon</h2>
      <p className="site">Ethics</p>
      <p>
        Athens never got a wing of its own in the old sanctuaries — it got the gate.
        Its Asklepieion sat just below the Acropolis, a short walk from the Areopagus,
        Athens's court for judging matters of conscience, and from the streets where
        Socrates, Plato, and Aristotle asked what a good life required. This isn't a
        fifth hall to finish once and leave behind — it's the threshold every Asclepiad
        passes through first, and returns to inside every other hall.
      </p>
      <ul className="topics">
        <li>Autonomy &amp; Consent</li>
        <li>Confidentiality</li>
        <li>Beneficence &amp; Non-maleficence</li>
        <li>Justice &amp; Access</li>
        <li>End-of-Life Care</li>
        <li>Professionalism</li>
        <li>Research Ethics</li>
        <li>Law &amp; Medicine</li>
      </ul>
      <TabletList hall="ethics" />
    </section>
  );
}
