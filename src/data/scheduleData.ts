export interface ScheduleTestItem {
  id: string; // e.g. "jee-mains-ptm-01"
  code: string; // e.g. "PTM 01"
  num: number;
  phase: 1 | 2 | 3;
  dateStr: string; // e.g. "Sun, Nov 22, 2026"
  windowStr: string; // e.g. "10:00 AM – 8:00 PM IST"
  startIso: string;
  endIso: string;
  tag?: string; // e.g. "All-India", "Shift 1 Sim", "Shift 2 Sim", "Grand Finale"
  route: string; // e.g. "/test/jee-mains/ptm-01"
  hashRoute: string; // e.g. "#/test/jee-mains/ptm-01"
  syllabus?: {
    physics: string[];
    chemistry: string[];
    mathematics: string[];
  };
}

export const JEE_MAINS_2027_SCHEDULE: ScheduleTestItem[] = [
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
    hashRoute: "#/test/jee-mains/ptm-03"
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
    hashRoute: "#/test/jee-mains/ptm-04"
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

export const FINAL_REVISION_CARD = {
  dateStr: "Jan 18 – Jan 20, 2027",
  title: "Final Formula Vault & Mental Rehearsal",
  description: "Formula sheets, inorganic tables, error logs & light revision before exam day.",
  route: "/resources",
  hashRoute: "#/resources"
};
