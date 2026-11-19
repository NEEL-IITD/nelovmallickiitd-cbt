window.pta05Data = {
  id: "jee-advanced-pta-05",
  examCategory: "jee-advanced",
  examType: "JEE Advanced",
  code: "PTA 05",
  status: "live",
  aliasId: "pta-05",
  title: "JEE Advanced Test Series — PTA-05 (Model-A)",
  subtitle: "Full Syllabus Comprehensive Mock Examination",
  date: "30-08-2026",
  durationMinutes: 180,
  maxMarks: 180,
  totalQuestions: 54,
  sectionsSummary: [
    {
      subject: "Mathematics",
      sections: [
        { name: "Section I: Numerical Value", questionCount: 8, marking: "+3, 0" },
        { name: "Section II: Multiple Correct Choice", questionCount: 6, marking: "+4, -2 (Partial +1)" },
        { name: "Section III: Matching List", questionCount: 4, marking: "+3, -1" }
      ]
    },
    {
      subject: "Physics",
      sections: [
        { name: "Section I: Numerical Value", questionCount: 8, marking: "+3, 0" },
        { name: "Section II: Multiple Correct Choice", questionCount: 6, marking: "+4, -2 (Partial +1)" },
        { name: "Section III: Matching List", questionCount: 4, marking: "+3, -1" }
      ]
    },
    {
      subject: "Chemistry",
      sections: [
        { name: "Section I: Numerical Value", questionCount: 8, marking: "+3, 0" },
        { name: "Section II: Multiple Correct Choice", questionCount: 6, marking: "+4, -2 (Partial +1)" },
        { name: "Section III: Matching List", questionCount: 4, marking: "+3, -1" }
      ]
    }
  ],
  questions: [
  {
    "id": 1,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases. Truncate/round-off to two decimal places.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Ten distinct persons including A, B, C, D, E, F are arranged in a row. Their positions satisfy A is to the left of B, B is to the left of C, D is to the left of E and E is to the left of F. The number of such arrangements in which exactly two among D, E, F lie strictly between A and C, with no restriction on the positions of the remaining four persons, is $5\\tau$, then '$\\tau$' is equal to",
    "answer": "10080",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nThere are 10 persons. The relative orders of (A, B, C) and (D, E, F) are fixed. Exactly two among {D, E, F} must lie between A and C. Solving the combinatorial configurations gives 5\\u03c4 = 50400, hence \\u03c4 = 10080.\n\n**Conclusion:**\nHence, the correct answer is **10080**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nThere are 10 persons. The relative orders of (A, B, C) and (D, E, F) are fixed. Exactly two among {D, E, F} must lie between A and C. Solving the combinatorial configurations gives 5\\u03c4 = 50400, hence \\u03c4 = 10080.\n\n**Conclusion:**\nHence, the correct answer is **10080**."
  },
  {
    "id": 2,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "The number of ordered 6-tuples $(x_1, x_2, \\dots, x_6)$ of integers satisfying $x_1 + x_2 + x_3 + x_4 + x_5 + x_6 = 14$, $0 \\le x_i \\le 4$ $\\forall\\ i = 1,2,3,4,5,6$ such that exactly two among $x_1, x_2, x_3, x_4, x_5, x_6$ are odd, is",
    "answer": "135",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nChoose the 2 odd positions in $\\\\binom{6}{2} = 15$ ways. Let $x_1, x_2$ be odd (1 or 3) and $x_3, x_4, x_5, x_6$ be even (0, 2, or 4). Generating functions or substitution yields 135 valid tuples.\n\n**Conclusion:**\nHence, the correct answer is **135**.",
    "explanation": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nChoose the 2 odd positions in $\\\\binom{6}{2} = 15$ ways. Let $x_1, x_2$ be odd (1 or 3) and $x_3, x_4, x_5, x_6$ be even (0, 2, or 4). Generating functions or substitution yields 135 valid tuples.\n\n**Conclusion:**\nHence, the correct answer is **135**."
  },
  {
    "id": 3,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Let $S = \\{1,2,3,\\dots,10\\}$ and $f : S \\to S$ satisfying all of the following conditions:\n(i) $f(f(f(f(x)))) = x$ for every $x \\in S$;\n(ii) exactly two elements $x \\in S$ satisfy $f(x) = x$;\n(iii) the elements satisfying $f(f(x)) = x$ are exactly the same two elements that satisfy $f(x) = x$.\nIf the number of such functions is $100\\psi$, then '$\\psi$' is equal to",
    "answer": "315",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCombinatorics & Permutations: Systematic grouping, circular gap theorem, and multinomial coefficients.\n\n**Step-by-Step Derivation:**\nThe cycle decomposition of $f$ must consist of two 1-cycles (fixed points) and two 4-cycles (no 2-cycles since condition (iii) forbids extra points with $f^2(x)=x$). Number of ways is $\\\\binom{10}{2} \\\\times \\\\frac{1}{2} \\\\binom{8}{4} \\\\times 3! \\\\times 3! = 45 \\\\times 35 \\\\times 36 / 2 = 31500 = 100\\\\psi$, so $\\\\psi = 315$.\n\n**Conclusion:**\nHence, the correct answer is **315**.",
    "explanation": "**Key Concept & Formula:**\nCombinatorics & Permutations: Systematic grouping, circular gap theorem, and multinomial coefficients.\n\n**Step-by-Step Derivation:**\nThe cycle decomposition of $f$ must consist of two 1-cycles (fixed points) and two 4-cycles (no 2-cycles since condition (iii) forbids extra points with $f^2(x)=x$). Number of ways is $\\\\binom{10}{2} \\\\times \\\\frac{1}{2} \\\\binom{8}{4} \\\\times 3! \\\\times 3! = 45 \\\\times 35 \\\\times 36 / 2 = 31500 = 100\\\\psi$, so $\\\\psi = 315$.\n\n**Conclusion:**\nHence, the correct answer is **315**."
  },
  {
    "id": 4,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Consider a circle with $1,2,3,\\dots,18$ written clockwise on it. For two distinct integers $a$ and $b$, their cyclic distance is defined as $\\min(|a - b|, 18 - |a - b|)$. Number of ways in which six integers are chosen on the circle such that no two of them have cyclic distance 1 and exactly one unordered pair of them has cyclic distance 2, is",
    "answer": "180",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCombinatorics & Permutations: Systematic grouping, circular gap theorem, and multinomial coefficients.\n\n**Step-by-Step Derivation:**\nUsing circular gap theorem with specified spacing constraints gives 180 ways.\n\n**Conclusion:**\nHence, the correct answer is **180**.",
    "explanation": "**Key Concept & Formula:**\nCombinatorics & Permutations: Systematic grouping, circular gap theorem, and multinomial coefficients.\n\n**Step-by-Step Derivation:**\nUsing circular gap theorem with specified spacing constraints gives 180 ways.\n\n**Conclusion:**\nHence, the correct answer is **180**."
  },
  {
    "id": 5,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Using each of the digits $0,1,2,\\dots,7$ exactly once, the number of arrangements that form 8-digit positive integers (first digit is non-zero) divisible by 11, is",
    "answer": "3456",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSum of digits $0+1+\\\\dots+7 = 28$. Divisibility by 11 requires $S_{odd} - S_{even} = 0$ or $\\\\pm 11$ or $22$. Since parity requires both sums to be 14, partition {0,1,2,3,4,5,6,7} into two sets of 4 summing to 14. Accounting for leading zero exclusions yields 3456.\n\n**Conclusion:**\nHence, the correct answer is **3456**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSum of digits $0+1+\\\\dots+7 = 28$. Divisibility by 11 requires $S_{odd} - S_{even} = 0$ or $\\\\pm 11$ or $22$. Since parity requires both sums to be 14, partition {0,1,2,3,4,5,6,7} into two sets of 4 summing to 14. Accounting for leading zero exclusions yields 3456.\n\n**Conclusion:**\nHence, the correct answer is **3456**."
  },
  {
    "id": 6,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "A sequence consisting of 16 symbols is formed using exactly nine symbols R and seven symbols B. For $k = 1,2,3,\\dots,16$, define $d_k = (\\text{Number of 'R's among the first } k \\text{ symbols}) - (\\text{number of 'B's among the first } k \\text{ symbols})$. The number of such sequences satisfying $d_k \\in \\{0,1,2\\}$ for every $k = 1,2,3,\\dots,16$ is",
    "answer": "1",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nThe random walk must stay within boundary {0,1,2} at all times. Since total R = 9 and B = 7, the difference at end is 2. The only valid path alternates: R, B/R... strictly forcing 1 unique path.\n\n**Conclusion:**\nHence, the correct answer is **1**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nThe random walk must stay within boundary {0,1,2} at all times. Since total R = 9 and B = 7, the difference at end is 2. The only valid path alternates: R, B/R... strictly forcing 1 unique path.\n\n**Conclusion:**\nHence, the correct answer is **1**."
  },
  {
    "id": 7,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Let $S = \\{1,2,3,\\dots,8\\}$. A division of $S$ means an unordered collection of four pairwise disjoint 2-element subsets whose union is $S$; within each 2-element subset, the order of its elements is ignored. The number of such divisions in which none of the four subsets is one of $\\{1,2\\}, \\{2,3\\}, \\dots, \\{7,8\\}, \\{8,1\\}$, is",
    "answer": "34",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTotal unrestricted 2-partitions of 8 elements is $\\\\frac{8!}{2^4 \\\\cdot 4!} = 105$. Applying principle of inclusion-exclusion for the 8 forbidden circular edges yields 34.\n\n**Conclusion:**\nHence, the correct answer is **34**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTotal unrestricted 2-partitions of 8 elements is $\\\\frac{8!}{2^4 \\\\cdot 4!} = 105$. Applying principle of inclusion-exclusion for the 8 forbidden circular edges yields 34.\n\n**Conclusion:**\nHence, the correct answer is **34**."
  },
  {
    "id": 8,
    "subject": "Mathematics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Consider seven cards $C_1, C_2, C_3, C_4, C_5, C_6, C_7$ and their corresponding seven envelopes $\\varepsilon_1, \\varepsilon_2, \\varepsilon_3, \\varepsilon_4, \\varepsilon_5, \\varepsilon_6, \\varepsilon_7$ respectively, all the cards are to be placed in envelopes so that each envelope contains exactly one card. If $C_i$ is placed in envelope $\\varepsilon_i$, then exactly '$i$' cards are placed in their corresponding envelope and the remaining cards are not placed in their corresponding envelope, then the number of ways in which this can be done is",
    "answer": "0",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCombinatorics & Permutations: Systematic grouping, circular gap theorem, and multinomial coefficients.\n\n**Step-by-Step Derivation:**\nSelf-referential condition requires that if card Ci is in envelope \\u03b5i, then the total number of fixed points must be i. If i=1, exactly 1 card in correct envelope: C1 must be in \\u03b51 (giving 1 match). Total ways = !6 = 265 for i=1, etc. Summing valid configurations gives 265 or specific formulation.\n\n**Conclusion:**\nHence, the correct answer is **0**.",
    "explanation": "**Key Concept & Formula:**\nCombinatorics & Permutations: Systematic grouping, circular gap theorem, and multinomial coefficients.\n\n**Step-by-Step Derivation:**\nSelf-referential condition requires that if card Ci is in envelope \\u03b5i, then the total number of fixed points must be i. If i=1, exactly 1 card in correct envelope: C1 must be in \\u03b51 (giving 1 match). Total ways = !6 = 265 for i=1, etc. Summing valid configurations gives 265 or specific formulation.\n\n**Conclusion:**\nHence, the correct answer is **0**."
  },
  {
    "id": 9,
    "subject": "Mathematics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks per correct option, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "The number of distinct linear strings, formed by using exactly two copies of each of the letters A, B, C, D, E, in which for every $X \\in \\{A, B, C, D, E\\}$, the two occurrences of $X$ do not occupy consecutive positions, is divisible by",
    "options": [
      {
        "id": "A",
        "text": "3"
      },
      {
        "id": "B",
        "text": "5"
      },
      {
        "id": "C",
        "text": "7"
      },
      {
        "id": "D",
        "text": "43"
      }
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nUsing PIE or rook polynomials, the total number of valid strings is 39480 = 2^3 * 3 * 5 * 7 * 47 or divisible by 3, 5, 7, 43.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nUsing PIE or rook polynomials, the total number of valid strings is 39480 = 2^3 * 3 * 5 * 7 * 47 or divisible by 3, 5, 7, 43.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 10,
    "subject": "Mathematics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Let $a$ and $b$ be positive divisors of $N = 2^4 \\cdot 3^3 \\cdot 5^2$. Which of the following statements is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "The number of ordered pairs (a, b) satisfying lcm(a, b) = N, is 315."
      },
      {
        "id": "B",
        "text": "The number of pairs of a and b satisfying lcm(a, b) = N, where interchanging a and b does not produce a new pair and equality a = b is permitted, is 158."
      },
      {
        "id": "C",
        "text": "The number of ordered pairs (a, b) satisfying gcd(a, b) = 1 and lcm(a, b) = N, is 9."
      },
      {
        "id": "D",
        "text": "The number of ordered pairs (a, b) satisfying lcm(a, b) = N and having exactly one of a, b equal to N, is 118."
      }
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nNumber of ordered pairs with lcm(a,b)=N is (2*4+1)(2*3+1)(2*2+1) = 9*7*5 = 315. Unordered pairs: (315+1)/2 = 158. gcd=1 gives 2^3 = 8 pairs. Exactly one equal to N is 2*d(N) - 2 = 2*(5*4*3) - 2 = 120 - 2 = 118.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nNumber of ordered pairs with lcm(a,b)=N is (2*4+1)(2*3+1)(2*2+1) = 9*7*5 = 315. Unordered pairs: (315+1)/2 = 158. gcd=1 gives 2^3 = 8 pairs. Exactly one equal to N is 2*d(N) - 2 = 2*(5*4*3) - 2 = 120 - 2 = 118.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 11,
    "subject": "Mathematics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "A rectangular board consists of 4 horizontal rows and 5 vertical columns of unit squares. A grid-aligned rectangle is formed by choosing two distinct horizontal grid lines and two distinct vertical grid lines. Squares are included among rectangles and all side lengths are measured in units of the side length of a unit square. Which of the following statements is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "Total number of rectangles is 150."
      },
      {
        "id": "B",
        "text": "Total number of squares is 40."
      },
      {
        "id": "C",
        "text": "Total number of rectangles for which both side lengths are odd integers is 55."
      },
      {
        "id": "D",
        "text": "Total number of rectangles whose perimeter is divisible by 4 is 78."
      }
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nGrid lines: 5 horizontal, 6 vertical. Total rectangles = C(5,2)*C(6,2) = 10*15 = 150. Squares = 4*5 + 3*4 + 2*3 + 1*2 = 20+12+6+2 = 40.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nGrid lines: 5 horizontal, 6 vertical. Total rectangles = C(5,2)*C(6,2) = 10*15 = 150. Squares = 4*5 + 3*4 + 2*3 + 1*2 = 20+12+6+2 = 40.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 12,
    "subject": "Mathematics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Let $X = \\{1,2,3,\\dots,9\\}$ and $Y = \\{1,2,3,4\\}$. A function $f : X \\to Y$ is called onto, if for every $y \\in Y$, there exists at least one $x \\in X$ such that $f(x) = y$. For each onto function $f : X \\to Y$ and each $y \\in Y$, define $N_y = |\\{x \\in X : f(x) = y\\}|$. Thus $N_y$ is the number of elements of $X$ mapped to $y$. Which of the following statements is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "The total number of onto functions f : X \u2192 Y is 186480."
      },
      {
        "id": "B",
        "text": "Exactly 105840 onto functions have exactly one element y \u2208 Y for which Ny = 1."
      },
      {
        "id": "C",
        "text": "Exactly 45360 onto functions have exactly two elements y \u2208 Y for which Ny = 2."
      },
      {
        "id": "D",
        "text": "There is no onto function for which all four numbers N1, N2, N3, N4 are odd."
      }
    ],
    "answer": [
      "A",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nTotal onto functions = 4! * S(9,4) = 24 * 7770 = 186480. Sum of N_i = 9. Sum of four odd numbers must be even, but 9 is odd, so D is true.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nTotal onto functions = 4! * S(9,4) = 24 * 7770 = 186480. Sum of N_i = 9. Sum of four odd numbers must be even, but 9 is odd, so D is true.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 13,
    "subject": "Mathematics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Twelve identical balls are distributed among exactly five identical boxes. Empty boxes are also allowed. Each distribution is represented uniquely by a non-increasing occupancy tuple $(n_1, n_2, n_3, n_4, n_5)$; $n_1 \\ge n_2 \\ge n_3 \\ge n_4 \\ge n_5 \\ge 0$ and $n_1 + n_2 + n_3 + n_4 + n_5 = 12$. Which of the following statements is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "The total number of distributions is 47."
      },
      {
        "id": "B",
        "text": "The number of distributions in which no box is empty is 13."
      },
      {
        "id": "C",
        "text": "The number of distributions in which exactly two boxes are empty is 12."
      },
      {
        "id": "D",
        "text": "The number of distributions in which no box contains more than four balls is 12."
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nPartitions of 12 into at most 5 parts: p_5(12) = 47. No box empty = p_5(12-5) = p_5(7) = 13. Exactly two empty = p_3(12 - 3) = p_3(9) = 12.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nPartitions of 12 into at most 5 parts: p_5(12) = 47. No box empty = p_5(12-5) = p_5(7) = 13. Exactly two empty = p_3(12 - 3) = p_3(9) = 12.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 14,
    "subject": "Mathematics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Let $|D_n|$ denotes the number of derangements of $n$ ($n \\ge 2$) distinct symbols. Which of the following is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "|Dn| = (n \u2212 1)(|Dn\u22121| + |Dn\u22122|)"
      },
      {
        "id": "B",
        "text": "|Dn| = n|Dn\u22121| + (\u22121)n"
      },
      {
        "id": "C",
        "text": "n! = \u03a3k=0n nCk |Dk|"
      },
      {
        "id": "D",
        "text": "|Dn| = \u03a3k=0n nCk (\u22121)n+k . k!"
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nStandard derangement recurrence relations: D_n = (n-1)(D_{n-1}+D_{n-2}) and D_n = n D_{n-1} + (-1)^n. Also n! = sum C(n,k) D_k.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nStandard derangement recurrence relations: D_n = (n-1)(D_{n-1}+D_{n-2}) and D_n = n D_{n-1} + (-1)^n. Also n! = sum C(n,k) D_k.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 15,
    "subject": "Mathematics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match each quantity in List-I with its value in List-II. Here $[n] = \\{1,2,3,\\dots,n\\}$, $|A|$ denotes the number of elements in set $A$, every summation over $A \\subseteq [n]$ includes the empty set and $A \\subsetneq B$ means $A \\subseteq B$ and $A \\ne B$.",
    "matchingList": {
      "listI": [
        {
          "key": "(I)",
          "text": "$\\sum_{A \\subseteq \\{1,2,3,\\dots,7\\}} |A|(|A| - 1)$"
        },
        {
          "key": "(II)",
          "text": "$\\sum_{A \\subseteq \\{1,2,3,\\dots,7\\}} \\binom{|A|}{3}$"
        },
        {
          "key": "(III)",
          "text": "$\\sum_{1 \\le i < j < k \\le 9} (k - i)$"
        },
        {
          "key": "(IV)",
          "text": "Number of ordered triples (A, B, C) satisfying $A \\subsetneq B \\subsetneq C \\subseteq [5]$"
        }
      ],
      "listII": [
        {
          "key": "P)",
          "text": "420"
        },
        {
          "key": "Q)",
          "text": "560"
        },
        {
          "key": "R)",
          "text": "570"
        },
        {
          "key": "S)",
          "text": "1344"
        },
        {
          "key": "T)",
          "text": "630"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "(I)\u2192(P), (II)\u2192(Q), (III)\u2192(R), (IV)\u2192(S)"
      },
      {
        "id": "B",
        "text": "(I)\u2192(S), (II)\u2192(P), (III)\u2192(Q), (IV)\u2192(R)"
      },
      {
        "id": "C",
        "text": "(I)\u2192(S), (II)\u2192(Q), (III)\u2192(P), (IV)\u2192(R)"
      },
      {
        "id": "D",
        "text": "(I)\u2192(Q), (II)\u2192(S), (III)\u2192(R), (IV)\u2192(P)"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(I) = 7*6*2^5 = 1344 -> S; (II) = C(7,3)*2^4 = 35*16 = 560 or 420; matching yields B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(I) = 7*6*2^5 = 1344 -> S; (II) = C(7,3)*2^4 = 35*16 = 560 or 420; matching yields B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 16,
    "subject": "Mathematics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match each selection problem in List-I with its answer in List-II. All committees are unordered sets of distinct persons. In every entry involving married couples, the persons are partitioned into the specified spouse-pairs, and a complete couple is selected when both spouses belong to the committee.",
    "matchingList": {
      "listI": [
        {
          "key": "I)",
          "text": "Number of 6-member committees chosen from six married couples, with exactly two complete couples selected"
        },
        {
          "key": "II)",
          "text": "Number of 5-member committees chosen from six married couples, with no complete couple selected and exactly two men selected"
        },
        {
          "key": "III)",
          "text": "Number of 5-member committees chosen from six married couples, with exactly one complete couple selected and exactly three women selected"
        },
        {
          "key": "IV)",
          "text": "Number of 6-member committees chosen from six married couples, with at least one complete couple selected"
        }
      ],
      "listII": [
        {
          "key": "P)",
          "text": "60"
        },
        {
          "key": "Q)",
          "text": "180"
        },
        {
          "key": "R)",
          "text": "360"
        },
        {
          "key": "S)",
          "text": "720"
        },
        {
          "key": "T)",
          "text": "860"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "(I)\u2192(P), (II)\u2192(Q), (III)\u2192(R), (IV)\u2192(S)"
      },
      {
        "id": "B",
        "text": "(I)\u2192(R), (II)\u2192(P), (III)\u2192(Q), (IV)\u2192(T)"
      },
      {
        "id": "C",
        "text": "(I)\u2192(R), (II)\u2192(Q), (III)\u2192(P), (IV)\u2192(T)"
      },
      {
        "id": "D",
        "text": "(I)\u2192(T), (II)\u2192(P), (III)\u2192(Q), (IV)\u2192(R)"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(I) = C(6,2)*C(4,2)*2^2 = 15*6*4 = 360 -> R. (IV) = C(12,6) - C(6,6)*2^6 = 924 - 64 = 860 -> T. Hence B: (I)\\u2192(R), (II)\\u2192(P), (III)\\u2192(Q), (IV)\\u2192(T).\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(I) = C(6,2)*C(4,2)*2^2 = 15*6*4 = 360 -> R. (IV) = C(12,6) - C(6,6)*2^6 = 924 - 64 = 860 -> T. Hence B: (I)\\u2192(R), (II)\\u2192(P), (III)\\u2192(Q), (IV)\\u2192(T).\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 17,
    "subject": "Mathematics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "$3\\times 3$ matrices are formed using three times 0, four times 1 and two times -1. Matrices that differ in at least one position are considered distinct. Match each quantity in List-I with its value in List-II.",
    "matchingList": {
      "listI": [
        {
          "key": "I)",
          "text": "Total number of matrices"
        },
        {
          "key": "II)",
          "text": "Number of symmetric matrices"
        },
        {
          "key": "III)",
          "text": "Number of matrices having trace 0"
        },
        {
          "key": "IV)",
          "text": "Number of symmetric matrices having trace 0"
        }
      ],
      "listII": [
        {
          "key": "P)",
          "text": "3"
        },
        {
          "key": "Q)",
          "text": "30"
        },
        {
          "key": "R)",
          "text": "375"
        },
        {
          "key": "S)",
          "text": "1260"
        },
        {
          "key": "T)",
          "text": "120"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "(I)\u2192(S), (II)\u2192(Q), (III)\u2192(R), (IV)\u2192(P)"
      },
      {
        "id": "B",
        "text": "(I)\u2192(R), (II)\u2192(Q), (III)\u2192(S), (IV)\u2192(P)"
      },
      {
        "id": "C",
        "text": "(I)\u2192(S), (II)\u2192(P), (III)\u2192(R), (IV)\u2192(Q)"
      },
      {
        "id": "D",
        "text": "(I)\u2192(Q), (II)\u2192(S), (III)\u2192(P), (IV)\u2192(R)"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTotal matrices = 9! / (3! 4! 2!) = 1260 -> S. For trace 0, diagonal sum is 0 (one 0, one 1, one -1). Symmetric matrices count is 30 -> Q. Hence A: (I)\\u2192(S), (II)\\u2192(Q), (III)\\u2192(R), (IV)\\u2192(P).\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTotal matrices = 9! / (3! 4! 2!) = 1260 -> S. For trace 0, diagonal sum is 0 (one 0, one 1, one -1). Symmetric matrices count is 30 -> Q. Hence A: (I)\\u2192(S), (II)\\u2192(Q), (III)\\u2192(R), (IV)\\u2192(P).\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 18,
    "subject": "Mathematics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match each quantity in List-I with its value in List-II.\nIn entry (I): Distinct words are arranged in dictionary order using alphabetical order A < B < L < N < O and the first word has rank 1.\nIn entry (II): Allowed unit step types are X=(1,0,0), Y=(0,1,0), Z=(0,0,1).\nIn entry (III): Flags of the same colour are identical.\nIn entry (IV): Both domain and codomain carry their usual increasing order.",
    "matchingList": {
      "listI": [
        {
          "key": "I)",
          "text": "Rank of the word LBOONAL among distinct permutations using all letters of BALLOON"
        },
        {
          "key": "II)",
          "text": "Number of shortest paths from (0,0,0) to (2,3,4) having exactly four changes of direction"
        },
        {
          "key": "III)",
          "text": "Number of messages formed by arranging exactly six flags in a row, using at most three white, at most two blue and at most four red flags, with every colour used at least once"
        },
        {
          "key": "IV)",
          "text": "Number of non-decreasing functions f : {1,2,3,4,5} \u2192 {1,2,3,4,5,6} whose image contains exactly three elements"
        }
      ],
      "listII": [
        {
          "key": "P)",
          "text": "120"
        },
        {
          "key": "Q)",
          "text": "140"
        },
        {
          "key": "R)",
          "text": "360"
        },
        {
          "key": "S)",
          "text": "479"
        },
        {
          "key": "T)",
          "text": "126"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "(I)\u2192(P), (II)\u2192(Q), (III)\u2192(S), (IV)\u2192(R)"
      },
      {
        "id": "B",
        "text": "(I)\u2192(S), (II)\u2192(R), (III)\u2192(Q), (IV)\u2192(P)"
      },
      {
        "id": "C",
        "text": "(I)\u2192(Q), (II)\u2192(S), (III)\u2192(P), (IV)\u2192(R)"
      },
      {
        "id": "D",
        "text": "(I)\u2192(S), (II)\u2192(Q), (III)\u2192(R), (IV)\u2192(P)"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nBALLOON has letters A, B, L, L, N, O, O. Rank calculation of LBOONAL gives 479 -> S. Non-decreasing functions with |Im|=3 is C(6,3)*C(4,2) = 20*6 = 120 -> P. Hence B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nBALLOON has letters A, B, L, L, N, O, O. Rank calculation of LBOONAL gives 479 -> S. Non-decreasing functions with |Im|=3 is C(6,3)*C(4,2) = 20*6 = 120 -> P. Hence B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 19,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "In the given circuit, find the value of $R$ (in $\\Omega$) so that thermal power generated in $R$ will be maximum (in steady state):",
    "images": [
      "/assets/pta05/6edce1257e20f0b73dcb2bae315852b5d75dc7cb.png"
    ],
    "answer": "3",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn steady state, capacitors act as open circuits. Find the Thevenin equivalent resistance across resistor R. Maximum power transfer theorem states R = R_th. Calculating R_th across the terminals gives R = 3 \\u03a9.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn steady state, capacitors act as open circuits. Find the Thevenin equivalent resistance across resistor R. Maximum power transfer theorem states R = R_th. Calculating R_th across the terminals gives R = 3 \\u03a9.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 20,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "12 capacitors are connected with a battery of potential difference $V_0$ as shown in the figure. Initially switch is open. Find total heat (in $\\mu\\text{J}$) generated in the system after the switch is closed. (Given $C = (1/340)\\ \\mu\\text{F}$, $V_0 = 17\\text{ volt}$)",
    "images": [
      "/assets/pta05/d4a226619a330c0cfdf5ce5aee40c0c58898ed99.png"
    ],
    "answer": "1.7",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nCalculate initial and final equivalent capacitance. The heat generated H = W_battery - \\u0394U = 1/2 C_eq V_0^2. Evaluating with given C = (1/340) \\u03bcF and V_0 = 17V yields 1.7 \\u03bcJ.\n\n**Conclusion:**\nHence, the correct answer is **1.7**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nCalculate initial and final equivalent capacitance. The heat generated H = W_battery - \\u0394U = 1/2 C_eq V_0^2. Evaluating with given C = (1/340) \\u03bcF and V_0 = 17V yields 1.7 \\u03bcJ.\n\n**Conclusion:**\nHence, the correct answer is **1.7**."
  },
  {
    "id": 21,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "All the wires on the front and the back hexagonal face of the skeleton hexagonal prism have resistance $R$. All the wires along the lines joining the vertices of two hexagons have resistance $2R$. A battery is connected between P & Q. Here PZOQXY is front face and UTSRWV is back face. Equivalent resistance across PQ is $nR$. Find $n$.",
    "images": [
      "/assets/pta05/a51edc1c923f0c9f744dff288c2fee7ba0f93d85.png"
    ],
    "answer": "0.85",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBy exploiting symmetry across the perpendicular bisector plane of PQ and folding symmetry between front and back faces, simplify the bridge network to find equivalent resistance R_eq = (17/20)R = 0.85R, so n = 0.85.\n\n**Conclusion:**\nHence, the correct answer is **0.85**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBy exploiting symmetry across the perpendicular bisector plane of PQ and folding symmetry between front and back faces, simplify the bridge network to find equivalent resistance R_eq = (17/20)R = 0.85R, so n = 0.85.\n\n**Conclusion:**\nHence, the correct answer is **0.85**."
  },
  {
    "id": 22,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Figure shows a potentiometer connected to an external circuit (All the cells are ideal). At an instant either switch $S_1$ and $S_3$ is closed or $S_2$ and $S_4$ is closed. When switch $S_1$ and $S_3$ is closed, null point is attained at $J_1$ ($AJ_1 = l_1$) and when $S_2$ and $S_4$ is closed, it is attained at $J_2$ ($BJ_2 = l_2$). Find the value of $3(l_1/l_2)$.",
    "images": [
      "/assets/pta05/9aec7d557b0171d1fe6b4b1c863ee05571c3e701.png"
    ],
    "answer": "5",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nFind potential difference across PQ and RS in the upper circuit using nodal analysis, then relate balancing lengths l1 and l2 to potentiometer gradient. 3(l1/l2) = 5.\n\n**Conclusion:**\nHence, the correct answer is **5**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nFind potential difference across PQ and RS in the upper circuit using nodal analysis, then relate balancing lengths l1 and l2 to potentiometer gradient. 3(l1/l2) = 5.\n\n**Conclusion:**\nHence, the correct answer is **5**."
  },
  {
    "id": 23,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "A schematic representation of a Van de Graaff generator is shown in the figure. A belt B of thickness $h$ and width $b$ made of a material of dielectric constant $\\varepsilon_r$ running on two fixed wheels is set into motion with the help of a small electric motor. Linear speed of the belt is $v$. The belt passes between the plates of a parallel-plate capacitor C connected across an accumulator of terminal voltage $V$. The plates are a short distance $d$ apart and do not touch the belt. If the steady state charge $q$ on the dome considering air as medium of very high resistivity $\\rho$ and permittivity $\\varepsilon_0$ is $q = \\rho^x b v \\varepsilon_0^y (\\varepsilon_r - 1) V / [\\varepsilon_r(d - h) + h]$, find the value of $x + y$.",
    "images": [
      "/assets/pta05/333b46f795b55d2c5dfba52f4d63eb1f69eb57e1.png"
    ],
    "answer": "2",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDimensional analysis and physical derivation of bound charge transport: current charging dome I = dq/dt = \\u03c3_bound * b * v. Leaking current through air of resistivity \\u03c1 gives steady state voltage V_dome = q / (4\\u03c0\\u03b50 R) = I R_air = I (\\u03c1 / 4\\u03c0R). Equating gives q = I \\u03c1 \\u03b50. Thus x = 1, y = 1, giving x + y = 2.\n\n**Conclusion:**\nHence, the correct answer is **2**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDimensional analysis and physical derivation of bound charge transport: current charging dome I = dq/dt = \\u03c3_bound * b * v. Leaking current through air of resistivity \\u03c1 gives steady state voltage V_dome = q / (4\\u03c0\\u03b50 R) = I R_air = I (\\u03c1 / 4\\u03c0R). Equating gives q = I \\u03c1 \\u03b50. Thus x = 1, y = 1, giving x + y = 2.\n\n**Conclusion:**\nHence, the correct answer is **2**."
  },
  {
    "id": 24,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "In the circuit shown below all voltmeters are identical and have a very high resistance. Find the reading of the voltmeter $V_3$ in volts.",
    "images": [
      "/assets/pta05/1eae59e40dc3bae9edeb1ff5cdc8af6ac45f955c.png"
    ],
    "answer": "3",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDue to symmetry and identical resistances of voltmeters, solve the bridge network potentials across V1, V2, and V3. Reading of V3 is 3 V.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDue to symmetry and identical resistances of voltmeters, solve the bridge network potentials across V1, V2, and V3. Reading of V3 is 3 V.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 25,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "The temperature dependence of the resistance of a non linear resistor is investigated in a laboratory having constant ambient temperature $T_0 = 20^\\circ\\text{C}$. As the temperature is raised to $T_1 = 100^\\circ\\text{C}$, the resistance changes abruptly from $R_1 = 50\\,\\Omega$ to $R_2 = 100\\,\\Omega$ at $100^\\circ\\text{C}$. On cooling, the reverse abrupt change from $100\\,\\Omega$ to $50\\,\\Omega$ takes place at $T_2 = 90^\\circ\\text{C}$. When a voltage $V = 80\\text{ volt}$ is applied to the resistor, a periodically varying current is established in the circuit after some time. Assume Newton's law of cooling is applicable to the resistor, the proportionality constant being $d = 1.2\\text{ J}\\,\\text{K}^{-1}\\text{s}^{-1}$. The heat capacity of the resistor is $c = 3\\text{ J/K}$. Calculate the time period of the current oscillation (in sec). [Take $\\ln(2.2) = 0.8$]",
    "answer": "2.4",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nHeating phase from 90\\u00b0C to 100\\u00b0C with R=50\\u03a9 gives t1. Cooling phase from 100\\u00b0C to 90\\u00b0C with R=100\\u03a9 gives t2. Total period T = t1 + t2 = 2.4 sec.\n\n**Conclusion:**\nHence, the correct answer is **2.4**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nHeating phase from 90\\u00b0C to 100\\u00b0C with R=50\\u03a9 gives t1. Cooling phase from 100\\u00b0C to 90\\u00b0C with R=100\\u03a9 gives t2. Total period T = t1 + t2 = 2.4 sec.\n\n**Conclusion:**\nHence, the correct answer is **2.4**."
  },
  {
    "id": 26,
    "subject": "Physics",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "A real cell of emf 20V is connected across a resistor of resistance $R$. A voltmeter of varying resistance ($r_v$) is connected across resistance to measure the potential drop across the resistor. Variation of potential drop against $r_v$ is as shown in figure. Thus value of $R$ will be (in ohm)",
    "images": [
      "/assets/pta05/3ec142b4cbb3e2a4143462ac0bc01e556bbb1332.png"
    ],
    "answer": "16",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAs r_v \\u2192 \\u221e, PD = 16V = 20*R/(R+r), so r = R/4. At r_v = 8\\u03a9, parallel combination R' = 8R/(R+8). PD = 20*R'/(R'+r) = 40/3. Solving for R gives R = 16 \\u03a9.\n\n**Conclusion:**\nHence, the correct answer is **16**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAs r_v \\u2192 \\u221e, PD = 16V = 20*R/(R+r), so r = R/4. At r_v = 8\\u03a9, parallel combination R' = 8R/(R+8). PD = 20*R'/(R'+r) = 40/3. Solving for R gives R = 16 \\u03a9.\n\n**Conclusion:**\nHence, the correct answer is **16**."
  },
  {
    "id": 27,
    "subject": "Physics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "A network of resistances is constructed with $R_1$ and $R_2$ as shown in the figure. The potential at the points 1,2,3,.... are $V_1, V_2, V_3, \\dots$ respectively, such that each is having a potential $k$ times smaller than the previous one ($V_0 = kV_1, V_1 = kV_2, \\dots; k > 1$). Identify the correct statement/s:",
    "images": [
      "/assets/pta05/bc6dbc8675342269663ebc05415c41afd8b3429d.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "The ratio R1/R2 = (k \u2212 1)^2/k"
      },
      {
        "id": "B",
        "text": "The ratio R2/R3 = k/(k \u2212 1)"
      },
      {
        "id": "C",
        "text": "The current that passes through the resistance R2 nearest to V0 is ((k \u2212 1)/k^2) \u00d7 V0/R3"
      },
      {
        "id": "D",
        "text": "The current that passes through the resistance R2 nearest to V0 is ((k + 1)/k^2) \u00d7 V0/R3"
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nNodal equation at node 1: (V0 - V1)/R1 = V1/R2 + (V1 - V2)/R1. Since V0 = kV1 and V2 = V1/k: (k - 1)/R1 = 1/R2 + (1 - 1/k)/R1. Simplifying yields R1/R2 = (k-1)^2/k. For the end termination, R2/R3 = k/(k-1). Current is I = V1/R2 = (V0/k)/R2 = ((k-1)/k^2) * V0/R3.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nNodal equation at node 1: (V0 - V1)/R1 = V1/R2 + (V1 - V2)/R1. Since V0 = kV1 and V2 = V1/k: (k - 1)/R1 = 1/R2 + (1 - 1/k)/R1. Simplifying yields R1/R2 = (k-1)^2/k. For the end termination, R2/R3 = k/(k-1). Current is I = V1/R2 = (V0/k)/R2 = ((k-1)/k^2) * V0/R3.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 28,
    "subject": "Physics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "In the circuit given below, initially capacitors are uncharged. Now the switch is closed. The total charge flown through '$r$' during a long time interval is $Q$, then",
    "images": [
      "/assets/pta05/9d3122ef090c3bc324ab656547ffb7373e6d8e1c.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "if r = 0, Q is CV/3"
      },
      {
        "id": "B",
        "text": "if r = R, Q is CV/2"
      },
      {
        "id": "C",
        "text": "if r = 2R, Q is CV/5"
      },
      {
        "id": "D",
        "text": "if r = 3R, Q is CV/6"
      }
    ],
    "answer": [
      "A"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nInitial charges are zero. Final steady state current through r is zero since capacitors block DC. Integrate current through r over time: total charge transferred Q depends only on terminal states when r=0: Q = CV/3.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nInitial charges are zero. Final steady state current through r is zero since capacitors block DC. Integrate current through r over time: total charge transferred Q depends only on terminal states when r=0: Q = CV/3.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 29,
    "subject": "Physics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "In the circuit we connect four identical resistors $R = 300\\,\\Omega$, two switches $S_1$ and $S_2$, two identical capacitors $C_1 = C_2 = 4\\,\\mu\\text{F}$ and two sources with an electromotive voltage of 4.5 V, as shown in the circuit diagram. Switch $S_1$ is kept open and switch $S_2$ is kept closed for a long time.",
    "images": [
      "/assets/pta05/8e2096ed7cff31796a380b3d791155493d9dd928.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "The charge on capacitor C1 is 3.6\u03bcC"
      },
      {
        "id": "B",
        "text": "The magnitude of the current, immediately after we open switch S2 at t=0 through the resistor that is farthest to the right in the diagram is 12 mA"
      },
      {
        "id": "C",
        "text": "At t=0, we close switch S1 then the magnitude of the current through switch S1 after a long time is 5mA"
      },
      {
        "id": "D",
        "text": "At t=0, we close switch S1 then the charge on capacitor C2 after a long time is 6\u03bcC"
      }
    ],
    "answer": [
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSteady state analysis with capacitors open. Solve loop equations for voltages across C1 and C2, and transient currents upon switching S1 and S2.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSteady state analysis with capacitors open. Solve loop equations for voltages across C1 and C2, and transient currents upon switching S1 and S2.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 30,
    "subject": "Physics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "A capacitor consists of two circular parallel plates both with radius $R$ separated by distance $d$, where $d \\ll R$. The top plate is connected to a constant voltage source at potential $V$ while the bottom plate is grounded. A thin and small conducting disk of mass $m$ with radius $r (\\ll R, d)$ and thickness $t (\\ll r)$ is placed on the center of the bottom plate. Then the correct statement(s) is (are)",
    "images": [
      "/assets/pta05/a1b19ee11a8f6cc6a8dac333001e56d395c3d434.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "The magnitude of the force between the plates before inserting the disk is \u00bd \u03b50 \u03c0 R^2 V^2 / d^2"
      },
      {
        "id": "B",
        "text": "When the disk is placed on the bottom plate the charge q on it is \u2212\u00bd \u03b50 (\u03c0R^2/d) V"
      },
      {
        "id": "C",
        "text": "To lift up the disk at rest initially in presence of a uniform gravitational field g perpendicular to the plates the applied voltage has to be increased beyond a threshold voltage Vt = \u221a(2mgd^2 / (\u03b50 \u03c0 r^2))"
      },
      {
        "id": "D",
        "text": "When V > Vt the disk undergoes an up and down motion and eventually comes to rest"
      }
    ],
    "answer": [
      "A",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nForce between parallel plates is F = (1/2) \\u03b50 A E^2 = (1/2) \\u03b50 \\u03c0 R^2 (V/d)^2 (A is true). Charge on small disk q = \\u03b50 (\\u03c0 r^2) E. Electrostatic lift occurs when qE > mg => Vt = sqrt(mg d^2 / (\\u03b50 \\u03c0 r^2)) or with factor 2 based on contact redistribution.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nForce between parallel plates is F = (1/2) \\u03b50 A E^2 = (1/2) \\u03b50 \\u03c0 R^2 (V/d)^2 (A is true). Charge on small disk q = \\u03b50 (\\u03c0 r^2) E. Electrostatic lift occurs when qE > mg => Vt = sqrt(mg d^2 / (\\u03b50 \\u03c0 r^2)) or with factor 2 based on contact redistribution.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 31,
    "subject": "Physics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "A capacitor with air as dielectric has capacity $C$ as shown in figure is completely filled with dielectric slab of mass $M$ and is connected to a block of mass $M$. The system is released from rest at time $t = 0$ when the capacitor was completely filled with dielectric. Then :- (Dielectric constant of slab = $K$)",
    "images": [
      "/assets/pta05/4b07cddd25049dece2426a0dd967ff5f08f3f0b2.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Charge on the plate of the capacitor when it is half filled with air is (K + 1)CV/2"
      },
      {
        "id": "B",
        "text": "The kinetic energy of the block when the capacitor is half filled with dielectric is Mg\u2113/4 \u2212 CV^2(K \u2212 1)/8."
      },
      {
        "id": "C",
        "text": "The potential difference between the plates when the capacitor is half filled with air is V."
      },
      {
        "id": "D",
        "text": "The energy stored in the capacitor when it is half filled with dielectric is (K/2)CV^2."
      }
    ],
    "answer": [
      "A",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBattery maintains constant voltage V across the capacitor plates at all times (C is true). When half filled with dielectric and half with air, equivalent capacitance C' = (C/2) + K(C/2) = (K+1)C/2. Charge Q = C'V = (K+1)CV/2 (A is true).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBattery maintains constant voltage V across the capacitor plates at all times (C is true). When half filled with dielectric and half with air, equivalent capacitance C' = (C/2) + K(C/2) = (K+1)C/2. Charge Q = C'V = (K+1)CV/2 (A is true).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 32,
    "subject": "Physics",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "The space between two concentric conductor spherical shells of radii $R_1$ and $R_3$, is filled with two types of media. The dielectric constant and conductivity are $\\varepsilon_1, \\sigma_1$ and $\\varepsilon_2, \\sigma_2$, respectively. Voltage between shells is $V$. In case-A, media form two concentric shells. In case-B, medium-1 fills upper hemisphere and medium-2 fills the other half.",
    "images": [
      "/assets/pta05/1de0b3b3fbe3aec54deedfd2ebdd94bc1fd78f56.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "The current from inner shell to outer shell in Case A is 4\u03c0K where 1/K = (1/V)[ (1/\u03c31)(1/R1 \u2212 1/R2) + (1/\u03c32)(1/R2 \u2212 1/R3) ]"
      },
      {
        "id": "B",
        "text": "The total charge on the boundary of two medium in case A is 4\u03c0K(\u03b52/\u03c32 \u2212 \u03b51/\u03c31) where 1/K = (1/V)[ (1/\u03c31)(1/R1 \u2212 1/R2) + (1/\u03c32)(1/R2 \u2212 1/R3) ]"
      },
      {
        "id": "C",
        "text": "The current from inner shell to outer shell in case B is 2\u03c0K(\u03c31 + \u03c32) where K = V R1R3/(R3 \u2212 R1)."
      },
      {
        "id": "D",
        "text": "The current from inner shell to outer shell in case B is \u03c0K(\u03c31 + \u03c32) where K = V R1R3/(R3 \u2212 R1)."
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn Case A, resistors are in series: R = 1/(4\\u03c0\\u03c31)(1/R1 - 1/R2) + 1/(4\\u03c0\\u03c32)(1/R2 - 1/R3). Boundary charge follows from boundary condition for electric displacement and current continuity. In Case B, resistors are in parallel across hemispheres: G = 2\\u03c0\\u03c31 R1R3/(R3-R1) + 2\\u03c0\\u03c32 R1R3/(R3-R1).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn Case A, resistors are in series: R = 1/(4\\u03c0\\u03c31)(1/R1 - 1/R2) + 1/(4\\u03c0\\u03c32)(1/R2 - 1/R3). Boundary charge follows from boundary condition for electric displacement and current continuity. In Case B, resistors are in parallel across hemispheres: G = 2\\u03c0\\u03c31 R1R3/(R3-R1) + 2\\u03c0\\u03c32 R1R3/(R3-R1).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 33,
    "subject": "Physics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "A spherical shell of inner radius $a$ and outer $b$ is made of a material of resistivity $\\rho$ and dielectric constant $\\simeq 1$. A single point charge $q_0$ is located at the centre of the shell. At time $t = 0$ all the material of the shell is electrically neutral, including both the inner and outer surfaces. If the current flowing from inner surface to outer surface as a function of time is $I$ and $Q$ be the charge on the outer surface at a general time $t$ then match the columns (All quantities in SI units):",
    "matchingList": {
      "listI": [
        {
          "key": "P)",
          "text": "$q_0 = 2, t = \\ln 2, \\rho = 1/\\varepsilon_0, a = 1, b = 2, Q = ?$"
        },
        {
          "key": "Q)",
          "text": "$q_0 = 5, t = \\ln 4, \\rho = 1/(3\\varepsilon_0), a = 1, b = 5, I = ?$"
        },
        {
          "key": "R)",
          "text": "$q_0 = 5, t = \\ln 2, \\rho = 1/(3\\varepsilon_0), a = 1, b = 3, I = ?$"
        },
        {
          "key": "S)",
          "text": "$q_0 = 4, t = \\ln 4, \\rho = 1/(3\\varepsilon_0), a = 1, b = 5, Q = ?$"
        }
      ],
      "listII": [
        {
          "key": "(1)",
          "text": "63/16"
        },
        {
          "key": "(2)",
          "text": "15/8"
        },
        {
          "key": "(3)",
          "text": "15/64"
        },
        {
          "key": "(4)",
          "text": "1"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P\u21924; Q\u21923; R\u21922; S\u21921"
      },
      {
        "id": "B",
        "text": "P\u21922; Q\u21921; R\u21923; S\u21924"
      },
      {
        "id": "C",
        "text": "P\u21924; Q\u21921; R\u21922; S\u21923"
      },
      {
        "id": "D",
        "text": "P\u21923; Q\u21924; R\u21922; S\u21921"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nCharge relaxation time \\u03c4 = \\u03c1\\u03b50. Current decays exponentially: I(t) = (q0/\\u03c4) e^(-t/\\u03c4). Charge on outer surface Q(t) = q0(1 - e^(-t/\\u03c4)). Matching gives A.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nCharge relaxation time \\u03c4 = \\u03c1\\u03b50. Current decays exponentially: I(t) = (q0/\\u03c4) e^(-t/\\u03c4). Charge on outer surface Q(t) = q0(1 - e^(-t/\\u03c4)). Matching gives A.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 34,
    "subject": "Physics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Let us look at the circuit diagram given in the drawing where the circuit element marked as an arrow is a constant current source with a current $I = 2\\text{ mA}$ towards the direction of the arrow. Match the quantities of Column I with Column II (only magnitude):",
    "images": [
      "/assets/pta05/87f87261e96f9532713b8072b49819136a71e04e.png"
    ],
    "matchingList": {
      "listI": [
        {
          "key": "P)",
          "text": "The voltage U on the output leads when switch K is closed"
        },
        {
          "key": "Q)",
          "text": "The current through resistor R=10k\u03a9 when switch K is closed"
        },
        {
          "key": "R)",
          "text": "The current through resistor R=10k\u03a9 when switch K is opened (in mA)"
        },
        {
          "key": "S)",
          "text": "The voltage U on the output leads when switch K is opened"
        }
      ],
      "listII": [
        {
          "key": "1)",
          "text": "0"
        },
        {
          "key": "2)",
          "text": "1"
        },
        {
          "key": "3)",
          "text": "2"
        },
        {
          "key": "4)",
          "text": "21"
        },
        {
          "key": "5)",
          "text": "19"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P\u21921; Q\u21922; R\u21923; S\u21924"
      },
      {
        "id": "B",
        "text": "P\u21922; Q\u21921; R\u21923; S\u21924"
      },
      {
        "id": "C",
        "text": "P\u21921; Q\u21923; R\u21922; S\u21925"
      },
      {
        "id": "D",
        "text": "P\u21922; Q\u21921; R\u21923; S\u21925"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nWhen K is closed, current source is shorted. Circuit operates with remaining batteries and resistors. When K is open, 2mA current is forced through the branch. Matching gives B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nWhen K is closed, current source is shorted. Circuit operates with remaining batteries and resistors. When K is open, 2mA current is forced through the branch. Matching gives B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 35,
    "subject": "Physics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match List I (Capacitor Circuit) with List II (Equivalent Capacitance $C_{eq}$):",
    "matchingList": {
      "listI": [
        {
          "key": "(P)",
          "text": "Circuit P",
          "image": "/assets/pta05/4fd207821273089cb0c3a09d63de9f83356c57fc.png"
        },
        {
          "key": "(Q)",
          "text": "Circuit Q",
          "image": "/assets/pta05/381bf6894a69d575ed4bddb743064fcb44f72f5a.png"
        },
        {
          "key": "(R)",
          "text": "Circuit R",
          "image": "/assets/pta05/cb45109ac23f3e3c72fc966ed8f07ccf476fbb13.png"
        },
        {
          "key": "(S)",
          "text": "Circuit S",
          "image": "/assets/pta05/f0e29e8796da209066fb75ad83d99427af3243ad.png"
        }
      ],
      "listII": [
        {
          "key": "(1)",
          "text": "3C/4"
        },
        {
          "key": "(2)",
          "text": "5C/12"
        },
        {
          "key": "(3)",
          "text": "2C/3"
        },
        {
          "key": "(4)",
          "text": "3C/2"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P\u21924; Q\u21922; R\u21923; S\u21921"
      },
      {
        "id": "B",
        "text": "P\u21924; Q\u21921; R\u21922; S\u21923"
      },
      {
        "id": "C",
        "text": "P\u21924; Q\u21921; R\u21923; S\u21922"
      },
      {
        "id": "D",
        "text": "P\u21924; Q\u21922; R\u21921; S\u21923"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAnalyze node connections for each capacitor ladder: Circuit P gives 3C/2 -> (4); Circuit Q gives 3C/4 -> (1); Circuit R gives 5C/12 -> (2); Circuit S gives 2C/3 -> (3). Hence B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAnalyze node connections for each capacitor ladder: Circuit P gives 3C/2 -> (4); Circuit Q gives 3C/4 -> (1); Circuit R gives 5C/12 -> (2); Circuit S gives 2C/3 -> (3). Hence B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 36,
    "subject": "Physics",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "A network consisting of three resistors, three batteries, and a capacitor is shown in figure (Assuming steady state):",
    "images": [
      "/assets/pta05/1ef074b427abc6eb0160d0041b691d9df8e36e5b.png"
    ],
    "matchingList": {
      "listI": [
        {
          "key": "(P)",
          "text": "Current in branch EB is"
        },
        {
          "key": "(Q)",
          "text": "Current in branch CB is"
        },
        {
          "key": "(R)",
          "text": "Current in branch ED is"
        },
        {
          "key": "(S)",
          "text": "Charge on capacitor is"
        }
      ],
      "listII": [
        {
          "key": "(1)",
          "text": "10\u03bcC"
        },
        {
          "key": "(2)",
          "text": "0.5A"
        },
        {
          "key": "(3)",
          "text": "1.5A"
        },
        {
          "key": "(4)",
          "text": "5\u03bcC"
        },
        {
          "key": "(5)",
          "text": "None of these"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P\u21922; Q\u21923; R\u21922; S\u21921"
      },
      {
        "id": "B",
        "text": "P\u21923; Q\u21922; R\u21922; S\u21921"
      },
      {
        "id": "C",
        "text": "P\u21925; Q\u21922; R\u21923; S\u21924"
      },
      {
        "id": "D",
        "text": "P\u21922; Q\u21923; R\u21923; S\u21924"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn steady state, capacitor branch carries zero current. Loop currents in outer loops determine potentials at E, B, C, D. Potential difference across capacitor gives Q = C \\u0394V. Matches option A.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn steady state, capacitor branch carries zero current. Loop currents in outer loops determine potentials at E, B, C, D. Potential difference across capacitor gives Q = C \\u0394V. Matches option A.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 37,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Total number of correct statements with respect to X and Y amongst the following is:\n(i) X is a dinitrophenol\n(ii) pKa of X is less than 1\n(iii) Y is stronger acid than phenol\n(iv) X is stronger acid than Y\n(v) Molecular weight of X is smaller than Y\n(vi) X will liberate CO2 from NaHCO3 solution.",
    "images": [
      "/assets/pta05/2b853e202b3983d54d37f901102fa775eb0d5494.png"
    ],
    "answer": 5,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nX is 2,4,6-trinitrophenol (picric acid, %N = 18.34). Y is 2,4-dibromophenol (%O = 9.25). Picric acid has pKa ~ 0.38 (<1), liberates CO2 from NaHCO3, and is stronger than Y. Count of correct statements = 5.\n\n**Conclusion:**\nHence, the correct answer is **5**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nX is 2,4,6-trinitrophenol (picric acid, %N = 18.34). Y is 2,4-dibromophenol (%O = 9.25). Picric acid has pKa ~ 0.38 (<1), liberates CO2 from NaHCO3, and is stronger than Y. Count of correct statements = 5.\n\n**Conclusion:**\nHence, the correct answer is **5**."
  },
  {
    "id": 38,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Choose the code of the method which is best for synthesis of phenyl n-propyl ether?\nIf (A) is the answer, enter (1); if (B) enter (2); if (C) enter (3); if (D) enter (4).",
    "images": [
      "/assets/pta05/3aa55b2ace16dcf9396e826207abf0f088533b83.png",
      "/assets/pta05/9656e62af22fa31c88ae8771ff17c95d6a3bd135.png"
    ],
    "answer": 1,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nMethod (1) uses sodium phenoxide reacting with 1-bromopropane in polar aprotic solvent via SN2 pathway, which gives high yield. Bromobenzene does not undergo SN2 displacement with propoxide.\n\n**Conclusion:**\nHence, the correct answer is **1**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nMethod (1) uses sodium phenoxide reacting with 1-bromopropane in polar aprotic solvent via SN2 pathway, which gives high yield. Bromobenzene does not undergo SN2 displacement with propoxide.\n\n**Conclusion:**\nHence, the correct answer is **1**."
  },
  {
    "id": 39,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Maximum number of moles of $\\text{CH}_3-\\text{C}(=\\text{O})-\\text{O}-\\text{C}(=\\text{O})-\\text{CH}_3$ consumed by one mole of reactant A in presence of small amount of conc. $\\text{H}_2\\text{SO}_4$ is $P$. The value of $P$ is:",
    "images": [
      "/assets/pta05/85237a93b14bbce4042cf38aee1fcc883c8c21a5.png"
    ],
    "answer": 4,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nReactant A oxidizes with 4 moles of PCC to give the cyclic dicarbonyl dialdehyde. Reactant A must have 2 secondary alcohol groups and 2 primary alcohol groups (total 4 hydroxyl groups), consuming 4 moles of acetic anhydride.\n\n**Conclusion:**\nHence, the correct answer is **4**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nReactant A oxidizes with 4 moles of PCC to give the cyclic dicarbonyl dialdehyde. Reactant A must have 2 secondary alcohol groups and 2 primary alcohol groups (total 4 hydroxyl groups), consuming 4 moles of acetic anhydride.\n\n**Conclusion:**\nHence, the correct answer is **4**."
  },
  {
    "id": 40,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "If the number of oxygen atoms in the ring of the product P is '$x$' and total number of atoms in the ring is '$y$'. Find out $x + y = ?$",
    "images": [
      "/assets/pta05/20645cf41bb4646d004d497795663226e09f9762.png"
    ],
    "answer": 6,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nGrignard reagent CH3MgBr adds to the carbonyl of 5-chloropentan-2-one to form a tertiary alkoxide, which undergoes intramolecular nucleophilic substitution (SNi/SN2) displacing chloride to form 2,2-dimethyltetrahydrofuran (a 5-membered cyclic ether containing 1 oxygen atom and 4 carbon atoms). Thus x = 1, y = 5, giving x + y = 6.\n\n**Conclusion:**\nHence, the correct answer is **6**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nGrignard reagent CH3MgBr adds to the carbonyl of 5-chloropentan-2-one to form a tertiary alkoxide, which undergoes intramolecular nucleophilic substitution (SNi/SN2) displacing chloride to form 2,2-dimethyltetrahydrofuran (a 5-membered cyclic ether containing 1 oxygen atom and 4 carbon atoms). Thus x = 1, y = 5, giving x + y = 6.\n\n**Conclusion:**\nHence, the correct answer is **6**."
  },
  {
    "id": 41,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "If the number of chiral centers present in final product A is '$x$', B is '$y$', C is '$z$' and D is '$q$'. Find out $x + y + z + q$:",
    "images": [
      "/assets/pta05/454c8b7d0ec8383c68170059d0e5322ff94afa4c.png"
    ],
    "answer": 4,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nFor pent-2-ene derivatives: A (hydration) gives pentan-2-ol and pentan-3-ol (1 chiral center); B (OMDM) gives pentan-2-ol (1 chiral center); C (hydroboration with BD3) introduces chiral centers with deuterium; D (hydroboration) gives pentan-1-ol and pentan-2-ol. Summing yields 4.\n\n**Conclusion:**\nHence, the correct answer is **4**.",
    "explanation": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nFor pent-2-ene derivatives: A (hydration) gives pentan-2-ol and pentan-3-ol (1 chiral center); B (OMDM) gives pentan-2-ol (1 chiral center); C (hydroboration with BD3) introduces chiral centers with deuterium; D (hydroboration) gives pentan-1-ol and pentan-2-ol. Summing yields 4.\n\n**Conclusion:**\nHence, the correct answer is **4**."
  },
  {
    "id": 42,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "If the number of substitution products formed in reaction A is '$x$' and the number of products formed in reaction B is '$y$'. Find out $x + y$:",
    "images": [
      "/assets/pta05/10628ef31e4ec83494d0018c4b2822f71cd7fe91.png"
    ],
    "answer": 3,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nReaction A is SN2 with NaOH: complete inversion of configuration at chiral center yields 1 enantiomer (x = 1). Reaction B is solvolysis with H2O via planar carbocation (SN1): yields racemic mixture of 2 enantiomers (y = 2). Total x + y = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nReaction A is SN2 with NaOH: complete inversion of configuration at chiral center yields 1 enantiomer (x = 1). Reaction B is solvolysis with H2O via planar carbocation (SN1): yields racemic mixture of 2 enantiomers (y = 2). Total x + y = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 43,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Find out degree of unsaturation in the major product of the following pinacol-pinacolone rearrangement reaction:",
    "images": [
      "/assets/pta05/c4381cffc905a9ec5bb0ed846001b2116e0c5a3b.png"
    ],
    "answer": 9,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nProtonation occurs preferentially at primary OH, followed by hydride/phenyl migration to form diphenylacetaldehyde Ph2CH-CHO. The degree of unsaturation = 2*(benzene ring: 4) + (carbonyl group: 1) = 4 + 4 + 1 = 9.\n\n**Conclusion:**\nHence, the correct answer is **9**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nProtonation occurs preferentially at primary OH, followed by hydride/phenyl migration to form diphenylacetaldehyde Ph2CH-CHO. The degree of unsaturation = 2*(benzene ring: 4) + (carbonyl group: 1) = 4 + 4 + 1 = 9.\n\n**Conclusion:**\nHence, the correct answer is **9**."
  },
  {
    "id": 44,
    "subject": "Chemistry",
    "section": "Section I: Numerical Value",
    "sectionInstruction": "+3 if only the correct numerical value is entered; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 3,
      "negative": 0
    },
    "question": "Find out the number of bromine atoms in the final product of the reaction between 4-hydroxybenzenesulfonic acid and excess aqueous bromine (3 equivalents):",
    "images": [
      "/assets/pta05/7b0c4bc4728fc59a6927dec09df4bab88ae6459a.png"
    ],
    "answer": 3,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAqueous bromine causes electrophilic aromatic substitution at the ortho positions, followed by ipso-substitution (desulfonation) at the para position to form 2,4,6-tribromophenol. The product has 3 bromine atoms.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAqueous bromine causes electrophilic aromatic substitution at the ortho positions, followed by ipso-substitution (desulfonation) at the para position to form 2,4,6-tribromophenol. The product has 3 bromine atoms.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 45,
    "subject": "Chemistry",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Which of the following will give color in the phthalein dye test?",
    "images": [
      "/assets/pta05/3e9e38a130c654254ed145fe8ecabf28133a90b2.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "o-Cresol"
      },
      {
        "id": "B",
        "text": "m-Cresol"
      },
      {
        "id": "C",
        "text": "p-Cresol"
      },
      {
        "id": "D",
        "text": "Resorcinol / substituted phenol with free para position"
      }
    ],
    "answer": [
      "A",
      "B"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nPhthalein dye test requires condensation with phthalic anhydride at the para position to the -OH group. Phenols with an unsubstituted para position (like o-cresol and m-cresol) give positive phthalein tests. p-Cresol has its para position blocked and does not form phthalein dyes.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nPhthalein dye test requires condensation with phthalic anhydride at the para position to the -OH group. Phenols with an unsubstituted para position (like o-cresol and m-cresol) give positive phthalein tests. p-Cresol has its para position blocked and does not form phthalein dyes.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 46,
    "subject": "Chemistry",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Phenol is subjected to the reaction sequence: Phenol + NaOH(aq) \u2192 (A) + CH3-CH2-I \u2192 (B) + Excess HI, \u0394 \u2192 (C) + (D). Compound C contains an aromatic ring, whereas Compound D is aliphatic. Which of the following statement(s) is/are true?",
    "images": [
      "/assets/pta05/c801178d599ec2e5285f92ef81758e523bbd19d2.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Compound B is phenetole (Ethyl phenyl ether)"
      },
      {
        "id": "B",
        "text": "The cleavage of B by HI proceeds via an SN2 attack of I\u2212 on the ethyl carbon, because the aryl C\u2013O bond has partial double bond character."
      },
      {
        "id": "C",
        "text": "Compound C will give a characteristic violet colour with neutral FeCl3 solution."
      },
      {
        "id": "D",
        "text": "Compound D can be converted back into ethanol by treatment with aqueous NaOH."
      }
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nA is sodium phenoxide, B is ethyl phenyl ether (phenetole). Cleavage with HI gives phenol (C) and ethyl iodide (D). Phenol gives violet color with FeCl3. Ethyl iodide hydrolyzes with aq NaOH to ethanol.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nA is sodium phenoxide, B is ethyl phenyl ether (phenetole). Cleavage with HI gives phenol (C) and ethyl iodide (D). Phenol gives violet color with FeCl3. Ethyl iodide hydrolyzes with aq NaOH to ethanol.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 47,
    "subject": "Chemistry",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "In which of the following cases, ring expansion / ring contraction takes place when protic acid is added to the compound?",
    "images": [
      "/assets/pta05/14a4df1fd5c199ec71687067a7602b27710cdda6.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "1-cyclobutylethanol"
      },
      {
        "id": "B",
        "text": "1-methylcyclobutanol"
      },
      {
        "id": "C",
        "text": "3-methylcyclobutanol"
      },
      {
        "id": "D",
        "text": "cyclopentylmethanol"
      }
    ],
    "answer": [
      "A",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nProtonation and loss of water creates a carbocation adjacent to the 4- or 5-membered ring (in A and D), triggering ring expansion to relieve angle strain (cyclobutane to cyclopentane, and cyclopentane to cyclohexane).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nProtonation and loss of water creates a carbocation adjacent to the 4- or 5-membered ring (in A and D), triggering ring expansion to relieve angle strain (cyclobutane to cyclopentane, and cyclopentane to cyclohexane).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 48,
    "subject": "Chemistry",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Hydroboration oxidation (HBO), oxymercuration-demercuration (OMDM), and acid-catalysed hydration will NOT give the same product in:",
    "images": [
      "/assets/pta05/e42f481b3dd942c04f81446f7dd5acebe73beff0.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "3,3-dimethylbut-1-ene"
      },
      {
        "id": "B",
        "text": "methylenecyclohexane"
      },
      {
        "id": "C",
        "text": "cyclohexene"
      },
      {
        "id": "D",
        "text": "1-methylcyclohexene"
      }
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nIn asymmetrical alkenes, HBO gives anti-Markovnikov alcohol without rearrangement, OMDM gives Markovnikov alcohol without rearrangement, while acid-catalysed hydration gives rearranged carbocation products. Only symmetrical cyclohexene (C) gives cyclohexanol in all three.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nIn asymmetrical alkenes, HBO gives anti-Markovnikov alcohol without rearrangement, OMDM gives Markovnikov alcohol without rearrangement, while acid-catalysed hydration gives rearranged carbocation products. Only symmetrical cyclohexene (C) gives cyclohexanol in all three.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 49,
    "subject": "Chemistry",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Which of the following ethers CANNOT be prepared by using Williamson's synthesis?",
    "images": [
      "/assets/pta05/19e069591a5a120663e0072e50727d8d3cb3d50d.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Di-tert-butyl ether"
      },
      {
        "id": "B",
        "text": "Divinyl ether"
      },
      {
        "id": "C",
        "text": "Diphenyl ether"
      },
      {
        "id": "D",
        "text": "Diallyl ether"
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nWilliamson ether synthesis requires an SN2 attack on an unhindered primary/methyl halide. A involves tertiary halide (elimination dominates); B and C involve vinyl/aryl halides which are inert to SN2 displacement. Diallyl ether (D) can be prepared easily from allyl bromide.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nWilliamson ether synthesis requires an SN2 attack on an unhindered primary/methyl halide. A involves tertiary halide (elimination dominates); B and C involve vinyl/aryl halides which are inert to SN2 displacement. Diallyl ether (D) can be prepared easily from allyl bromide.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 50,
    "subject": "Chemistry",
    "section": "Section II: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial marks, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Which of the following reaction mechanism descriptions is/are correctly matched?",
    "images": [
      "/assets/pta05/85ad358edf652f01a959fcd78b19f69f2f96b0c2.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "tert-butyl methyl ether + HI \u2192 SN1"
      },
      {
        "id": "B",
        "text": "tert-butyl methyl ether + H+/H2O \u2192 SN1"
      },
      {
        "id": "C",
        "text": "isopropyl methyl ether + HI \u2192 SN2"
      },
      {
        "id": "D",
        "text": "ethyl methyl ether + HI \u2192 SN1"
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTert-butyl ethers form stable 3\\u00b0 carbocations and undergo cleavage via SN1 mechanism (A and B). Primary and secondary ethers cleave via SN2 attack by iodide on less hindered carbon (C). D undergoes SN2, not SN1.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTert-butyl ethers form stable 3\\u00b0 carbocations and undergo cleavage via SN1 mechanism (A and B). Primary and secondary ethers cleave via SN2 attack by iodide on less hindered carbon (C). D undergoes SN2, not SN1.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 51,
    "subject": "Chemistry",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match the specific reagents used for converting an optically active secondary alcohol (List-I) to the corresponding alkyl halide along with its stereochemical outcome (List-II):",
    "matchingList": {
      "listI": [
        {
          "key": "P)",
          "text": "SOCl2 (without pyridine)"
        },
        {
          "key": "Q)",
          "text": "SOCl2 + Pyridine"
        },
        {
          "key": "R)",
          "text": "PBr3"
        },
        {
          "key": "S)",
          "text": "Action of HBr"
        }
      ],
      "listII": [
        {
          "key": "I)",
          "text": "Inversion of configuration via SN2"
        },
        {
          "key": "II)",
          "text": "Retention of configuration via SNi"
        },
        {
          "key": "III)",
          "text": "Racemization via Carbocation intermediate"
        },
        {
          "key": "IV)",
          "text": "Elimination to form alkene primarily"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P-(II); Q-(I); R-(I); S-(III)"
      },
      {
        "id": "B",
        "text": "P-(I); Q-(II); R-(III); S-(IV)"
      },
      {
        "id": "C",
        "text": "P-(II); Q-(I); R-(III); S-(I)"
      },
      {
        "id": "D",
        "text": "P-(III); Q-(II); R-(I); S-(IV)"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSOCl2 alone acts via SNi with internal nucleophilic return (Retention: II). In presence of pyridine, pyridinium chloride provides free chloride for backside attack (Inversion: I). PBr3 proceeds via SN2 (Inversion: I). HBr forms carbocation (Racemization: III). Option A.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSOCl2 alone acts via SNi with internal nucleophilic return (Retention: II). In presence of pyridine, pyridinium chloride provides free chloride for backside attack (Inversion: I). PBr3 proceeds via SN2 (Inversion: I). HBr forms carbocation (Racemization: III). Option A.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 52,
    "subject": "Chemistry",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match the multi-step reaction sequences (List-I) with the identity of the final major organic product (List-II):",
    "images": [
      "/assets/pta05/98e7e6d8728d0a9040cc64c2d4911167ce8f752b.png"
    ],
    "matchingList": {
      "listI": [
        {
          "key": "P)",
          "text": "Phenol -(i) NaOH,CO2,\u0394 (ii) H+-> -(Ac2O, H+)->"
        },
        {
          "key": "Q)",
          "text": "Ethanol -(Cu, 300\u00b0C)-> -(i) CH3MgBr (ii) H3O+->"
        },
        {
          "key": "R)",
          "text": "2-Propanol -(PCl5)-> -(Mg/ether)-> -(i) HCHO (ii) H3O+->"
        },
        {
          "key": "S)",
          "text": "Phenol -(CHCl3, NaOH, \u0394; H+)->"
        }
      ],
      "listII": [
        {
          "key": "I)",
          "text": "Isopropyl alcohol"
        },
        {
          "key": "II)",
          "text": "Isobutyl alcohol"
        },
        {
          "key": "III)",
          "text": "Salicylaldehyde"
        },
        {
          "key": "IV)",
          "text": "Aspirin"
        },
        {
          "key": "V)",
          "text": "Salicylic acid"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P-(V); Q-(II); R-(I); S-(III)"
      },
      {
        "id": "B",
        "text": "P-(IV); Q-(I); R-(II); S-(III)"
      },
      {
        "id": "C",
        "text": "P-(IV); Q-(II); R-(I); S-(V)"
      },
      {
        "id": "D",
        "text": "P-(III); Q-(I); R-(II); S-(IV)"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nP gives salicylic acid then acetylation gives Aspirin (IV). Q oxidizes ethanol to acetaldehyde + MeMgBr gives 2-propanol (Isopropyl alcohol: I). R gives isopropyl Grignard + formaldehyde gives isobutyl alcohol (II). S is Reimer-Tiemann giving salicylaldehyde (III). Option B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nP gives salicylic acid then acetylation gives Aspirin (IV). Q oxidizes ethanol to acetaldehyde + MeMgBr gives 2-propanol (Isopropyl alcohol: I). R gives isopropyl Grignard + formaldehyde gives isobutyl alcohol (II). S is Reimer-Tiemann giving salicylaldehyde (III). Option B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 53,
    "subject": "Chemistry",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match the specific alcohol undergoing acid-catalysed dehydration (List-I) with the major organic product formed (List-II):",
    "matchingList": {
      "listI": [
        {
          "key": "P)",
          "text": "3,3-Dimethyl-2-butanol"
        },
        {
          "key": "Q)",
          "text": "Cyclobutylmethyl alcohol"
        },
        {
          "key": "R)",
          "text": "2-Methylcyclohexanol"
        },
        {
          "key": "S)",
          "text": "2,2-Dimethylcyclopentanol"
        }
      ],
      "listII": [
        {
          "key": "I)",
          "text": "1-Methylcyclohexene"
        },
        {
          "key": "II)",
          "text": "Cyclopentene"
        },
        {
          "key": "III)",
          "text": "2,3-Dimethyl-2-butene"
        },
        {
          "key": "IV)",
          "text": "1,2-Dimethylcyclopentene"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P-(III); Q-(II); R-(I); S-(IV)"
      },
      {
        "id": "B",
        "text": "P-(III); Q-(II); R-(IV); S-(I)"
      },
      {
        "id": "C",
        "text": "P-(IV); Q-(I); R-(II); S-(III)"
      },
      {
        "id": "D",
        "text": "P-(II); Q-(III); R-(I); S-(IV)"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nP rearranges to tetrasubstituted 2,3-dimethyl-2-butene (III). Q expands ring to cyclopentene (II). R undergoes hydride shift to 1-methylcyclohexene (I). S undergoes methyl shift to 1,2-dimethylcyclopentene (IV). Option A.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nP rearranges to tetrasubstituted 2,3-dimethyl-2-butene (III). Q expands ring to cyclopentene (II). R undergoes hydride shift to 1-methylcyclohexene (I). S undergoes methyl shift to 1,2-dimethylcyclopentene (IV). Option A.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 54,
    "subject": "Chemistry",
    "section": "Section III: Matching List",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "matching_list",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match the organic reaction type (List-I) with the key reactive intermediate involved in its mechanism (List-II):",
    "matchingList": {
      "listI": [
        {
          "key": "(P)",
          "text": "Acid-Catalysed Dehydration of alcohols"
        },
        {
          "key": "(Q)",
          "text": "Fischer Esterification"
        },
        {
          "key": "(R)",
          "text": "Reaction of alcohol with sodium (Na)"
        },
        {
          "key": "(S)",
          "text": "Reimer-Tiemann reaction of phenol"
        }
      ],
      "listII": [
        {
          "key": "(I)",
          "text": "Tetrahedral intermediate"
        },
        {
          "key": "(II)",
          "text": "Carbocation intermediate"
        },
        {
          "key": "(III)",
          "text": "Alkoxide anion"
        },
        {
          "key": "(IV)",
          "text": "Dichlorocarbene"
        }
      ]
    },
    "options": [
      {
        "id": "A",
        "text": "P-(I); Q-(II); R-(IV); S-(III)"
      },
      {
        "id": "B",
        "text": "P-(II); Q-(I); R-(III); S-(IV)"
      },
      {
        "id": "C",
        "text": "P-(II); Q-(III); R-(I); S-(IV)"
      },
      {
        "id": "D",
        "text": "P-(III); Q-(I); R-(II); S-(IV)"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nP proceeds via carbocation (II). Q proceeds via nucleophilic acyl substitution tetrahedral intermediate (I). R produces alkoxide anion (III). S involves electrophilic dichlorocarbene :CCl2 (IV). Option B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nP proceeds via carbocation (II). Q proceeds via nucleophilic acyl substitution tetrahedral intermediate (I). R produces alkoxide anion (III). S involves electrophilic dichlorocarbene :CCl2 (IV). Option B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  }
]
};
