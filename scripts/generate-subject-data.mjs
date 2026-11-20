import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// ==============================================================================
// 1. CHEMISTRY CHAPTERS DATA DEFINITION (29 CHAPTERS)
// ==============================================================================
const chemistryRaw = [
  {
    code: 'Ch 1',
    chapterNumber: 1,
    name: 'Acidity & Basicity',
    category: 'Organic Chemistry',
    iconName: 'Beaker',
    theory: {
      title: 'Theory Notes: Acidity, Basicity & Conjugate Stability',
      topics: ['Inductive & Resonance Effects on Acid Strength', 'pKa / pKb Trend Analysis', 'Ortho Effect in Benzoic Acids & Anilines', 'SIR (Steric Inhibition of Resonance) on Basicity'],
      summary: 'Acid-base equilibria in organic systems, conjugate base resonance delocalization, and solvent solvation factors.'
    },
    exercises: [
      { id: 'ch1-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Combined conceptual drill covering organic acids, basicity order of amines, and steric effects.' }
    ]
  },
  {
    code: 'Ch 2',
    chapterNumber: 2,
    name: 'Alcohol & Ether',
    category: 'Organic Chemistry',
    iconName: 'Wine',
    theory: {
      title: 'Theory Notes: Alcohols, Phenols & Ethers',
      topics: ['Hydroboration-Oxidation vs Oxymercuration', 'Lucas Reagent & Victor Meyer Test', 'Pinacol-Pinacolone Rearrangement', 'Williamson Ether Synthesis & Cleavage with HI'],
      summary: 'Synthesis, substitution, elimination, and rearrangement mechanisms of alcohols, phenols, and ether linkages.'
    },
    exercises: [
      { id: 'ch2-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Preparation methods, Grignard additions, and industrial alcohol synthesis.' },
      { id: 'ch2-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Chemical reactions of alcohols: dehydration, oxidation, and esterification.' },
      { id: 'ch2-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Phenol acidity, Reimer-Tiemann, and Kolbe-Schmitt carbalkoxylation.' },
      { id: 'ch2-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Ether synthesis, unsymmetrical ether cleavage with anhydrous HI.' },
      { id: 'ch2-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Epoxide ring opening kinetics under acidic and basic conditions.' },
      { id: 'ch2-ex6a', title: 'Exercise 6A', type: 'numbered', number: 6, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced multi-step synthesis and stereochemical transformations.' },
      { id: 'ch2-ex6b', title: 'Exercise 6B', type: 'numbered', number: 6, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Matrix matching and integer type challenge problems on Alcohols & Ethers.' }
    ]
  },
  {
    code: 'Ch 3',
    chapterNumber: 3,
    name: 'Alkyl Halide',
    category: 'Organic Chemistry',
    iconName: 'Atom',
    theory: {
      title: 'Theory Notes: Alkyl Halides (SN1, SN2, E1, E2)',
      topics: ['SN1 vs SN2 Kinetic Competition & Solvent Role', 'E1 vs E2 Saytzeff vs Hofmann Elimination', 'Neighboring Group Participation (NGP)', 'Ambident Nucleophiles & Inversion of Configuration'],
      summary: 'Nucleophilic aliphatic substitution and beta-elimination reaction coordinate diagrams and stereospecificity.'
    },
    exercises: [
      { id: 'ch3-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'SN1 and SN2 reaction rates, carbocation stability, and substrate reactivity.' },
      { id: 'ch3-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'E1 and E2 mechanisms, Saytzeff vs Hofmann product distribution.' },
      { id: 'ch3-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Stereochemistry of substitution: Walden inversion vs racemization.' },
      { id: 'ch3-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Reactions of polyhalogen compounds (Chloroform, CCl4, and Freons).' },
      { id: 'ch3-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Aryl halides and nucleophilic aromatic substitution (SNAr & benzyne).' },
      { id: 'ch3-ex6', title: 'Exercise 6', type: 'numbered', number: 6, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced comprehensive multi-concept problems on Alkyl Halides.' }
    ]
  },
  {
    code: 'Ch 4',
    chapterNumber: 4,
    name: 'Aromatic Compound',
    category: 'Organic Chemistry',
    iconName: 'Shield',
    theory: {
      title: 'Theory Notes: Electrophilic Aromatic Substitution (EAS)',
      topics: ['Huckel (4n+2) Rule & Anti-Aromatic Systems', 'Halogenation, Nitration, Sulphonation & Friedel-Crafts', 'Activating vs Deactivating Directing Groups', 'Ipso Substitution & Poly-substituted Benzenes'],
      summary: 'Thermodynamics of aromatic stability, sigma-complex arenium ion intermediates, and regioselectivity.'
    },
    exercises: [
      { id: 'ch4-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Aromaticity determination and Huckel rule applications.' },
      { id: 'ch4-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'EAS reactions: Nitration, Sulphonation, and Friedel-Crafts Alkylation/Acylation.' },
      { id: 'ch4-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Directing influences of substituents and poly-substitution roadmaps.' },
      { id: 'ch4-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced multi-step aromatic synthesis and rearrangement drills.' }
    ]
  },
  {
    code: 'Ch 5',
    chapterNumber: 5,
    name: 'Atomic Structure',
    category: 'Physical Chemistry',
    iconName: 'Orbit',
    theory: {
      title: 'Theory Notes: Quantum Mechanical Model of the Atom',
      topics: ['Bohr Model, Rydberg Formula & Spectral Series', 'De Broglie Wavelength & Heisenberg Uncertainty', 'Schrodinger Wave Equation & Radial Wavefunctions', 'Quantum Numbers, Pauli Exclusion, Hund & Aufbau'],
      summary: 'Transition from classical planetary atomic models to quantum probability distributions and orbital nodal surfaces.'
    },
    exercises: [
      { id: 'ch5-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Comprehensive mock test on Bohr orbits, spectral emissions, de Broglie duality, and radial probability curves.' }
    ]
  },
  {
    code: 'Ch 6',
    chapterNumber: 6,
    name: 'Biomolecules',
    category: 'Organic Chemistry',
    iconName: 'Dna',
    theory: {
      title: 'Theory Notes: Carbohydrates, Amino Acids & Nucleic Acids',
      topics: ['Monosaccharide Mutarotation & Haworth Projections', 'Reducing vs Non-reducing Sugars (Fehling & Tollens)', 'Amino Acid Zwitterions & Isoelectric Point (pI)', 'Peptide Bonds, Protein Structures & DNA/RNA Double Helix'],
      summary: 'Stereochemistry and biochemical reactions of carbohydrates, essential amino acids, proteins, and genetic nucleotide polymers.'
    },
    exercises: [
      { id: 'ch6-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Classification of carbohydrates, D/L configurations, and glycosidic linkages.' },
      { id: 'ch6-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Amino acids, ninhydrin test, isoelectric point, and peptide sequence determination.' },
      { id: 'ch6-ex3a', title: 'Exercise 3A', type: 'numbered', number: 3, questionCount: 25, timeMinutes: 60, targetExam: 'Both', description: 'Nucleic acid structure, nucleotide bases, hydrogen bonding, and denaturation.' },
      { id: 'ch6-ex3b', title: 'Exercise 3B', type: 'numbered', number: 3, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced multi-correct and matching questions on Biomolecules.' }
    ]
  },
  {
    code: 'Ch 7',
    chapterNumber: 7,
    name: 'Carbonyl Compounds',
    category: 'Organic Chemistry',
    iconName: 'Flame',
    theory: {
      title: 'Theory Notes: Aldehydes & Ketones',
      topics: ['Nucleophilic Carbonyl Addition Mechanisms', 'Aldol & Cross-Aldol Condensation Kinetics', 'Cannizzaro & Cross-Cannizzaro Disproportionation', 'Wittig Reaction, Benzoin, Perkin & Beckmann Rearrangement'],
      summary: 'Electrophilic reactivity of carbonyl carbon, alpha-hydrogen acidity, enolate stabilization, and named condensations.'
    },
    exercises: [
      { id: 'ch7-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Preparation of aldehydes and ketones, Rosenmund, Stephen, and Etard reactions.' },
      { id: 'ch7-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Nucleophilic additions: HCN, NaHSO3, Grignard, and hydrazine derivatives.' },
      { id: 'ch7-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Aldol, Cannizzaro, and haloform reaction mechanisms.' },
      { id: 'ch7-ex4a', title: 'Exercise 4A', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced named reactions: Reformatsky, Benzoin, and Michael Addition.' },
      { id: 'ch7-ex4b', title: 'Exercise 4B', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Complex organic roadmaps and multi-step synthesis involving carbonyls.' }
    ]
  },
  {
    code: 'Ch 8',
    chapterNumber: 8,
    name: 'Carboxylic Acid & Derivatives',
    category: 'Organic Chemistry',
    iconName: 'FlaskConical',
    theory: {
      title: 'Theory Notes: Carboxylic Acids, Derivatives & Amines',
      topics: ['Carboxylic Acid Synthesis & Decarboxylation (HVZ Reaction)', 'Nucleophilic Acyl Substitution (Acyl Chloride, Anhydride, Ester, Amide)', 'Amine Basicity, Gabriel Phthalimide & Hofmann Bromamide', 'Diazotization, Sandmeyer & Azo Coupling Dyes'],
      summary: 'Acyl group transfer mechanisms, resonance stabilization of carboxylate anions, and aromatic/aliphatic amine reactivity.'
    },
    exercises: [
      { id: 'ch8-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Preparation and acidic strength of carboxylic acids, HVZ halogenation.' },
      { id: 'ch8-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Reactions of acid chlorides, esters, anhydrides, and amides.' },
      { id: 'ch8-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Amines preparation: Gabriel Phthalimide, Hofmann Bromamide, and reduction.' },
      { id: 'ch8-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Diazonium salt reactions, dye synthesis, and advanced acyl substitutions.' }
    ]
  },
  {
    code: 'Ch 9',
    chapterNumber: 9,
    name: 'Chemical Bonding',
    category: 'Inorganic Chemistry',
    iconName: 'Link',
    theory: {
      title: 'Theory Notes: VSEPR, Hybridization & Molecular Orbital Theory',
      topics: ['VSEPR Molecular Geometry & Lone Pair Repulsion', 'Valence Bond Theory, Hybridization & Dipole Moments', 'Molecular Orbital Theory (MOT) for Diatomic Species', 'Hydrogen Bonding, Back Bonding & Banana Bonds'],
      summary: 'Fundamental principles of chemical bond formation, orbital overlap, bond order, magnetic properties, and secondary forces.'
    },
    exercises: [
      { id: 'ch9-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'VSEPR theory, shape and bond angles of polyatomic molecules.' },
      { id: 'ch9-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Hybridization schemes (sp, sp2, sp3, sp3d, sp3d2) and dipole moment vectors.' },
      { id: 'ch9-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Molecular Orbital Theory (MOT), bond order calculations, and paramagnetism.' },
      { id: 'ch9-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Back-bonding (dπ-pπ), bridge bonds in diborane, and intermolecular interactions.' }
    ]
  },
  {
    code: 'Ch 10',
    chapterNumber: 10,
    name: 'Chemical Equilibrium',
    category: 'Physical Chemistry',
    iconName: 'Scale',
    theory: {
      title: 'Theory Notes: Dynamic Equilibrium & Le Chatelier Principle',
      topics: ['Law of Mass Action, Kp & Kc Interconversion', 'Reaction Quotient (Q) & Spontaneity Direction', 'Le Chatelier Principle (Temperature, Pressure & Inert Gas Addition)', 'Van\'t Hoff Equation & Temperature Dependence of K'],
      summary: 'Dynamic equilibrium kinetics, equilibrium constant formulation, Gibbs free energy relationship, and stress response.'
    },
    exercises: [
      { id: 'ch10-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Calculation of Kp, Kc, and equilibrium concentrations.' },
      { id: 'ch10-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Degree of dissociation and vapor density calculations.' },
      { id: 'ch10-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Le Chatelier principle applications in gaseous and heterogeneous equilibria.' },
      { id: 'ch10-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Simultaneous equilibria and thermodynamic coupling problems.' }
    ]
  },
  {
    code: 'Ch 11',
    chapterNumber: 11,
    name: 'Chemical Kinetics',
    category: 'Physical Chemistry',
    iconName: 'Timer',
    theory: {
      title: 'Theory Notes: Reaction Rates, Orders & Arrhenius Equation',
      topics: ['Rate Law, Molecularity vs Order of Reaction', 'Integrated Rate Equations (Zero, First, Second & n-th Order)', 'Half-Life Expressions & Radioactive Decay Kinetics', 'Arrhenius Equation, Activation Energy & Collision Theory'],
      summary: 'Time course of chemical transformations, differential rate analysis, temperature dependence, and catalytic pathways.'
    },
    exercises: [
      { id: 'ch11-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Comprehensive test covering zero and first-order decay, half-life plots, activation energy, and mechanism derivation.' }
    ]
  },
  {
    code: 'Ch 12',
    chapterNumber: 12,
    name: 'Coordination Compounds',
    category: 'Inorganic Chemistry',
    iconName: 'Sparkles',
    theory: {
      title: 'Theory Notes: Werner Theory, CFT & Coordination Complexes',
      topics: ['Werner Coordination Theory & IUPAC Nomenclature', 'Isomerism: Geometrical, Optical, Ionization & Linkage', 'Crystal Field Theory (CFT), Octahedral & Tetrahedral Splitting (Δo & Δt)', 'Color, Magnetic Moments (Spin-only Formula) & Jahn-Teller Effect'],
      summary: 'Ligand field stabilization energy (LFSE), spectrochemical series, coordination numbers, and stereoisomerism.'
    },
    exercises: [
      { id: 'ch12-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'High-yield mock test covering ligand field splitting, isomer counting, magnetic moments, and organometallic synergetic bonding.' }
    ]
  },
  {
    code: 'Ch 13',
    chapterNumber: 13,
    name: 'Electrochemistry',
    category: 'Physical Chemistry',
    iconName: 'Zap',
    theory: {
      title: 'Theory Notes: Galvanic Cells, Nernst Equation & Conductance',
      topics: ['Electrochemical Series, Standard Electrode Potentials (E°)', 'Nernst Equation for Half-Cells & Complete Cells', 'Gibbs Energy & Equilibrium Constant (ΔG° = -nFE°)', 'Kohlrausch Law, Molar Conductance & Faraday Electrolysis Laws'],
      summary: 'Chemical to electrical energy conversion, non-standard cell potentials, electrolytic cell stoichiometry, and ionic mobility.'
    },
    exercises: [
      { id: 'ch13-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Standard electrode potentials, cell notation, and spontaneous direction.' },
      { id: 'ch13-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Nernst equation applications, concentration cells, and pH determination.' },
      { id: 'ch13-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Faraday laws of electrolysis, current efficiency, and electroplating.' },
      { id: 'ch13-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Conductance, molar conductivity at infinite dilution, and Kohlrausch law.' },
      { id: 'ch13-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Commercial batteries, fuel cells, corrosion kinetics, and multi-electrode cells.' }
    ]
  },
  {
    code: 'Ch 14',
    chapterNumber: 14,
    name: 'Gaseous State',
    category: 'Physical Chemistry',
    iconName: 'Wind',
    theory: {
      title: 'Theory Notes: Ideal Gas Laws & Real Gas Van der Waals Equation',
      topics: ['Boyle, Charles, Avogadro & Dalton Law of Partial Pressures', 'Maxwell-Boltzmann Speed Distribution (Vrms, Vavg, Vmp)', 'Van der Waals Equation, Virial Coefficients & Critical Constants', 'Compressibility Factor (Z) & Liquefaction of Gases'],
      summary: 'Kinetic molecular theory of gases, intermolecular attraction and finite molecular volume corrections.'
    },
    exercises: [
      { id: 'ch14-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Ideal gas equation, Dalton partial pressure, and Graham law of effusion.' },
      { id: 'ch14-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Molecular speeds: Vrms, Vavg, Vmp, and kinetic energy per mole.' },
      { id: 'ch14-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Real gas deviation: Van der Waals constants a and b physical significance.' },
      { id: 'ch14-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Compressibility factor Z plots and Boyle temperature calculations.' },
      { id: 'ch14-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Critical phenomena (Tc, Pc, Vc), inversion temperature, and virial equations.' }
    ]
  },
  {
    code: 'Ch 15',
    chapterNumber: 15,
    name: 'GOC (General Organic Chemistry)',
    category: 'Organic Chemistry',
    iconName: 'Cpu',
    theory: {
      title: 'Theory Notes: Electronic Effects & Reaction Intermediates',
      topics: ['Inductive Effect (+I / -I) & Field Effects', 'Resonance, Mesomeric Effect (+M / -M) & Hyperconjugation', 'Carbocation, Carbanion & Carbon Free Radical Stability', 'Electrophiles, Nucleophiles & Aromaticity Basics'],
      summary: 'Electronic displacement mechanisms forming the foundational substrate for all organic transformation kinetics.'
    },
    exercises: [
      { id: 'ch15-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Crucial foundational test on electron delocalization, canonical stability, carbocation rearrangements, and hyperconjugation.' }
    ]
  },
  {
    code: 'Ch 16',
    chapterNumber: 16,
    name: 'Grignard Reagent',
    category: 'Organic Chemistry',
    iconName: 'Boxes',
    theory: {
      title: 'Theory Notes: Organomagnesium Compounds (RMgX)',
      topics: ['Preparation & Solvent Stabilization of RMgX', 'Nucleophilic Addition to Carbonyls, Nitriles & Esters', 'Acid-Base Reactions with Active Hydrogen Compounds', 'Reaction with Epoxides, Carbon Dioxide & Acid Halides'],
      summary: 'Carbanionic character of carbon-magnesium polar bonds and synthetic versatility in carbon-carbon bond construction.'
    },
    exercises: [
      { id: 'ch16-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Preparation and basic additions to aldehydes, ketones, and esters.' },
      { id: 'ch16-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Stereochemical outcomes, organolithium comparisons, and synthetic roadmaps.' }
    ]
  },
  {
    code: 'Ch 17',
    chapterNumber: 17,
    name: 'Hydrocarbons',
    category: 'Organic Chemistry',
    iconName: 'Flame',
    theory: {
      title: 'Theory Notes: Alkanes, Alkenes & Alkynes',
      topics: ['Free Radical Halogenation & Wurtz Reaction', 'Electrophilic Addition to Alkenes (Markovnikov vs Anti-Markovnikov)', 'Ozonolysis, Hydroboration & Catalytic Hydrogenation', 'Alkyne Acidity, Kucherov Hydration & Birch Reduction'],
      summary: 'Structure, preparation, conformational analysis, and addition/substitution profiles of aliphatic hydrocarbon families.'
    },
    exercises: [
      { id: 'ch17-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Alkane free-radical substitution, reactivity-selectivity principle.' },
      { id: 'ch17-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Alkene additions: HX, H2O, halogens via cyclic halonium ions.' },
      { id: 'ch17-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Ozonolysis cleavage products and alkene oxidative degradation.' },
      { id: 'ch17-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Alkyne chemistry: additions, hydration to carbonyls, and stereoselective reduction.' },
      { id: 'ch17-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced multi-step hydrocarbon transformation roadmaps.' }
    ]
  },
  {
    code: 'Ch 18',
    chapterNumber: 18,
    name: 'Ionic Equilibrium',
    category: 'Physical Chemistry',
    iconName: 'Activity',
    theory: {
      title: 'Theory Notes: pH Calculations, Buffer Solutions & Solubility Product',
      topics: ['Ostwald Dilution Law & Auto-ionization of Water (Kw)', 'pH & pOH of Strong/Weak Acids & Bases', 'Salt Hydrolysis Formulations (All 4 Combinations)', 'Buffer Solutions, Henderson-Hasselbalch & Solubility Product (Ksp)'],
      summary: 'Aqueous electrolyte dissociation, buffer action, precipitation thresholds, and common ion suppression.'
    },
    exercises: [
      { id: 'ch18-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'pH of weak acids, polyprotic acid dissociation steps.' },
      { id: 'ch18-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Salt hydrolysis formulas and solution pH calculations.' },
      { id: 'ch18-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Buffer capacity, buffer action, and Henderson-Hasselbalch equation.' },
      { id: 'ch18-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Solubility product (Ksp), simultaneous solubility, and selective precipitation.' },
      { id: 'ch18-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Acid-base titration curves, indicators selection, and complex equilibria.' }
    ]
  },
  {
    code: 'Ch 19',
    chapterNumber: 19,
    name: 'Isomerism',
    category: 'Organic Chemistry',
    iconName: 'Layers',
    theory: {
      title: 'Theory Notes: Structural, Geometrical & Optical Isomerism',
      topics: ['Chain, Position, Functional, Metamerism & Tautomerism', 'Geometrical Isomerism (cis/trans, E/Z, syn/anti)', 'Optical Isomerism: Chirality, Enantiomers & Diastereomers', 'Fischer, Newman, Sawhorse Projections & R/S Nomenclature'],
      summary: 'Spatial orientation of atoms in molecules, symmetry planes, optical rotation, and conformational energetics.'
    },
    exercises: [
      { id: 'ch19-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Rigorous test covering isomer counting, stereoisomers of tartaric acid, meso compounds, and conformation energy diagrams.' }
    ]
  },
  {
    code: 'Ch 20',
    chapterNumber: 20,
    name: 'Liquid Solution',
    category: 'Physical Chemistry',
    iconName: 'Droplet',
    theory: {
      title: 'Theory Notes: Colligative Properties & Van\'t Hoff Factor',
      topics: ['Raoult Law for Ideal & Non-Ideal Solutions', 'Positive & Negative Deviations, Azeotropic Mixtures', '4 Colligative Properties (RLVP, Elevation in BP, Depression in FP, Osmotic Pressure)', 'Van\'t Hoff Factor (i), Association & Dissociation of Solutes'],
      summary: 'Thermodynamics of binary liquid mixtures, vapor pressure depression, colligative phenomena, and anomalous molar masses.'
    },
    exercises: [
      { id: 'ch20-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Raoult law calculations, vapor pressure of binary liquid systems.' },
      { id: 'ch20-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Relative lowering of vapor pressure and osmotic pressure measurements.' },
      { id: 'ch20-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Boiling point elevation (Kb) and freezing point depression (Kf).' },
      { id: 'ch20-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Van\'t Hoff factor (i) for weak electrolytes and dimerizing solutes.' },
      { id: 'ch20-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Non-ideal azeotropes, abnormal colligative properties, and phase diagrams.' }
    ]
  },
  {
    code: 'Ch 21',
    chapterNumber: 21,
    name: 'Metallurgy',
    category: 'Inorganic Chemistry',
    iconName: 'Anvil',
    theory: {
      title: 'Theory Notes: Principles of Metal Extraction',
      topics: ['Ores & Minerals Concentration Methods (Froth Flotation, Leaching)', 'Calcination, Roasting & Ellingham Diagrams (ΔG° vs T)', 'Extraction of Fe (Blast Furnace), Cu (Bessemer), Al (Hall-Heroult) & Ag/Au (MacArthur-Forrest)', 'Refining: Zone Refining, Mond & Van Arkel Vapor Phase Methods'],
      summary: 'Thermodynamic and electrochemical principles governing reduction of metal oxides, sulfides, and chlorides.'
    },
    exercises: [
      { id: 'ch21-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Concentration of ores, dressing, calcination, and roasting.' },
      { id: 'ch21-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Ellingham diagrams interpretation and reducing agent selection.' },
      { id: 'ch21-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Extraction flows for Iron, Copper, Zinc, and high-purity refining methods.' }
    ]
  },
  {
    code: 'Ch 22',
    chapterNumber: 22,
    name: 'Periodic Table',
    category: 'Inorganic Chemistry',
    iconName: 'Grid',
    theory: {
      title: 'Theory Notes: Periodic Properties & Atomic Trends',
      topics: ['Modern Periodic Law & Effective Nuclear Charge (Zeff)', 'Atomic & Ionic Radii Trends (Lanthanoid Contraction)', 'Ionization Enthalpy & Electron Gain Enthalpy Anomalies', 'Electronegativity Scales (Pauling, Mulliken) & Diagonal Relationships'],
      summary: 'Electronic basis of periodic periodicity, screening effect, relativistic effects, and group trends.'
    },
    exercises: [
      { id: 'ch22-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Atomic radii, isoelectronic species radii comparison.' },
      { id: 'ch22-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Ionization enthalpies and electron gain enthalpy anomalies (e.g. O vs S, F vs Cl).' },
      { id: 'ch22-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Slater rules, diagonal relationship, and inert pair effect manifestations.' }
    ]
  },
  {
    code: 'Ch 23',
    chapterNumber: 23,
    name: 'Redox Reactions',
    category: 'Physical Chemistry',
    iconName: 'RefreshCw',
    theory: {
      title: 'Theory Notes: Oxidation States, Balancing & Redox Titrations',
      topics: ['Rules for Assigning Oxidation Numbers', 'Balancing Redox Reactions: Ion-Electron & Oxidation State Methods', 'Disproportionation & Comproportionation Reactions', 'Redox Titrations (KMnO4 & K2Cr2O7 in Acidic/Basic Media)'],
      summary: 'Electron transfer stoichiometry, equivalent concept in oxidation-reduction, and primary volumetric standards.'
    },
    exercises: [
      { id: 'ch23-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Oxidation state determination in complex and inorganic species.' },
      { id: 'ch23-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Balancing redox reactions in acidic, basic, and neutral media.' },
      { id: 'ch23-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Equivalent weight of oxidizing and reducing agents (n-factor).' },
      { id: 'ch23-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Permanganate and dichromate redox titration stoichiometry.' },
      { id: 'ch23-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Iodometric and iodimetric titrations and complex multi-component redox mixtures.' }
    ]
  },
  {
    code: 'Ch 24',
    chapterNumber: 24,
    name: 'Salt Analysis',
    category: 'Inorganic Chemistry',
    iconName: 'TestTube',
    theory: {
      title: 'Theory Notes: Qualitative Inorganic Analysis (Cations & Anions)',
      topics: ['Preliminary Tests (Flame Test, Borax Bead & Charcoal Cavity)', 'Anion Groups: Dilute H2SO4, Conc H2SO4 & Special Group', 'Cation Group Separation (Group 0 to Group VI)', 'Confirmatory Reactions, Complex Ion Formation & Precipitate Colors'],
      summary: 'Systematic chemical identification schemes for acidic and basic radicals based on differential Ksp.'
    },
    exercises: [
      { id: 'ch24-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Dry tests, flame coloration, and borax bead test colors.' },
      { id: 'ch24-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Anion identification (CO3^2-, S^2-, NO2^-, NO3^-, halides).' },
      { id: 'ch24-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Cation group reagents and precipitation chemistry (Group I to III).' },
      { id: 'ch24-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced confirmatory tests: Turnbull blue, Prussian blue, brown ring, and Nessler reagent.' }
    ]
  },
  {
    code: 'Ch 25',
    chapterNumber: 25,
    name: 'Solid State',
    category: 'Physical Chemistry',
    iconName: 'Box',
    theory: {
      title: 'Theory Notes: Crystal Lattices, Unit Cells & Defects',
      topics: ['7 Crystal Systems & 14 Bravais Lattices', 'Simple Cubic, BCC, FCC & HCP Packing Efficiency', 'Interstitial Voids (Tetrahedral & Octahedral)', 'Radius Ratio Rule, Crystal Defects (Schottky & Frenkel)'],
      summary: 'Long-range order in crystalline solids, packing geometry, density calculations, and point defect equilibria.'
    },
    exercises: [
      { id: 'ch25-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Unit cell types, number of atoms per unit cell, and edge length.' },
      { id: 'ch25-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Packing fraction and density calculations of cubic crystals.' },
      { id: 'ch25-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Octahedral and tetrahedral voids, coordination numbers.' },
      { id: 'ch25-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Structures of ionic solids (NaCl, CsCl, ZnS, CaF2).' },
      { id: 'ch25-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Stoichiometric and non-stoichiometric defects, F-centers, and electrical properties.' }
    ]
  },
  {
    code: 'Ch 26',
    chapterNumber: 26,
    name: 'Stoichiometry-1',
    category: 'Physical Chemistry',
    iconName: 'Calculator',
    theory: {
      title: 'Theory Notes: Mole Concept & Empirical Formulas',
      topics: ['Mole Definition, Avogadro Number & Molar Mass', 'Percentage Composition & Empirical/Molecular Formulas', 'Limiting Reagent & Theoretical/Percentage Yield', 'Concentration Terms: Molarity, Molality, Mole Fraction & ppm'],
      summary: 'Quantitative chemical mass relationships, fundamental mole accounting, and solution concentration scales.'
    },
    exercises: [
      { id: 'ch26-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Core computational drill on limiting reactant problems, combustion analysis, and concentration unit conversions.' }
    ]
  },
  {
    code: 'Ch 27',
    chapterNumber: 27,
    name: 'Stoichiometry-2',
    category: 'Physical Chemistry',
    iconName: 'Layers',
    theory: {
      title: 'Theory Notes: Equivalent Concept & Advanced Volumetric Analysis',
      topics: ['Gram Equivalent Weight & Law of Chemical Equivalence', 'Normality vs Molarity & n-factor Formulations', 'Double Indicator Titrations (Phenolphthalein & Methyl Orange)', 'Kjeldahl Method for Nitrogen Estimation & Back Titrations'],
      summary: 'Equivalence law applications in neutralization, precipitation, and complexometric titrations without balancing.'
    },
    exercises: [
      { id: 'ch27-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Advanced titration mock paper covering Na2CO3/NaHCO3 mixture analysis, oleum labeling, and back titrations.' }
    ]
  },
  {
    code: 'Ch 28',
    chapterNumber: 28,
    name: 'Thermochemistry',
    category: 'Physical Chemistry',
    iconName: 'Flame',
    theory: {
      title: 'Theory Notes: Enthalpy Changes & Hess Law',
      topics: ['Standard Enthalpies of Formation, Combustion & Neutralization', 'Hess Law of Constant Heat Summation', 'Bond Dissociation Enthalpy & Reaction Enthalpy Calculation', 'Resonance Energy Estimation from Thermochemical Cycles'],
      summary: 'Heat exchange in chemical bond rearrangement, thermochemical state functions, and cycle formulations.'
    },
    exercises: [
      { id: 'ch28-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Standard enthalpy of formation (ΔfH°) and enthalpy of reaction.' },
      { id: 'ch28-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Hess law algebraic problem solving.' },
      { id: 'ch28-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Bond energy calculations and resonance energy evaluation.' },
      { id: 'ch28-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Enthalpy of neutralization of strong/weak acid-base pairs.' },
      { id: 'ch28-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Lattice enthalpy via Born-Haber cycle and temperature dependence (Kirchhoff equation).' }
    ]
  },
  {
    code: 'Ch 29',
    chapterNumber: 29,
    name: 'Thermodynamics',
    category: 'Physical Chemistry',
    iconName: 'Compass',
    theory: {
      title: 'Theory Notes: First, Second & Third Laws of Thermodynamics',
      topics: ['First Law of Thermodynamics (ΔU = q + w)', 'Reversible vs Irreversible Work (Isothermal & Adiabatic)', 'Entropy (S), Second Law & Spontaneity Criteria', 'Gibbs Free Energy (ΔG = ΔH - TΔS) & Thermodynamic Equilibrium'],
      summary: 'Macroscopic state variables, heat engine cycles, thermodynamic potentials, and criterion of spontaneous change.'
    },
    exercises: [
      { id: 'ch29-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Comprehensive exam on PV work integration, adiabatic expansion, entropy calculations, and Gibbs-Helmholtz equation.' }
    ]
  }
];

// ==============================================================================
// 2. MATHEMATICS CHAPTERS DATA DEFINITION (26 CHAPTERS)
// ==============================================================================
const mathsRaw = [
  {
    code: 'C01',
    chapterNumber: 1,
    name: 'Logarithm',
    category: 'Algebra',
    iconName: 'Hash',
    theory: {
      title: 'Theory Notes: Logarithmic Identities & Inequations',
      topics: ['Fundamental Logarithmic Identities & Base Change', 'Logarithmic Equations & Extraneous Roots', 'Logarithmic Inequations & Base Interval Analysis', 'Characteristic & Mantissa of Logarithms'],
      summary: 'Foundational algebra of logarithmic functions, monotonicity conditions for inequalities, and domain boundaries.'
    },
    exercises: [
      { id: 'c01-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Combined drill on logarithmic properties, inequalities with variable bases, and characteristic-mantissa.' }
    ]
  },
  {
    code: 'C02',
    chapterNumber: 2,
    name: 'Trigonometric Ratios & Identities (Ph-I)',
    category: 'Trigonometry',
    iconName: 'Triangle',
    theory: {
      title: 'Theory Notes: Compound Angles & Transformation Formulas',
      topics: ['Compound Angles (sin/cos/tan(A±B)) & Multiple Angles', 'Transformation of Sum/Difference into Products', 'Conditional Trigonometric Identities in Triangles', 'Maximum and Minimum Values of a cos θ + b sin θ'],
      summary: 'Algebraic manipulations of circular trigonometric functions, angle summation identities, and bounded ranges.'
    },
    exercises: [
      { id: 'c02-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Intensive practice on angle transformations, telescoping trigonometric series, and extreme values.' }
    ]
  },
  {
    code: 'C03',
    chapterNumber: 3,
    name: 'Quadratic Equation',
    category: 'Algebra',
    iconName: 'Variable',
    theory: {
      title: 'Theory Notes: Roots, Discriminant & Location of Roots',
      topics: ['Relation Between Roots & Coefficients (Vieta Formulas)', 'Nature of Roots & Sign of Quadratic Expressions', 'Location of Roots (6 Classical Boundary Conditions)', 'Common Roots of Two Quadratic Equations (Cramer Condition)'],
      summary: 'Parabolic geometry of quadratic polynomials, discriminants, root locations with respect to fixed real numbers, and transformations.'
    },
    exercises: [
      { id: 'c03-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Complete mock on Vieta formulas, location of roots constraints, symmetric functions of roots, and higher degree polynomials.' }
    ]
  },
  {
    code: 'C04',
    chapterNumber: 4,
    name: 'Sequence & Series',
    category: 'Algebra',
    iconName: 'TrendingUp',
    theory: {
      title: 'Theory Notes: AP, GP, HP & Special Series',
      topics: ['Arithmetic & Geometric Progressions (AP & GP)', 'Arithmetico-Geometric Progression (AGP)', 'AM-GM-HM Inequality & Applications', 'Sigma Notations, Method of Differences & Telescoping Series'],
      summary: 'Summation techniques for standard and non-standard numeric sequences, inequality bounds, and telescoping cancellation.'
    },
    exercises: [
      { id: 'c04-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'AP properties, general terms, and sum of n terms.' },
      { id: 'c04-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'GP properties, infinite geometric series, and product of terms.' },
      { id: 'c04-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'AGP summation and recursive sequence formulations.' },
      { id: 'c04-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'AM >= GM >= HM inequality applications for optimization.' },
      { id: 'c04-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Method of differences and advanced telescoping rational summations.' }
    ]
  },
  {
    code: 'C05',
    chapterNumber: 5,
    name: 'Binomial Theorem',
    category: 'Algebra',
    iconName: 'Percent',
    theory: {
      title: 'Theory Notes: Binomial Theorem for Any Index',
      topics: ['General & Middle Terms in Binomial Expansions', 'Properties of Binomial Coefficients & Summation Formulas', 'Multinomial Theorem & Coefficient Evaluation', 'Binomial Theorem for Negative/Fractional Indices & Divisibility'],
      summary: 'Combinatorial polynomial expansions, coefficient properties, calculus-based series evaluation, and remainder theorems.'
    },
    exercises: [
      { id: 'c05-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'General term, independent of x terms, and middle term calculation.' },
      { id: 'c05-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Series involving binomial coefficients (sum, alternate sum).' },
      { id: 'c05-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Differentiation and integration techniques for coefficient series.' },
      { id: 'c05-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Divisibility and remainder problems using binomial expansions.' },
      { id: 'c05-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Multinomial theorem, greatest term, and fractional exponent approximations.' }
    ]
  },
  {
    code: 'C06',
    chapterNumber: 6,
    name: 'Trigonometric Equation (Ph-II)',
    category: 'Trigonometry',
    iconName: 'PieChart',
    theory: {
      title: 'Theory Notes: General Solutions & Inequations',
      topics: ['General Solutions of sin θ = sin α, cos θ = cos α, tan θ = tan α', 'Solving a cos θ + b sin θ = c by Auxiliary Angle', 'Factorization & Quadratic Trigonometric Equations', 'Trigonometric Inequations on the Unit Circle'],
      summary: 'Periodic solution sets, boundary rejection based on domain restrictions, and bounded trigonometric systems.'
    },
    exercises: [
      { id: 'c06-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'General solutions of standard linear trigonometric equations.' },
      { id: 'c06-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Equations reducible to quadratic form in sin θ or cos θ.' },
      { id: 'c06-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Auxiliary angle method (a cos θ + b sin θ = c) and existence conditions.' },
      { id: 'c06-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Number of solutions in given intervals [0, 2π], [-π, π].' },
      { id: 'c06-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Systems of simultaneous trigonometric equations and inequalities.' }
    ]
  },
  {
    code: 'C07',
    chapterNumber: 7,
    name: 'Solution of Triangle (Ph-III)',
    category: 'Trigonometry',
    iconName: 'Shapes',
    theory: {
      title: 'Theory Notes: Sine, Cosine Rules & Triangle Circles',
      topics: ['Sine Rule, Cosine Rule & Projection Formulas', 'Half-Angle Formulas (Hero Formula & Tangent Rule)', 'Circumradius (R), Inradius (r) & Exradii (r1, r2, r3)', 'Pedal Triangle, Excentral Triangle & Orthocenter Relations'],
      summary: 'Geometric properties of triangle centers, circumcircle, incircle, excircles, and cyclic polygon trigonometry.'
    },
    exercises: [
      { id: 'c07-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Sine rule, cosine rule, and projection rule applications.' },
      { id: 'c07-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Area of triangles and half-angle formulas for sides and angles.' },
      { id: 'c07-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Inradius r and circumradius R relations (Euler formula).' },
      { id: 'c07-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Exradii r1, r2, r3 and distance between triangle centers.' },
      { id: 'c07-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Pedal triangle, orthic triangles, and cyclic quadrilateral geometry.' }
    ]
  },
  {
    code: 'C08',
    chapterNumber: 8,
    name: 'Straight Line',
    category: 'Coordinate Geometry',
    iconName: 'Slash',
    theory: {
      title: 'Theory Notes: 2D Coordinate Geometry of Lines',
      topics: ['Various Forms of Line Equations (Slope-Intercept, Normal, Symmetric)', 'Distance of a Point from a Line & Distance Between Parallel Lines', 'Family of Lines Passing Through Intersection (L1 + λL2 = 0)', 'Angle Bisectors, Foot of Perpendicular & Image of a Point'],
      summary: 'Linear locus in Cartesian plane, homogenous second-degree equations, pair of straight lines, and angular bisectors.'
    },
    exercises: [
      { id: 'c08-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Slope formulas, intercepts, and parametric equations of a line.' },
      { id: 'c08-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Perpendicular distance, area of triangles, and collinearity.' },
      { id: 'c08-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Family of straight lines and concurrency conditions.' },
      { id: 'c08-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Equations of angle bisectors: acute vs obtuse and containing origin.' },
      { id: 'c08-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Pair of straight lines passing through origin and homogenization.' }
    ]
  },
  {
    code: 'C09',
    chapterNumber: 9,
    name: 'Circle',
    category: 'Coordinate Geometry',
    iconName: 'Circle',
    theory: {
      title: 'Theory Notes: Circle Geometry & Tangent Systems',
      topics: ['Standard, Central & Diametric Forms of Circle Equations', 'Line and Circle Intersection (Condition of Tangency)', 'Pair of Tangents, Length of Tangent & Chord of Contact', 'Orthogonal Circles, Radical Axis & Coaxial System of Circles'],
      summary: 'Quadratic curves with equal coefficients and zero cross-term, pole and polar lines, and power of a point.'
    },
    exercises: [
      { id: 'c09-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Equation of circles from given center/radius and 3 non-collinear points.' },
      { id: 'c09-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Condition of tangency and equations of tangents in slope and point form.' },
      { id: 'c09-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Length of tangent, director circle, and chord of contact (T = 0).' },
      { id: 'c09-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Common tangents to two circles (direct and transverse).' },
      { id: 'c09-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Orthogonal intersection of circles, radical axis, and family of circles.' }
    ]
  },
  {
    code: 'C10',
    chapterNumber: 10,
    name: 'Determinant & Matrices',
    category: 'Algebra',
    iconName: 'Grid',
    theory: {
      title: 'Theory Notes: Matrix Algebra & Determinant Properties',
      topics: ['Properties of Determinants & Row/Column Operations', 'Cramer Rule for System of Linear Equations', 'Matrix Operations, Adjoint & Invertibility (A · adj(A) = |A|·I)', 'Cayley-Hamilton Theorem & Orthogonal/Symmetric Matrices'],
      summary: 'Linear transformations, rank, consistency of simultaneous linear systems, and characteristic polynomial analysis.'
    },
    exercises: [
      { id: 'c10-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Evaluation of determinants using properties and cyclic symmetry.' },
      { id: 'c10-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Cramer rule and consistency conditions (unique, infinite, no solution).' },
      { id: 'c10-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Matrix multiplication, trace, transpose, and symmetric/skew-symmetric.' },
      { id: 'c10-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Adjoint and inverse of matrices, determinant of adjoint identities.' },
      { id: 'c10-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Powers of matrices, Cayley-Hamilton theorem, and idempotent/orthogonal matrices.' }
    ]
  },
  {
    code: 'C13',
    chapterNumber: 13,
    name: 'Function',
    category: 'Calculus',
    iconName: 'FunctionSquare',
    theory: {
      title: 'Theory Notes: Domain, Range, Types & Composite Functions',
      topics: ['Domain & Range Determination of Algebraic & Transcendental Functions', 'Classification: One-One (Injective), Onto (Surjective) & Bijective', 'Composite Functions (fog & gof) & Invertible Functions', 'Even/Odd Functions, Periodic Functions & Functional Equations'],
      summary: 'Mapping rules, bijectivity as criteria for invertibility, Cauchy functional equations, and fundamental period calculation.'
    },
    exercises: [
      { id: 'c13-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Comprehensive calculus drill covering domain intersections, range optimization, composite function graphs, and functional equations.' }
    ]
  },
  {
    code: 'C14',
    chapterNumber: 14,
    name: 'ITF (Inverse Trigonometric Functions)',
    category: 'Trigonometry',
    iconName: 'RotateCcw',
    theory: {
      title: 'Theory Notes: Principal Value Branches & Identities',
      topics: ['Domains & Principal Value Ranges of 6 Inverse Trig Functions', 'Self-Inversion Properties (sin^-1(sin x) & sin(sin^-1 x))', 'Sum & Difference Formulas (tan^-1 x + tan^-1 y)', 'Telescoping Series of Inverse Tangents'],
      summary: 'Branch cuts for inverse circular functions, piecewise evaluation graphs, and summation of inverse tangent series.'
    },
    exercises: [
      { id: 'c14-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Essential mock test on principal branch evaluations, non-standard graph tracing, and telescoping series of arctan terms.' }
    ]
  },
  {
    code: 'C15',
    chapterNumber: 15,
    name: 'Limits',
    category: 'Calculus',
    iconName: 'MoveRight',
    theory: {
      title: 'Theory Notes: Indeterminate Forms & Asymptotic Behavior',
      topics: ['7 Indeterminate Forms (0/0, ∞/∞, 0·∞, ∞-∞, 0^0, ∞^0, 1^∞)', 'Standard Trigonometric & Exponential Limit Identities', 'L\'Hopital Rule & Taylor/Maclaurin Series Expansion', '1^Infinity Exponential Limits & Squeeze Play Theorem'],
      summary: 'Local behavior near singularities, asymptotic series truncations, dominant terms, and Sandwich theorem bounds.'
    },
    exercises: [
      { id: 'c15-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Thorough test on algebraic factoring, 1^infinity formulations, series expansions, and sandwich theorem limits.' }
    ]
  },
  {
    code: 'C16',
    chapterNumber: 16,
    name: 'Continuity & Differentiability',
    category: 'Calculus',
    iconName: 'Activity',
    theory: {
      title: 'Theory Notes: Continuity Criteria & Differentiability in R',
      topics: ['Definition of Continuity (LHL = RHL = f(a))', 'Types of Discontinuity (Removable, Jump, Essential)', 'Left Hand & Right Hand Derivatives (LHD & RHD)', 'Differentiability Implies Continuity (Converse Failure)'],
      summary: 'Topological smoothness, intermediate value theorem, corner points, cusps, and differentiability of composite functions.'
    },
    exercises: [
      { id: 'c16-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Full mock covering continuity at point and intervals, differentiability of piecewise defined functions, and intermediate value theorem.' }
    ]
  },
  {
    code: 'C17',
    chapterNumber: 17,
    name: 'MOD (Method of Differentiation)',
    category: 'Calculus',
    iconName: 'Percent',
    theory: {
      title: 'Theory Notes: Rules of Differentiation & Higher Derivatives',
      topics: ['Product, Quotient & Chain Rules', 'Logarithmic Differentiation for Variable Exponents', 'Parametric & Implicit Differentiation', 'Higher Order Derivatives & Successive Differentiation'],
      summary: 'Computational techniques for instantaneous rates of change, inverse function derivatives, and determinant differentiation.'
    },
    exercises: [
      { id: 'c17-combined', title: 'Exercise (Combined)', type: 'combined', questionCount: 30, timeMinutes: 60, targetExam: 'Both', description: 'Comprehensive drill on chain rule, logarithmic differentiation, derivatives of parametric functions, and second-order derivatives.' }
    ]
  },
  {
    code: 'C18',
    chapterNumber: 18,
    name: 'Applications of Derivative',
    category: 'Calculus',
    iconName: 'TrendingUp',
    hasSubTopics: true,
    subTopics: [
      {
        id: 'c18-sub1',
        name: 'Monotonicity',
        slug: 'monotonicity',
        theory: {
          title: 'Theory Notes: Monotonicity & Mean Value Theorems',
          topics: ['Sign of First Derivative & Strict Increasing/Decreasing', 'Rolle Theorem & Lagrange Mean Value Theorem (LMVT)', 'Cauchy Mean Value Theorem & Applications to Inequalities', 'Concavity, Convexity & Points of Inflection (f\'\'(x))'],
          summary: 'Global and interval monotonicity, proving non-trivial mathematical inequalities via first derivatives, and LMVT applications.'
        },
        exercises: [
          { id: 'c18-sub1-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Intervals of increase and decrease using first derivative.' },
          { id: 'c18-sub1-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Rolle theorem verification and roots of derivatives.' },
          { id: 'c18-sub1-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Lagrange Mean Value Theorem (LMVT) applications.' },
          { id: 'c18-sub1-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Proving functional inequalities using monotonicity.' },
          { id: 'c18-sub1-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Advanced concavity, inflection points, and curve behavior.' }
        ]
      },
      {
        id: 'c18-sub2',
        name: 'Maxima & Minima',
        slug: 'maxima-minima',
        theory: {
          title: 'Theory Notes: Extrema of Functions & Optimization',
          topics: ['Local Extrema: First & Second Derivative Tests', 'Higher Derivative Test for Extrema at Stationary Points', 'Global (Absolute) Extrema in Closed Bounded Intervals [a, b]', 'Geometric & Applied Optimization Word Problems'],
          summary: 'Critical points, Fermat theorem, second order Taylor sufficiency conditions, and constrained geometric optimization.'
        },
        exercises: [
          { id: 'c18-sub2-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Critical points and local maxima/minima using first derivative test.' },
          { id: 'c18-sub2-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Second derivative test and point of inflection identification.' },
          { id: 'c18-sub2-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Absolute (global) maxima and minima on closed intervals.' },
          { id: 'c18-sub2-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Geometric optimization problems (cylinders, cones, boxes).' },
          { id: 'c18-sub2-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Multi-variable reduction, parametric constraints, and advanced extrema.' }
        ]
      },
      {
        id: 'c18-sub3',
        name: 'Tangent & Normal',
        slug: 'tangent-normal',
        theory: {
          title: 'Theory Notes: Tangents, Normals & Rate of Change',
          topics: ['Slope of Tangent & Normal to Curves (dy/dx)', 'Equations of Tangent & Normal at Point (x1, y1)', 'Angle of Intersection of Two Curves & Orthogonal Trajectories', 'Lengths of Tangent, Subtangent, Normal & Subnormal'],
          summary: 'Differential geometry of plane curves, linear approximation, rate of change of geometric quantities, and orthogonal intersections.'
        },
        exercises: [
          { id: 'c18-sub3-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Slopes and equations of tangents and normals to Cartesian curves.' },
          { id: 'c18-sub3-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Rate of change of physical quantities (distance, volume, shadow).' },
          { id: 'c18-sub3-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Angle of intersection between curves and orthogonality conditions.' },
          { id: 'c18-sub3-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Length of subtangent and subnormal evaluations.' },
          { id: 'c18-sub3-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Common tangents between multiple curves and envelope curves.' }
        ]
      }
    ],
    theory: {
      title: 'Theory Notes: Applications of Derivative (Monotonicity, Extrema & Tangents)',
      topics: ['Monotonicity & Inequations Proving', 'Local & Global Maxima/Minima Optimization', 'Tangents, Normals & Orthogonal Curves', 'Rolle & LMVT Theorems'],
      summary: 'Three unified calculus pillars: curve slope analysis, rate measurement, and function optimization.'
    },
    exercises: [] // populated by subTopics
  },
  {
    code: 'C19',
    chapterNumber: 19,
    name: 'Indefinite Integration',
    category: 'Calculus',
    iconName: 'Maximize2',
    theory: {
      title: 'Theory Notes: Antiderivatives & Integration Techniques',
      topics: ['Standard Algebraic, Trig, Exponential & Hyperbolic Antiderivatives', 'Integration by Substitution (Method of Change of Variable)', 'Integration by Parts (ILATE Rule) & Special Forms e^x(f(x) + f\'(x))', 'Partial Fractions & Integration of Rational/Irrational Algebraic Forms'],
      summary: 'Reverse differential operator algorithms, algebraic transformations, trigonometric substitutions, and reduction formulas.'
    },
    exercises: [
      { id: 'c19-elem', title: 'Elementary Exercise', type: 'combined', questionCount: 20, timeMinutes: 40, targetExam: 'JEE Mains', description: 'Fundamental standard antiderivatives and basic algebraic substitutions.' },
      { id: 'c19-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Method of substitution and trigonometric identities integration.' },
      { id: 'c19-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Integration by parts (ILATE) and exponential forms e^x(f + f\').' },
      { id: 'c19-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Integration using partial fractions and rational functions.' },
      { id: 'c19-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Special integrals of the form dx / (a + b cos x) and quadratic square roots.' },
      { id: 'c19-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Euler substitutions, algebraic twin integrals, and reduction formulas.' }
    ]
  },
  {
    code: 'C20',
    chapterNumber: 20,
    name: 'Definite Integration',
    category: 'Calculus',
    iconName: 'Bookmark',
    theory: {
      title: 'Theory Notes: Definite Integrals as Area & Properties',
      topics: ['Fundamental Theorem of Calculus & Newton-Leibniz Formula', 'Standard Properties (P1 to P7, King Property, Queen Property)', 'Leibniz Rule for Differentiation Under the Integral Sign', 'Definite Integral as the Limit of a Riemann Sum'],
      summary: 'Riemann integral foundations, symmetry transformations, periodic integral reduction, and differentiation under integral sign.'
    },
    exercises: [
      { id: 'c20-elem', title: 'Elementary Exercise', type: 'combined', questionCount: 20, timeMinutes: 40, targetExam: 'JEE Mains', description: 'Evaluation of definite integrals using fundamental theorem of calculus.' },
      { id: 'c20-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Properties: change of variable and splitting intervals for piecewise functions.' },
      { id: 'c20-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'King property: integral from a to b f(x)dx = integral f(a+b-x)dx.' },
      { id: 'c20-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Even/odd function properties, Queen property for symmetric limits.' },
      { id: 'c20-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Leibniz differentiation rule under integral sign.' },
      { id: 'c20-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Limit of sum formulation, periodic functions, and estimation of integrals.' }
    ]
  },
  {
    code: 'C21',
    chapterNumber: 21,
    name: 'Vector',
    category: 'Vectors & 3D',
    iconName: 'Navigation',
    theory: {
      title: 'Theory Notes: Vector Algebra (Part 1, Part 2, Part 3)',
      topics: ['Part 1: Representation, Addition, Section Formula & Direction Cosines', 'Part 2: Dot Product (Scalar Product) & Projections', 'Part 3: Cross Product, Scalar Triple Product (STP) & Vector Triple Product (VTP)'],
      summary: '3-dimensional vector spaces, orthogonality, coplanarity criteria, and vector triple product expansions.'
    },
    exercises: [
      { id: 'c21-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Vector representation, collinearity, linear combination, and section formula.' },
      { id: 'c21-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Dot product, projection of vector on line, and perpendicular vectors.' },
      { id: 'c21-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Cross product, area of triangle and parallelogram.' },
      { id: 'c21-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Scalar Triple Product [a b c], volume of parallelepiped, and coplanarity.' },
      { id: 'c21-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Vector Triple Product a x (b x c), vector equations, and reciprocal system.' }
    ]
  },
  {
    code: 'C22',
    chapterNumber: 22,
    name: '3D Geometry',
    category: 'Vectors & 3D',
    iconName: 'Box',
    theory: {
      title: 'Theory Notes: Lines and Planes in 3D Space',
      topics: ['Direction Cosines & Direction Ratios of 3D Lines', 'Equation of a Line in Vector & Cartesian Forms', 'Shortest Distance Between Two Skew Lines', 'Equation of a Plane, Angle Between Planes & Line-Plane Intersection'],
      summary: 'Euclidean spatial geometry, skew lines distance minimization, plane normal vectors, and coplanar conditions.'
    },
    exercises: [
      { id: 'c22-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Direction cosines, direction ratios, and angle between two lines.' },
      { id: 'c22-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Equation of a line, intersection of two lines, and foot of perpendicular.' },
      { id: 'c22-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Shortest distance between skew lines and parallel lines.' },
      { id: 'c22-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Equation of plane, distance of point from plane, and family of planes.' },
      { id: 'c22-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Line of intersection of planes, image in a plane, and coplanarity.' }
    ]
  },
  {
    code: 'C23',
    chapterNumber: 23,
    name: 'Differential Equation',
    category: 'Calculus',
    iconName: 'Binary',
    theory: {
      title: 'Theory Notes: First Order Differential Equations',
      topics: ['Order & Degree of Differential Equations', 'Formation of Differential Equations by Eliminating Arbitrary Constants', 'Variable Separable Method & Reducible Forms', 'Homogeneous Equations & First Order Linear DE (Integrating Factor IF)'],
      summary: 'Mathematical modeling of dynamic rates, exact differentials, linear integrating factors, and Bernoulli equations.'
    },
    exercises: [
      { id: 'c23-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Order and degree determination, differential equation formation.' },
      { id: 'c23-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Variable separable form and equations reducible to variable separable.' },
      { id: 'c23-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Homogeneous differential equations (substitution y = vx).' },
      { id: 'c23-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Linear differential equations (dy/dx + Py = Q, Integrating Factor).' },
      { id: 'c23-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Bernoulli equations, exact differentials, and orthogonal trajectories.' }
    ]
  },
  {
    code: 'C24',
    chapterNumber: 24,
    name: 'Area Under The Curve',
    category: 'Calculus',
    iconName: 'Maximize2',
    theory: {
      title: 'Theory Notes: Bounded Planar Areas & Quadrature',
      topics: ['Area Bounded by Curve y = f(x), x-axis & Ordinates x = a, b', 'Area Between Two Intersecting Curves (f(x) - g(x))', 'Symmetric Integrations for Parabolic & Circular Regions', 'Curve Tracing for Inequations & Region Shading'],
      summary: 'Definite integral application for bounded planar regions, split intervals around intersection nodes, and inverse axis integration.'
    },
    exercises: [
      { id: 'c24-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Standard area bounded by single curve and coordinate axes.' },
      { id: 'c24-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Area between line and parabola, line and circle.' },
      { id: 'c24-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Area between two intersecting parabolas (standard 16ab/3 formula).' },
      { id: 'c24-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Area of piecewise defined functions and modulus regions.' },
      { id: 'c24-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Regions defined by simultaneous inequalities and inverse trigonometric curves.' }
    ]
  },
  {
    code: 'C25',
    chapterNumber: 25,
    name: 'Complex Number',
    category: 'Algebra',
    iconName: 'Compass',
    theory: {
      title: 'Theory Notes: Argand Plane, De Moivre & Cube Roots of Unity',
      topics: ['Algebraic Operations, Conjugate, Modulus & Argument', 'Polar & Euler Form (r e^(iθ))', 'De Moivre Theorem & n-th Roots of Unity (1, ω, ω^2)', 'Geometry in Argand Plane (Circle, Straight Line, Ellipse Equations)'],
      summary: '2D plane complex representations, rotational operators, unimodular vectors, and geometric loci in the complex plane.'
    },
    exercises: [
      { id: 'c25-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Modulus, argument, and conjugate properties.' },
      { id: 'c25-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Euler form and De Moivre theorem for powers of complex numbers.' },
      { id: 'c25-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Cube roots of unity (1, ω, ω^2) and polynomial factorizations.' },
      { id: 'c25-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Locus in Argand plane: circles |z - z0| = r, perpendicular bisectors.' },
      { id: 'c25-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Rotation theorem (coni method) and n-th roots of unity geometry.' }
    ]
  },
  {
    code: 'C26',
    chapterNumber: 26,
    name: 'Parabola',
    category: 'Coordinate Geometry',
    iconName: 'TrendingUp',
    theory: {
      title: 'Theory Notes: Conic Definition & Parabola Geometry',
      topics: ['Standard Equation y^2 = 4ax, Focus, Directrix & Latus Rectum', 'Parametric Coordinates (at^2, 2at) & Chord Equations', 'Equations of Tangents in Slope, Point & Parametric Forms', 'Normals to Parabola, Co-normal Points & Reflection Property'],
      summary: 'Locus with eccentricity e = 1, focal chord harmonic properties, point of intersection of tangents, and 3 co-normal points.'
    },
    exercises: [
      { id: 'c26-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Standard parabola equations, focus, directrix, and latus rectum.' },
      { id: 'c26-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Parametric coordinates (at^2, 2at) and focal chord properties (t1 t2 = -1).' },
      { id: 'c26-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Equations of tangents in slope and parametric forms.' },
      { id: 'c26-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Normals to parabola and condition for 3 co-normal points.' },
      { id: 'c26-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Director circle, optical reflection property, and common tangents.' }
    ]
  },
  {
    code: 'C27',
    chapterNumber: 27,
    name: 'Ellipse',
    category: 'Coordinate Geometry',
    iconName: 'Circle',
    theory: {
      title: 'Theory Notes: Central Conic x^2/a^2 + y^2/b^2 = 1',
      topics: ['Standard Equation, Eccentricity (e < 1), Foci & Directrices', 'Auxiliary Circle & Eccentric Angle (a cos θ, b sin θ)', 'Tangents, Normals & Director Circle (x^2 + y^2 = a^2 + b^2)', 'Focal Distances Sum SP + S\'P = 2a & Optical Property'],
      summary: 'Central conic with eccentricity less than 1, conjugate diameters, focal property, and slope condition of tangency.'
    },
    exercises: [
      { id: 'c27-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Standard ellipse equations, eccentricity, foci, and axes lengths.' },
      { id: 'c27-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Parametric form (a cos θ, b sin θ) and auxiliary circle.' },
      { id: 'c27-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Condition of tangency (c^2 = a^2 m^2 + b^2) and director circle.' },
      { id: 'c27-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Equations of normals and reflection property of ellipse.' },
      { id: 'c27-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Focal chord properties, common tangents, and locus problems.' }
    ]
  },
  {
    code: 'C28',
    chapterNumber: 28,
    name: 'Hyperbola',
    category: 'Coordinate Geometry',
    iconName: 'Shapes',
    theory: {
      title: 'Theory Notes: Central Conic x^2/a^2 - y^2/b^2 = 1',
      topics: ['Standard Equation, Eccentricity (e > 1), Foci & Directrices', 'Conjugate Hyperbola & Rectangular Hyperbola (xy = c^2)', 'Asymptotes of Hyperbola & Angle Between Asymptotes', 'Director Circle (x^2 + y^2 = a^2 - b^2) & Focal Property |SP - S\'P| = 2a'],
      summary: 'Open central conic with eccentricity greater than 1, asymptotic bounds, equilateral hyperbolas, and tangent properties.'
    },
    exercises: [
      { id: 'c28-ex1', title: 'Exercise 1', type: 'numbered', number: 1, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Standard hyperbola equations, eccentricity, and foci.' },
      { id: 'c28-ex2', title: 'Exercise 2', type: 'numbered', number: 2, questionCount: 20, timeMinutes: 45, targetExam: 'JEE Mains', description: 'Conjugate hyperbola relations (1/e1^2 + 1/e2^2 = 1).' },
      { id: 'c28-ex3', title: 'Exercise 3', type: 'numbered', number: 3, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Condition of tangency (c^2 = a^2 m^2 - b^2) and director circle.' },
      { id: 'c28-ex4', title: 'Exercise 4', type: 'numbered', number: 4, questionCount: 20, timeMinutes: 45, targetExam: 'Both', description: 'Asymptotes equations and their geometric properties.' },
      { id: 'c28-ex5', title: 'Exercise 5', type: 'numbered', number: 5, questionCount: 25, timeMinutes: 60, targetExam: 'JEE Advanced', description: 'Rectangular hyperbola xy = c^2 parametric form (ct, c/t) and normal chords.' }
    ]
  }
];

// Helper to format full data
function formatChemistry(raw) {
  return raw.map(ch => {
    const slug = ch.code.toLowerCase().replace(/\s+/g, '-');
    const badgeText = ch.exercises.length === 1 && ch.exercises[0].type === 'combined'
      ? 'Theory + Combined Exercise'
      : `Theory + ${ch.exercises.length} Exercises`;
    return {
      id: slug,
      code: ch.code,
      chapterNumber: ch.chapterNumber,
      name: ch.name,
      fullName: `${ch.code} - ${ch.name}`,
      category: ch.category,
      iconName: ch.iconName,
      badgeText,
      theory: {
        title: ch.theory.title,
        topics: ch.theory.topics,
        status: 'upload_pending',
        statusLabel: 'Theory Notes — Upload Pending',
        summary: ch.theory.summary
      },
      exercises: ch.exercises.map(ex => ({
        id: ex.id,
        title: ex.title,
        type: ex.type,
        number: ex.number,
        questionCount: ex.questionCount || 20,
        timeMinutes: ex.timeMinutes || 45,
        marks: (ex.questionCount || 20) * 4,
        status: 'ready_for_upload',
        statusLabel: 'Ready for Upload / Coming Soon',
        targetExam: ex.targetExam || 'Both',
        markingScheme: '+4 for Correct, -1 for Incorrect (Single Choice/Numerical)',
        description: ex.description || 'Timed chapterwise CBT test drill prepared for Word (.docx) upload parsing.'
      })),
      colorTheme: {
        accent: '#059669', // Emerald-600
        bgLight: '#ECFDF5', // Emerald-50
        bgDark: '#022C22',  // Emerald-950
        borderLight: '#A7F3D0', // Emerald-200
        borderDark: '#065F46',  // Emerald-800
        glow: 'rgba(5, 150, 105, 0.25)'
      }
    };
  });
}

function formatMaths(raw) {
  return raw.map(ch => {
    const slug = ch.code.toLowerCase();
    let badgeText = '';
    if (ch.hasSubTopics) {
      badgeText = `3 Sub-Topics • 15 Exercises`;
    } else if (ch.exercises.length === 1 && ch.exercises[0].type === 'combined') {
      badgeText = 'Theory + Combined Exercise';
    } else {
      badgeText = `Theory + ${ch.exercises.length} Exercises`;
    }

    const formattedExercises = ch.hasSubTopics ? [] : ch.exercises.map(ex => ({
      id: ex.id,
      title: ex.title,
      type: ex.type,
      number: ex.number,
      questionCount: ex.questionCount || 20,
      timeMinutes: ex.timeMinutes || 45,
      marks: (ex.questionCount || 20) * 4,
      status: 'ready_for_upload',
      statusLabel: 'Ready for Upload / Coming Soon',
      targetExam: ex.targetExam || 'Both',
      markingScheme: '+4 for Correct, -1 for Incorrect (Single Choice/Numerical)',
      description: ex.description || 'Timed chapterwise CBT test drill prepared for Word (.docx) upload parsing.'
    }));

    const formattedSubTopics = ch.hasSubTopics ? ch.subTopics.map(sub => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      theory: {
        title: sub.theory.title,
        topics: sub.theory.topics,
        status: 'upload_pending',
        statusLabel: 'Theory Notes — Upload Pending',
        summary: sub.theory.summary
      },
      exercises: sub.exercises.map(ex => ({
        id: ex.id,
        title: ex.title,
        type: ex.type,
        number: ex.number,
        questionCount: ex.questionCount || 20,
        timeMinutes: ex.timeMinutes || 45,
        marks: (ex.questionCount || 20) * 4,
        status: 'ready_for_upload',
        statusLabel: 'Ready for Upload / Coming Soon',
        targetExam: ex.targetExam || 'Both',
        markingScheme: '+4 for Correct, -1 for Incorrect (Single Choice/Numerical)',
        description: ex.description || 'Timed chapterwise CBT test drill prepared for Word (.docx) upload parsing.'
      }))
    })) : undefined;

    return {
      id: slug,
      code: ch.code,
      chapterNumber: ch.chapterNumber,
      name: ch.name,
      fullName: `${ch.code} - ${ch.name}`,
      category: ch.category,
      iconName: ch.iconName,
      badgeText,
      hasSubTopics: !!ch.hasSubTopics,
      subTopics: formattedSubTopics,
      theory: {
        title: ch.theory.title,
        topics: ch.theory.topics,
        status: 'upload_pending',
        statusLabel: 'Theory Notes — Upload Pending',
        summary: ch.theory.summary
      },
      exercises: formattedExercises,
      colorTheme: {
        accent: '#7C3AED', // Violet-600
        bgLight: '#F5F3FF', // Violet-50
        bgDark: '#2E1065',  // Violet-950
        borderLight: '#DDD6FE', // Violet-200
        borderDark: '#5B21B6',  // Violet-800
        glow: 'rgba(124, 58, 237, 0.25)'
      }
    };
  });
}

const chemistryData = formatChemistry(chemistryRaw);
const mathsData = formatMaths(mathsRaw);

console.log(`Prepared Chemistry: ${chemistryData.length} chapters.`);
console.log(`Prepared Mathematics: ${mathsData.length} chapters.`);

// Output TS files
const chemTsContent = `// ==============================================================================
// NelovMallickIITD · Chemistry Chapterwise Resources Configuration
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Exact 29 Chapters + Theory + Online Test-Ready Exercises Data Mapping
// ==============================================================================

import { ChapterExercise, ChapterTheory } from './physicsChapters';

export type ChemistryUnitCategory =
  | 'Organic Chemistry'
  | 'Inorganic Chemistry'
  | 'Physical Chemistry';

export interface ChemistryChapter {
  id: string;
  code: string;
  chapterNumber: number;
  name: string;
  fullName: string;
  category: ChemistryUnitCategory;
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

export const chemistryChaptersData: ChemistryChapter[] = ${JSON.stringify(chemistryData, null, 2)};
`;

const mathsTsContent = `// ==============================================================================
// NelovMallickIITD · Mathematics Chapterwise Resources Configuration
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// Exact 26 Chapters + Theory + Online Test-Ready Exercises Data Mapping
// ==============================================================================

import { ChapterExercise, ChapterTheory } from './physicsChapters';

export type MathsUnitCategory =
  | 'Algebra'
  | 'Trigonometry'
  | 'Calculus'
  | 'Coordinate Geometry'
  | 'Vectors & 3D';

export interface MathsSubTopic {
  id: string;
  name: string;
  slug: string;
  theory: ChapterTheory;
  exercises: ChapterExercise[];
}

export interface MathsChapter {
  id: string;
  code: string;
  chapterNumber: number;
  name: string;
  fullName: string;
  category: MathsUnitCategory;
  iconName: string;
  badgeText: string;
  hasSubTopics?: boolean;
  subTopics?: MathsSubTopic[];
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

export const mathsChaptersData: MathsChapter[] = ${JSON.stringify(mathsData, null, 2)};
`;

// Write TS
fs.writeFileSync(path.join(rootDir, 'src', 'data', 'chemistryChapters.ts'), chemTsContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'src', 'data', 'mathsChapters.ts'), mathsTsContent, 'utf8');

// Write JSON
fs.writeFileSync(path.join(rootDir, 'src', 'data', 'chemistryChapters.json'), JSON.stringify(chemistryData, null, 2), 'utf8');
fs.writeFileSync(path.join(rootDir, 'src', 'data', 'mathsChapters.json'), JSON.stringify(mathsData, null, 2), 'utf8');

// Write Browser globals for standalone Babel runtime in index.html
const chemJsContent = `// NelovMallickIITD · Chemistry Chapters Global Data
(function() {
  window.chemistryChaptersData = ${JSON.stringify(chemistryData)};
})();
`;

const mathsJsContent = `// NelovMallickIITD · Mathematics Chapters Global Data
(function() {
  window.mathsChaptersData = ${JSON.stringify(mathsData)};
})();
`;

fs.writeFileSync(path.join(rootDir, 'data', 'chemistryChapters.js'), chemJsContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'data', 'mathsChapters.js'), mathsJsContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'public', 'data', 'chemistryChapters.js'), chemJsContent, 'utf8');
fs.writeFileSync(path.join(rootDir, 'public', 'data', 'mathsChapters.js'), mathsJsContent, 'utf8');

console.log('✅ Generated all Chemistry & Mathematics data files successfully!');
