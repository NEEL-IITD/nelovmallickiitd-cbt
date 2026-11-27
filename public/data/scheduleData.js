// public/data/scheduleData.js
// Standalone client bundle for JEE Mains 2027 (January Attempt) 20-Test PTM Schedule
// Curated by Nelov Mallick (IIT Delhi) - 100% Free Forever

(function() {
  const JEE_MAINS_2027_SCHEDULE = [
    // Phase 1 — Nov 22 to Dec 13, 2026 (2 Tests / Week)
    {
      id: "jee-mains-ptm-01",
      code: "PTM 01",
      num: 1,
      phase: 1,
      dateStr: "Sun, Nov 22, 2026",
      windowStr: "10:00 AM – 8:00 PM IST",
      startIso: "2026-11-22T10:00:00+05:30",
      endIso: "2026-11-22T20:00:00+05:30",
      route: "/test/jee-mains/ptm-01",
      hashRoute: "#/test/jee-mains/ptm-01",
      syllabus: {
        physics: [
          "Kinetic Theory of Gases (degrees of freedom, RMS, average and most probable speeds, Maxwell distribution, mean free path, relaxation time)",
          "Thermodynamics (First Law of Thermodynamics, work done in isobaric, isothermal, adiabatic, isochoric and cyclic processes, Carnot engine efficiency, adiabatic bulk modulus)"
        ],
        chemistry: [
          "Hydrocarbons (alkanes, alkenes, alkynes, free-radical halogenation, oxymercuration-demercuration, conjugated dienes, Wurtz-Fittig reaction)",
          "General Organic Chemistry (Aromaticity, Huckel's rule, acidic strength and pKa, dipole moment of alkyl halides)",
          "Purification & Separation Methods (distillation types: simple, fractional, steam, vacuum; chromatography: TLC; Kjeldahl's method)"
        ],
        mathematics: [
          "Trigonometric Ratios & Identities (compound angles, multiple & submultiple angles, transformation formulas, summation of trigonometric series)",
          "Trigonometric Functions & Properties (domain, range, periodicity, greatest integer combinations)",
          "Trigonometric Equations (number of roots, general solutions, system of equations)"
        ]
      }
    },
    {
      id: "jee-mains-ptm-02",
      code: "PTM 02",
      num: 2,
      phase: 1,
      dateStr: "Wed, Nov 25, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-11-25T09:00:00+05:30",
      endIso: "2026-11-25T21:00:00+05:30",
      route: "/test/jee-mains/ptm-02",
      hashRoute: "#/test/jee-mains/ptm-02",
      syllabus: {
        physics: [
          "Thermal Expansion of Solids and Liquids (linear, superficial, and cubical expansion; bimetallic strips, apparent expansion)",
          "Calorimetry and Heat Transfer (principle of calorimetry, water equivalent, latent heat of fusion and vaporization, phase change)",
          "Heat Conduction (Fourier's law, steady state heat current, thermal resistance of series and parallel composite rods, spherical and cylindrical shells)",
          "Thermal Radiation (Stefan-Boltzmann law, Wien's displacement law, Newton's law of cooling, blackbody radiation)"
        ],
        chemistry: [
          "IUPAC Nomenclature & Structural Basics (rules of IUPAC naming for polyfunctional organic compounds, bond line notation, sigma and pi bond counts, hybridization)",
          "General Organic Chemistry (Electronic effects: Inductive, Resonance/Mesomeric, Hyperconjugation, and Electromeric effects; Aromaticity and Hückel's 4n+2 rule; Reaction intermediates: stability of carbocations, carbanions, and free radicals; Acidic and basic strengths of organic compounds)",
          "Isomerism in Organic Compounds (Structural isomerism: chain, position, functional, metamerism, tautomerism; Stereoisomerism: geometrical cis/trans isomerism, optical isomerism, enantiomers, diastereomers, meso compounds, conformers of cyclohexane and ethane)"
        ],
        mathematics: [
          "Quadratic Equations & Expressions (relations between roots and coefficients, nature of roots, common roots, sign of quadratic expressions, location of roots, reducible quadratic equations)",
          "Logarithms & Inequalities (properties of logarithms, logarithmic equations and inequalities, base transformations, domain restrictions)",
          "Sequences & Series (Arithmetic Progression: general term, sum of n terms, arithmetic mean; Geometric Progression: finite and infinite sums, geometric mean; Arithmetico-Geometric Progression (AGP), Telescoping series summation, Newton's sums for polynomial roots)"
        ]
      }
    },
    {
      id: "jee-mains-ptm-03",
      code: "PTM 03",
      num: 3,
      phase: 1,
      dateStr: "Sun, Nov 29, 2026",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2026-11-29T09:00:00+05:30",
      endIso: "2026-11-29T18:00:00+05:30",
      tag: "All-India",
      route: "/test/jee-mains/ptm-03",
      hashRoute: "#/test/jee-mains/ptm-03",
      syllabus: {
        physics: [
          "Thermal Properties of Matter (Thermometry: linear and faulty scales; linear, superficial, and volume thermal expansion: composite rods, thermal stress, apparent expansion of liquids in vessels, buoyancy, and moment of inertia effects; calorimetry: principle of mixtures, water equivalent, latent heat of fusion and vaporization, power-driven heating)",
          "Heat Transfer (Thermal conduction: variable thermal conductivity, series and parallel slabs, steady-state junction temperatures in rod networks, radial conduction through spherical shells; thermal radiation: Stefan–Boltzmann law, Wien's displacement law, and solar intensity)"
        ],
        chemistry: [
          "**Haloalkanes & Haloarenes:** Common names, physical properties (boiling points), preparation from alkenes and alcohols (SOCl<sub>2</sub>/pyridine), substitution mechanisms (S<sub>N</sub>1, S<sub>N</sub>2, Finkelstein reaction, solvent effects, stereochemistry, rearrangements/ring expansion), elimination reactions (E1, E2, Saytzeff vs. Hofmann products), and reactivity/electrophilic substitution of haloarenes.",
          "**Grignard Reagents:** Acid–base reactions (D<sub>2</sub>O, -COOH vs. -SO<sub>3</sub>H), nucleophilic addition to carbonyl/acid derivatives, and epoxide ring opening.",
          "**Polymers:** Natural rubber (hydrogenation) and biodegradable polymers."
        ],
        mathematics: [
          "Matrices & Matrix Algebra (Types of matrices: symmetric, skew-symmetric, orthogonal, idempotent, and nilpotent; matrix multiplication, powers of matrices, trace of matrix powers tr(A^n), and polynomial matrix expressions)",
          "Determinants & Matrix Inversion (Properties of determinants, minors and cofactors, adjoint of a matrix and its iterative properties: |adj A| = |A|^(n-1), |adj(adj A)| = |A|^((n-1)^2), and matrix inverse A^(-1) = adj A / |A|)",
          "System of Linear Equations (Cramer's rule, consistency and inconsistency of linear non-homogeneous and homogeneous systems, conditions for unique solution, infinitely many solutions, and trivial/non-trivial solutions)"
        ]
      }
    },
    {
      id: "jee-mains-ptm-04",
      code: "PTM 04",
      num: 4,
      phase: 1,
      dateStr: "Wed, Dec 2, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-02T09:00:00+05:30",
      endIso: "2026-12-02T21:00:00+05:30",
      route: "/test/jee-mains/ptm-04",
      hashRoute: "#/test/jee-mains/ptm-04",
      syllabus: {
        physics: [
          "Electrostatics & Capacitors (Charge redistribution and energy loss on touching identical conducting spheres; work done in separating plates of an isolated capacitor; series and parallel combinations of dielectrics; variable triangular dielectric wedge integration; interleaved multi-plate and floating-conductor systems; asymmetrically charged parallel-plate capacitors in RC circuits)",
          "Current Electricity & DC Circuits (Electrical power scaling with voltage, temperature coefficient of resistance referenced to 0°C, wire stretching at constant density, non-uniform cylindrical current density integration J(x), electron drift mobility, mixed grouping of cells for maximum current, Kirchhoff's junction & loop conservation laws, balanced and anti-symmetric Wheatstone bridges, resistor ladders & short-wire symmetric networks, meter bridge null-point shifts, potentiometer internal resistance, finite-resistance voltmeter loading, and initial t=0+ vs. steady-state RC capacitor charges)"
        ],
        chemistry: [
          "**Alcohols, Phenols & Ethers:** Cleavage of mixed aryl-alkyl and benzylic ethers with hot HI; acid-catalyzed dehydration rates (3° benzylic vs. 2° vs. 1° & carbocation rearrangements/spiro ring expansion & Bredt's rule resistance at bicyclic bridgeheads); chemoselective allylic oxidation with MnO<sub>2</sub> vs. PCC and chromic acid oxidation to p-benzoquinone; Lucas reagent reactivity (cyclopropylmethyl, cyclopropenyl, and tropylium cations); epoxide ring opening and Lindlar reduction; relative acidity of substituted phenols, picric acid with NaHCO<sub>3</sub>, distinction tests (neutral FeCl<sub>3</sub>, Liebermann's nitroso, Na, Br<sub>2</sub>/CS<sub>2</sub>, Zn dust, PCl<sub>5</sub>, HBr inertness); Reimer–Tiemann, Gattermann formylation, oxymercuration–demercuration cyclization, and intramolecular Friedel–Crafts alkylation.",
          "**Haloalkanes & Stereochemistry:** Stereochemical course of SOCl<sub>2</sub> (S<sub>N</sub>i retention vs. S<sub>N</sub>2 inversion with pyridine), Finkelstein S<sub>N</sub>2 inversion (NaI/acetone), anti-periplanar E2 elimination selectivity, iodoform test (I<sub>2</sub>+NaOH), and optical/diastereomeric isomer counting."
        ],
        mathematics: [
          "Permutations & Combinations (Fundamental counting principle for alternative questions, digit pairs without borrowing, digit-product multisets; restricted arrangements of INEFFECTIVE and dictionary rank of MONDAY; non-consecutive identical digits and odd digits at even places; circular seating avoiding adjacent same-nationality pairs; block-constrained multiset arrangements; committee selection, non-decreasing onto functions, grid rectangles excluding squares, diagonals of polygons, parallel-line segment intersections, and lattice-point integer-area triangle counting)",
          "Matrices & Number Theory Counting (Counting 3×3 matrices with zero trace and 2×2 matrices with prime entry sums; divisibility by 9, Legendre's formula on 33!, inclusion–exclusion on positive divisors of 10^10, 15^7, 18^11, GCD-constrained 4-digit numbers, and digit-sum parity counts)"
        ]
      }
    },
    {
      id: "jee-mains-ptm-05",
      code: "PTM 05",
      num: 5,
      phase: 1,
      dateStr: "Sun, Dec 6, 2026",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2026-12-06T09:00:00+05:30",
      endIso: "2026-12-06T18:00:00+05:30",
      tag: "All-India",
      route: "/test/jee-mains/ptm-05",
      hashRoute: "#/test/jee-mains/ptm-05"
    },
    {
      id: "jee-mains-ptm-06",
      code: "PTM 06",
      num: 6,
      phase: 1,
      dateStr: "Wed, Dec 9, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-09T09:00:00+05:30",
      endIso: "2026-12-09T21:00:00+05:30",
      route: "/test/jee-mains/ptm-06",
      hashRoute: "#/test/jee-mains/ptm-06"
    },
    {
      id: "jee-mains-ptm-07",
      code: "PTM 07",
      num: 7,
      phase: 1,
      dateStr: "Sun, Dec 13, 2026",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2026-12-13T09:00:00+05:30",
      endIso: "2026-12-13T18:00:00+05:30",
      tag: "All-India",
      route: "/test/jee-mains/ptm-07",
      hashRoute: "#/test/jee-mains/ptm-07"
    },

    // Phase 2 — Dec 15, 2026 to Jan 3, 2027 (3 Tests / Week)
    {
      id: "jee-mains-ptm-08",
      code: "PTM 08",
      num: 8,
      phase: 2,
      dateStr: "Tue, Dec 15, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-15T09:00:00+05:30",
      endIso: "2026-12-15T21:00:00+05:30",
      route: "/test/jee-mains/ptm-08",
      hashRoute: "#/test/jee-mains/ptm-08"
    },
    {
      id: "jee-mains-ptm-09",
      code: "PTM 09",
      num: 9,
      phase: 2,
      dateStr: "Thu, Dec 17, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-17T09:00:00+05:30",
      endIso: "2026-12-17T21:00:00+05:30",
      route: "/test/jee-mains/ptm-09",
      hashRoute: "#/test/jee-mains/ptm-09"
    },
    {
      id: "jee-mains-ptm-10",
      code: "PTM 10",
      num: 10,
      phase: 2,
      dateStr: "Sun, Dec 20, 2026",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2026-12-20T09:00:00+05:30",
      endIso: "2026-12-20T18:00:00+05:30",
      tag: "All-India",
      route: "/test/jee-mains/ptm-10",
      hashRoute: "#/test/jee-mains/ptm-10"
    },
    {
      id: "jee-mains-ptm-11",
      code: "PTM 11",
      num: 11,
      phase: 2,
      dateStr: "Tue, Dec 22, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-22T09:00:00+05:30",
      endIso: "2026-12-22T21:00:00+05:30",
      route: "/test/jee-mains/ptm-11",
      hashRoute: "#/test/jee-mains/ptm-11"
    },
    {
      id: "jee-mains-ptm-12",
      code: "PTM 12",
      num: 12,
      phase: 2,
      dateStr: "Thu, Dec 24, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-24T09:00:00+05:30",
      endIso: "2026-12-24T21:00:00+05:30",
      route: "/test/jee-mains/ptm-12",
      hashRoute: "#/test/jee-mains/ptm-12"
    },
    {
      id: "jee-mains-ptm-13",
      code: "PTM 13",
      num: 13,
      phase: 2,
      dateStr: "Sun, Dec 27, 2026",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2026-12-27T09:00:00+05:30",
      endIso: "2026-12-27T18:00:00+05:30",
      tag: "All-India",
      route: "/test/jee-mains/ptm-13",
      hashRoute: "#/test/jee-mains/ptm-13"
    },
    {
      id: "jee-mains-ptm-14",
      code: "PTM 14",
      num: 14,
      phase: 2,
      dateStr: "Tue, Dec 29, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-29T09:00:00+05:30",
      endIso: "2026-12-29T21:00:00+05:30",
      route: "/test/jee-mains/ptm-14",
      hashRoute: "#/test/jee-mains/ptm-14"
    },
    {
      id: "jee-mains-ptm-15",
      code: "PTM 15",
      num: 15,
      phase: 2,
      dateStr: "Thu, Dec 31, 2026",
      windowStr: "9:00 AM – 9:00 PM IST",
      startIso: "2026-12-31T09:00:00+05:30",
      endIso: "2026-12-31T21:00:00+05:30",
      route: "/test/jee-mains/ptm-15",
      hashRoute: "#/test/jee-mains/ptm-15"
    },
    {
      id: "jee-mains-ptm-16",
      code: "PTM 16",
      num: 16,
      phase: 2,
      dateStr: "Sun, Jan 3, 2027",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2027-01-03T09:00:00+05:30",
      endIso: "2027-01-03T18:00:00+05:30",
      tag: "All-India",
      route: "/test/jee-mains/ptm-16",
      hashRoute: "#/test/jee-mains/ptm-16"
    },

    // Phase 3 — Jan 6 to Jan 17, 2027 (NTA Shift Simulation)
    {
      id: "jee-mains-ptm-17",
      code: "PTM 17",
      num: 17,
      phase: 3,
      dateStr: "Wed, Jan 6, 2027",
      windowStr: "9:00 AM – 12:00 PM IST",
      startIso: "2027-01-06T09:00:00+05:30",
      endIso: "2027-01-06T12:00:00+05:30",
      tag: "Shift 1 Sim",
      route: "/test/jee-mains/ptm-17",
      hashRoute: "#/test/jee-mains/ptm-17"
    },
    {
      id: "jee-mains-ptm-18",
      code: "PTM 18",
      num: 18,
      phase: 3,
      dateStr: "Sun, Jan 10, 2027",
      windowStr: "3:00 PM – 6:00 PM IST",
      startIso: "2027-01-10T15:00:00+05:30",
      endIso: "2027-01-10T18:00:00+05:30",
      tag: "Shift 2 Sim",
      route: "/test/jee-mains/ptm-18",
      hashRoute: "#/test/jee-mains/ptm-18"
    },
    {
      id: "jee-mains-ptm-19",
      code: "PTM 19",
      num: 19,
      phase: 3,
      dateStr: "Wed, Jan 13, 2027",
      windowStr: "9:00 AM – 12:00 PM IST",
      startIso: "2027-01-13T09:00:00+05:30",
      endIso: "2027-01-13T12:00:00+05:30",
      tag: "Shift 1 Sim",
      route: "/test/jee-mains/ptm-19",
      hashRoute: "#/test/jee-mains/ptm-19"
    },
    {
      id: "jee-mains-ptm-20",
      code: "PTM 20",
      num: 20,
      phase: 3,
      dateStr: "Sun, Jan 17, 2027",
      windowStr: "9:00 AM – 6:00 PM IST",
      startIso: "2027-01-17T09:00:00+05:30",
      endIso: "2027-01-17T18:00:00+05:30",
      tag: "Grand Finale",
      route: "/test/jee-mains/ptm-20",
      hashRoute: "#/test/jee-mains/ptm-20"
    }
  ];

  const FINAL_REVISION_CARD = {
    dateStr: "Jan 18 – Jan 20, 2027",
    title: "Final Formula Vault & Mental Rehearsal",
    description: "Formula sheets, inorganic tables, error logs & light revision before exam day.",
    route: "/resources",
    hashRoute: "#/resources"
  };

  window.JEE_MAINS_2027_SCHEDULE = JEE_MAINS_2027_SCHEDULE;
  window.FINAL_REVISION_CARD = FINAL_REVISION_CARD;
})();
