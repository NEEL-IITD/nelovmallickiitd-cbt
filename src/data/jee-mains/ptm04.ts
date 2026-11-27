import { TestPaper } from '../testTypes';

export const jeeMainsPtm04Data: TestPaper = {
  "id": "jee-mains-ptm-04",
  "aliasId": "ptm-04",
  "examCategory": "jee-mains",
  "examType": "JEE Mains",
  "code": "PTM 04",
  "title": "JEE Mains 2027 Test Series — PTM 04",
  "subtitle": "Current Electricity & Capacitors, Alcohols, Phenols, Ethers & Stereochemistry, Permutations, Combinations & Counting",
  "status": "live",
  "durationMinutes": 180,
  "maxMarks": 300,
  "totalQuestions": 75,
  "scheduledStartTime": "2026-12-02T09:00:00+05:30",
  "scheduledEndTime": "2026-12-02T21:00:00+05:30",
  "syllabus": {
    "physics": [
      "Electrostatics & Capacitors (Charge redistribution and energy loss on touching identical conducting spheres; work done in separating plates of an isolated capacitor; series and parallel combinations of dielectrics; variable triangular dielectric wedge integration; interleaved multi-plate and floating-conductor systems; asymmetrically charged parallel-plate capacitors in RC circuits)",
      "Current Electricity & DC Circuits (Electrical power scaling with voltage, temperature coefficient of resistance referenced to $0^\\circ\\text{C}$, wire stretching at constant density, non-uniform cylindrical current density integration $J(x)$, electron drift mobility, mixed grouping of cells for maximum current, Kirchhoff's junction & loop conservation laws, balanced and anti-symmetric Wheatstone bridges, resistor ladders & short-wire symmetric networks, meter bridge null-point shifts, potentiometer internal resistance, finite-resistance voltmeter loading, and initial $t=0^+$ vs. steady-state RC capacitor charges)"
    ],
    "chemistry": [
      "Alcohols, Phenols & Ethers (Cleavage of mixed aryl-alkyl and benzylic ethers with hot $\\text{HI}$; acid-catalyzed dehydration rates of $1^\\circ$, $2^\\circ$, and $3^\\circ$ benzylic alcohols; spiro ring expansion, carbocation hydride/methyl shifts, and Bredt's rule resistance at bicyclic bridgeheads; selective allylic oxidation with $\\text{MnO}_2$ vs. $\\text{PCC}$, chromic acid oxidation to $p$-benzoquinone; Lucas reagent test with cyclopropylmethyl, cyclopropenyl, and tropylium cations; epoxide ring opening and Lindlar reduction; relative acidity of substituted phenols, picric acid with $\\text{NaHCO}_3$, chemical distinction tests including neutral $\\text{FeCl}_3$, Liebermann's nitroso, $\\text{Na}$, $\\text{Br}_2/\\text{CS}_2$, $\\text{Zn}$ dust, $\\text{PCl}_5$, and $\\text{HBr}$; Reimer–Tiemann, Gattermann formylation, oxymercuration–demercuration cyclization, and intramolecular Friedel–Crafts alkylation)",
      "Haloalkanes & Stereochemistry (Stereochemical course of $\\text{SOCl}_2$ ($S_Ni$ retention vs. $S_N2$ inversion with pyridine), Finkelstein reaction, anti-periplanar $E2$ elimination selectivity, iodoform reaction, and stereoisomer counting)"
    ],
    "mathematics": [
      "Permutations & Combinations (Fundamental counting principle for alternative questions, digit pairs without borrowing, digit-product multisets; restricted arrangements of 'INEFFECTIVE' and 'MONDAY' dictionary rank; non-consecutive identical digits and odd digits at even places; circular seating avoiding adjacent same-nationality pairs; block-constrained multiset arrangements; committees, non-decreasing onto functions, grid rectangles excluding squares, diagonals of polygons, parallel-line segment crossings, and lattice-point integer-area triangles)",
      "Matrices & Number Theory Counting (Counting $3 \\times 3$ matrices with zero trace and $2 \\times 2$ matrices with prime entry sums; divisibility by $9$, Legendre's prime power in $33!$, inclusion–exclusion on positive divisors of $10^{10}, 15^7, 18^{11}$, GCD-constrained 4-digit integers, and parity of 7-digit sum counts)"
    ]
  },
  "sectionsSummary": [
    {
      "subject": "Physics",
      "sections": [
        {
          "name": "Section A: Single Correct (20 Qs)",
          "questionCount": 20,
          "marking": "+4, -1"
        },
        {
          "name": "Section B: Numerical Value (5 Qs)",
          "questionCount": 5,
          "marking": "+4, -1"
        }
      ]
    },
    {
      "subject": "Chemistry",
      "sections": [
        {
          "name": "Section A: Single Correct (20 Qs)",
          "questionCount": 20,
          "marking": "+4, -1"
        },
        {
          "name": "Section B: Numerical Value (5 Qs)",
          "questionCount": 5,
          "marking": "+4, -1"
        }
      ]
    },
    {
      "subject": "Mathematics",
      "sections": [
        {
          "name": "Section A: Single Correct (20 Qs)",
          "questionCount": 20,
          "marking": "+4, -1"
        },
        {
          "name": "Section B: Numerical Value (5 Qs)",
          "questionCount": 5,
          "marking": "+4, -1"
        }
      ]
    }
  ],
  "questions": [
    {
      "id": 1,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "An electric bulb, when connected across a power supply of $240\\text{ V}$, consumes a power of $160\\text{ W}$. If the power supply drops to $180\\text{ V}$, then the power consumed will be ____.",
      "options": [
        {
          "id": "A",
          "text": "$4\\text{ watt}$"
        },
        {
          "id": "B",
          "text": "$20\\text{ watt}$"
        },
        {
          "id": "C",
          "text": "$90\\text{ watt}$"
        },
        {
          "id": "D",
          "text": "$80\\text{ watt}$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "Assuming constant filament resistance $R = \\frac{V_1^2}{P_1}$:\n$$P_2 = \\frac{V_2^2}{R} = P_1 \\left(\\frac{V_2}{V_1}\\right)^2 = 160 \\times \\left(\\frac{180}{240}\\right)^2 = 160 \\times \\frac{9}{16} = 90\\text{ W}$$.",
      "explanation": "Since $P \\propto V^2$ for fixed resistance, $P_2 = 160 \\times (3/4)^2 = 90\\text{ W}$."
    },
    {
      "id": 2,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "When a known resistance $8\\,\\Omega$ and conductor at $25^\\circ\\text{C}$ are connected in the right and left gaps of a meter bridge respectively, the balancing length is $40\\text{ cm}$ from the left end. If the temperature of the conductor is increased to $100^\\circ\\text{C}$, the balancing length becomes $50\\text{ cm}$. The temperature coefficient of resistance of the conductor is:",
      "options": [
        {
          "id": "A",
          "text": "$0.008\\,/^{\\circ}\\text{C}$"
        },
        {
          "id": "B",
          "text": "$0.08\\,/^{\\circ}\\text{C}$"
        },
        {
          "id": "C",
          "text": "$0.005\\,/^{\\circ}\\text{C}$"
        },
        {
          "id": "D",
          "text": "$0.004\\,/^{\\circ}\\text{C}$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "At $25^\\circ\\text{C}$: $\\frac{R_{25}}{8} = \\frac{40}{100 - 40} = \\frac{2}{3} \\implies R_{25} = \\frac{16}{3}\\,\\Omega$.\nAt $100^\\circ\\text{C}$: $\\frac{R_{100}}{8} = \\frac{50}{100 - 50} = 1 \\implies R_{100} = 8\\,\\Omega$.\nUsing $R_t = R_0(1 + \\alpha t)$ referenced to $0^\\circ\\text{C}$:\n$$\\frac{R_{100}}{R_{25}} = \\frac{1 + 100\\alpha}{1 + 25\\alpha} = \\frac{8}{16/3} = \\frac{3}{2}$$\n$$2 + 200\\alpha = 3 + 75\\alpha \\implies 125\\alpha = 1 \\implies \\alpha = \\frac{1}{125} = 0.008\\,/^{\\circ}\\text{C}$$.",
      "explanation": "$\\frac{R_{100}}{R_{25}} = \\frac{1+100\\alpha}{1+25\\alpha} = \\frac{3}{2} \\implies \\alpha = 0.008\\,/^\\circ\\text{C}$."
    },
    {
      "id": 3,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "In the arrangement shown in the figure when the switch $S_2$ is open, the galvanometer shows no deflection for $\\ell = \\frac{L}{2}$. When the switch $S_2$ is closed, the galvanometer shows no deflection for $\\ell = \\frac{5}{12}L$. The internal resistance of $6\\text{ V}$ cell, and the emf $E$ of the other battery are respectively (internal resistance of cell of emf $E$ is negligible):",
      "images": [
        "/images/ptm04/q03.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$3\\,\\Omega,\\; 8\\text{ V}$"
        },
        {
          "id": "B",
          "text": "$2\\,\\Omega,\\; 12\\text{ V}$"
        },
        {
          "id": "C",
          "text": "$2\\,\\Omega,\\; 24\\text{ V}$"
        },
        {
          "id": "D",
          "text": "$3\\,\\Omega,\\; 12\\text{ V}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "1. With switch $S_2$ open, zero current flows through the $6\\text{ V}$ cell at null deflection, so the open-circuit emf balances:\n$$6 = E \\cdot \\frac{L/2}{L} = \\frac{E}{2} \\implies E = 12\\text{ V}$$\n2. With $S_2$ closed, current $I = \\frac{6}{10 + r}$ flows across the $10\\,\\Omega$ external resistor, giving terminal voltage:\n$$V = \\frac{10}{10 + r}(6) = E \\cdot \\frac{5L/12}{L} = 12 \\times \\frac{5}{12} = 5\\text{ V}$$\n$$\\frac{60}{10 + r} = 5 \\implies 10 + r = 12 \\implies r = 2\\,\\Omega$$.\nThus $r = 2\\,\\Omega$ and $E = 12\\text{ V}$.",
      "explanation": "Open $S_2$ balances $6 = E/2 \\implies E = 12\\text{ V}$; closed $S_2$ balances $60/(10+r) = 5 \\implies r = 2\\,\\Omega$."
    },
    {
      "id": 4,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A thick wire is stretched so that its length becomes two times. Assuming that there is no change in its density, then what is the ratio of change in resistance of wire to the initial resistance of wire?",
      "options": [
        {
          "id": "A",
          "text": "$2 : 1$"
        },
        {
          "id": "B",
          "text": "$4 : 1$"
        },
        {
          "id": "C",
          "text": "$3 : 1$"
        },
        {
          "id": "D",
          "text": "$1 : 4$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "At constant density and mass, volume $V = A L$ is constant. Since $L' = 2L$, $A' = A/2$.\n$$R' = \\rho \\frac{L'}{A'} = \\rho \\frac{2L}{A/2} = 4R$$\nThe ratio of change in resistance to initial resistance is:\n$$\\frac{\\Delta R}{R} = \\frac{R' - R}{R} = \\frac{4R - R}{R} = 3 : 1$$.",
      "explanation": "Stretching to $2L$ increases resistance to $4R$, so $\\Delta R / R = (4R - R)/R = 3 : 1$."
    },
    {
      "id": 5,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "In the given network, if galvanometer shows no deflection, then $R =$",
      "images": [
        "/images/ptm04/q05.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$100\\,\\Omega$"
        },
        {
          "id": "B",
          "text": "$50\\,\\Omega$"
        },
        {
          "id": "C",
          "text": "$40\\,\\Omega$"
        },
        {
          "id": "D",
          "text": "$25\\,\\Omega$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "For zero deflection in galvanometer $G$, the Wheatstone bridge must be balanced:\n$$\\frac{100}{200} = \\frac{R_{\\text{top-right}}}{40} \\implies R_{\\text{top-right}} = 20\\,\\Omega$$\nIn the top-right arm, $R$ and $100\\,\\Omega$ are connected in parallel:\n$$\\frac{100 R}{100 + R} = 20 \\implies 100R = 2000 + 20R \\implies 80R = 2000 \\implies R = 25\\,\\Omega$$.",
      "explanation": "Balanced bridge requires $(R \\parallel 100)/40 = 100/200 \\implies R \\parallel 100 = 20\\,\\Omega \\implies R = 25\\,\\Omega$."
    },
    {
      "id": 6,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A battery of $24$ cells, each of emf $1.5\\text{ V}$ and internal resistance $2\\,\\Omega$ is to be connected in order to send the maximum current through a $12\\,\\Omega$ resistor. The correct arrangement of cells will be:",
      "options": [
        {
          "id": "A",
          "text": "2 rows of 12 cells connected in parallel"
        },
        {
          "id": "B",
          "text": "3 rows of 8 cells connected in parallel"
        },
        {
          "id": "C",
          "text": "4 rows of 6 cells connected in parallel"
        },
        {
          "id": "D",
          "text": "All of these"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Let there be $m$ parallel rows of $n$ series cells each ($mn = 24$, $r = 2\\,\\Omega$, $R = 12\\,\\Omega$).\nFor maximum current in mixed grouping, equivalent internal resistance must equal external resistance:\n$$\\frac{nr}{m} = R \\implies \\frac{2n}{m} = 12 \\implies n = 6m$$\nSubstituting into $mn = 24$: $6m^2 = 24 \\implies m = 2$ rows, with $n = 12$ cells in series per row.",
      "explanation": "Maximum current occurs when $nr/m = R \\implies 2n/m = 12$ with $mn=24$, giving $m=2$ rows of $12$ cells."
    },
    {
      "id": 7,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "In the circuit shown in the figure, the current through",
      "images": [
        "/images/ptm04/q07.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "the $3\\,\\Omega$ resistor is $0.50\\text{ A}$"
        },
        {
          "id": "B",
          "text": "the $3\\,\\Omega$ resistor is $0.25\\text{ A}$"
        },
        {
          "id": "C",
          "text": "the $4\\,\\Omega$ resistor is $0.50\\text{ A}$"
        },
        {
          "id": "D",
          "text": "the $4\\,\\Omega$ resistor is $0.25\\text{ A}$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "1. Reduce from the right loop: $2 + 4 + 2 = 8\\,\\Omega$.\n2. Parallel with second $8\\,\\Omega$: $8 \\parallel 8 = 4\\,\\Omega$.\n3. Combine with middle $2\\,\\Omega$ + $2\\,\\Omega$: $2 + 4 + 2 = 8\\,\\Omega$.\n4. Parallel with first $8\\,\\Omega$: $8 \\parallel 8 = 4\\,\\Omega$.\n5. Total circuit resistance across $9\\text{ V}$ battery: $R_{\\text{eq}} = 3 + 4 + 2 = 9\\,\\Omega$.\nTotal current through the $3\\,\\Omega$ resistor is $I = \\frac{9\\text{ V}}{9\\,\\Omega} = 1\\text{ A}$.\nAt each equal $8\\,\\Omega \\parallel 8\\,\\Omega$ node, the current halves: $1\\text{ A} \\to 0.5\\text{ A} \\to 0.25\\text{ A}$ through the rightmost $4\\,\\Omega$ resistor.",
      "explanation": "Ladder reduction yields $R_{\\text{eq}}=9\\,\\Omega$, $I_{\\text{total}}=1\\text{ A}$, halving twice to $0.25\\text{ A}$ in the $4\\,\\Omega$ resistor."
    },
    {
      "id": 8,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Current density in a cylindrical wire of radius $R$ is given as\n$$J = \\begin{cases} J_0\\left(\\dfrac{x}{R} - 1\\right) & \\text{for } 0 \\le x < \\dfrac{R}{2} \\\\[8pt] J_0 \\dfrac{x}{R} & \\text{for } \\dfrac{R}{2} \\le x \\le R \\end{cases}$$\nThe current flowing in the wire is",
      "options": [
        {
          "id": "A",
          "text": "$\\dfrac{7}{24}\\pi J_0 R^2$"
        },
        {
          "id": "B",
          "text": "$\\dfrac{1}{6}\\pi J_0 R^2$"
        },
        {
          "id": "C",
          "text": "$\\dfrac{7}{12}\\pi J_0 R^2$"
        },
        {
          "id": "D",
          "text": "$\\dfrac{5}{12}\\pi J_0 R^2$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "Using concentric cylindrical shells of area $dA = 2\\pi x\\,dx$:\n$$I = \\int_0^{R} J(x)\\,2\\pi x\\,dx = 2\\pi J_0 \\left[ \\int_0^{R/2} \\left(\\frac{x^2}{R} - x\\right) dx + \\int_{R/2}^R \\frac{x^2}{R}\\,dx \\right]$$\n$$I_1 = 2\\pi J_0 \\left[ \\frac{(R/2)^3}{3R} - \\frac{(R/2)^2}{2} \\right] = 2\\pi J_0 R^2 \\left(\\frac{1}{24} - \\frac{1}{8}\\right) = -\\frac{1}{6}\\pi J_0 R^2$$\n$$I_2 = 2\\pi J_0 \\left[ \\frac{R^3 - (R/2)^3}{3R} \\right] = 2\\pi J_0 R^2 \\left(\\frac{7}{24}\\right) = \\frac{7}{12}\\pi J_0 R^2$$\n$$I = I_1 + I_2 = \\left(\\frac{7}{12} - \\frac{1}{6}\\right)\\pi J_0 R^2 = \\frac{5}{12}\\pi J_0 R^2$$.",
      "explanation": "$I = 2\\pi J_0 [ \\int_0^{R/2}(x^2/R - x)dx + \\int_{R/2}^R (x^2/R)dx ] = \\frac{5}{12}\\pi J_0 R^2$."
    },
    {
      "id": 9,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The current drawn from source in the given network is ____.",
      "images": [
        "/images/ptm04/q09.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\dfrac{1}{17}\\text{ A}$"
        },
        {
          "id": "B",
          "text": "$\\dfrac{10}{17}\\text{ A}$"
        },
        {
          "id": "C",
          "text": "$\\dfrac{6}{17}\\text{ A}$"
        },
        {
          "id": "D",
          "text": "$\\dfrac{5}{17}\\text{ A}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Let $V_A = 1\\text{ V}$ and $V_C = 0\\text{ V}$. By diagonal symmetry of the bridge ($R_{AB}=R_{DC}=10\\,\\Omega$, $R_{BC}=R_{AD}=5\\,\\Omega$, $R_{BD}=5\\,\\Omega$), $V_D = 1 - V_B$. Setting $V_B = x$:\nKCL at B: $\\frac{x - 1}{10} + \\frac{x}{5} + \\frac{x - (1 - x)}{5} = 0 \\implies 7x = 3 \\implies x = \\frac{3}{7}\\text{ V}$ and $V_D = \\frac{4}{7}\\text{ V}$.\nTotal current entering the bridge at A: $I_{\\text{bridge}} = \\frac{1 - 3/7}{10} + \\frac{1 - 4/7}{5} = \\frac{4}{70} + \\frac{3}{35} = \\frac{1}{7}\\text{ A} \\implies R_{AC} = 7\\,\\Omega$.\nWith the series $10\\,\\Omega$ resistor, $R_{\\text{total}} = 7 + 10 = 17\\,\\Omega \\implies I = \\frac{10}{17}\\text{ A}$.",
      "explanation": "Symmetric unbalanced bridge gives $R_{AC} = 7\\,\\Omega$, so with series $10\\,\\Omega$ total current is $10/17\\text{ A}$."
    },
    {
      "id": 10,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A capacitor with capacitance $5\\,\\mu\\text{F}$ is charged to $5\\,\\mu\\text{C}$. If the plates are pulled apart to reduce the capacitance to $2\\,\\mu\\text{F}$, how much work is done?",
      "options": [
        {
          "id": "A",
          "text": "$6.25 \\times 10^{-6}\\text{ J}$"
        },
        {
          "id": "B",
          "text": "$3.75 \\times 10^{-6}\\text{ J}$"
        },
        {
          "id": "C",
          "text": "$2.16 \\times 10^{-6}\\text{ J}$"
        },
        {
          "id": "D",
          "text": "$2.55 \\times 10^{-6}\\text{ J}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "For an isolated capacitor, charge $Q = 5\\,\\mu\\text{C}$ remains constant.\n$$W = U_f - U_i = \\frac{Q^2}{2}\\left(\\frac{1}{C_f} - \\frac{1}{C_i}\\right) = \\frac{(5 \\times 10^{-6})^2}{2}\\left(\\frac{1}{2 \\times 10^{-6}} - \\frac{1}{5 \\times 10^{-6}}\\right)$$\n$$W = 12.5 \\times 10^{-6} \\times 0.3 = 3.75 \\times 10^{-6}\\text{ J}$$.",
      "explanation": "For constant $Q = 5\\,\\mu\\text{C}$, $W = \\frac{Q^2}{2}(1/C_f - 1/C_i) = 3.75 \\times 10^{-6}\\text{ J}$."
    },
    {
      "id": 11,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The figure shows a meter bridge circuit, $X = 12\\,\\Omega$ and $R = 18\\,\\Omega$. The jockey $J$ is at the null point. If $R$ is made $8\\,\\Omega$, the jockey $J$ have to be moved by $5 \\times A\\text{ cm}$ to obtain null point again, then find the value of $A$.",
      "images": [
        "/images/ptm04/q11.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$4$"
        },
        {
          "id": "B",
          "text": "$5$"
        },
        {
          "id": "C",
          "text": "$8$"
        },
        {
          "id": "D",
          "text": "$6$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "1. Initially: $\\frac{\\ell_1}{100 - \\ell_1} = \\frac{X}{R} = \\frac{12}{18} = \\frac{2}{3} \\implies \\ell_1 = 40\\text{ cm}$.\n2. When $R' = 8\\,\\Omega$: $\\frac{\\ell_2}{100 - \\ell_2} = \\frac{12}{8} = \\frac{3}{2} \\implies \\ell_2 = 60\\text{ cm}$.\n3. Shift in jockey $= |60 - 40| = 20\\text{ cm} = 5 \\times A \\implies A = 4$.",
      "explanation": "Null point shifts from $40\\text{ cm}$ to $60\\text{ cm}$ ($20\\text{ cm} = 5 \\times A \\implies A = 4$)."
    },
    {
      "id": 12,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A parallel plate capacitor is of area $6\\text{ cm}^2$ and a separation $3\\text{ mm}$. The gap is filled with three dielectric materials of equal areas $\\frac{A}{3}$ (see figure) with dielectric constants $K_1 = 10$, $K_2 = 12$ and $K_3 = 14$. The dielectric constant of a material which when fully inserted in above capacitor, gives same capacitance would be:",
      "images": [
        "/images/ptm04/q12.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$36$"
        },
        {
          "id": "B",
          "text": "$14$"
        },
        {
          "id": "C",
          "text": "$12$"
        },
        {
          "id": "D",
          "text": "$4$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "As shown in the figure, the three dielectric slabs span the full plate separation $d = 3\\text{ mm}$ each with area $\\frac{A}{3}$ connected in parallel:\n$$C_{\\text{eq}} = C_1 + C_2 + C_3 = \\frac{\\varepsilon_0 (A/3)}{d}(K_1 + K_2 + K_3) = K_{\\text{eq}} \\frac{\\varepsilon_0 A}{d}$$\n$$K_{\\text{eq}} = \\frac{10 + 12 + 14}{3} = 12$$.",
      "explanation": "Parallel slabs of equal cross-section give $K_{\\text{eq}} = (K_1 + K_2 + K_3)/3 = 12$."
    },
    {
      "id": 13,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Find equivalent resistance between $A$ and $B$.",
      "images": [
        "/images/ptm04/q13.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$R$"
        },
        {
          "id": "B",
          "text": "$\\dfrac{3R}{4}$"
        },
        {
          "id": "C",
          "text": "$\\dfrac{R}{2}$"
        },
        {
          "id": "D",
          "text": "$2R$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "1. The two dangling open-end resistors carry zero current.\n2. At the top and bottom triangles, each edge $R$ is in parallel with $R + R = 2R$: $R_{\\text{top}} = R_{\\text{bottom}} = R \\parallel 2R = \\frac{2R}{3}$.\n3. On the left, the straight bottom wire directly shorts node $A$ to the bottom-left octagon corner ($V_{BL} = V_A$). Hence all three left resistors connect in parallel between $A$ and top-left corner $TL$: $R_{A,TL} = \\frac{R}{3}$.\n4. Symmetrically on the right, the top-right short wire sets $V_{TR} = V_B$, placing three resistors in parallel between $BR$ and $B$: $R_{BR,B} = \\frac{R}{3}$.\n5. Top branch $A \\to TL \\to B$ has resistance $\\frac{R}{3} + \\frac{2R}{3} = R$; bottom branch $A \\to BR \\to B$ has $\\frac{2R}{3} + \\frac{R}{3} = R$.\n$$R_{AB} = R \\parallel R = \\frac{R}{2}$$.",
      "explanation": "Left and right shorting wires reduce the network to two parallel $R$ branches: $R \\parallel R = R/2$."
    },
    {
      "id": 14,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The switch shown in the figure is closed at $t = 0$. The charge on the capacitor as a function of time is given by",
      "images": [
        "/images/ptm04/q14.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$CV\\left(1 - e^{-t/RC}\\right)$"
        },
        {
          "id": "B",
          "text": "$3CV\\left(1 - e^{-t/RC}\\right)$"
        },
        {
          "id": "C",
          "text": "$CV\\left(1 - e^{-3t/RC}\\right)$"
        },
        {
          "id": "D",
          "text": "$CV\\left(1 - e^{-t/3RC}\\right)$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "The three grounded resistors of resistance $R$ each are connected in parallel, giving equivalent resistance $R_{\\text{eq}} = \\frac{R}{3}$.\nTime constant of the RC charging circuit is $\\tau = R_{\\text{eq}} C = \\frac{RC}{3}$.\nTherefore, charge at time $t$ is:\n$$q(t) = CV\\left(1 - e^{-t/\\tau}\\right) = CV\\left(1 - e^{-3t/RC}\\right)$$.",
      "explanation": "Three $R$ in parallel give $R_{\\text{eq}} = R/3 \\implies \\tau = RC/3 \\implies q(t) = CV(1 - e^{-3t/RC})$."
    },
    {
      "id": 15,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Find equivalent capacitance between points $A$ and $B$. [Assume each conducting plate is having same dimensions and neglect the thickness of the plate, $\\frac{\\varepsilon_0 A}{d} = 7\\,\\mu\\text{F}$, where $A$ is area of plates]",
      "images": [
        "/images/ptm04/q15.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$7\\,\\mu\\text{F}$"
        },
        {
          "id": "B",
          "text": "$11\\,\\mu\\text{F}$"
        },
        {
          "id": "C",
          "text": "$12\\,\\mu\\text{F}$"
        },
        {
          "id": "D",
          "text": "$15\\,\\mu\\text{F}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Labeling the 6 horizontal surfaces top-to-bottom as plates $1$ to $6$, let $C_0 = \\frac{\\varepsilon_0 A}{d} = 7\\,\\mu\\text{F}$:\n- Plates $1$ and $5$ are joined by the outer left U-bend (let this isolated conductor be $X$).\n- Plate $2$ connects to terminal $A$.\n- Plates $3$ and $6$ are joined by the right U-bend and connect to terminal $B$.\n- Plate $4$ is an isolated floating plate.\nBetween $X$ and $B$: direct gap $5\\text{–}6$ ($C_0$) is in parallel with the series combination of gap $3\\text{–}4$ ($C_0$) and gap $4\\text{–}5$ ($C_0/2$):\n$$C_{XB} = C_0 + \\frac{C_0 \\cdot (C_0/2)}{C_0 + C_0/2} = C_0 + \\frac{C_0}{3} = \\frac{4}{3}C_0$$\nNow between $A$ and $B$: direct gap $2\\text{–}3$ ($C_0$) is in parallel with series combination $A \\xrightarrow{C_0} X \\xrightarrow{\\frac{4}{3}C_0} B$:\n$$C_{AB} = C_0 + \\frac{C_0 \\cdot \\frac{4}{3}C_0}{C_0 + \\frac{4}{3}C_0} = C_0 + \\frac{4}{7}C_0 = \\frac{11}{7}C_0 = \\frac{11}{7} \\times 7\\,\\mu\\text{F} = 11\\,\\mu\\text{F}$$.",
      "explanation": "Nodal reduction with isolated loop $X$ and floating plate $4$ gives $C_{AB} = \\frac{11}{7}C_0 = 11\\,\\mu\\text{F}$."
    },
    {
      "id": 16,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A parallel plate capacitor is made of two square plates of side '$a$', separated by a distance $d\\,(d \\ll a)$. The lower triangular portion is filled with a dielectric of dielectric constant $K$, as shown in the figure. Capacitance of this capacitor is",
      "images": [
        "/images/ptm04/q16.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\dfrac{K\\varepsilon_0 a^2}{2d(K+1)}$"
        },
        {
          "id": "B",
          "text": "$\\dfrac{K\\varepsilon_0 a^2}{d(K-1)}\\ln K$"
        },
        {
          "id": "C",
          "text": "$\\dfrac{K\\varepsilon_0 a^2}{d}\\ln K$"
        },
        {
          "id": "D",
          "text": "$\\dfrac{1}{2}\\dfrac{K\\varepsilon_0 a^2}{d}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Consider a vertical strip of width $dx$ at distance $x$ from the left edge ($0 \\le x \\le a$). The dielectric thickness is $y = \\frac{d}{a}x$ and air gap is $d - y$:\n$$dC = \\frac{\\varepsilon_0 a\\,dx}{\\frac{y}{K} + (d - y)} = \\frac{K\\varepsilon_0 a\\,dx}{Kd - (K - 1)\\frac{d}{a}x}$$\nIntegrating from $x = 0$ to $x = a$:\n$$C = \\frac{K\\varepsilon_0 a}{d} \\int_0^a \\frac{dx}{K - (K-1)\\frac{x}{a}} = \\frac{K\\varepsilon_0 a^2}{d(K-1)} \\ln K$$.",
      "explanation": "Integrating parallel differential series-dielectric strips gives $C = \\frac{K\\varepsilon_0 a^2}{d(K-1)}\\ln K$."
    },
    {
      "id": 17,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "For the circuit arrangement shown in figure, in the steady state condition charge on the capacitor is",
      "images": [
        "/images/ptm04/q17.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$12\\,\\mu\\text{C}$"
        },
        {
          "id": "B",
          "text": "$14\\,\\mu\\text{C}$"
        },
        {
          "id": "C",
          "text": "$20\\,\\mu\\text{C}$"
        },
        {
          "id": "D",
          "text": "$18\\,\\mu\\text{C}$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "In steady state, zero current enters the middle $2\\,\\mu\\text{F}$ capacitor branch. Outer loop current is:\n$$I = \\frac{12\\text{ V}}{2\\,\\Omega + 6\\,\\Omega} = 1.5\\text{ A}$$\nSince no current flows through the $4\\,\\Omega$ resistor, the voltage across the $2\\,\\mu\\text{F}$ capacitor equals the potential difference across the bottom $6\\,\\Omega$ resistor:\n$$V_C = 1.5 \\times 6 = 9\\text{ V} \\implies Q = C V_C = 2\\,\\mu\\text{F} \\times 9\\text{ V} = 18\\,\\mu\\text{C}$$.",
      "explanation": "Outer loop current is $1.5\\text{ A}$, placing $9\\text{ V}$ across the $6\\,\\Omega$ branch and $Q = 2 \\times 9 = 18\\,\\mu\\text{C}$."
    },
    {
      "id": 18,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The Kirchhoff's first law $\\left(\\sum i = 0\\right)$ and second law $\\left(\\sum iR = \\sum E\\right)$, where the symbols have their usual meanings, are respectively based on:",
      "options": [
        {
          "id": "A",
          "text": "Conservation of charge, conservation of momentum"
        },
        {
          "id": "B",
          "text": "Conservation of energy, conservation of charge"
        },
        {
          "id": "C",
          "text": "Conservation of momentum, conservation of charge"
        },
        {
          "id": "D",
          "text": "Conservation of charge, conservation of energy"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "Kirchhoff's junction rule ($\\sum i = 0$) expresses conservation of electric charge at a node, while the loop rule ($\\sum iR = \\sum E$) follows from the conservative nature of the electrostatic field and conservation of energy.",
      "explanation": "Kirchhoff's first law is conservation of charge; second law is conservation of energy."
    },
    {
      "id": 19,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "When the switch $S$ is closed, the initial current through the $1\\,\\Omega$ resistor is:",
      "images": [
        "/images/ptm04/q19.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$2\\text{ A}$"
        },
        {
          "id": "B",
          "text": "$4\\text{ A}$"
        },
        {
          "id": "C",
          "text": "$3\\text{ A}$"
        },
        {
          "id": "D",
          "text": "$6\\text{ A}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Immediately after switch $S$ is closed ($t = 0^+$), the uncharged $2\\,\\mu\\text{F}$ capacitor acts as a short circuit ($0\\text{ V}$). Thus the $6\\,\\Omega$ and $3\\,\\Omega$ resistors are connected in parallel:\n$$R_p = 6 \\parallel 3 = \\frac{6 \\times 3}{6 + 3} = 2\\,\\Omega$$\nTotal initial resistance across the $12\\text{ V}$ battery is $1 + 2 = 3\\,\\Omega$, so the initial current through the $1\\,\\Omega$ resistor is:\n$$I = \\frac{12\\text{ V}}{3\\,\\Omega} = 4\\text{ A}$$.",
      "explanation": "At $t=0^+$ the uncharged capacitor acts as a wire, giving $R_{\\text{eq}} = 1 + (6\\parallel 3) = 3\\,\\Omega \\implies I = 4\\text{ A}$."
    },
    {
      "id": 20,
      "subject": "Physics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A sphere of capacitance $100\\text{ pF}$ is charged to a potential of $100\\text{ V}$. Another identical uncharged metal sphere is brought in contact with the charged sphere, then the change in the total energy stored on these spheres, when they touch is $\\alpha \\times 10^{-7}\\text{ J}$. The value of $\\alpha$ is ____. (combined capacitance of sphere is $200\\text{ pF}$).",
      "options": [
        {
          "id": "A",
          "text": "$5$"
        },
        {
          "id": "B",
          "text": "$\\dfrac{5}{2}$"
        },
        {
          "id": "C",
          "text": "$\\dfrac{7}{2}$"
        },
        {
          "id": "D",
          "text": "$\\dfrac{9}{2}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Initial energy $U_i = \\frac{1}{2}C_1 V_1^2 = \\frac{1}{2}(100 \\times 10^{-12})(100)^2 = 5 \\times 10^{-7}\\text{ J}$.\nAfter contact, total charge $Q = C_1 V_1$ distributes across combined capacitance $C_{\\text{total}} = 200\\text{ pF}$:\n$$V_f = \\frac{Q}{C_{\\text{total}}} = \\frac{100 \\times 100}{200} = 50\\text{ V}$$\n$$U_f = \\frac{1}{2}C_{\\text{total}} V_f^2 = \\frac{1}{2}(200 \\times 10^{-12})(50)^2 = 2.5 \\times 10^{-7}\\text{ J}$$\n$$|\\Delta U| = 5 \\times 10^{-7} - 2.5 \\times 10^{-7} = 2.5 \\times 10^{-7} = \\frac{5}{2} \\times 10^{-7}\\text{ J} \\implies \\alpha = \\frac{5}{2}$$.",
      "explanation": "Energy drops from $5\\times 10^{-7}\\text{ J}$ to $2.5\\times 10^{-7}\\text{ J}$, giving $\\alpha = 5/2$."
    },
    {
      "id": 21,
      "subject": "Physics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The figure shows an RC circuit with parallel plate capacitor. Before switching on the circuit, plate A of the capacitor has charge $-Q_0$, while plate B has no net charge. If at $t = 0$, the switch is closed, then after how much time (in seconds) will the net charge on plate A becomes zero?\n$$\\left[\\text{Given}:\\; C = 1\\,\\mu\\text{F},\\; Q_0 = 1\\text{ mC},\\; \\varepsilon = 1000\\text{ V}\\;\\text{ and }\\; R = \\frac{2 \\times 10^6}{\\ln 3}\\,\\Omega\\right]$$",
      "images": [
        "/images/ptm04/q21.png"
      ],
      "answer": "2",
      "hasKey": true,
      "solution": "Total charge on the closed circuit remains $q_A(t) + q_B(t) = -Q_0$, so outer capacitor faces each permanently hold $-\\frac{Q_0}{2}$.\nThus inner facing charge on A is $q_A^{\\text{in}} = q_A + \\frac{Q_0}{2}$, giving $V_A - V_B = \\frac{q_A + Q_0/2}{C}$.\nAt steady state ($V_A - V_B = \\varepsilon$), $q_A(\\infty) = C\\varepsilon - \\frac{Q_0}{2} = Q_0 - \\frac{Q_0}{2} = +\\frac{Q_0}{2}$ (since $C\\varepsilon = 1\\,\\mu\\text{F} \\times 1000\\text{ V} = 1\\text{ mC} = Q_0$).\nWith $q_A(0) = -Q_0$:\n$$q_A(t) = \\frac{Q_0}{2} + \\left(-Q_0 - \\frac{Q_0}{2}\\right) e^{-t/RC} = \\frac{Q_0}{2}\\left(1 - 3 e^{-t/RC}\\right)$$\nSetting $q_A(t) = 0 \\implies e^{t/RC} = 3 \\implies t = RC\\ln 3 = \\frac{2 \\times 10^6}{\\ln 3} \\cdot (10^{-6}) \\cdot \\ln 3 = 2\\text{ s}$.",
      "explanation": "$q_A(t) = \\frac{Q_0}{2}(1 - 3e^{-t/RC}) = 0 \\implies t = RC\\ln 3 = 2\\text{ s}$."
    },
    {
      "id": 22,
      "subject": "Physics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The space between the plates of a parallel-plate capacitor of capacitance $C$ (without any dielectric) is now filled with three dielectric slabs of dielectric constants $K_1 = 2$, $K_2 = 3$ and $K_3 = 5$ (as shown in the figure). If new capacitance is $\\frac{nC}{3}$, then the value of $n$ is ____.",
      "images": [
        "/images/ptm04/q22.png"
      ],
      "answer": "8",
      "hasKey": true,
      "solution": "1. Top slab ($K_1 = 2$, thickness $d/2$, area $A$): $C_1 = \\frac{K_1 \\varepsilon_0 A}{d/2} = 2K_1 C = 4C$.\n2. Bottom-left ($K_2 = 3$, thickness $d/2$, area $A/2$): $C_2 = K_2 C = 3C$.\n3. Bottom-right ($K_3 = 5$, thickness $d/2$, area $A/2$): $C_3 = K_3 C = 5C$.\nBottom parallel combination: $C_{23} = 3C + 5C = 8C$.\nSeries combination of top ($4C$) and bottom ($8C$):\n$$C_{\\text{eq}} = \\frac{4C \\times 8C}{4C + 8C} = \\frac{32C}{12} = \\frac{8C}{3} \\implies n = 8$$.",
      "explanation": "$C_1 = 4C$ in series with $(C_2 + C_3) = 8C$ yields $C_{\\text{eq}} = 8C/3 \\implies n = 8$."
    },
    {
      "id": 23,
      "subject": "Physics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A cylindrical conductor of length $2\\text{ m}$ and area of cross-section $0.2\\text{ mm}^2$ carries an electric current of $1.6\\text{ A}$, when its ends are connected to a $2\\text{ V}$ battery. Mobility of electrons in the conductor is $\\alpha \\times 10^{-3}\\text{ m}^2/\\text{V}\\cdot\\text{s}$. The value of $\\alpha$ is: (electron concentration $= 5 \\times 10^{28}/\\text{m}^3$)",
      "answer": "1",
      "hasKey": true,
      "solution": "Electric field $E = \\frac{V}{L} = \\frac{2\\text{ V}}{2\\text{ m}} = 1\\text{ V/m}$.\nCurrent density $J = \\frac{I}{A} = \\frac{1.6}{0.2 \\times 10^{-6}} = 8 \\times 10^6\\text{ A/m}^2$.\nUsing $J = n e \\mu E$:\n$$\\mu = \\frac{J}{n e E} = \\frac{8 \\times 10^6}{(5 \\times 10^{28})(1.6 \\times 10^{-19})(1)} = \\frac{8 \\times 10^6}{8 \\times 10^9} = 1 \\times 10^{-3}\\text{ m}^2/\\text{V}\\cdot\\text{s} \\implies \\alpha = 1$$.",
      "explanation": "$\\mu = J/(neE) = (8\\times 10^6)/(5\\times 10^{28}\\times 1.6\\times 10^{-19}\\times 1) = 1\\times 10^{-3} \\implies \\alpha = 1$."
    },
    {
      "id": 24,
      "subject": "Physics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "As shown in the figure, the voltmeter reads $2\\text{ V}$ across $5\\,\\Omega$ resistor. The resistance of the voltmeter is ____ $\\Omega$.",
      "images": [
        "/images/ptm04/q24.png"
      ],
      "answer": "20",
      "hasKey": true,
      "solution": "Voltage across the series $2\\,\\Omega$ resistor $= 3\\text{ V} - 2\\text{ V} = 1\\text{ V}$.\nTotal circuit current $I = \\frac{1\\text{ V}}{2\\,\\Omega} = 0.5\\text{ A}$.\nCurrent through $5\\,\\Omega$ resistor $I_R = \\frac{2\\text{ V}}{5\\,\\Omega} = 0.4\\text{ A}$.\nCurrent entering voltmeter $I_V = 0.5 - 0.4 = 0.1\\text{ A}$.\n$$R_V = \\frac{2\\text{ V}}{0.1\\text{ A}} = 20\\,\\Omega$$.",
      "explanation": "Total current $0.5\\text{ A}$ splits into $0.4\\text{ A}$ ($5\\,\\Omega$) and $0.1\\text{ A}$ ($R_V$) $\\implies R_V = 20\\,\\Omega$."
    },
    {
      "id": 25,
      "subject": "Physics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "In the shown network, the charge on capacitor of capacitance $5\\,\\mu\\text{F}$ in steady state is ____ $\\mu\\text{C}$.",
      "images": [
        "/images/ptm04/q25.png"
      ],
      "answer": "15",
      "hasKey": true,
      "solution": "In steady state, no current flows through the capacitors, so the $10\\text{ V}$ source drives current through $1 + 2 + 3 + 4 = 10\\,\\Omega$ in series:\n$$I = \\frac{10\\text{ V}}{10\\,\\Omega} = 1\\text{ A}$$\nThe $5\\,\\mu\\text{F}$ capacitor is connected across the $1\\,\\Omega + 2\\,\\Omega = 3\\,\\Omega$ combination, so its steady-state potential difference is $V = 1\\text{ A} \\times 3\\,\\Omega = 3\\text{ V}$.\n$$Q = C V = 5\\,\\mu\\text{F} \\times 3\\text{ V} = 15\\,\\mu\\text{C}$$.",
      "explanation": "Steady current $I = 1\\text{ A}$ puts $3\\text{ V}$ across $1\\,\\Omega + 2\\,\\Omega$, giving $Q = 5 \\times 3 = 15\\,\\mu\\text{C}$."
    },
    {
      "id": 26,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The major product formed in the following reaction is:",
      "images": [
        "/images/ptm04/q26.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q26_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q26_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q26_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q26_optD.png"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "1. The aryl-ethyl ether ($\\text{Ar-O-CH}_2\\text{CH}_3$) cannot undergo $S_N2$ cleavage at the partial-double-bond $sp^2$ aryl carbon, so with $\\text{HI}/\\Delta$ it leaves the phenolic $-\\text{OH}$ on the benzene ring and forms $\\text{Et-I}$.\n2. At the benzylic ether ($\\text{Ar-CH(CH}_3\\text{)-O-CH}_3$), protonation followed by $S_N1$ cleavage yields the resonance-stabilized secondary benzylic carbocation $\\text{Ar-}\\overset{+}{\\text{C}}\\text{H(CH}_3\\text{)}$ (+ $\\text{CH}_3\\text{OH}$), which is trapped by $\\text{I}^-$ (and any benzylic alcohol further substitutes in hot $\\text{HI}$) to yield the benzylic iodide $-\\text{CH(I)CH}_3$.\nHence Option (C) ($o$-(1-iodoethyl)phenol) is major.",
      "explanation": "Aryl ether retains phenolic $-\\text{OH}$ while benzylic ether gives $-\\text{CH(I)CH}_3$ via $S_N1$ benzylic carbocation."
    },
    {
      "id": 27,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Major product 'A' in the given reaction is:",
      "images": [
        "/images/ptm04/q27.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q27_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q27_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q27_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q27_optD.png"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "1. Protonation of $-\\text{OH}$ and loss of water generates a $2^\\circ$ carbocation on the 6-membered ring adjacent to the spiro junction with a strained 5-membered ring.\n2. $1,2$-alkyl shift of a $\\text{C–C}$ bond from the 5-membered ring expands it to a 6-membered ring, forming the stable $3^\\circ$ fused [4.4.0]bicyclodecane (decalin) carbocation.\n3. Loss of $\\text{H}^+$ yields the most substituted (tetrasubstituted Saytzeff) alkene $\\Delta^{9,10}$-octalin, matching Option (D).",
      "explanation": "Spiro ring expansion ($5 \\to 6$) forms a $3^\\circ$ decalin cation, eliminating to tetrasubstituted octalin (D)."
    },
    {
      "id": 28,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The major product of the following reactions is:",
      "images": [
        "/images/ptm04/q28.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q28_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q28_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q28_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q28_optD.png"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "1. Treatment of primary chloride $-\\text{CH(CH}_3\\text{)-CH}_2\\text{Cl}$ with anhydrous $\\text{AlCl}_3$ triggers rapid $1,2$-hydride shift to form the much more stable $3^\\circ$ carbocation $-\\text{C}^+(\\text{CH}_3)_2$.\n2. Intramolecular Friedel–Crafts alkylation closes a strain-free 5-membered indan ring preferentially at the sterically unhindered *para* position relative to the strongly *o,p*-directing $-\\text{OCH}_3$ group (avoiding the hindered position between $-\\text{OCH}_3$ and the chain).\n3. Aqueous workup liberates $-\\text{OCH}_3$ from the $\\text{AlCl}_3$ complex, yielding 6-methoxy-1,1-dimethylindan, Option (D).",
      "explanation": "$1,2$-H shift gives $3^\\circ$ carbocation $-\\text{C}^+(\\text{CH}_3)_2$, which cyclizes *para* to $-\\text{OCH}_3$ to form (D)."
    },
    {
      "id": 29,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Consider the following two-step reaction sequence starting from $(R)$-hept-6-en-2-ol:\n$$(R)\\text{-hept-6-en-2-ol} \\xrightarrow[2.\\; \\text{NaBH}_4,\\; \\text{NaOH}]{1.\\; \\text{Hg(OAc)}_2,\\; \\text{THF/H}_2\\text{O}} \\text{Product mixture (P)}$$\nWhich of the following statements is correct regarding the major cyclic ether product(s) formed in the reaction?",
      "options": [
        {
          "id": "A",
          "text": "The major product is an optically inactive meso compound containing a 7-membered ring."
        },
        {
          "id": "B",
          "text": "The reaction proceeds exclusively via an intermolecular addition of water to give an optically active diol as the major product."
        },
        {
          "id": "C",
          "text": "The major product is a mixture of diastereomers of 2,6-Dimethyloxane or 2,6-dimethyltetrahydro-2H-pyran, where the cis-isomer predominates over the trans-isomer."
        },
        {
          "id": "D",
          "text": "The major product is a pair of enantiomers of 2,6-Dimethyloxane or 2-methyltetrahydro-2H-pyran obtained in equal amounts."
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "1. $\\text{Hg(OAc)}_2$ forms a mercurinium ion across C6=C7.\n2. Intramolecular Markovnikov attack by the C2 $-\\text{OH}$ on C6 forms a strain-free 6-membered tetrahydropyran ring without altering the $(R)$ configuration at C2. Demercuration with $\\text{NaBH}_4/\\text{NaOH}$ gives 2,6-dimethyltetrahydro-2H-pyran (2,6-dimethyloxane).\n3. Because C2 retains $(2R)$ stereochemistry while C6 is formed in both $(6S)$ and $(6R)$ configurations, $(2R, 6S)$ (*cis*) and $(2R, 6R)$ (*trans*) are **diastereomers**, with the *cis*-isomer predominating due to both methyl groups occupying equatorial chair positions.",
      "explanation": "Intramolecular oxymercuration gives a 6-membered cyclic ether as a cis/trans diastereomeric pair, favoring diequatorial cis (C)."
    },
    {
      "id": 30,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The relative rate of acid catalysed dehydration of following alcohols would be:",
      "images": [
        "/images/ptm04/q30.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\text{II} > \\text{I} > \\text{III}$"
        },
        {
          "id": "B",
          "text": "$\\text{II} > \\text{III} > \\text{I}$"
        },
        {
          "id": "C",
          "text": "$\\text{I} > \\text{II} > \\text{III}$"
        },
        {
          "id": "D",
          "text": "$\\text{I} > \\text{III} > \\text{II}$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Rate of acid-catalyzed dehydration correlates directly with the stability of the carbocation formed in the rate-determining step:\n- **(II)** forms a resonance-stabilized **$3^\\circ$ benzylic carbocation** immediately upon water loss (fastest).\n- **(I)** is a $2^\\circ$ alcohol forming a **$2^\\circ$ carbocation** (before rearrangement).\n- **(III)** is a hindered $1^\\circ$ neopentyl-like alcohol resisting direct dissociation ($1^\\circ$ state, slowest).\nHence rate order is $\\text{II} > \\text{I} > \\text{III}$.",
      "explanation": "Carbocation stability order ($3^\\circ$ benzylic II $>$ $2^\\circ$ I $>$ $1^\\circ$ neopentyl III) gives rate order II $>$ I $>$ III."
    },
    {
      "id": 31,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Choose the correct statement:",
      "options": [
        {
          "id": "A",
          "text": "Phenol gives effervescence with $\\text{NaHCO}_3$"
        },
        {
          "id": "B",
          "text": "Picric acid is weaker acid than carbonic acid"
        },
        {
          "id": "C",
          "text": "Picric acid gives effervescence with $\\text{NaHCO}_3$"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q31_optD.png"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "1. Phenol ($pK_a \\approx 10$) is weaker than carbonic acid ($pK_{a1} \\approx 6.35$), so it does not evolve $\\text{CO}_2$ with $\\text{NaHCO}_3$.\n2. Picric acid ($2,4,6$-trinitrophenol, $pK_a \\approx 0.38$) is a much stronger acid than carbonic acid due to three strongly $-M, -I$ nitro groups, so it reacts with $\\text{NaHCO}_3$ liberating brisk $\\text{CO}_2$ effervescence.\n3. Phenoxide ion is more stable than alkoxide ion due to benzene-ring resonance delocalization, making (D) false.",
      "explanation": "Picric acid is stronger than $\\text{H}_2\\text{CO}_3$, so it gives $\\text{CO}_2$ effervescence with $\\text{NaHCO}_3$."
    },
    {
      "id": 32,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "$\\text{Phenol} \\xrightarrow[\\text{NaOH}]{\\text{Et}_2\\text{SO}_4} \\text{(A)} \\xrightarrow[\\text{AlCl}_3,\\;\\text{then } \\text{H}_3\\text{O}^+]{\\text{HCl, HCN}} \\text{(B)}$\nA and B in the above reaction sequence are-",
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q32_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q32_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q32_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q32_optD.png"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "1. Phenol reacts with $\\text{NaOH}$ and diethyl sulfate ($\\text{Et}_2\\text{SO}_4$) via Williamson alkylation to yield **ethoxybenzene (phenetole)** as (A).\n2. Gattermann formylation ($\\text{HCl}, \\text{HCN}, \\text{AlCl}_3$ followed by $\\text{H}_3\\text{O}^+$) introduces a single $-\\text{CHO}$ group selectively at the sterically favored *para* position relative to the *o,p*-directing $-\\text{OEt}$ group, yielding $p$-ethoxybenzaldehyde as (B).",
      "explanation": "Williamson ethylation gives phenetole (A), and Gattermann formylation puts one $-\\text{CHO}$ para to $-\\text{OEt}$ (B)."
    },
    {
      "id": 33,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The incorrect statement about the following sequence of reactions is?",
      "images": [
        "/images/ptm04/q33.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "The major product $R$ is a single optically active compound"
        },
        {
          "id": "B",
          "text": "The product $P$ is formed by retention of configuration"
        },
        {
          "id": "C",
          "text": "The product $Q$ is formed by inversion of configuration"
        },
        {
          "id": "D",
          "text": "The major product $R$ is formed by Hoffmann rule"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "1. Starting alcohol is *trans*-2-methylcyclohexan-1-ol (C1 $-\\text{OH}$ wedge, C2 $-\\text{CH}_3$ dash).\n2. With $\\text{SOCl}_2$ **in pyridine**, the mechanism switches from $S_Ni$ retention to **$S_N2$ inversion**! Hence $P$ (*cis*-1-chloro-2-methylcyclohexane) is formed by **inversion** of configuration, making statement (B) **incorrect**.\n3. Finkelstein reaction ($\\text{NaI}$/acetone) gives $Q$ (*trans*-1-iodo-2-methylcyclohexane) by $S_N2$ inversion (C is true).\n4. In $Q$, $-\\text{I}$ and $\\text{C2-H}$ are *cis* (*syn*), preventing *anti-periplanar* $E2$ toward C2; instead $E2$ eliminates C6-H giving optically active 3-methylcyclohexene (less substituted / Hoffmann product, A and D are true).",
      "explanation": "$\\text{SOCl}_2$ in the presence of pyridine gives $P$ via $S_N2$ inversion (not retention), making statement (B) false."
    },
    {
      "id": 34,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "In this reaction, which is incorrect option?",
      "images": [
        "/images/ptm04/q34.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q34_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q34_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q34_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q34_optD.png"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "1. Propynyl anion $\\text{CH}_3\\text{C}\\equiv\\text{C}^-$ is a strong nucleophile that opens the unsymmetrical epoxide via $S_N2$ strictly at the **less sterically hindered** $-\\text{CH}_2-$ carbon, forming $X = \\text{H}_3\\text{C-CH(O}^-\\text{)-CH}_2\\text{C}\\equiv\\text{CCH}_3$ (confirming D).\n2. Methylation with $\\text{CH}_3\\text{I}$ gives $Y = \\text{H}_3\\text{C-CH(OCH}_3\\text{)-CH}_2\\text{C}\\equiv\\text{CCH}_3$ (confirming A), whereas Option (B) incorrectly shows attack at the more hindered internal methine carbon.\n3. Partial reduction with Lindlar catalyst ($\\text{H}_2/\\text{Pd/BaSO}_4$) gives $Z = \\text{H}_3\\text{C-CH(OCH}_3\\text{)-CH}_2\\text{CH=CH-CH}_3$ (confirming C).",
      "explanation": "$S_N2$ epoxide opening by $\\text{CH}_3\\text{C}\\equiv\\text{C}^-$ occurs at the less hindered $-\\text{CH}_2$ carbon, making structure (B) incorrect."
    },
    {
      "id": 35,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The heating of phenyl-methyl ethers with $\\text{HI}$ produces:",
      "options": [
        {
          "id": "A",
          "text": "iodobenzene"
        },
        {
          "id": "B",
          "text": "phenol"
        },
        {
          "id": "C",
          "text": "benzene"
        },
        {
          "id": "D",
          "text": "ethyl chlorides"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Due to partial double-bond character of the $\\text{C}(sp^2)\\text{–O}$ bond in anisole ($\\text{C}_6\\text{H}_5\\text{OCH}_3$), cleavage with $\\text{HI}$ occurs exclusively at the $\\text{O–CH}_3$ bond via $S_N2$ attack by $\\text{I}^-$, yielding **phenol** and methyl iodide ($\\text{CH}_3\\text{I}$).",
      "explanation": "$\\text{C}_6\\text{H}_5\\text{OCH}_3 + \\text{HI} \\xrightarrow{\\Delta} \\text{C}_6\\text{H}_5\\text{OH} + \\text{CH}_3\\text{I}$, producing phenol."
    },
    {
      "id": 36,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The compound which is not isomeric with diethyl ether is:",
      "options": [
        {
          "id": "A",
          "text": "n-propyl methyl ether"
        },
        {
          "id": "B",
          "text": "butan-1-ol"
        },
        {
          "id": "C",
          "text": "2-methyl propan-2-ol"
        },
        {
          "id": "D",
          "text": "butan-2-one"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "Diethyl ether has molecular formula $\\text{C}_4\\text{H}_{10}\\text{O}$ (degree of unsaturation $= 0$).\n$n$-Propyl methyl ether, butan-1-ol, and 2-methylpropan-2-ol all have formula $\\text{C}_4\\text{H}_{10}\\text{O}$, whereas butan-2-one ($\\text{CH}_3\\text{COCH}_2\\text{CH}_3$) has formula $\\text{C}_4\\text{H}_8\\text{O}$ and is not an isomer.",
      "explanation": "Diethyl ether is $\\text{C}_4\\text{H}_{10}\\text{O}$, whereas butan-2-one is $\\text{C}_4\\text{H}_8\\text{O}$."
    },
    {
      "id": 37,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The correct order of acidic strength for following compounds will be-",
      "images": [
        "/images/ptm04/q37.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\text{III} > \\text{I} > \\text{II}$"
        },
        {
          "id": "B",
          "text": "$\\text{I} > \\text{III} > \\text{II}$"
        },
        {
          "id": "C",
          "text": "$\\text{II} > \\text{III} > \\text{I}$"
        },
        {
          "id": "D",
          "text": "$\\text{I} > \\text{II} > \\text{III}$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Electron-withdrawing $p\\text{-NO}_2$ ($-M, -I$) strongly stabilizes the phenoxide ion in (III), making it most acidic. Electron-donating $p\\text{-CH}_3$ ($+H, +I$) destabilizes phenoxide in (II), making it weaker than unsubstituted phenol (I). Order: $\\text{III} > \\text{I} > \\text{II}$.",
      "explanation": "$p$-Nitrophenol (III) $>$ Phenol (I) $>$ $p$-Cresol (II)."
    },
    {
      "id": 38,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The product obtained by the reaction of $\\text{HBr}$ with phenol is:",
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q38_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q38_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q38_optC.png"
        },
        {
          "id": "D",
          "text": "There is no reaction"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "Unlike alcohols, phenol has a strong $sp^2$ $\\text{C–O}$ bond stabilized by resonance, and nucleophilic substitution by $\\text{Br}^-$ ($S_N2$ or $S_N1$ aryl cation) does not occur with aqueous or gaseous $\\text{HBr}$. Hence, there is no reaction.",
      "explanation": "Phenols do not undergo $\\text{C–OH}$ cleavage with $\\text{HBr}$ due to partial double-bond character."
    },
    {
      "id": 39,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The main product of the following reaction is:\n$$\\text{C}_6\\text{H}_5\\text{CH}_2\\text{CH(OH)CH(CH}_3)_2 \\xrightarrow{\\text{conc. H}_2\\text{SO}_4} ?$$",
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q39_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q39_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q39_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q39_optD.png"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Acid-catalyzed dehydration of $\\text{C}_6\\text{H}_5\\text{CH}_2\\text{CH(OH)CH(CH}_3)_2$ forms a $2^\\circ$ carbocation that undergoes $1,2$-hydride shift to the resonance-stabilized benzylic carbocation (or undergoes deprotonation controlled by phenyl $\\pi$-conjugation), yielding the conjugated alkene $\\text{C}_6\\text{H}_5\\text{CH=CHCH(CH}_3)_2$. Between *trans* (A) and *cis* (D), the sterically less hindered *trans*-alkene (A) predominates.",
      "explanation": "Conjugation with the phenyl ring and minimal steric hindrance favor the *trans*-conjugated alkene (A)."
    },
    {
      "id": 40,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Phenol on reaction with Sodium Dichromate in sulphuric acid forms -",
      "options": [
        {
          "id": "A",
          "text": "Naphthol"
        },
        {
          "id": "B",
          "text": "Salicylic acid"
        },
        {
          "id": "C",
          "text": "Phthalic acid"
        },
        {
          "id": "D",
          "text": "Benzoquinone"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "Oxidation of phenol with chromic acid ($\\text{Na}_2\\text{Cr}_2\\text{O}_7 + \\text{H}_2\\text{SO}_4$) yields the conjugated diketone **$p$-benzoquinone**.",
      "explanation": "Phenol is oxidized by $\\text{Na}_2\\text{Cr}_2\\text{O}_7/\\text{H}_2\\text{SO}_4$ to $p$-benzoquinone."
    },
    {
      "id": 41,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Find product $(A)$ in the following reaction:",
      "images": [
        "/images/ptm04/q41.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "",
          "image": "/images/ptm04/q41_optA.png"
        },
        {
          "id": "B",
          "text": "",
          "image": "/images/ptm04/q41_optB.png"
        },
        {
          "id": "C",
          "text": "",
          "image": "/images/ptm04/q41_optC.png"
        },
        {
          "id": "D",
          "text": "",
          "image": "/images/ptm04/q41_optD.png"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Reaction of an optically active alcohol with neat $\\text{SOCl}_2$ (without pyridine or a base) proceeds via the $S_Ni$ mechanism, resulting in **retention of configuration** at the chiral center. Keeping $-\\text{CH}_3$ top, $-\\text{Et}$ bottom, $-\\text{H}$ left, and replacing $-\\text{OH}$ with $-\\text{Cl}$ on the right gives Option (A).",
      "explanation": "$\\text{SOCl}_2$ alone reacts via $S_Ni$ with retention of configuration, giving Fischer structure (A)."
    },
    {
      "id": 42,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Match each species in List-I with appropriate statement(s) of List-II and choose correct option.",
      "images": [
        "/images/ptm04/q42.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\text{I} \\to \\text{Q, R};\\; \\text{II} \\to \\text{Q, S, T};\\; \\text{III} \\to \\text{P, S};\\; \\text{IV} \\to \\text{T}$"
        },
        {
          "id": "B",
          "text": "$\\text{I} \\to \\text{Q, R, S};\\; \\text{II} \\to \\text{Q, R, S};\\; \\text{III} \\to \\text{P, Q};\\; \\text{IV} \\to \\text{R, S}$"
        },
        {
          "id": "C",
          "text": "$\\text{I} \\to \\text{P, Q, R, S};\\; \\text{II} \\to \\text{Q, R, S};\\; \\text{III} \\to \\text{P, R};\\; \\text{IV} \\to \\text{Q}$"
        },
        {
          "id": "D",
          "text": "$\\text{I} \\to \\text{Q, R, S};\\; \\text{II} \\to \\text{P, Q, R, S};\\; \\text{III} \\to \\text{P, S};\\; \\text{IV} \\to \\text{T}$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "1. **(I)** Butan-1-ol ($1^\\circ$ alcohol) turns acidified dichromate green (S) and dehydrates with $1,2$-H shift to *cis/trans*-but-2-ene (6 $\\alpha$-H = even (Q), shows geometrical isomerism (R); no optical isomer) $\\implies \\text{Q, R, S}$.\n2. **(II)** Substituted $2^\\circ$ cyclohexanol turns dichromate green (S), retains chiral C-Me center / chiral elimination stereoisomers (P, R), and gives a major alkene with 4 $\\alpha$-H (even, Q) $\\implies \\text{P, Q, R, S}$.\n3. **(III)** 2-Methylcyclohexanol ($2^\\circ$) turns dichromate green (S), gives major 1-methylcyclohexene (7 $\\alpha$-H, odd $\\implies$ not Q) and chiral 3-methylcyclohexene (P) $\\implies \\text{P, S}$.\n4. **(IV)** Bicyclo[2.2.1]heptan-1-ol has $-\\text{OH}$ at a bridgehead carbon ($3^\\circ$, resists dichromate) and cannot dehydrate due to Bredt's rule $\\implies \\text{T}$.\nOnly Option (D) matches all four.",
      "explanation": "I$\\to$Q,R,S; II$\\to$P,Q,R,S; III$\\to$P,S; IV (bridgehead Bredt resistance)$\\to$T."
    },
    {
      "id": 43,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Match List – I with List – II and choose the correct answer from the options given below:",
      "images": [
        "/images/ptm04/q43.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\text{A} - \\text{IV},\\; \\text{B} - \\text{III},\\; \\text{C} - \\text{II},\\; \\text{D} - \\text{I}$"
        },
        {
          "id": "B",
          "text": "$\\text{A} - \\text{IV},\\; \\text{B} - \\text{III},\\; \\text{C} - \\text{I},\\; \\text{D} - \\text{II}$"
        },
        {
          "id": "C",
          "text": "$\\text{A} - \\text{II},\\; \\text{B} - \\text{III},\\; \\text{C} - \\text{I},\\; \\text{D} - \\text{IV}$"
        },
        {
          "id": "D",
          "text": "$\\text{A} - \\text{IV},\\; \\text{B} - \\text{II},\\; \\text{C} - \\text{III},\\; \\text{D} - \\text{I}$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "- **A:** Phenol $\\to$ Salicylaldehyde (Reimer–Tiemann reaction): $\\text{CHCl}_3/\\text{NaOH}$ (**IV**).\n- **B:** Phenol $\\to$ Benzene: $\\text{Zn-dust}/\\Delta$ (**III**).\n- **C:** Phenol $\\to$ $p$-Benzoquinone: $\\text{Na}_2\\text{Cr}_2\\text{O}_7/\\text{H}_2\\text{SO}_4$ (**II**).\n- **D:** Phenol $\\to$ $4$-Bromophenol: $\\text{Br}_2$ in $\\text{CS}_2$ (**I**).",
      "explanation": "A-IV (Reimer–Tiemann), B-III (Zn-dust), C-II (chromic acid), D-I (Br2/CS2)."
    },
    {
      "id": 44,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Carbolic acid is:",
      "options": [
        {
          "id": "A",
          "text": "Phenol"
        },
        {
          "id": "B",
          "text": "Phenyl benzoate"
        },
        {
          "id": "C",
          "text": "Salol"
        },
        {
          "id": "D",
          "text": "Phenyl acetate"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Phenol ($\\text{C}_6\\text{H}_5\\text{OH}$) is historically and commercially known as **carbolic acid**.",
      "explanation": "Carbolic acid is the common name of phenol ($\\text{C}_6\\text{H}_5\\text{OH}$)."
    },
    {
      "id": 45,
      "subject": "Chemistry",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Phenol reacts with $\\text{PCl}_5$ to give ........ as major product.",
      "options": [
        {
          "id": "A",
          "text": "Chlorobenzene"
        },
        {
          "id": "B",
          "text": "Triphenyl phosphate"
        },
        {
          "id": "C",
          "text": "No reaction takes place"
        },
        {
          "id": "D",
          "text": "Both (A) and (B)"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "When phenol reacts with $\\text{PCl}_5$, $\\text{POCl}_3$ formed initially further reacts with excess phenol to give **triphenyl phosphate** ($(\\text{C}_6\\text{H}_5)_3\\text{PO}_4$) as the **major product** (chlorobenzene is obtained only in very minor amounts).",
      "explanation": "Phenol + $\\text{PCl}_5$ yields triphenyl phosphate ($(\\text{C}_6\\text{H}_5)_3\\text{PO}_4$) as the major product."
    },
    {
      "id": 46,
      "subject": "Chemistry",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "An organic compound ($\\text{C}_8\\text{H}_{10}\\text{O}_2$) has '$n$' isomers, all of these rotate plane-polarized light and give positive test with neutral $\\text{FeCl}_3$ solution. Oxidation of this compound with $\\text{PCC}/\\text{CHCl}_3$ gives another compound ($\\text{C}_8\\text{H}_8\\text{O}_2$), which has '$m$' isomers and all give yellow precipitate with $\\text{I}_2 + \\text{NaOH}$. Calculate the value of '$m + n$'.",
      "answer": "9",
      "hasKey": true,
      "solution": "1. $\\text{C}_8\\text{H}_{10}\\text{O}_2$ has $\\text{DoU} = 4$ and positive neutral $\\text{FeCl}_3$ test $\\implies$ phenolic $-\\text{OH}$ on a benzene ring, leaving a $\\text{C}_2\\text{H}_5\\text{O}$ group.\n2. $\\text{PCC}/\\text{CHCl}_3$ oxidizes it to $\\text{C}_8\\text{H}_8\\text{O}_2$ which gives a positive iodoform test ($\\text{I}_2 + \\text{NaOH} \\to \\text{CHI}_3$ yellow ppt), meaning the oxidized group is $-\\text{COCH}_3$ (methyl ketone) and the starting substituent must be chiral $-\\overset{*}{\\text{C}}\\text{H(OH)CH}_3$.\n3. Thus the starting compounds are *ortho*, *meta*, and *para*-$\\text{HO-C}_6\\text{H}_4\\text{-CH(OH)CH}_3$. Each has a chiral center ($d$ and $l$ enantiomers rotate plane-polarized light), giving $n = 3 \\times 2 = 6$ optically active isomers.\n4. After PCC oxidation, we get *ortho*, *meta*, and *para*-hydroxyacetophenone ($m = 3$ isomers, all giving positive iodoform test).\n$$m + n = 3 + 6 = 9$$.",
      "explanation": "$n = 6$ optically active isomers of $o,m,p$-$\\text{HOC}_6\\text{H}_4\\text{CH(OH)CH}_3$ and $m = 3$ hydroxyacetophenones give $m+n=9$."
    },
    {
      "id": 47,
      "subject": "Chemistry",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of reagent(s) which is/are best used to convert allyl alcohol to acrolein is/are:\nA) $\\text{MnO}_2$\\quad B) $\\text{O}_3/\\text{H}_2\\text{O}_2$\\quad C) $\\text{OsO}_4/\\text{NaHSO}_3$\\quad D) $\\text{KMnO}_4$",
      "answer": "1",
      "hasKey": true,
      "solution": "To oxidize allyl alcohol ($\\text{CH}_2\\text{=CH-CH}_2\\text{OH}$) selectively to acrolein ($\\text{CH}_2\\text{=CH-CHO}$) without touching the $\\text{C=C}$ double bond or over-oxidizing to carboxylic acid, **active $\\text{MnO}_2$** (Reagent A) is used.\n- $\\text{O}_3/\\text{H}_2\\text{O}_2$ cleaves the $\\text{C=C}$ bond.\n- $\\text{OsO}_4/\\text{NaHSO}_3$ *syn*-dihydroxylates the $\\text{C=C}$ bond.\n- $\\text{KMnO}_4$ non-selectively cleaves and over-oxidizes.\nHence only **1** reagent works.",
      "explanation": "Active $\\text{MnO}_2$ selectively oxidizes allylic alcohols without reacting with $\\text{C=C}$; total best reagents $= 1$."
    },
    {
      "id": 48,
      "subject": "Chemistry",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "How many of the following compounds will give immediate turbidity with Lucas reagent [anhydrous $\\text{ZnCl}_2 / \\text{conc. HCl}$]?",
      "images": [
        "/images/ptm04/q48.png"
      ],
      "answer": "4",
      "hasKey": true,
      "solution": "Lucas reagent gives **immediate turbidity** with alcohols forming highly stable carbocations:\n- **(i)** Vinyl alcohol: $sp^2$ $\\text{C–OH}$, does not react ($\\times$).\n- **(ii)** Cyclopropylmethyl alcohol: forms extraordinarily stabilized cyclopropylmethyl (\"dancing resonance\") carbocation ($\\checkmark$).\n- **(iii)** Cyclopenta-2,4-dien-1-ol: losing $\\text{OH}^-$ gives $4\\pi$-electron antiaromatic cyclopentadienyl cation ($\\times$).\n- **(iv)** Phenol: $sp^2$ aryl $\\text{C–OH}$, unreactive ($\\times$).\n- **(v)** Cycloprop-2-en-1-ol: losing $\\text{OH}^-$ forms aromatic $2\\pi$-electron cyclopropenyl cation ($\\checkmark$).\n- **(vi)** Cyclohepta-2,4,6-trien-1-ol: forms aromatic $6\\pi$-electron tropylium cation ($\\checkmark$).\n- **(vii)** *tert*-Butyl alcohol: $3^\\circ$ alcohol forms stable $3^\\circ$-butyl carbocation ($\\checkmark$).\nTotal $= 4$ compounds: (ii), (v), (vi), and (vii).",
      "explanation": "Compounds (ii), (v), (vi), and (vii) form unusually stable/aromatic/$3^\\circ$ carbocations $\\implies 4$."
    },
    {
      "id": 49,
      "subject": "Chemistry",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "If the no. of hydroxyl group(s) in major '$Q$' is '$n$' and the no. of methane gas(es) released after reacting '$Q$' with $\\text{CH}_3\\text{MgBr}$ is '$m$'. Then calculate '$m + n$'.",
      "images": [
        "/images/ptm04/q49.png"
      ],
      "answer": "8",
      "hasKey": true,
      "solution": "1. Acid-catalyzed dehydration ($\\text{H}^+/\\Delta$) removes $-\\text{OH}$, triggers a $1,2$-methyl shift from the quaternary $-\\text{C(CH}_3)_2-$ center to form a $3^\\circ$ carbocation, and eliminates $\\text{H}^+$ to produce a bicyclic diene $P$ possessing **2 double bonds** (one existing $\\text{C=C}$ in the right ring + one newly generated $\\text{C=C}$ in the left ring).\n2. Excess cold aqueous dilute $\\text{KMnO}_4$ ($0^\\circ\\text{C}$, Baeyer's reagent) *syn*-dihydroxylates **both** $\\text{C=C}$ double bonds to give tetra-ol $Q$, containing $n = 2 \\times 2 = 4$ hydroxyl ($-\\text{OH}$) groups.\n3. Reaction of $Q$ with excess $\\text{CH}_3\\text{MgBr}$ releases 1 mole of $\\text{CH}_4$ per acidic $-\\text{OH}$ proton, so $m = 4$.\n$$m + n = 4 + 4 = 8$$.",
      "explanation": "Dehydration forms diene $P$ (2 double bonds); excess cold $\\text{KMnO}_4$ creates $n=4$ $-\\text{OH}$ groups $\\implies m=4$ $\\text{CH}_4 \\implies m+n=8$."
    },
    {
      "id": 50,
      "subject": "Chemistry",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "How many of the following tests/reactions will give a positive observation (e.g., color change, precipitate, turbidity or effervescence) with *ortho*-cresol?\n1. Neutral $\\text{FeCl}_3$ test\n2. Libermann's nitroso solution\n3. Lucas test at room temperature within 5 minutes\n4. Sodium bicarbonate test\n5. Sodium metal test",
      "answer": "3",
      "hasKey": true,
      "solution": "Evaluating *ortho*-cresol ($2$-methylphenol, which has a phenolic $-\\text{OH}$ and a **free *para* position** at C4):\n1. **Neutral $\\text{FeCl}_3$ test:** Positive (violet/green phenolic complex).\n2. **Liebermann's nitroso solution:** Positive (free *para* position undergoes nitrosation $\\to$ indophenol color change).\n3. **Lucas test:** Negative (aryl $sp^2$ $\\text{C–OH}$ does not react).\n4. **$\\text{NaHCO}_3$ test:** Negative ($o$-cresol is weaker than $\\text{H}_2\\text{CO}_3$, no $\\text{CO}_2$).\n5. **Sodium metal test:** Positive (evolves $\\text{H}_2$ gas effervescence).\nTotal positive observations $= 3$ (tests 1, 2, and 5).",
      "explanation": "Neutral $\\text{FeCl}_3$, Liebermann's nitroso (free para site), and Na metal tests are positive $\\implies 3$."
    },
    {
      "id": 51,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A question paper is split into two parts, Part A and Part B. Part A contains $5$ questions and Part B has $4$ questions. Each question in Part A has an alternative. A student has to attempt at least one question from each part. Find the number of ways in which the student can attempt the question paper.",
      "options": [
        {
          "id": "A",
          "text": "$3063$"
        },
        {
          "id": "B",
          "text": "$3530$"
        },
        {
          "id": "C",
          "text": "$3360$"
        },
        {
          "id": "D",
          "text": "$3630$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "- For each of the 5 questions in Part A (each having an alternative), the student has 3 options: attempt main question, attempt alternative, or skip both. Requiring at least one attempted from Part A gives $3^5 - 1 = 243 - 1 = 242$ ways.\n- For each of the 4 questions in Part B, there are 2 options (attempt or skip). Requiring at least one attempted gives $2^4 - 1 = 16 - 1 = 15$ ways.\nTotal ways $= 242 \\times 15 = 3630$.",
      "explanation": "$(3^5 - 1)(2^4 - 1) = 242 \\times 15 = 3630$."
    },
    {
      "id": 52,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "How many four letter words can be formed by using the letters of the word 'INEFFECTIVE'?",
      "options": [
        {
          "id": "A",
          "text": "$1242$"
        },
        {
          "id": "B",
          "text": "$1224$"
        },
        {
          "id": "C",
          "text": "$1422$"
        },
        {
          "id": "D",
          "text": "$1442$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "Letter frequencies in 'INEFFECTIVE' (11 letters, 7 distinct: E, F, I, N, C, T, V): 'E:3, F:2, I:2, N:1, C:1, T:1, V:1'.\n1. **All 4 distinct:** $\\binom{7}{4} \\times 4! = 35 \\times 24 = 840$.\n2. **2 alike, 2 distinct:** $\\binom{3}{1}\\binom{6}{2}\\frac{4!}{2!} = 3 \\times 15 \\times 12 = 540$.\n3. **2 alike, 2 alike:** $\\binom{3}{2}\\frac{4!}{2!2!} = 3 \\times 6 = 18$.\n4. **3 alike, 1 distinct:** $\\binom{1}{1}\\binom{6}{1}\\frac{4!}{3!} = 1 \\times 6 \\times 4 = 24$.\nTotal $= 840 + 540 + 18 + 24 = 1422$.",
      "explanation": "$840 + 540 + 18 + 24 = 1422$ four-letter words."
    },
    {
      "id": 53,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "How many $7$-digit numbers can be formed using digits $3$ and $5$ only, using both digits at least once, such that no two $3$'s are consecutive?",
      "options": [
        {
          "id": "A",
          "text": "$26$"
        },
        {
          "id": "B",
          "text": "$33$"
        },
        {
          "id": "C",
          "text": "$32$"
        },
        {
          "id": "D",
          "text": "$53$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Let $k$ be the number of $3$'s used ($1 \\le k \\le 4$, since $k=0$ uses only $5$'s and $k \\ge 5$ forces adjacent $3$'s):\n- $k=1$ (six $5$'s, 7 gaps): $\\binom{7}{1} = 7$.\n- $k=2$ (five $5$'s, 6 gaps): $\\binom{6}{2} = 15$.\n- $k=3$ (four $5$'s, 5 gaps): $\\binom{5}{3} = 10$.\n- $k=4$ (three $5$'s, 4 gaps): $\\binom{4}{4} = 1$.\nTotal $= 7 + 15 + 10 + 1 = 33$.",
      "explanation": "By gap method for $k=1,2,3,4$: $\\binom{7}{1}+\\binom{6}{2}+\\binom{5}{3}+\\binom{4}{4} = 33$."
    },
    {
      "id": 54,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of six digit numbers which contain exactly three different digits is $N$, then sum of digits of $N$ is ____.",
      "options": [
        {
          "id": "A",
          "text": "$20$"
        },
        {
          "id": "B",
          "text": "$18$"
        },
        {
          "id": "C",
          "text": "$16$"
        },
        {
          "id": "D",
          "text": "$22$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "1. **Case 1 (All 3 digits nonzero):** $\\binom{9}{3} = 84$ triples. Number of 6-digit strings using all 3 digits $= 3^6 - 3(2^6) + 3(1^6) = 729 - 192 + 3 = 540$. Contribution $= 84 \\times 540 = 45360$.\n2. **Case 2 (Includes digit '0' + 2 nonzero digits):** $\\binom{9}{2} = 36$ choices. First digit has 2 nonzero choices; remaining 5 places from the 3 digits must contain at least one '0' and the other nonzero digit: $2(3^5 - 2^5 - 2^5 + 1^5) = 2(243 - 64 + 1) = 360$. Contribution $= 36 \\times 360 = 12960$.\nTotal $N = 45360 + 12960 = 58320$.\nSum of digits of $N = 5 + 8 + 3 + 2 + 0 = 18$.",
      "explanation": "$N = \\binom{9}{3}\\cdot 540 + \\binom{9}{2}\\cdot 360 = 58320 \\implies \\text{digit sum} = 18$."
    },
    {
      "id": 55,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A swimming team has eight members, only two of which are boys. The coach wants to take a delegation from the team to a special swimming camp. If the delegation must have either five or six members, and must include atleast one boy, then the number of ways to select the delegation, is",
      "options": [
        {
          "id": "A",
          "text": "$66$"
        },
        {
          "id": "B",
          "text": "$77$"
        },
        {
          "id": "C",
          "text": "$88$"
        },
        {
          "id": "D",
          "text": "$99$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Team consists of 2 boys and 6 girls.\n- Delegation of 5 with at least 1 boy: $\\binom{8}{5} - \\binom{6}{5} = 56 - 6 = 50$.\n- Delegation of 6 with at least 1 boy: $\\binom{8}{6} - \\binom{6}{6} = 28 - 1 = 27$.\nTotal ways $= 50 + 27 = 77$.",
      "explanation": "$\\left(\\binom{8}{5}-\\binom{6}{5}\\right) + \\left(\\binom{8}{6}-\\binom{6}{6}\\right) = 50 + 27 = 77$."
    },
    {
      "id": 56,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "All words, with or without meaning, are made using all the letters of the word 'MONDAY'. These words are written as in a dictionary with serial numbers. The serial number of the word 'MONDAY' is",
      "options": [
        {
          "id": "A",
          "text": "$327$"
        },
        {
          "id": "B",
          "text": "$326$"
        },
        {
          "id": "C",
          "text": "$328$"
        },
        {
          "id": "D",
          "text": "$324$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Alphabetical order of letters: 'A, D, M, N, O, Y'.\n- Words before 'M': $2 \\times 5! = 240$.\n- Words starting 'MA, MD, MN': $3 \\times 4! = 72$ (running sum $312$).\n- Words starting 'MOA, MOD': $2 \\times 3! = 12$ (running sum $324$).\n- Words starting 'MONA': $1 \\times 2! = 2$ (running sum $326$).\n- Next alphabetical word is 'MONDAY' itself $\\implies 326 + 1 = 327$.",
      "explanation": "Dictionary count before 'MONDAY' is $240+72+12+2 = 326 \\implies \\text{rank} = 327$."
    },
    {
      "id": 57,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The total number of $4$-digit numbers whose greatest common divisor with $54$ is $2$, is",
      "options": [
        {
          "id": "A",
          "text": "$4500$"
        },
        {
          "id": "B",
          "text": "$6000$"
        },
        {
          "id": "C",
          "text": "$3000$"
        },
        {
          "id": "D",
          "text": "$1500$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "Since $54 = 2 \\times 3^3$, $\\gcd(x, 54) = 2$ holds if and only if $x$ is divisible by $2$ and **not** divisible by $3$ (i.e., $x \\equiv 2$ or $4 \\pmod 6$).\nOut of all $9000$ four-digit numbers ($1000$ to $9999$), exactly $\\frac{2}{6} = \\frac{1}{3}$ satisfy this condition:\n$$9000 \\times \\frac{1}{3} = 3000$$.",
      "explanation": "Out of $9000$ four-digit numbers, $2$ out of every $6$ satisfy $2\\mid x, 3\\nmid x \\implies 3000$."
    },
    {
      "id": 58,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of onto functions which are non decreasing from $A = \\{1,2,3,4,5\\}$ to $B = \\{7,8,9\\}$ is ____.",
      "options": [
        {
          "id": "A",
          "text": "$6$"
        },
        {
          "id": "B",
          "text": "$8$"
        },
        {
          "id": "C",
          "text": "$9$"
        },
        {
          "id": "D",
          "text": "$10$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Any non-decreasing onto function $f: \\{1,2,3,4,5\\} \\to \\{7,8,9\\}$ is uniquely determined by the positive preimage sizes $n_7 + n_8 + n_9 = 5$ with $n_i \\ge 1$.\nNumber of positive integer solutions $= \\binom{5-1}{3-1} = \\binom{4}{2} = 6$.",
      "explanation": "Positive preimage counts $n_7 + n_8 + n_9 = 5$ give $\\binom{4}{2} = 6$ non-decreasing onto functions."
    },
    {
      "id": 59,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of ways two Americans, two British, one Chinese, one Dutch and one Indian can sit on a round table so that persons of the same nationality are separated:",
      "options": [
        {
          "id": "A",
          "text": "$344$"
        },
        {
          "id": "B",
          "text": "$246$"
        },
        {
          "id": "C",
          "text": "$336$"
        },
        {
          "id": "D",
          "text": "$384$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "Using Inclusion–Exclusion on circular arrangements of 7 distinct people:\n- Total circular arrangements: $(7-1)! = 6! = 720$.\n- Either Americans together or British together: $5! \\times 2! + 5! \\times 2! = 240 + 240 = 480$.\n- Both pairs together: $4! \\times 2! \\times 2! = 96$.\nValid arrangements $= 720 - 480 + 96 = 336$.",
      "explanation": "By Inclusion–Exclusion: $6! - 2(5!2!) + 4!2!2! = 720 - 480 + 96 = 336$."
    },
    {
      "id": 60,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Let $N$ be the number of $7\\text{-digit}$ numbers the sum of whose digits is even. The number of positive divisors of $N$ is:",
      "options": [
        {
          "id": "A",
          "text": "$64$"
        },
        {
          "id": "B",
          "text": "$72$"
        },
        {
          "id": "C",
          "text": "$88$"
        },
        {
          "id": "D",
          "text": "$126$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "solution": "The first 6 digits can be chosen in $9 \\times 10^5$ ways; regardless of the parity of their sum, there are always 5 choices for the 7th digit to make the total sum even.\nThus $N = 9 \\times 10^5 \\times 5 = 45 \\times 10^5 = 2^5 \\cdot 3^2 \\cdot 5^6$.\nNumber of positive divisors $= (5+1)(2+1)(6+1) = 6 \\times 3 \\times 7 = 126$.",
      "explanation": "$N = 45 \\times 10^5 = 2^5 \\cdot 3^2 \\cdot 5^6 \\implies (6)(3)(7) = 126$ divisors."
    },
    {
      "id": 61,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Using the elements $-3, -2, -1, 0, 1, 2, 3$ (Trace: sum of diagonal elements):",
      "options": [
        {
          "id": "A",
          "text": "The number of $3 \\times 3$ matrices having trace $0$ is $37(7^6)$"
        },
        {
          "id": "B",
          "text": "The number of $3 \\times 3$ matrices is $7^6$"
        },
        {
          "id": "C",
          "text": "The number of $3 \\times 3$ skew symmetric matrices is $7^6$"
        },
        {
          "id": "D",
          "text": "The number of $3 \\times 3$ symmetric matrices is $7^3$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "There are 7 allowed values $\\{-3,-2,-1,0,1,2,3\\}$.\nFor trace $a_{11} + a_{22} + a_{33} = 0$, shift $x_i = a_{ii} + 3 \\in \\{0..6\\}$ so $x_1 + x_2 + x_3 = 9$.\nNumber of solutions $= \\binom{9+2}{2} - 3\\binom{2+2}{2} = 55 - 18 = 37$.\nThe remaining 6 off-diagonal entries have $7^6$ choices, giving $37(7^6)$ matrices. Hence (A) is true.",
      "explanation": "Diagonal sum $0$ has 37 solutions and 6 off-diagonal entries have $7^6$ choices $\\implies 37(7^6)$."
    },
    {
      "id": 62,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "If $\\alpha = x_1 x_2 x_3$ and $\\beta = y_1 y_2 y_3$ be two three digit numbers, the number of pairs $\\alpha$ and $\\beta$ that can be formed so that $\\alpha$ can be subtracted from $\\beta$ without borrowing is $3^p 5^q 11^r$, then the value of $p+q+r$ is:",
      "options": [
        {
          "id": "A",
          "text": "$7$"
        },
        {
          "id": "B",
          "text": "$8$"
        },
        {
          "id": "C",
          "text": "$6$"
        },
        {
          "id": "D",
          "text": "$9$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Subtraction without borrowing requires $1 \\le x_1 \\le y_1 \\le 9$, $0 \\le x_2 \\le y_2 \\le 9$, and $0 \\le x_3 \\le y_3 \\le 9$.\n- Hundred's place pairs: $\\binom{9+1}{2} = \\binom{10}{2} = 45$.\n- Ten's & Unit's place pairs: $\\binom{10+1}{2} = \\binom{11}{2} = 55$ each.\nTotal pairs $= 45 \\times 55 \\times 55 = (3^2 \\cdot 5)(5 \\cdot 11)(5 \\cdot 11) = 3^2 \\cdot 5^3 \\cdot 11^2$.\nHence $p + q + r = 2 + 3 + 2 = 7$.",
      "explanation": "$45 \\times 55^2 = 3^2 5^3 11^2 \\implies p+q+r = 7$."
    },
    {
      "id": 63,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of function $f : \\{1,2,3,4,5\\} \\to \\{1,2,3,4\\}$ such that $f(1) = 1$ or $f(2) = 1$ are:",
      "options": [
        {
          "id": "A",
          "text": "$448$"
        },
        {
          "id": "B",
          "text": "$548$"
        },
        {
          "id": "C",
          "text": "$600$"
        },
        {
          "id": "D",
          "text": "$601$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "Total $= n(f(1)=1) + n(f(2)=1) - n(f(1)=1\\text{ and }f(2)=1) = 4^4 + 4^4 - 4^3 = 256 + 256 - 64 = 448$.",
      "explanation": "$4^4 + 4^4 - 4^3 = 448$."
    },
    {
      "id": 64,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A seven digit number without repetition and divisible by $9$ is to be formed by using $7$ digits out of $1, 2, 3, 4, 5, 6, 7, 8, 9$. The number of ways in which this can be done is:",
      "options": [
        {
          "id": "A",
          "text": "$9!$"
        },
        {
          "id": "B",
          "text": "$2(7!)$"
        },
        {
          "id": "C",
          "text": "$4(7!)$"
        },
        {
          "id": "D",
          "text": "$7!$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "Sum of digits $1$ to $9$ is $45$ (multiple of $9$). Removing 2 digits leaving a sum divisible by 9 requires the omitted pair sum to be $9$: $\\{(1,8), (2,7), (3,6), (4,5)\\}$, giving 4 valid 7-digit subsets.\nArranging each 7-digit subset gives $4 \\times 7!$.",
      "explanation": "4 valid subsets (omitting pairs summing to 9), each arranged in $7!$ ways $\\implies 4(7!)$."
    },
    {
      "id": 65,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Suppose that $20$ pillars of the same height have been erected along the boundary of a circular stadium. If the top of each pillar has been connected by beams with the top of all its non-adjacent pillars, then the total number of beams is:",
      "options": [
        {
          "id": "A",
          "text": "$180$"
        },
        {
          "id": "B",
          "text": "$210$"
        },
        {
          "id": "C",
          "text": "$170$"
        },
        {
          "id": "D",
          "text": "$190$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "Number of diagonals of a 20-sided polygon $= \\binom{20}{2} - 20 = 190 - 20 = 170$.",
      "explanation": "$\\binom{20}{2} - 20 = 170$."
    },
    {
      "id": 66,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The maximum value of $n$, for which $33!$ is divisible by $2^n$ is ($n \\in \\mathbb{N}$):",
      "options": [
        {
          "id": "A",
          "text": "$30$"
        },
        {
          "id": "B",
          "text": "$32$"
        },
        {
          "id": "C",
          "text": "$31$"
        },
        {
          "id": "D",
          "text": "$33$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "solution": "By Legendre's formula:\n$$n = \\left\\lfloor\\frac{33}{2}\\right\\rfloor + \\left\\lfloor\\frac{33}{4}\\right\\rfloor + \\left\\lfloor\\frac{33}{8}\\right\\rfloor + \\left\\lfloor\\frac{33}{16}\\right\\rfloor + \\left\\lfloor\\frac{33}{32}\\right\\rfloor = 16 + 8 + 4 + 2 + 1 = 31$$.",
      "explanation": "$v_2(33!) = 16+8+4+2+1 = 31$."
    },
    {
      "id": 67,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "All possible numbers are formed using the digits $1, 1, 2, 2, 2, 2, 3, 4, 4$ taken all at a time. The number of such numbers in which the odd digits occupy even places is:",
      "options": [
        {
          "id": "A",
          "text": "$180$"
        },
        {
          "id": "B",
          "text": "$175$"
        },
        {
          "id": "C",
          "text": "$160$"
        },
        {
          "id": "D",
          "text": "$162$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "There are 9 positions, of which 4 are even places ($2, 4, 6, 8$). The 3 odd digits ($1, 1, 3$) choose 3 of these 4 places and permute in $\\binom{4}{3} \\cdot \\frac{3!}{2!} = 4 \\times 3 = 12$ ways.\nThe remaining 6 even digits ($2, 2, 2, 2, 4, 4$) occupy the remaining 6 positions in $\\frac{6!}{4!\\,2!} = 15$ ways.\nTotal $= 12 \\times 15 = 180$.",
      "explanation": "$\\left(\\binom{4}{3}\\frac{3!}{2!}\\right)\\left(\\frac{6!}{4!2!}\\right) = 12 \\times 15 = 180$."
    },
    {
      "id": 68,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "A man $X$ has $7$ friends, $4$ of them are ladies and $3$ are men; his wife $Y$ also has $7$ friends, $3$ of them are ladies and $4$ are men. Assume $X$ and $Y$ have no common friends. Then the total number of ways in which $X$ and $Y$ together can throw a party inviting $3$ ladies and $3$ men, so that $3$ friends of each of $X$ and $Y$ are in this party is:",
      "options": [
        {
          "id": "A",
          "text": "$484$"
        },
        {
          "id": "B",
          "text": "$485$"
        },
        {
          "id": "C",
          "text": "$468$"
        },
        {
          "id": "D",
          "text": "$469$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "If $X$ invites $k$ ladies and $(3-k)$ men ($0 \\le k \\le 3$), then $Y$ must invite $(3-k)$ ladies and $k$ men:\n$$\\sum_{k=0}^{3} \\binom{4}{k}\\binom{3}{3-k}\\binom{3}{3-k}\\binom{4}{k} = (1 \\cdot 1)^2 + (4 \\cdot 3)^2 + (6 \\cdot 3)^2 + (4 \\cdot 1)^2 = 1 + 144 + 324 + 16 = 485$$.",
      "explanation": "$1^2 + 12^2 + 18^2 + 4^2 = 485$."
    },
    {
      "id": 69,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Points $A_1, A_2, A_3, A_4, A_5$ lie on $L_1$. Points $B_1, B_2, B_3, B_4, B_5$ lie on $L_2$, and $L_1$ is parallel to $L_2$. If these points are joined and lines are formed, the maximum numbers of points of intersection that will lie between the lines is:",
      "options": [
        {
          "id": "A",
          "text": "$80$"
        },
        {
          "id": "B",
          "text": "$100$"
        },
        {
          "id": "C",
          "text": "$120$"
        },
        {
          "id": "D",
          "text": "$240$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "solution": "Every pair of points selected on $L_1$ ($\\binom{5}{2} = 10$ pairs) together with every pair of points selected on $L_2$ ($\\binom{5}{2} = 10$ pairs) defines two crossing segments meeting at a unique point strictly between parallel lines $L_1$ and $L_2$:\n$$\\binom{5}{2} \\times \\binom{5}{2} = 10 \\times 10 = 100$$.",
      "explanation": "Choosing 2 points on $L_1$ and 2 on $L_2$ gives $\\binom{5}{2}\\binom{5}{2} = 100$ interior intersections."
    },
    {
      "id": 70,
      "subject": "Mathematics",
      "section": "Section A: Single Correct (20 Qs)",
      "type": "single_correct",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Let $X = \\left\\{(x, y) \\in \\mathbb{Z} \\times \\mathbb{Z} : \\dfrac{x^2}{8} + \\dfrac{y^2}{20} < 1 \\text{ and } y^2 < 5x\\right\\}$ and three distinct points $P, Q$ and $R$ are randomly chosen from $X$. Then the total no. of triangle $PQR$ whose area is a positive integer, is:",
      "options": [
        {
          "id": "A",
          "text": "$73$"
        },
        {
          "id": "B",
          "text": "$51$"
        },
        {
          "id": "C",
          "text": "$67$"
        },
        {
          "id": "D",
          "text": "$69$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "solution": "1. From $y^2 < 5x$ ($x > 0$) and $x^2 < 8$, only $x = 1, 2$ are possible:\n   - $x=1$: $y^2 < 5 \\implies y \\in \\{-2,-1,0,1,2\\}$ (5 points).\n   - $x=2$: $y^2 < 10 \\implies y \\in \\{-3,-2,-1,0,1,2,3\\}$ (7 points).\n2. Thus $|X| = 12$ points. Area $\\frac{1}{2}|\\vec{PQ} \\times \\vec{PR}|$ is a positive integer iff the $2\\times 2$ determinant is non-zero and **even**. Checking parities across $x=1$ (3 even $y$, 2 odd $y$) and $x=2$ (3 even $y$, 4 odd $y$) and subtracting collinear triples on $x=1$ ($\\binom{5}{3}$) and $x=2$ ($\\binom{7}{3}$) gives **73** non-degenerate integer-area triangles.",
      "explanation": "Enumerating all $\\binom{12}{3}$ triples in $X$ with positive even determinant gives $73$ triangles."
    },
    {
      "id": 71,
      "subject": "Mathematics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of rectangles excluding squares from a rectangle of size $7 \\times 4$ in given diagram (where distance between each consecutive line is $1$ unit):",
      "images": [
        "/images/ptm04/q71.png"
      ],
      "answer": "220",
      "hasKey": true,
      "solution": "For a $7 \\times 4$ grid ($8$ vertical lines, $5$ horizontal lines):\n- Total rectangles $= \\binom{8}{2} \\times \\binom{5}{2} = 28 \\times 10 = 280$.\n- Total squares $= (7 \\times 4) + (6 \\times 3) + (5 \\times 2) + (4 \\times 1) = 28 + 18 + 10 + 4 = 60$.\n- Rectangles excluding squares $= 280 - 60 = 220$.",
      "explanation": "$\\binom{8}{2}\\binom{5}{2} - \\sum_{k=0}^3 (7-k)(4-k) = 280 - 60 = 220$."
    },
    {
      "id": 72,
      "subject": "Mathematics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Find the number of positive integers that are divisors of atleast one of the numbers $10^{10};\\; 15^7;\\; 18^{11}$.",
      "answer": "435",
      "hasKey": true,
      "solution": "Let $A = 10^{10} = 2^{10}5^{10}$, $B = 15^7 = 3^7 5^7$, $C = 18^{11} = 2^{11}3^{22}$:\n- $|D(A)| = 11 \\times 11 = 121$, $|D(B)| = 8 \\times 8 = 64$, $|D(C)| = 12 \\times 23 = 276$.\n- $|D(A)\\cap D(B)| = d(5^7) = 8$; $|D(B)\\cap D(C)| = d(3^7) = 8$; $|D(A)\\cap D(C)| = d(2^{10}) = 11$; $|D(A)\\cap D(B)\\cap D(C)| = d(1) = 1$.\nBy Inclusion–Exclusion:\n$$121 + 64 + 276 - 8 - 8 - 11 + 1 = 435$$.",
      "explanation": "$121 + 64 + 276 - (8 + 8 + 11) + 1 = 435$."
    },
    {
      "id": 73,
      "subject": "Mathematics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "How many ways $12$ letter arrangements of $4\\text{ A's}$, $4\\text{ B's}$ and $4\\text{ C's}$ have no A's in the first $4$ letters, no B's in the next $4$ letters, and no C's in the last $4$ letters?",
      "answer": "346",
      "hasKey": true,
      "solution": "Suppose the first block of 4 positions contains $k$ B's and $(4-k)$ C's ($0 \\le k \\le 4$).\n- Since the middle block cannot contain B's, all remaining $(4-k)$ B's must go into the last block (along with $k$ A's).\n- Since the last block cannot contain C's, all remaining $k$ C's must go into the middle block (along with $4-k$ A's).\nTotal arrangements $= \\sum_{k=0}^{4} \\binom{4}{k}^3 = 1^3 + 4^3 + 6^3 + 4^3 + 1^3 = 1 + 64 + 216 + 64 + 1 = 346$.",
      "explanation": "$\\sum_{k=0}^{4}\\binom{4}{k}^3 = 346$."
    },
    {
      "id": 74,
      "subject": "Mathematics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "The number of $5$-digit natural numbers such that the product of their digits is $54$ is:",
      "answer": "130",
      "hasKey": true,
      "solution": "Since $54 = 2^1 \\cdot 3^3$, the 5 digits must come from $\\{1, 2, 3, 6, 9\\}$:\n- $\\{9, 6, 1, 1, 1\\}$: $\\frac{5!}{3!} = 20$.\n- $\\{9, 3, 2, 1, 1\\}$: $\\frac{5!}{2!} = 60$.\n- $\\{6, 3, 3, 1, 1\\}$: $\\frac{5!}{2!2!} = 30$.\n- $\\{3, 3, 3, 2, 1\\}$: $\\frac{5!}{3!} = 20$.\nTotal $= 20 + 60 + 30 + 20 = 130$.",
      "explanation": "$20 + 60 + 30 + 20 = 130$ five-digit numbers."
    },
    {
      "id": 75,
      "subject": "Mathematics",
      "section": "Section B: Numerical Value (5 Qs)",
      "type": "numerical",
      "marking": {
        "positive": 4,
        "negative": 1
      },
      "question": "Let $A$ be a matrix of order $2 \\times 2$, whose entries are from the set $\\{0,1,2,3,4,5\\}$. If the sum of all the entries of $A$ is a prime number $p$, $2 < p < 8$, then the number of such matrices $A$ is:",
      "answer": "180",
      "hasKey": true,
      "solution": "Prime numbers satisfying $2 < p < 8$ are $p \\in \\{3, 5, 7\\}$. We count $a + b + c + d = p$ with $0 \\le a,b,c,d \\le 5$:\n- **$p = 3$:** $\\binom{3+4-1}{3} = \\binom{6}{3} = 20$.\n- **$p = 5$:** $\\binom{5+4-1}{3} = \\binom{8}{3} = 56$.\n- **$p = 7$:** $\\binom{7+4-1}{3} - 4\\binom{1+4-1}{3} = \\binom{10}{3} - 4\\binom{4}{3} = 120 - 16 = 104$ (excluding entries $\\ge 6$).\nTotal matrices $= 20 + 56 + 104 = 180$.",
      "explanation": "Primes $p\\in\\{3,5,7\\}$ give $20 + 56 + 104 = 180$ matrices."
    }
  ]
};
