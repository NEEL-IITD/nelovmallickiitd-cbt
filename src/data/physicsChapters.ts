// ==============================================================================
// NelovMallickIITD · Physics Chapterwise Resources Configuration
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Exact 28 Chapters + Theory + Online Test-Ready Exercises Data Mapping
// ==============================================================================

export interface ChapterExercise {
  id: string;
  title: string;
  type: 'combined' | 'numbered';
  number?: number;
  questionCount?: number;
  timeMinutes?: number;
  marks?: number;
  status: 'ready_for_upload' | 'coming_soon' | 'live';
  statusLabel: string;
  targetExam: 'JEE Mains' | 'JEE Advanced' | 'Both';
  markingScheme: string;
  description: string;
  jsonUrl?: string;
  mode?: 'cbt' | 'study_deck';
  uploadedQuestions?: any[]; // Prepared for Word (.docx) upload parsing
}

export interface ChapterTheory {
  title: string;
  topics?: string[];
  status: 'upload_pending' | 'ready';
  statusLabel: string;
  pdfUrl?: string | null;
  docxUrl?: string | null;
  summary: string;
}

export type PhysicsUnitCategory =
  | 'Mechanics'
  | 'General Physics'
  | 'Waves & Oscillations'
  | 'Thermal Physics'
  | 'Electromagnetism'
  | 'Optics'
  | 'Modern Physics';

export interface PhysicsChapter {
  id: string; // 'c1' .. 'c28'
  code: string; // 'C1' .. 'C28'
  chapterNumber: number;
  name: string;
  fullName: string;
  category: PhysicsUnitCategory;
  iconName: string;
  badgeText: string;
  theory: ChapterTheory;
  exercises: ChapterExercise[];
  colorTheme: {
    accent: string;
    bgLight: string;
    bgDark: string;
    borderLight: string;
    borderDark: string;
    glow: string;
  };
}

export const physicsChaptersData: PhysicsChapter[] = [
  // C1 - Unit & Dimension: Theory, Exercise (Combined)
  {
    id: 'c1',
    code: 'C1',
    chapterNumber: 1,
    name: 'Unit & Dimension',
    fullName: 'C1 - Unit & Dimension',
    category: 'General Physics',
    iconName: 'Ruler',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Fundamental & Derived Units', 'Dimensional Formulae', 'Homogeneity Principle', 'Applications & Limitations'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Comprehensive revision of fundamental SI units, standard dimensional analysis, and error reduction methods in dimensional formulas.'
    },
    exercises: [
      {
        id: 'c1-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 30,
        timeMinutes: 60,
        marks: 120,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1 (JEE Mains & Advanced)',
        description: 'Comprehensive chapter test covering dimensions of modern physics constants, standard formulas, and conversion of units.'
      }
    ],
    colorTheme: {
      accent: 'text-blue-500',
      bgLight: 'bg-blue-500/10',
      bgDark: 'dark:bg-blue-500/10',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-800',
      glow: 'rgba(59, 130, 246, 0.25)'
    }
  },

  // C2 - Error: Theory, Exercise 1, Exercise 2, Exercise 3
  {
    id: 'c2',
    code: 'C2',
    chapterNumber: 2,
    name: 'Error',
    fullName: 'C2 - Error',
    category: 'General Physics',
    iconName: 'Target',
    badgeText: 'Theory + 3 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Absolute, Relative & Percentage Error', 'Propagation of Errors in Arithmetic & Powers', 'Least Count of Vernier & Screw Gauge', 'Significant Figures'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Rigorous notes on systematic vs random errors, instrumental least count calculations, and fractional error propagation.'
    },
    exercises: [
      {
        id: 'c2-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Fundamental practice on significant figures and basic fractional & percentage error propagation.'
      },
      {
        id: 'c2-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Instrument-focused test on Vernier Calipers, Screw Gauge, zero errors, and pitch measurements.'
      },
      {
        id: 'c2-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Advanced multi-step experimental problems with calculus-based error minimization techniques.'
      }
    ],
    colorTheme: {
      accent: 'text-indigo-500',
      bgLight: 'bg-indigo-500/10',
      bgDark: 'dark:bg-indigo-500/10',
      borderLight: 'border-indigo-200',
      borderDark: 'dark:border-indigo-800',
      glow: 'rgba(99, 102, 241, 0.25)'
    }
  },

  // C3 - Vector & Calculus: Theory, Exercise (Combined)
  {
    id: 'c3',
    code: 'C3',
    chapterNumber: 3,
    name: 'Vector & Calculus',
    fullName: 'C3 - Vector & Calculus',
    category: 'General Physics',
    iconName: 'Compass',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Vector Algebra & Resolution', 'Dot & Cross Product', 'Differential & Integral Calculus in Kinematics', 'Area Under Curves'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Mathematical toolkit for physics: vector components, unit vectors, triple products, and definite integrals in dynamic systems.'
    },
    exercises: [
      {
        id: 'c3-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 30,
        timeMinutes: 60,
        marks: 120,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Comprehensive test spanning vector geometry, direction cosines, scalar triple products, and rate-of-change applications.'
      }
    ],
    colorTheme: {
      accent: 'text-cyan-500',
      bgLight: 'bg-cyan-500/10',
      bgDark: 'dark:bg-cyan-500/10',
      borderLight: 'border-cyan-200',
      borderDark: 'dark:border-cyan-800',
      glow: 'rgba(6, 182, 212, 0.25)'
    }
  },

  // C4 - Kinematics: Theory (49 Pages) + 6 Exercises
  {
    id: 'c4',
    code: 'C4',
    chapterNumber: 4,
    name: 'Kinematics',
    fullName: 'C4 - Kinematics',
    category: 'Mechanics',
    iconName: 'Gauge',
    badgeText: 'Theory + 6 Exercises',
    theory: {
      title: 'Theory',
      topics: [
        '1D Motion with Constant & Variable Acceleration',
        'Projectile Motion on Horizontal & Inclined Planes',
        'Relative Velocity (River-Boat, Rain-Man, Wind-Airplane)',
        'Graphical Analysis (v-t, a-t, x-t curves & calculus)'
      ],
      status: 'ready',
      statusLabel: 'Live • 49 Pages',
      pdfUrl: '/resources/physics/c04-kinematics/Kinematics_Theory_Clean.pdf',
      summary: 'Complete 49-page authentic chapter theory notes: equations of motion, graphical calculus (v-t, a-t, x-t curves), horizontal and inclined plane projectile trajectories, and 2D relative motion frames.'
    },
    exercises: [
      {
        id: 'c4-ex1',
        title: 'Exercise 1 — Single Correct',
        type: 'numbered',
        number: 1,
        questionCount: 79,
        timeMinutes: 90,
        marks: 316,
        status: 'live',
        statusLabel: 'Live • 79 Questions',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        jsonUrl: '/data/physics/c04-kinematics/exercise-1.json',
        description: '79 authentic single-choice questions covering full kinematics 1D and 2D.'
      },
      {
        id: 'c4-ex2',
        title: 'Exercise 2 — Multi-Correct',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 60,
        marks: 80,
        status: 'live',
        statusLabel: 'Live • 20 Questions',
        targetExam: 'JEE Advanced',
        markingScheme: '+4 / -2 (Partial)',
        jsonUrl: '/data/physics/c04-kinematics/exercise-2.json',
        description: '20 challenging multiple-choice questions requiring multi-variable analysis.'
      },
      {
        id: 'c4-ex3',
        title: 'Exercise 3 — Subjective / Numerical',
        type: 'numbered',
        number: 3,
        questionCount: 35,
        timeMinutes: 90,
        marks: 140,
        status: 'live',
        statusLabel: 'Live • 35 Questions',
        targetExam: 'Both',
        markingScheme: '+4 / 0',
        jsonUrl: '/data/physics/c04-kinematics/exercise-3.json',
        description: '35 comprehensive subjective problems and numerical value challenges.'
      },
      {
        id: 'c4-ex4',
        title: 'Exercise 4 — Advanced Subjective',
        type: 'numbered',
        number: 4,
        questionCount: 10,
        timeMinutes: 60,
        marks: 40,
        status: 'live',
        statusLabel: 'Live • 10 Questions',
        targetExam: 'JEE Advanced',
        markingScheme: '+4 / 0',
        jsonUrl: '/data/physics/c04-kinematics/exercise-4.json',
        description: '10 Olympiad and JEE Advanced level tough subjective problems.'
      },
      {
        id: 'c4-ex5',
        title: 'Exercise 5 — JEE Previous Year Problems',
        type: 'numbered',
        number: 5,
        questionCount: 12,
        timeMinutes: 45,
        marks: 48,
        status: 'live',
        statusLabel: 'Live • 12 Questions',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        jsonUrl: '/data/physics/c04-kinematics/exercise-5.json',
        description: '12 curated actual JEE Mains & Advanced previous year examination questions.'
      },
      {
        id: 'c4-sa',
        title: 'Short Answer Questions',
        type: 'combined',
        questionCount: 19,
        timeMinutes: 30,
        marks: 76,
        status: 'live',
        statusLabel: 'Live • 19 Conceptual Q&As',
        targetExam: 'Both',
        markingScheme: 'Study Mode / Flashcard',
        jsonUrl: '/data/physics/c04-kinematics/short-answers.json',
        mode: 'study_deck',
        description: '19 conceptual flashcard Q&As designed for rapid core revision and interview prep.'
      }
    ],
    colorTheme: {
      accent: 'text-emerald-500',
      bgLight: 'bg-emerald-500/10',
      bgDark: 'dark:bg-emerald-500/10',
      borderLight: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800',
      glow: 'rgba(16, 185, 129, 0.25)'
    }
  },

  // C5 - NLM, Friction: Theory (NLM, Friction, Constraint), Exercise (Combined)
  {
    id: 'c5',
    code: 'C5',
    chapterNumber: 5,
    name: 'NLM, Friction',
    fullName: 'C5 - NLM, Friction',
    category: 'Mechanics',
    iconName: 'Layers',
    badgeText: 'Theory (3 Parts) + Combined Exercise',
    theory: {
      title: 'Theory (NLM, Friction, Constraint)',
      topics: ['Newton\'s Laws of Motion & FBDs', 'String & Wedge Constraint Relations', 'Static, Limiting & Kinetic Friction', 'Two-Block Systems & Pseudo Forces'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Deep conceptual breakdown of Free Body Diagrams (FBD), virtual work method for constraint equations, and multi-block friction thresholds.'
    },
    exercises: [
      {
        id: 'c5-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 35,
        timeMinutes: 75,
        marks: 140,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Comprehensive test featuring complex pulley-wedge systems, multi-tiered friction blocks, and non-inertial reference frame dynamics.'
      }
    ],
    colorTheme: {
      accent: 'text-amber-500',
      bgLight: 'bg-amber-500/10',
      bgDark: 'dark:bg-amber-500/10',
      borderLight: 'border-amber-200',
      borderDark: 'dark:border-amber-800',
      glow: 'rgba(245, 158, 11, 0.25)'
    }
  },

  // C6 - Circular & WPE: Theory (Circular Motion, WPE), Exercise (Combined)
  {
    id: 'c6',
    code: 'C6',
    chapterNumber: 6,
    name: 'Circular & WPE',
    fullName: 'C6 - Circular & WPE',
    category: 'Mechanics',
    iconName: 'RotateCw',
    badgeText: 'Theory (2 Parts) + Combined Exercise',
    theory: {
      title: 'Theory (Circular Motion, WPE)',
      topics: ['Kinematics & Dynamics of Circular Motion', 'Banking of Roads & Conical Pendulum', 'Work-Energy Theorem & Conservative Forces', 'Potential Energy Curves & Vertical Circular Motion'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Centripetal and tangential accelerations, complete work-energy theorem proofs, equilibrium points, and looping the loop criteria.'
    },
    exercises: [
      {
        id: 'c6-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 35,
        timeMinutes: 75,
        marks: 140,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Intensive drill covering non-uniform circular paths, vertical loop tensions, spring-mass systems, and power-time curves.'
      }
    ],
    colorTheme: {
      accent: 'text-rose-500',
      bgLight: 'bg-rose-500/10',
      bgDark: 'dark:bg-rose-500/10',
      borderLight: 'border-rose-200',
      borderDark: 'dark:border-rose-800',
      glow: 'rgba(244, 63, 94, 0.25)'
    }
  },

  // C7 - COM: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c7',
    code: 'C7',
    chapterNumber: 7,
    name: 'COM (Center of Mass)',
    fullName: 'C7 - COM',
    category: 'Mechanics',
    iconName: 'Crosshair',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Calculation of Center of Mass (Discrete & Continuous)', 'COM of Truncated Bodies', 'Motion of COM & Conservation of Linear Momentum', '1D & 2D Elastic/Inelastic Collisions, Coefficient of Restitution'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Formula sheets for standard lamina/solids COM, zero external force displacement theorem, and impact impulse calculations.'
    },
    exercises: [
      {
        id: 'c7-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Discrete mass configurations, center of mass coordinates, and basic continuous symmetry integrations.'
      },
      {
        id: 'c7-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Truncated bodies (cavity problems), negative mass concept, and shifting coordinates.'
      },
      {
        id: 'c7-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Conservation of linear momentum, man-plank displacements, and recoil mechanics.'
      },
      {
        id: 'c7-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: '1D & 2D oblique collisions, coefficient of restitution, and kinetic energy loss.'
      },
      {
        id: 'c7-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Advanced multi-stage impact systems, impulse-momentum equations, and variable mass rocket propulsion.'
      }
    ],
    colorTheme: {
      accent: 'text-violet-500',
      bgLight: 'bg-violet-500/10',
      bgDark: 'dark:bg-violet-500/10',
      borderLight: 'border-violet-200',
      borderDark: 'dark:border-violet-800',
      glow: 'rgba(139, 92, 246, 0.25)'
    }
  },

  // C8 - Rotational Motion: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c8',
    code: 'C8',
    chapterNumber: 8,
    name: 'Rotational Motion',
    fullName: 'C8 - Rotational Motion',
    category: 'Mechanics',
    iconName: 'Disc',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Moment of Inertia (Parallel & Perpendicular Axes Theorems)', 'Torque & Rotational Equilibrium', 'Angular Momentum & Its Conservation', 'Pure Rolling Motion on Flat & Inclined Surfaces', 'Toppling vs Sliding'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Complete treatise on rigid body dynamics: MOI tensor fundamentals, instantaneous axis of rotation (IAOR), and combined translation-rotation.'
    },
    exercises: [
      {
        id: 'c8-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Moment of Inertia of rods, rings, discs, cylinders, spheres, and cavity shapes.'
      },
      {
        id: 'c8-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Torque equations, fixed-axis rotation, hinge forces, and rotational work-energy.'
      },
      {
        id: 'c8-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Angular momentum calculations about point and axis, conservation of angular momentum.'
      },
      {
        id: 'c8-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Pure rolling dynamics, rolling with slipping, friction direction, and acceleration on an incline.'
      },
      {
        id: 'c8-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Masterclass problems: Toppling, collision of point mass with rigid rods, and instantaneous center of rotation.'
      }
    ],
    colorTheme: {
      accent: 'text-fuchsia-500',
      bgLight: 'bg-fuchsia-500/10',
      bgDark: 'dark:bg-fuchsia-500/10',
      borderLight: 'border-fuchsia-200',
      borderDark: 'dark:border-fuchsia-800',
      glow: 'rgba(217, 70, 239, 0.25)'
    }
  },

  // C9 - Gravitation: Theory, Exercise (Combined)
  {
    id: 'c9',
    code: 'C9',
    chapterNumber: 9,
    name: 'Gravitation',
    fullName: 'C9 - Gravitation',
    category: 'Mechanics',
    iconName: 'Globe',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Newton\'s Universal Law & Gravitational Field', 'Gravitational Potential & Self Energy', 'Escape Velocity & Orbital Velocity of Satellites', 'Kepler\'s Three Laws of Planetary Motion'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Spherical shell potential proofs, geo-stationary satellite trajectory parameters, and orbital energy transfers.'
    },
    exercises: [
      {
        id: 'c9-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 30,
        timeMinutes: 60,
        marks: 120,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Covers earth gravitation variation with depth/altitude, tunnel through earth motion, and elliptic orbit dynamics.'
      }
    ],
    colorTheme: {
      accent: 'text-teal-500',
      bgLight: 'bg-teal-500/10',
      bgDark: 'dark:bg-teal-500/10',
      borderLight: 'border-teal-200',
      borderDark: 'dark:border-teal-800',
      glow: 'rgba(20, 184, 166, 0.25)'
    }
  },

  // C10 - Elasticity and Thermal Expansion: Theory, Exercise 1, Exercise 2, Exercise 3
  {
    id: 'c10',
    code: 'C10',
    chapterNumber: 10,
    name: 'Elasticity & Thermal Expansion',
    fullName: 'C10 - Elasticity and Thermal Expansion',
    category: 'Thermal Physics',
    iconName: 'Activity',
    badgeText: 'Theory + 3 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Hooke\'s Law & Stress-Strain Curve', 'Young\'s, Bulk & Shear Modulus', 'Elastic Potential Energy & Wire Elongation Under Self-Weight', 'Linear, Superficial & Volume Thermal Expansion, Thermal Stress'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Mechanical properties of solids, bimetallic strips, apparent expansion of liquids in vessels, and thermal stress in constrained rods.'
    },
    exercises: [
      {
        id: 'c10-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Stress, strain, Young\'s modulus calculations, and series/parallel combination of elastic wires.'
      },
      {
        id: 'c10-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Elastic energy density, wire elongation under self-weight, and bulk compression in liquids.'
      },
      {
        id: 'c10-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: '+4 / -1',
        description: 'Thermal expansion, bimetallic strip curvature, and thermal stresses with fixed boundaries.'
      }
    ],
    colorTheme: {
      accent: 'text-orange-500',
      bgLight: 'bg-orange-500/10',
      bgDark: 'dark:bg-orange-500/10',
      borderLight: 'border-orange-200',
      borderDark: 'dark:border-orange-800',
      glow: 'rgba(249, 115, 22, 0.25)'
    }
  },

  // C11 - Fluid: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c11',
    code: 'C11',
    chapterNumber: 11,
    name: 'Fluid Mechanics',
    fullName: 'C11 - Fluid',
    category: 'General Physics',
    iconName: 'Droplets',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Hydrostatic Pressure & Pascal\'s Law', 'Archimedes\' Principle & Laws of Floatation', 'Accelerating Fluid Containers (Linear & Rotational)', 'Equation of Continuity & Bernoulli\'s Principle', 'Torricelli\'s Law & Venturimeter'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Hydrostatics and hydrodynamics: free surface shapes in accelerated vessels, siphon action, orifice discharge, and dynamic lift.'
    },
    exercises: [
      {
        id: 'c11-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Fluid statics, manometer pressure balances, and hydraulic lift applications.'
      },
      {
        id: 'c11-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Buoyancy, Archimedes\' principle, fractional submergence, and apparent weight.'
      },
      {
        id: 'c11-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Accelerated containers: parabolic free liquid surfaces and rotating U-tubes.'
      },
      {
        id: 'c11-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Bernoulli\'s equation, continuity law, flow through variable pipes, and Venturi meters.'
      },
      {
        id: 'c11-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Efflux speed, time to empty tanks with variable cross-sections, and recoil thrust on tanks.'
      }
    ],
    colorTheme: {
      accent: 'text-sky-500',
      bgLight: 'bg-sky-500/10',
      bgDark: 'dark:bg-sky-500/10',
      borderLight: 'border-sky-200',
      borderDark: 'dark:border-sky-800',
      glow: 'rgba(14, 165, 233, 0.25)'
    }
  },

  // C12 - Surface Tension and Viscosity: Theory, Exercise 1, Exercise 2, Exercise 3
  {
    id: 'c12',
    code: 'C12',
    chapterNumber: 12,
    name: 'Surface Tension & Viscosity',
    fullName: 'C12 - Surface Tension and Viscosity',
    category: 'General Physics',
    iconName: 'Droplet',
    badgeText: 'Theory + 3 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Surface Energy & Surface Tension Force', 'Excess Pressure Inside Drops & Soap Bubbles', 'Contact Angle & Capillary Rise (Jurin\'s Law)', 'Newton\'s Law of Viscosity & Stokes\' Law Terminal Velocity', 'Poiseuille\'s Formula & Reynolds Number'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Laplace excess pressure, capillary rise derivations in vertical and inclined tubes, and terminal velocity of falling spheres.'
    },
    exercises: [
      {
        id: 'c12-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Surface energy, work done in blowing bubbles, and splitting of big drops into droplets.'
      },
      {
        id: 'c12-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Excess pressure, common interface radius of intersecting bubbles, and capillary rise.'
      },
      {
        id: 'c12-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: '+4 / -1',
        description: 'Viscous force, velocity gradients, Stokes\' drag, and terminal velocity dynamics.'
      }
    ],
    colorTheme: {
      accent: 'text-blue-400',
      bgLight: 'bg-blue-400/10',
      bgDark: 'dark:bg-blue-400/10',
      borderLight: 'border-blue-200',
      borderDark: 'dark:border-blue-800',
      glow: 'rgba(96, 165, 250, 0.25)'
    }
  },

  // C13 - S.H.M: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c13',
    code: 'C13',
    chapterNumber: 13,
    name: 'S.H.M (Simple Harmonic Motion)',
    fullName: 'C13 - S.H.M',
    category: 'Waves & Oscillations',
    iconName: 'Timer',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Kinematics of SHM (Displacement, Velocity, Acceleration)', 'Energy in SHM (Kinetic, Potential, Total)', 'Spring-Mass Systems (Series, Parallel, Cut Springs)', 'Simple, Physical & Torsional Pendulum', 'Superposition of Two SHMs & Lissajous Figures'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Differential equation of SHM, phasor method for phase differences, effective spring constant, and small oscillation approximations.'
    },
    exercises: [
      {
        id: 'c13-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Basic SHM equations, phase relationships, velocity-displacement graphs, and energy graphs.'
      },
      {
        id: 'c13-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Horizontal and vertical spring-mass blocks, cut springs, and equivalent spring constants.'
      },
      {
        id: 'c13-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Simple pendulum in accelerated elevators, physical pendulum, and liquid column oscillations.'
      },
      {
        id: 'c13-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Superposition of parallel and perpendicular SHMs with identical and distinct frequencies.'
      },
      {
        id: 'c13-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Advanced small oscillation analysis via energy method and angular SHM in complex rigid bodies.'
      }
    ],
    colorTheme: {
      accent: 'text-purple-500',
      bgLight: 'bg-purple-500/10',
      bgDark: 'dark:bg-purple-500/10',
      borderLight: 'border-purple-200',
      borderDark: 'dark:border-purple-800',
      glow: 'rgba(168, 85, 247, 0.25)'
    }
  },

  // C14 - String Wave: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c14',
    code: 'C14',
    chapterNumber: 14,
    name: 'String Wave',
    fullName: 'C14 - String Wave',
    category: 'Waves & Oscillations',
    iconName: 'Activity',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Wave Pulse Speed on Stretched Strings (v = √(T/μ))', 'General Wave Equation & Traveling Wave Parameters', 'Power & Energy Transmitted by Waves', 'Interference & Reflection at Fixed/Free Ends', 'Standing Waves on Strings & Normal Modes'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Mathematical formulation of progressive sinusoidal waves, phase shifts on reflection, standing wave nodes/antinodes, and resonance frequencies.'
    },
    exercises: [
      {
        id: 'c14-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Wave velocity formula, tension changes, and wave pulse travel time along heavy vertical ropes.'
      },
      {
        id: 'c14-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Progressive wave function y = A sin(kx - ωt + φ), particle speed vs wave speed, and phase relations.'
      },
      {
        id: 'c14-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Average power and energy density transmitted across string boundaries.'
      },
      {
        id: 'c14-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Standing wave harmonics in clamped strings, sonometer experiments, and tuning fork resonance.'
      },
      {
        id: 'c14-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Boundary transmission coefficients, impedance matching, and non-uniform density string wave pulses.'
      }
    ],
    colorTheme: {
      accent: 'text-indigo-400',
      bgLight: 'bg-indigo-400/10',
      bgDark: 'dark:bg-indigo-400/10',
      borderLight: 'border-indigo-200',
      borderDark: 'dark:border-indigo-800',
      glow: 'rgba(129, 140, 248, 0.25)'
    }
  },

  // C15 - Sound Wave: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c15',
    code: 'C15',
    chapterNumber: 15,
    name: 'Sound Wave',
    fullName: 'C15 - Sound Wave',
    category: 'Waves & Oscillations',
    iconName: 'Volume2',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Speed of Longitudinal Waves (Newton-Laplace Formula)', 'Displacement Wave vs Pressure Wave Equations', 'Sound Intensity & Decibel Scale (Loudness)', 'Standing Waves in Organ Pipes & End Corrections', 'Beats & Doppler Effect in Sound'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Acoustic wave pressure nodes, closed & open organ pipe resonance harmonics, beat frequency equations, and general Doppler effect frames.'
    },
    exercises: [
      {
        id: 'c15-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Speed of sound in gases, temperature and humidity dependencies, and displacement-pressure phase shift.'
      },
      {
        id: 'c15-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Sound intensity, point and line source attenuation, and decibel level calculation.'
      },
      {
        id: 'c15-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Closed & open organ pipes, resonance tube water level measurements, and end corrections.'
      },
      {
        id: 'c15-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Beats phenomenon, wax loading/filing on tuning forks, and interference of sound waves (Quincke\'s tube).'
      },
      {
        id: 'c15-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Doppler effect with moving source, observer, wind velocity, and reflection from moving walls.'
      }
    ],
    colorTheme: {
      accent: 'text-violet-400',
      bgLight: 'bg-violet-400/10',
      bgDark: 'dark:bg-violet-400/10',
      borderLight: 'border-violet-200',
      borderDark: 'dark:border-violet-800',
      glow: 'rgba(167, 139, 250, 0.25)'
    }
  },

  // C16 - Heat-1: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c16',
    code: 'C16',
    chapterNumber: 16,
    name: 'Heat-1 (Calorimetry & KTG)',
    fullName: 'C16 - Heat-1',
    category: 'Thermal Physics',
    iconName: 'Flame',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Specific Heat & Latent Heat of Phase Change', 'Principle of Calorimetry & Water Equivalent', 'Postulates of Kinetic Theory of Gases', 'Pressure of Ideal Gas, RMS, Mean & Most Probable Speeds', 'Degrees of Freedom & Equipartition of Energy'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Ice-water-steam mixture equilibrium calculations, Maxwell-Boltzmann velocity distribution curves, and molar specific heats (Cp and Cv).'
    },
    exercises: [
      {
        id: 'c16-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Calorimetry problems, mixture temperature, and latent heat equilibrium states.'
      },
      {
        id: 'c16-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Ideal gas law PV = nRT, Dalton\'s law of partial pressures, and mixture molar mass.'
      },
      {
        id: 'c16-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'KTG speed relations (v_rms, v_avg, v_mp) and kinetic energy per molecule/mole.'
      },
      {
        id: 'c16-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Degrees of freedom of monoatomic, diatomic, polyatomic gases and internal energy.'
      },
      {
        id: 'c16-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Maxwell speed distribution integrals and mean free path collisions under varying conditions.'
      }
    ],
    colorTheme: {
      accent: 'text-rose-500',
      bgLight: 'bg-rose-500/10',
      bgDark: 'dark:bg-rose-500/10',
      borderLight: 'border-rose-200',
      borderDark: 'dark:border-rose-800',
      glow: 'rgba(244, 63, 94, 0.25)'
    }
  },

  // C17 - Heat-2: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c17',
    code: 'C17',
    chapterNumber: 17,
    name: 'Heat-2 (Thermodynamics & Heat Transfer)',
    fullName: 'C17 - Heat-2',
    category: 'Thermal Physics',
    iconName: 'Thermometer',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['First Law of Thermodynamics (ΔQ = ΔU + W)', 'Isobaric, Isochoric, Isothermal & Adiabatic Processes', 'Polytropic Processes & Molar Heat Capacity', 'Second Law, Carnot Engine & Refrigerator Efficiency', 'Heat Transfer: Conduction, Convection & Stefan-Boltzmann Radiation'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'P-V, T-S and P-T thermodynamic cycles, work done in adiabatic expansions, thermal resistance analogy, and Wien\'s displacement law.'
    },
    exercises: [
      {
        id: 'c17-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Work done in standard thermodynamic processes and first law energy conservation.'
      },
      {
        id: 'c17-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Adiabatic equations PV^γ = const and polytropic molar heat capacities.'
      },
      {
        id: 'c17-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Cyclic thermodynamic engines, indicator P-V diagrams, and Carnot efficiency calculations.'
      },
      {
        id: 'c17-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Conduction through composite slabs, thermal current, and junction temperature equilibrium.'
      },
      {
        id: 'c17-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Stefan-Boltzmann law, Newton\'s law of cooling approximations, and solar radiation geometry.'
      }
    ],
    colorTheme: {
      accent: 'text-amber-500',
      bgLight: 'bg-amber-500/10',
      bgDark: 'dark:bg-amber-500/10',
      borderLight: 'border-amber-200',
      borderDark: 'dark:border-amber-800',
      glow: 'rgba(245, 158, 11, 0.25)'
    }
  },

  // C18 - Electrostatics-1: Theory, Exercise (Combined)
  {
    id: 'c18',
    code: 'C18',
    chapterNumber: 18,
    name: 'Electrostatics-1',
    fullName: 'C18 - Electrostatics-1',
    category: 'Electromagnetism',
    iconName: 'Zap',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Coulomb\'s Law & Principle of Superposition', 'Electric Field due to Point & Continuous Charge Distributions (Ring, Disc, Line, Sheet)', 'Electric Potential & Potential Energy', 'Electric Dipole & Dipole Interactions in External Fields'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Electrostatic field lines, potential gradient E = -∇V, axial and equatorial dipole fields, and work done rotating a dipole.'
    },
    exercises: [
      {
        id: 'c18-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 35,
        timeMinutes: 75,
        marks: 140,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Full chapter test spanning Coulomb equilibrium, electric field integration of charged arcs/rings, and dipole torque dynamics.'
      }
    ],
    colorTheme: {
      accent: 'text-yellow-500',
      bgLight: 'bg-yellow-500/10',
      bgDark: 'dark:bg-yellow-500/10',
      borderLight: 'border-yellow-200',
      borderDark: 'dark:border-yellow-800',
      glow: 'rgba(234, 179, 8, 0.25)'
    }
  },

  // C19 - Electrostatics-2: Theory, Exercise (Combined)
  {
    id: 'c19',
    code: 'C19',
    chapterNumber: 19,
    name: 'Electrostatics-2 (Gauss Law & Conductors)',
    fullName: 'C19 - Electrostatics-2',
    category: 'Electromagnetism',
    iconName: 'Shield',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Electric Flux & Gauss\'s Law Formulation', 'Field Calculation for Spherical, Cylindrical & Planar Symmetries', 'Properties of Conductors & Induced Charges', 'Electrostatic Pressure & Earthing of Concentric Spheres'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Symmetry analysis for Gaussian surfaces, cavity field shielding theorems, charge distribution on connected concentric metallic shells.'
    },
    exercises: [
      {
        id: 'c19-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 35,
        timeMinutes: 75,
        marks: 140,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Rigorous problems on solid and hollow spherical charge shells, non-conducting sphere fields, and multiple earthing switch states.'
      }
    ],
    colorTheme: {
      accent: 'text-lime-500',
      bgLight: 'bg-lime-500/10',
      bgDark: 'dark:bg-lime-500/10',
      borderLight: 'border-lime-200',
      borderDark: 'dark:border-lime-800',
      glow: 'rgba(132, 204, 22, 0.25)'
    }
  },

  // C20 - Capacitance: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c20',
    code: 'C20',
    chapterNumber: 20,
    name: 'Capacitance',
    fullName: 'C20 - Capacitance',
    category: 'Electromagnetism',
    iconName: 'BatteryCharging',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Capacitance Definition & Isolated Sphere Capacitance', 'Parallel Plate Capacitor & Energy Stored (U = 1/2 CV²)', 'Series & Parallel Combinations, Infinite Ladders', 'Dielectric Slabs & Induced Bound Charges', 'RC Circuits (Charging & Discharging Transient Equations)'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Electric field energy density, force between capacitor plates, dielectric insertion under constant voltage vs constant charge, and RC time constants.'
    },
    exercises: [
      {
        id: 'c20-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Parallel plate capacitance formula, series-parallel reduction, and equivalent capacitance.'
      },
      {
        id: 'c20-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Energy stored, heat dissipated during charge sharing, and battery work done.'
      },
      {
        id: 'c20-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Dielectric slabs with partial filling, variable dielectric constants, and attractive dielectric forces.'
      },
      {
        id: 'c20-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Transient RC circuits: charging and discharging currents, exponential growth curves, and switch closings.'
      },
      {
        id: 'c20-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Multi-loop RC networks with inductors/diodes and cylindrical/spherical capacitor integration.'
      }
    ],
    colorTheme: {
      accent: 'text-emerald-500',
      bgLight: 'bg-emerald-500/10',
      bgDark: 'dark:bg-emerald-500/10',
      borderLight: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800',
      glow: 'rgba(16, 185, 129, 0.25)'
    }
  },

  // C21 - Current Electricity: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c21',
    code: 'C21',
    chapterNumber: 21,
    name: 'Current Electricity',
    fullName: 'C21 - Current Electricity',
    category: 'Electromagnetism',
    iconName: 'Cpu',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Drift Velocity, Mobility & Microscopic Ohm\'s Law', 'Temperature Coefficient of Resistance & Color Coding', 'Kirchhoff\'s Laws (KCL, KVL) & Nodal Analysis', 'Grouping of Cells (EMF, Internal Resistance) & Maximum Power Transfer', 'Electrical Instruments: Meter Bridge & Potentiometer Principle'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Full circuit theory reference: nodal & mesh voltage solving, cube and infinite resistor grids, Wheatstone bridge sensitivity, and potentiometer null points.'
    },
    exercises: [
      {
        id: 'c21-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Drift velocity equations, current density, resistivity, and temperature variation of resistance.'
      },
      {
        id: 'c21-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Kirchhoff\'s laws in multi-loop networks, nodal analysis, and delta-star conversions.'
      },
      {
        id: 'c21-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Cell grouping in series and parallel, internal resistance, and maximum power transfer theorem.'
      },
      {
        id: 'c21-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Galvanometer to ammeter/voltmeter conversion and Meter Bridge end error corrections.'
      },
      {
        id: 'c21-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Potentiometer sensitivity, internal resistance measurement, and symmetric 3D resistor lattices.'
      }
    ],
    colorTheme: {
      accent: 'text-cyan-500',
      bgLight: 'bg-cyan-500/10',
      bgDark: 'dark:bg-cyan-500/10',
      borderLight: 'border-cyan-200',
      borderDark: 'dark:border-cyan-800',
      glow: 'rgba(6, 182, 212, 0.25)'
    }
  },

  // C22 - Magnetism: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c22',
    code: 'C22',
    chapterNumber: 22,
    name: 'Magnetism (Magnetic Effect of Current)',
    fullName: 'C22 - Magnetism',
    category: 'Electromagnetism',
    iconName: 'Magnet',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Biot-Savart Law for Straight Wire, Circular Arc & Solenoid', 'Ampere\'s Circuital Law & Toroid Magnetic Fields', 'Lorentz Magnetic Force on Moving Charge & Helical Motion', 'Magnetic Force on Current-Carrying Wires & Magnetic Torque (M × B)', 'Matter Magnetism: Diamagnetic, Paramagnetic & Ferromagnetic Materials, Hysteresis Loop'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Magnetic field vectors, cyclotron frequency, magnetic dipole moment, galvanometer coil torque, and Curie temperature behavior.'
    },
    exercises: [
      {
        id: 'c22-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Biot-Savart law calculations for straight wires, circular rings on axis, and planar wire loops.'
      },
      {
        id: 'c22-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Ampere\'s circuital law applications for thick cylindrical conductors and coaxial cables.'
      },
      {
        id: 'c22-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Lorentz force q(v × B), circular and helical trajectories in uniform and combined fields.'
      },
      {
        id: 'c22-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Magnetic force between parallel conductors, magnetic dipole moments, and torque on current loops.'
      },
      {
        id: 'c22-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Magnetic materials, susceptibility relations, Earth magnetism elements (declination/dip), and hysteresis.'
      }
    ],
    colorTheme: {
      accent: 'text-red-500',
      bgLight: 'bg-red-500/10',
      bgDark: 'dark:bg-red-500/10',
      borderLight: 'border-red-200',
      borderDark: 'dark:border-red-800',
      glow: 'rgba(239, 68, 68, 0.25)'
    }
  },

  // C23 - E.M.I: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c23',
    code: 'C23',
    chapterNumber: 23,
    name: 'E.M.I (Electromagnetic Induction)',
    fullName: 'C23 - E.M.I',
    category: 'Electromagnetism',
    iconName: 'Shuffle',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Magnetic Flux & Faraday\'s Laws of Induction', 'Lenz\'s Law & Energy Conservation', 'Motional EMF (Translational & Rotational Rods in B Field)', 'Self-Inductance & Mutual Inductance Theorems', 'LR Circuits & Induced Electric Field (Non-Conservative Fields)'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Flux derivative e = -dΦ/dt, non-conservative circular induced electric fields, LR growth/decay curves, and mutual inductance coupling coefficient.'
    },
    exercises: [
      {
        id: 'c23-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Magnetic flux variation with time, induced EMF calculation, and Lenz\'s law directions.'
      },
      {
        id: 'c23-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Motional EMF across moving conductor rods, rails in magnetic fields, and terminal velocity equilibrium.'
      },
      {
        id: 'c23-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Rotational EMF in rotating metallic discs/rods, Faraday generator discs, and induced charge transfers.'
      },
      {
        id: 'c23-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Self-inductance of solenoids, energy stored in B field, and LR transient growth/decay circuits.'
      },
      {
        id: 'c23-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Induced non-conservative electric fields, line integrals of E · dl, and mutual inductance networks.'
      }
    ],
    colorTheme: {
      accent: 'text-indigo-500',
      bgLight: 'bg-indigo-500/10',
      bgDark: 'dark:bg-indigo-500/10',
      borderLight: 'border-indigo-200',
      borderDark: 'dark:border-indigo-800',
      glow: 'rgba(99, 102, 241, 0.25)'
    }
  },

  // C24 - Alternating Current: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4
  {
    id: 'c24',
    code: 'C24',
    chapterNumber: 24,
    name: 'Alternating Current',
    fullName: 'C24 - Alternating Current',
    category: 'Electromagnetism',
    iconName: 'Activity',
    badgeText: 'Theory + 4 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Peak, RMS & Average Values of AC Voltage & Current', 'Phasor Diagrams for R, L, C Individual Elements', 'Series LCR Circuit & Impedance Triangle (Z = √(R² + (XL-XC)²))', 'Resonance in Series LCR & Quality Factor (Q)', 'Power in AC Circuits (Wattless Current & Power Factor), Transformers'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'AC phasor algebra, resonance bandwidth calculations, LC oscillations energy exchange, and transformer step-up/down core losses.'
    },
    exercises: [
      {
        id: 'c24-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'RMS and average calculations for sinusoidal, square, and triangular waveforms.'
      },
      {
        id: 'c24-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Purely resistive, inductive, and capacitive AC circuits with phase relationships.'
      },
      {
        id: 'c24-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Series LCR impedance, phase angle, resonant frequency, and sharpness of resonance.'
      },
      {
        id: 'c24-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Power factor correction, wattless current components, LC oscillations, and non-ideal transformers.'
      }
    ],
    colorTheme: {
      accent: 'text-violet-500',
      bgLight: 'bg-violet-500/10',
      bgDark: 'dark:bg-violet-500/10',
      borderLight: 'border-violet-200',
      borderDark: 'dark:border-violet-800',
      glow: 'rgba(139, 92, 246, 0.25)'
    }
  },

  // C25 - Geometrical Optics: Theory, Exercise (Combined)
  {
    id: 'c25',
    code: 'C25',
    chapterNumber: 25,
    name: 'Geometrical Optics',
    fullName: 'C25 - Geometrical Optics',
    category: 'Optics',
    iconName: 'Sun',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Reflection at Plane & Spherical Mirrors, Mirror Formula', 'Snell\'s Law of Refraction & Total Internal Reflection (TIR, Optical Fibers)', 'Refraction at Spherical Surfaces & Lens Maker\'s Formula', 'Combination of Thin Lenses & Silvering of Lenses', 'Prism Refraction & Dispersion, Optical Instruments (Microscope, Telescope)'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Complete ray optics treatise: sign conventions, apparent depth & shift, critical angle, chromatic aberration, and magnifying powers.'
    },
    exercises: [
      {
        id: 'c25-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 40,
        timeMinutes: 90,
        marks: 160,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Comprehensive test covering silvered lenses, minimum deviation angle in prisms, glass slab apparent shifts, and astronomical telescope adjustments.'
      }
    ],
    colorTheme: {
      accent: 'text-amber-400',
      bgLight: 'bg-amber-400/10',
      bgDark: 'dark:bg-amber-400/10',
      borderLight: 'border-amber-200',
      borderDark: 'dark:border-amber-800',
      glow: 'rgba(251, 191, 36, 0.25)'
    }
  },

  // C26 - Wave Optics: Theory, Exercise (Combined)
  {
    id: 'c26',
    code: 'C26',
    chapterNumber: 26,
    name: 'Wave Optics',
    fullName: 'C26 - Wave Optics',
    category: 'Optics',
    iconName: 'Waves',
    badgeText: 'Theory + Combined Exercise',
    theory: {
      title: 'Theory',
      topics: ['Huygens\' Wave Theory & Wavefronts (Plane, Spherical, Cylindrical)', 'Young\'s Double Slit Experiment (YDSE) & Fringe Width', 'Fringe Shift with Thin Dielectric Mylar Film', 'Single Slit Fraunhofer Diffraction (Central Maxima Width)', 'Polarization: Brewster\'s Law & Malus\'s Law'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Optical path difference Δx = d sin θ, coherent source interference, central maxima angular spread, and polaroid intensity attenuation.'
    },
    exercises: [
      {
        id: 'c26-ex-comb',
        title: 'Exercise (Combined)',
        type: 'combined',
        questionCount: 35,
        timeMinutes: 75,
        marks: 140,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Comprehensive test on YDSE with polychromatic light, thin glass plate shifts, single-slit diffraction minima, and Brewster angle reflections.'
      }
    ],
    colorTheme: {
      accent: 'text-teal-400',
      bgLight: 'bg-teal-400/10',
      bgDark: 'dark:bg-teal-400/10',
      borderLight: 'border-teal-200',
      borderDark: 'dark:border-teal-800',
      glow: 'rgba(45, 212, 191, 0.25)'
    }
  },

  // C27 - Modern Physics-I: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c27',
    code: 'C27',
    chapterNumber: 27,
    name: 'Modern Physics-I (Photoelectric & Atomic)',
    fullName: 'C27 - Modern Physics-I',
    category: 'Modern Physics',
    iconName: 'Atom',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Photoelectric Effect & Einstein\'s Equation (hν = Φ + KE_max)', 'Stopping Potential & Cut-Off Frequency Curves', 'Photons, Radiation Pressure & Momentum Transfer', 'Bohr Model of Hydrogen-Like Atoms (Radius, Velocity, Energy Levels)', 'Hydrogen Emission Spectrum (Lyman, Balmer, Paschen, Brackett, Pfund) & de-Broglie Wavelength'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Quantized energy packets, work function thresholds, Bohr quantization condition mvr = nh/2π, Rydberg formula, and matter wave duality.'
    },
    exercises: [
      {
        id: 'c27-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Photoelectric effect equations, stopping potential graphs, and threshold wavelength calculations.'
      },
      {
        id: 'c27-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Photon flux, radiation pressure on totally reflecting and absorbing surfaces.'
      },
      {
        id: 'c27-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Bohr orbit parameters: orbital radii, velocities, kinetic, potential and total energies in H-like ions.'
      },
      {
        id: 'c27-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Spectral line transitions, Lyman/Balmer series series limits, and recoil speed of emitting atoms.'
      },
      {
        id: 'c27-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'de-Broglie wavelength of accelerated charges, Davisson-Germer diffraction, and X-ray emission spectra (Moseley\'s Law).'
      }
    ],
    colorTheme: {
      accent: 'text-emerald-400',
      bgLight: 'bg-emerald-400/10',
      bgDark: 'dark:bg-emerald-400/10',
      borderLight: 'border-emerald-200',
      borderDark: 'dark:border-emerald-800',
      glow: 'rgba(52, 211, 153, 0.25)'
    }
  },

  // C28 - Modern Physics-II: Theory, Exercise 1, Exercise 2, Exercise 3, Exercise 4, Exercise 5
  {
    id: 'c28',
    code: 'C28',
    chapterNumber: 28,
    name: 'Modern Physics-II (Nuclear Physics & Radioactivity)',
    fullName: 'C28 - Modern Physics-II',
    category: 'Modern Physics',
    iconName: 'Radiation',
    badgeText: 'Theory + 5 Exercises',
    theory: {
      title: 'Theory',
      topics: ['Nuclear Composition, Radius (R = R₀ A^(1/3)) & Nuclear Density', 'Mass Defect, Binding Energy & Binding Energy per Nucleon Curve', 'Nuclear Fission & Fusion Energy Calculations', 'Law of Radioactive Decay (N = N₀ e^(-λt)), Half-Life & Mean Life', 'Alpha, Beta & Gamma Decay Modes, Q-Value of Nuclear Reactions'],
      status: 'upload_pending',
      statusLabel: 'Theory Notes — Upload Pending',
      summary: 'Nuclear stability criteria, radioactive decay kinetics, parallel decay routes, activity (Becquerel & Curie), and energy conservation in alpha-particle recoil.'
    },
    exercises: [
      {
        id: 'c28-ex1',
        title: 'Exercise 1',
        type: 'numbered',
        number: 1,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Mains',
        markingScheme: '+4 / -1',
        description: 'Nuclear size, density invariance, mass-energy equivalence E = mc², and mass defect calculations.'
      },
      {
        id: 'c28-ex2',
        title: 'Exercise 2',
        type: 'numbered',
        number: 2,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Binding energy per nucleon curve, stability peaks, and energy released in fission/fusion.'
      },
      {
        id: 'c28-ex3',
        title: 'Exercise 3',
        type: 'numbered',
        number: 3,
        questionCount: 20,
        timeMinutes: 45,
        marks: 80,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Radioactive decay law, half-life, average life, and sample activity calculations.'
      },
      {
        id: 'c28-ex4',
        title: 'Exercise 4',
        type: 'numbered',
        number: 4,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'Both',
        markingScheme: '+4 / -1',
        description: 'Successive radioactive decay chains, radioactive secular equilibrium, and carbon dating.'
      },
      {
        id: 'c28-ex5',
        title: 'Exercise 5',
        type: 'numbered',
        number: 5,
        questionCount: 25,
        timeMinutes: 60,
        marks: 100,
        status: 'ready_for_upload',
        statusLabel: 'Coming Soon / Ready for Upload',
        targetExam: 'JEE Advanced',
        markingScheme: 'JEE Advanced Pattern (+4 / -2)',
        description: 'Q-value of nuclear reactions, kinetic energy of alpha particles taking daughter recoil into account, and beta decay spectrum.'
      }
    ],
    colorTheme: {
      accent: 'text-amber-400',
      bgLight: 'bg-amber-400/10',
      bgDark: 'dark:bg-amber-400/10',
      borderLight: 'border-amber-200',
      borderDark: 'dark:border-amber-800',
      glow: 'rgba(251, 191, 36, 0.25)'
    }
  }
];

// Helper functions for easy lookup and filtering
export const getChapterById = (id: string): PhysicsChapter | undefined => {
  const normalizedId = id.toLowerCase().trim();
  return physicsChaptersData.find(c => c.id === normalizedId || c.code.toLowerCase() === normalizedId);
};

export const getTotalPhysicsExercisesCount = (): number => {
  return physicsChaptersData.reduce((total, ch) => total + ch.exercises.length, 0);
};
