// =========================
// JEE OS SYLLABUS DATABASE
// =========================

const FULL_SYLLABUS = {

  Physics: [

    "Units & Dimensions",
    "Errors & Measurements",
    "Vectors",

    "Kinematics",
    "Projectile Motion",

    "Laws of Motion",
    "Friction",

    "Work Power Energy",

    "Circular Motion",

    "Center of Mass",

    "Collision",

    "Rotational Motion",

    "Gravitation",

    "Fluid Mechanics",

    "Properties of Matter",

    "Thermal Expansion",

    "Calorimetry",

    "KTG",

    "Thermodynamics",

    "Simple Harmonic Motion",

    "Waves",

    "Electrostatics",

    "Capacitance",

    "Current Electricity",

    "Magnetic Effects of Current",

    "Magnetism",

    "Electromagnetic Induction",

    "Alternating Current",

    "Electromagnetic Waves",

    "Ray Optics",

    "Wave Optics",

    "Dual Nature",

    "Atoms",

    "Nuclei",

    "Semiconductors",

    "Communication Systems"

  ],

  Chemistry: [

    "Mole Concept",

    "Atomic Structure",

    "Periodic Table",

    "Chemical Bonding",

    "States of Matter",

    "Thermodynamics",

    "Thermochemistry",

    "Chemical Equilibrium",

    "Ionic Equilibrium",

    "Redox Reactions",

    "Hydrogen",

    "s Block",

    "p Block",

    "d Block",

    "f Block",

    "Coordination Compounds",

    "Metallurgy",

    "Environmental Chemistry",

    "Salt Analysis",

    "Purification of Organic Compounds",

    "Practical Organic Chemistry",

    "General Organic Chemistry",

    "Isomerism",

    "Hydrocarbons",

    "Haloalkanes & Haloarenes",

    "Alcohols Phenols Ethers",

    "Aldehydes Ketones",

    "Carboxylic Acids",

    "Amines",

    "Biomolecules",

    "Polymers",

    "Chemistry in Everyday Life",

    "Solid State",

    "Solutions",

    "Electrochemistry",

    "Chemical Kinetics",

    "Surface Chemistry"

  ],

  Mathematics: [

    "Sets",

    "Relations & Functions",

    "Trigonometric Ratios",

    "Inverse Trigonometric Functions",

    "Complex Numbers",

    "Quadratic Equations",

    "Sequence & Series",

    "Binomial Theorem",

    "Permutations & Combinations",

    "Probability",

    "Matrices",

    "Determinants",

    "Statistics",

    "Mathematical Reasoning",

    "Limits",

    "Continuity",

    "Differentiability",

    "Differentiation",

    "Application of Derivatives",

    "Indefinite Integration",

    "Definite Integration",

    "Area Under Curve",

    "Differential Equations",

    "Vector Algebra",

    "3D Geometry",

    "Straight Line",

    "Circle",

    "Parabola",

    "Ellipse",

    "Hyperbola"

  ]

};

// =========================
// INITIALIZE CHAPTERS
// =========================

function initializeSyllabus() {

  if (
    Object.keys(
      appData.chapters
    ).length > 0
  ) {
    return;
  }

  Object.entries(
    FULL_SYLLABUS
  ).forEach(
    ([subject, chapters]) => {

      chapters.forEach(
        chapter => {

          appData.chapters[
            chapter
          ] = {

            subject,

            status: "weak",

            pyq: 0,

            revision1: false,

            revision2: false,

            revision3: false

          };

        }
      );

    }
  );

  saveData();

}

// =========================
// SUBJECT COUNTS
// =========================

function getSubjectStats() {

  let result = {

    Physics: 0,

    Chemistry: 0,

    Mathematics: 0

  };

  Object.values(
    appData.chapters
  ).forEach(
    chapter => {

      result[
        chapter.subject
      ]++;

    }
  );

  return result;

}

// =========================
// WEAK CHAPTERS
// =========================

function getWeakChapters() {

  return Object.entries(
    appData.chapters
  )

  .filter(
    ([_, data]) =>
      data.status === "weak"
  )

  .map(
    ([name]) => name
  );

}

// =========================
// PYQ SORTING
// =========================

function getChaptersByPYQ() {

  return Object.entries(
    appData.chapters
  )

  .sort(
    (a, b) =>
      a[1].pyq -
      b[1].pyq
  );

}

// =========================
// DASHBOARD LIST
// =========================

function renderLowestPYQList() {

  const target =
    document.getElementById(
      "danger-zone-list"
    );

  if (!target)
    return;

  let list =
    getChaptersByPYQ()
      .slice(0, 10);

  target.innerHTML = "";

  list.forEach(
    ([name, data]) => {

      target.innerHTML += `
      <div class="danger-item">

        <strong>
          ${name}
        </strong>

        <br>

        PYQ:
        ${data.pyq}%

      </div>
      `;

    }
  );

}

// =========================
// STARTUP
// =========================

initializeSyllabus();

renderLowestPYQList();