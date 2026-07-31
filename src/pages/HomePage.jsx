import FloorPlan from "../components/FloorPlan.jsx";
import Hall from "../components/Hall.jsx";
import Propylon from "../components/Propylon.jsx";
import TabletList from "../components/TabletList.jsx";

export default function HomePage() {
  return (
    <>
      <header className="hero">
        <span className="eyebrow">Α Σ Κ Λ Η Π Ι Ε Ι Ο Ν</span>
        <h1>Asklepieion</h1>
        <p className="tagline">
          Four halls, one sanctuary of study — anatomy, physiology, biochemistry, and
          histopathology written in full, and cross-referenced exactly where the body
          itself connects them.
        </p>
        <FloorPlan />
      </header>

      <section className="intro">
        <span className="eyebrow">For Asclepiads</span>
        <h2>One place, read in full</h2>
        <p>
          Most texts summarize, and send you elsewhere for the rest. The Asklepieion
          doesn't — it gathers the connected reading that medical study usually forces
          you to hunt across ten sources for, written to the depth doctors expect and
          organized so each hall answers to the others.
        </p>
      </section>

      <Propylon />

      <section className="halls">
        <Hall
          id="hall-trikka" mark="Α" name="Hall of Trikka" site="Anatomy"
          description="Named for the site tradition holds as Asclepius's birthplace — the origin point. The form of the body, region by region and system by system, as the foundation everything else in the sanctuary is built on."
          topics={["Musculoskeletal", "Cardiovascular", "Respiratory", "Gastrointestinal", "Renal & Pelvic", "Nervous System", "Head & Neck", "Embryology"]}
        >
          <TabletList hall="trikka" />
        </Hall>

        <Hall
          id="hall-epidaurus" mark="Β" name="Hall of Epidaurus" site="Physiology"
          description="Named for the largest and most complete Asklepieion — the mother sanctuary, an entire complex engineered to function as one working system. How each system of the body operates, in health and under strain."
          topics={["Cardiovascular", "Respiratory", "Renal", "Gastrointestinal", "Endocrine", "Neurophysiology", "Acid–Base & Fluids", "Hematology & Immunity"]}
        >
          <TabletList hall="epidaurus" />
        </Hall>

        <Hall
          id="hall-kos" mark="Γ" name="Hall of Kos" site="Biochemistry"
          description="Named for Hippocrates's home, where the humoral tradition first framed illness as an imbalance of internal substances. The reactions, pathways, and molecules that sustain the system — and what happens when they don't."
          topics={["Metabolism", "Molecular Biology", "Enzymology", "Genetics", "Cell Signaling", "Nutrition & Vitamins"]}
        >
          <TabletList hall="kos" />
        </Hall>

        <Hall
          id="hall-pergamon" mark="Δ" name="Hall of Pergamon" site="Histopathology"
          description="Named for the sanctuary where Galen studied the wounded and dying at close hand. The tissue itself, and what disrupts it — injury, inflammation, neoplasia, and the organisms that cause disease."
          topics={["General Pathology", "Systemic Pathology", "Bacteriology", "Virology", "Mycology & Parasitology", "Immunopathology"]}
        >
          <TabletList hall="pergamon" />
        </Hall>
      </section>

      <footer>
        <span className="eyebrow">Ασκληπιάδαι</span>
        <p>Built for Asclepiads — students and physicians who read past the summary.</p>
      </footer>
    </>
  );
}
