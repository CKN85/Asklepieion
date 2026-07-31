// Every hall's identity lives here. The floor plan, the hall pages, and the
// Tablet labels all read from this one place, so nothing can drift out of sync.

export const HALLS = [
  {
    id: "trikka",
    mark: "Α",
    name: "Trikka",
    greek: "Τρίκκη",
    discipline: "Anatomy",
    kind: "hall",
    tagline: "The form of the body.",
    description:
      "Named for the site tradition holds as Asclepius's birthplace — the origin point, and the oldest of the sanctuaries. This hall holds the form of the body: region by region, system by system, as the foundation everything else in the Asklepieion is built upon.",
    chapters: [
      "Musculoskeletal",
      "Cardiovascular",
      "Respiratory",
      "Gastrointestinal",
      "Renal & Pelvic",
      "Nervous System",
      "Head & Neck",
      "Embryology",
    ],
  },
  {
    id: "epidaurus",
    mark: "Β",
    name: "Epidaurus",
    greek: "Ἐπίδαυρος",
    discipline: "Physiology",
    kind: "hall",
    tagline: "The body at work.",
    description:
      "Named for the greatest of the sanctuaries — the mother site, an entire complex of theatre, baths, and abaton engineered to function as a single working system. This hall holds physiology: how each system of the body operates, in health and under strain.",
    chapters: [
      "Cardiovascular",
      "Respiratory",
      "Renal",
      "Gastrointestinal",
      "Endocrine",
      "Neurophysiology",
      "Acid–Base & Fluids",
      "Haematology & Immunity",
    ],
  },
  {
    id: "kos",
    mark: "Γ",
    name: "Kos",
    greek: "Κῶς",
    discipline: "Biochemistry",
    kind: "hall",
    tagline: "The chemistry beneath.",
    description:
      "Named for the home of Hippocrates, where the humoral tradition first framed illness as an imbalance of internal substances — the earliest attempt at a chemistry of the body. This hall holds the reactions, pathways, and molecules that sustain life, and what follows when they fail.",
    chapters: [
      "Metabolism",
      "Molecular Biology",
      "Enzymology",
      "Genetics",
      "Cell Signalling",
      "Nutrition & Vitamins",
    ],
  },
  {
    id: "pergamon",
    mark: "Δ",
    name: "Pergamon",
    greek: "Πέργαμον",
    discipline: "Histopathology",
    kind: "hall",
    tagline: "The tissue, and what destroys it.",
    description:
      "Named for the sanctuary where Galen treated the wounded and the dying at close hand, alongside a great library of accumulated medical scholarship. This hall holds the tissue itself and what disrupts it: injury, inflammation, neoplasia, and the organisms that cause disease.",
    chapters: [
      "General Pathology",
      "Systemic Pathology",
      "Bacteriology",
      "Virology",
      "Mycology & Parasitology",
      "Immunopathology",
    ],
  },
  {
    id: "ethics",
    mark: "Ε",
    name: "Athens",
    greek: "Ἀθῆναι",
    discipline: "Ethics",
    kind: "propylon",
    tagline: "The threshold.",
    description:
      "Athens never took a wing of its own — it took the gate. Its Asklepieion sat below the Acropolis, a short walk from the Areopagus, the court for matters of conscience, and from the streets where Socrates, Plato, and Aristotle asked what a good life required. This is not a hall to finish and leave behind, but the threshold every Asclepiad passes through first, and returns to inside every other hall.",
    chapters: [
      "Autonomy & Consent",
      "Confidentiality",
      "Beneficence & Non-maleficence",
      "Justice & Access",
      "End-of-Life Care",
      "Professionalism",
      "Research Ethics",
      "Law & Medicine",
    ],
  },
];

export const HALLS_BY_ID = Object.fromEntries(HALLS.map((h) => [h.id, h]));

export function hallLabel(id) {
  const h = HALLS_BY_ID[id];
  if (!h) return id;
  return h.kind === "propylon"
    ? `The Propylon · ${h.discipline}`
    : `Hall of ${h.name} · ${h.discipline}`;
}
