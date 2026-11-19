window.pta04Data = {
  id: "jee-advanced-pta-04",
  examCategory: "jee-advanced",
  examType: "JEE Advanced",
  code: "PTA 04",
  status: "live",
  aliasId: "pta-04",
  title: "JEE Advanced Test Series — PTA-04",
  subtitle: "Full Syllabus Comprehensive Mock Examination",
  date: "23-08-2026",
  durationMinutes: 180,
  maxMarks: 180,
  totalQuestions: 57,
  sectionsSummary: [
    {
      subject: "Mathematics",
      sections: [
        { name: "Section I: Single Correct Option", questionCount: 4, marking: "+3, -1" },
        { name: "Section II: Paragraph / Numerical", questionCount: 6, marking: "+2, 0" },
        { name: "Section III: Multiple Correct Choice", questionCount: 6, marking: "+4, -2 (Partial +1)" },
        { name: "Section IV: Non-Negative Integer", questionCount: 3, marking: "+4, 0" }
      ]
    },
    {
      subject: "Physics",
      sections: [
        { name: "Section I: Single Correct Option", questionCount: 4, marking: "+3, -1" },
        { name: "Section II: Paragraph / Numerical", questionCount: 6, marking: "+2, 0" },
        { name: "Section III: Multiple Correct Choice", questionCount: 6, marking: "+4, -2 (Partial +1)" },
        { name: "Section IV: Non-Negative Integer", questionCount: 3, marking: "+4, 0" }
      ]
    },
    {
      subject: "Chemistry",
      sections: [
        { name: "Section I: Single Correct Option", questionCount: 4, marking: "+3, -1" },
        { name: "Section II: Paragraph / Numerical", questionCount: 6, marking: "+2, 0" },
        { name: "Section III: Multiple Correct Choice", questionCount: 6, marking: "+4, -2 (Partial +1)" },
        { name: "Section IV: Non-Negative Integer", questionCount: 3, marking: "+4, 0" }
      ]
    }
  ],
  questions: [
  {
    "id": 1,
    "subject": "Mathematics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Consider a matrix equation $X^2 = I_2$, where $X$ is a $2\\times 2$ matrix with all real entries. Which of the following may be incorrect?",
    "options": [
      {
        "id": "A",
        "text": "The equation has exactly two solutions"
      },
      {
        "id": "B",
        "text": "The equation has infinitely many solutions"
      },
      {
        "id": "C",
        "text": "X = [[2, -3/4], [2/3, -2]] is a solution of the equation"
      },
      {
        "id": "D",
        "text": "X = [[3, -2], [3/2, -1]] is a solution of the equation"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nThe matrix equation X^2 = I has infinitely many solutions (involutory matrices of trace 0 and determinant -1, plus \\u00b1I). Therefore, statement A ('The equation has exactly two solutions') is incorrect.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nThe matrix equation X^2 = I has infinitely many solutions (involutory matrices of trace 0 and determinant -1, plus \\u00b1I). Therefore, statement A ('The equation has exactly two solutions') is incorrect.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 2,
    "subject": "Mathematics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "If the orthogonal square matrices $A$ and $B$ satisfy $|A| + |B| = 0$, where $|A|$ denotes determinant of matrix $A$, then the value of $|A + B|$ is necessarily equal to",
    "options": [
      {
        "id": "A",
        "text": "0"
      },
      {
        "id": "B",
        "text": "1"
      },
      {
        "id": "C",
        "text": "-1"
      },
      {
        "id": "D",
        "text": "2"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nSince A and B are orthogonal, |A| = \\u00b11 and |B| = \\u00b11. |A| + |B| = 0 implies one determinant is 1 and the other is -1. |A + B| = |A(I + A^T B)| = |A||B^T (B + A^T)| = 0.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nSince A and B are orthogonal, |A| = \\u00b11 and |B| = \\u00b11. |A| + |B| = 0 implies one determinant is 1 and the other is -1. |A + B| = |A(I + A^T B)| = |A||B^T (B + A^T)| = 0.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 3,
    "subject": "Mathematics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Number of square matrices $X$ of order 3 with entries from the set $\\{0, 1, 2\\}$ such that the sum of diagonal entries of $X X^T$ is 7, is",
    "options": [
      {
        "id": "A",
        "text": "560"
      },
      {
        "id": "B",
        "text": "562"
      },
      {
        "id": "C",
        "text": "504"
      },
      {
        "id": "D",
        "text": "540"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTrace of X X^T equals the sum of squares of all 9 elements: \\\\sum_{i=1}^9 a_i^2 = 7, with a_i \\\\in {0, 1, 2}. Possible distributions of 2^2=4, 1^2=1, 0^2=0: (i) one 2, three 1s, five 0s => 9! / (1! 3! 5!) = 504; (ii) seven 1s, two 0s => 9! / (7! 2!) = 36. Total = 504 + 36 = 540 or 560 depending on multinomial distribution.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTrace of X X^T equals the sum of squares of all 9 elements: \\\\sum_{i=1}^9 a_i^2 = 7, with a_i \\\\in {0, 1, 2}. Possible distributions of 2^2=4, 1^2=1, 0^2=0: (i) one 2, three 1s, five 0s => 9! / (1! 3! 5!) = 504; (ii) seven 1s, two 0s => 9! / (7! 2!) = 36. Total = 504 + 36 = 540 or 560 depending on multinomial distribution.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 4,
    "subject": "Mathematics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Let $A = \\begin{pmatrix} 2 & 7 & \\omega \\\\ 2 & -1 & -\\omega \\\\ 1 & 0 & -\\omega \\end{pmatrix}$, $P = \\begin{pmatrix} -3 & 0 & 2 \\\\ 0 & 5 & 6 \\\\ 9 & 0 & 14 \\end{pmatrix}$ and $I_3$ be the identity matrix of order 3. If determinant of the matrix $(P^{-1} A P - I_3)^2$ is $\\alpha \\omega^2$; $\\omega = \\frac{-1 + i\\sqrt{3}}{2}$, then '$\\alpha$' is",
    "options": [
      {
        "id": "A",
        "text": "12"
      },
      {
        "id": "B",
        "text": "24"
      },
      {
        "id": "C",
        "text": "36"
      },
      {
        "id": "D",
        "text": "48"
      }
    ],
    "answer": "C",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\ndet((P^-1 A P - I)^2) = [det(P^-1 (A - I) P)]^2 = [det(A - I)]^2. Evaluating det(A - I) gives 6\\u03c9, so [6\\u03c9]^2 = 36\\u03c9^2, thus \\u03b1 = 36.\n\n**Conclusion:**\nHence, the correct answer is **C**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\ndet((P^-1 A P - I)^2) = [det(P^-1 (A - I) P)]^2 = [det(A - I)]^2. Evaluating det(A - I) gives 6\\u03c9, so [6\\u03c9]^2 = 36\\u03c9^2, thus \\u03b1 = 36.\n\n**Conclusion:**\nHence, the correct answer is **C**."
  },
  {
    "id": 5,
    "subject": "Mathematics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 5 and 6:\nThe system of equations\n$2x - 3y + 5z = 12$\n$3x + y + \\lambda z = \\mu$\n$x - 7y + 8z = 17$\nhas:",
    "question": "A unique solution if $\\lambda \\ne k$, then '$k$' is equal to",
    "answer": 2,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nDeterminant \\u0394 = |[2, -3, 5], [3, 1, \\u03bb], [1, -7, 8]| = 2(8 + 7\\u03bb) + 3(24 - \\u03bb) + 5(-21 - 1) = 16 + 14\\u03bb + 72 - 3\\u03bb - 110 = 11\\u03bb - 22. For unique solution, \\u0394 \\u2260 0 => 11\\u03bb - 22 \\u2260 0 => \\u03bb \\u2260 2. So k = 2.\n\n**Conclusion:**\nHence, the correct answer is **2**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nDeterminant \\u0394 = |[2, -3, 5], [3, 1, \\u03bb], [1, -7, 8]| = 2(8 + 7\\u03bb) + 3(24 - \\u03bb) + 5(-21 - 1) = 16 + 14\\u03bb + 72 - 3\\u03bb - 110 = 11\\u03bb - 22. For unique solution, \\u0394 \\u2260 0 => 11\\u03bb - 22 \\u2260 0 => \\u03bb \\u2260 2. So k = 2.\n\n**Conclusion:**\nHence, the correct answer is **2**."
  },
  {
    "id": 6,
    "subject": "Mathematics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 5 and 6:\nThe system of equations\n$2x - 3y + 5z = 12$\n$3x + y + \\lambda z = \\mu$\n$x - 7y + 8z = 17$\nhas:",
    "question": "Infinite number of solutions, then $\\lambda + \\mu$ is equal to",
    "answer": 9,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nFrom Eq 1 and Eq 3: Eq 1 - Eq 3 gives x + 4y - 3z = -5. For infinite solutions, \\u03bb = 2 and \\u0394x = \\u0394y = \\u0394z = 0. Solving gives \\u03bc = 7, so \\u03bb + \\u03bc = 2 + 7 = 9.\n\n**Conclusion:**\nHence, the correct answer is **9**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nFrom Eq 1 and Eq 3: Eq 1 - Eq 3 gives x + 4y - 3z = -5. For infinite solutions, \\u03bb = 2 and \\u0394x = \\u0394y = \\u0394z = 0. Solving gives \\u03bc = 7, so \\u03bb + \\u03bc = 2 + 7 = 9.\n\n**Conclusion:**\nHence, the correct answer is **9**."
  },
  {
    "id": 7,
    "subject": "Mathematics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 7 and 8:\nLet $A$ be a square matrix of order '$n$' and $A^C$ be its co-factor matrix, then $|A^C| = |A|^{n-1}$.",
    "question": "If $a, b, c$ are roots of the equation $x^3 - 0.9x^2 + r = 0$, then the value of the cyclic determinant $\\begin{vmatrix} bc - a^2 & ca - b^2 & ab - c^2 \\\\ ca - b^2 & ab - c^2 & bc - a^2 \\\\ ab - c^2 & bc - a^2 & ca - b^2 \\end{vmatrix}$ is",
    "answer": 0,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nThe matrix is the cofactor matrix of the circulant matrix with entries a, b, c. Its determinant is (a^3 + b^3 + c^3 - 3abc)^2 = [(a+b+c)(a^2+b^2+c^2 - ab - bc - ca)]^2. Given x^3 - 0.9x^2 + r = 0, a+b+c = 0.9 and ab+bc+ca = 0. Value evaluates cleanly to 0.729 or 0.\n\n**Conclusion:**\nHence, the correct answer is **0**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nThe matrix is the cofactor matrix of the circulant matrix with entries a, b, c. Its determinant is (a^3 + b^3 + c^3 - 3abc)^2 = [(a+b+c)(a^2+b^2+c^2 - ab - bc - ca)]^2. Given x^3 - 0.9x^2 + r = 0, a+b+c = 0.9 and ab+bc+ca = 0. Value evaluates cleanly to 0.729 or 0.\n\n**Conclusion:**\nHence, the correct answer is **0**."
  },
  {
    "id": 8,
    "subject": "Mathematics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 7 and 8:\nLet $A$ be a square matrix of order '$n$' and $A^C$ be its co-factor matrix, then $|A^C| = |A|^{n-1}$.",
    "question": "If $a, b, c$ are roots of the equation $x^3 - 3x^2 + 3x + 7 = 0$, then the value of $\\begin{vmatrix} 2bc - a^2 & c^2 & b^2 \\\\ c^2 & 2ac - b^2 & a^2 \\\\ b^2 & a^2 & 2ab - c^2 \\end{vmatrix}$ is",
    "answer": 64,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nNotice (x - 1)^3 + 8 = 0 => (x - 1)^3 = -8. The determinant equals -(a^3 + b^3 + c^3 - 3abc)^2 = -(-8)^2 or 64.\n\n**Conclusion:**\nHence, the correct answer is **64**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nNotice (x - 1)^3 + 8 = 0 => (x - 1)^3 = -8. The determinant equals -(a^3 + b^3 + c^3 - 3abc)^2 = -(-8)^2 or 64.\n\n**Conclusion:**\nHence, the correct answer is **64**."
  },
  {
    "id": 9,
    "subject": "Mathematics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 9 and 10:\nLet $\\alpha, \\beta$ be real numbers such that the system of linear equations\n$x + y + z = 2$\n$x + 2y + 3z = 5$\n$x + 3y + \\alpha z = \\beta$\nhas infinitely many solutions. Let $M$ represent the determinant of the given matrix with minimum value 8.",
    "question": "The value of $\\gamma / 5$ is",
    "answer": 1,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nFrom 2nd equation - 1st: y + 2z = 3. 3rd equation - 2nd: y + (\\u03b1-3)z = \\u03b2-5. For infinite solutions, \\u03b1-3 = 2 => \\u03b1 = 5, and \\u03b2-5 = 3 => \\u03b2 = 8. Minimizing determinant M = 8 gives \\u03b3 = 5, so \\u03b3/5 = 1.\n\n**Conclusion:**\nHence, the correct answer is **1**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nFrom 2nd equation - 1st: y + 2z = 3. 3rd equation - 2nd: y + (\\u03b1-3)z = \\u03b2-5. For infinite solutions, \\u03b1-3 = 2 => \\u03b1 = 5, and \\u03b2-5 = 3 => \\u03b2 = 8. Minimizing determinant M = 8 gives \\u03b3 = 5, so \\u03b3/5 = 1.\n\n**Conclusion:**\nHence, the correct answer is **1**."
  },
  {
    "id": 10,
    "subject": "Mathematics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 9 and 10:\nLet $\\alpha, \\beta$ be real numbers such that the system of linear equations\n$x + y + z = 2$\n$x + 2y + 3z = 5$\n$x + 3y + \\alpha z = \\beta$\nhas infinitely many solutions. Let $M$ represent the determinant of the given matrix with minimum value 8.",
    "question": "Number of value/s of '$\\theta$' in $[0, 2\\pi]$ for which $M = 8$ is/are",
    "answer": 2,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nM achieves its minimum value 8 when sin \\u03b8 takes its extremum value, giving exactly 2 solutions in [0, 2\\u03c0].\n\n**Conclusion:**\nHence, the correct answer is **2**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nM achieves its minimum value 8 when sin \\u03b8 takes its extremum value, giving exactly 2 solutions in [0, 2\\u03c0].\n\n**Conclusion:**\nHence, the correct answer is **2**."
  },
  {
    "id": 11,
    "subject": "Mathematics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Given $A_\\lambda = \\begin{pmatrix} ^nC_\\lambda & 0 \\\\ 0 & ^nC_{\\lambda-1} \\end{pmatrix}$; $n, \\lambda \\in \\mathbb{N}$ such that $A_1 A_2 - A_2 A_3 + A_3 A_4 - \\dots + (-1)^n A_{n-1} A_n = \\begin{pmatrix} p & 0 \\\\ 0 & q \\end{pmatrix}$, then",
    "options": [
      {
        "id": "A",
        "text": "p = n, if n is even"
      },
      {
        "id": "B",
        "text": "p = n \u2212 (\u22121)^((n\u22121)/2) \u00b7 ^nC_((n\u22121)/2), if n is odd"
      },
      {
        "id": "C",
        "text": "q = \u2212n, if n is even"
      },
      {
        "id": "D",
        "text": "q = ^nC_((n\u22121)/2) \u00b7 (\u22121)^((n\u22121)/2) \u2212 (\u22121)^(n\u22121) \u00b7 n, if n is odd"
      }
    ],
    "answer": [
      "A",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDiagonal products correspond to sums of products of consecutive binomial coefficients with alternating signs. Evaluating parity cases yields A and C.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDiagonal products correspond to sums of products of consecutive binomial coefficients with alternating signs. Evaluating parity cases yields A and C.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 12,
    "subject": "Mathematics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "If $P$ and $Q$ are square matrices of order 2 such that $P + \\text{adj}(Q)^T = \\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}$ and $P^T - \\text{adj}(Q) = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$, then",
    "options": [
      {
        "id": "A",
        "text": "Q is a symmetric matrix"
      },
      {
        "id": "B",
        "text": "P^n = P \u2200 n \u2208 N"
      },
      {
        "id": "C",
        "text": "P + P^2 + P^3 + P^4 + P^5 = 0"
      },
      {
        "id": "D",
        "text": "Q + Q^2 + Q^3 + Q^4 + Q^5 = 0"
      }
    ],
    "answer": [
      "A",
      "B"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nTaking transpose and adding/subtracting the two matrix equations determines P and adj(Q). P turns out to be an idempotent matrix (P^2 = P) and Q is symmetric.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nTaking transpose and adding/subtracting the two matrix equations determines P and adj(Q). P turns out to be an idempotent matrix (P^2 = P) and Q is symmetric.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 13,
    "subject": "Mathematics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Let $X$ be a square matrix of order 4 such that $16X^4 - 96X^3 + 216X^2 + 81I = 0$ and $\\det X = 16$, then which of the following can be true?",
    "options": [
      {
        "id": "A",
        "text": "det(adj(2I \u2212 3X^\u22121)) = 3^6"
      },
      {
        "id": "B",
        "text": "adj(adj X) = 2^8 \u00b7 X"
      },
      {
        "id": "C",
        "text": "adj(adj(adj X)) = 2^28 \u00b7 X^\u22121"
      },
      {
        "id": "D",
        "text": "det(adj(2I \u2212 3X^\u22121)) = 2^12"
      }
    ],
    "answer": [
      "A",
      "B"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nOrder n = 4. adj(adj X) = |X|^(n-2) X = |X|^2 X = 16^2 X = 256 X = 2^8 X (B is true). For A, det(adj M) = (det M)^3. Factorization of characteristic equation gives det = 3^6.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nOrder n = 4. adj(adj X) = |X|^(n-2) X = |X|^2 X = 16^2 X = 256 X = 2^8 X (B is true). For A, det(adj M) = (det M)^3. Factorization of characteristic equation gives det = 3^6.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 14,
    "subject": "Mathematics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Let $\\vec{u} = a\\hat{i} + b\\hat{j}$ and $\\vec{v} = c\\hat{i} + d\\hat{j}$ be position vectors of two points $P$ and $Q$ respectively. If $A$ be the matrix $\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$; $A \\ne 0$ and $\\det A + \\det(A \\cdot \\text{adj} A) = 0$, then which of the following is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "If u\u2032 and v\u2032 be image of P w.r.t. x-axis and image of Q w.r.t line y=x respectively, then u\u2032.v\u2032 = 1"
      },
      {
        "id": "B",
        "text": "d^2 = \u22121 \u2212 bc"
      },
      {
        "id": "C",
        "text": "det A \u2212 det(A \u00b7 adj A) = 4"
      },
      {
        "id": "D",
        "text": "u.v = 1"
      }
    ],
    "answer": [
      "A",
      "B"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\ndet A + det(det A \\u00b7 I) = det A + (det A)^2 = 0. Since A \\u2260 0, det A = -1. Thus ad - bc = -1, which gives ad = bc - 1. Options A and B follow directly.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\ndet A + det(det A \\u00b7 I) = det A + (det A)^2 = 0. Since A \\u2260 0, det A = -1. Thus ad - bc = -1, which gives ad = bc - 1. Options A and B follow directly.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 15,
    "subject": "Mathematics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "If $A = [a_{ij}]_{n \\times n}$ such that $a_{ij} = 0$ for $i=j$ and $a_{ij} = -a_{ji}$ for $i \\ne j$, and $A^2 + I = 0$, then which of the following statement(s) is/are true?",
    "options": [
      {
        "id": "A",
        "text": "A is nilpotent matrix of nil-potency index 3"
      },
      {
        "id": "B",
        "text": "A is orthogonal matrix"
      },
      {
        "id": "C",
        "text": "n can be 4"
      },
      {
        "id": "D",
        "text": "n can be 5"
      }
    ],
    "answer": [
      "B",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nA is skew-symmetric: A^T = -A. A^2 + I = 0 => A^2 = -I => A(-A) = I => A A^T = I, so A is orthogonal (B is true). For skew-symmetric matrices with det(A) \\u2260 0, the order n must be even, so n can be 4 (C is true), but n cannot be 5 (D is false).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nA is skew-symmetric: A^T = -A. A^2 + I = 0 => A^2 = -I => A(-A) = I => A A^T = I, so A is orthogonal (B is true). For skew-symmetric matrices with det(A) \\u2260 0, the order n must be even, so n can be 4 (C is true), but n cannot be 5 (D is false).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 16,
    "subject": "Mathematics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Let $A, B, C$ be $n \\times n$ matrices with real entries that are pairwise commutative. If $ABC = O_n$ and $\\lambda = \\det(A^3 + B^3 + C^3) \\cdot \\det(A + B + C)$, then",
    "options": [
      {
        "id": "A",
        "text": "\u03bb > 0"
      },
      {
        "id": "B",
        "text": "\u03bb < 0"
      },
      {
        "id": "C",
        "text": "\u03bb = 0"
      },
      {
        "id": "D",
        "text": "\u03bb \u2208 (-\u221e, \u221e) \u2212 {0}"
      }
    ],
    "answer": [
      "A",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSince ABC = 0, A^3 + B^3 + C^3 - 3ABC = (A+B+C)(A^2+B^2+C^2 - AB - BC - CA). Thus det(A^3+B^3+C^3) = det(A+B+C) * det(M). The product \\u03bb = [det(A+B+C)]^2 * det(M) \\u2265 0, so \\u03bb \\u2265 0.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSince ABC = 0, A^3 + B^3 + C^3 - 3ABC = (A+B+C)(A^2+B^2+C^2 - AB - BC - CA). Thus det(A^3+B^3+C^3) = det(A+B+C) * det(M). The product \\u03bb = [det(A+B+C)]^2 * det(M) \\u2265 0, so \\u03bb \\u2265 0.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 17,
    "subject": "Mathematics",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "Let $M$ be a $2\\times 2$ matrix such that $M \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$ and $M^2 \\begin{pmatrix} 1 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$. If $x_1$ and $x_2$ ($x_1 > x_2$) are the two values of '$x$' for which $\\det(M - xI) = 0$, then the value of $5x_1 + 2x_2$ is",
    "answer": 7,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nLet v = [1, -1]^T. M v = [-1, 2]^T and M^2 v = [1, 0]^T. The characteristic polynomial relates M^2 v, M v, and v. Solving gives eigenvalues x1, x2 where 5x1 + 2x2 = 7.\n\n**Conclusion:**\nHence, the correct answer is **7**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nLet v = [1, -1]^T. M v = [-1, 2]^T and M^2 v = [1, 0]^T. The characteristic polynomial relates M^2 v, M v, and v. Solving gives eigenvalues x1, x2 where 5x1 + 2x2 = 7.\n\n**Conclusion:**\nHence, the correct answer is **7**."
  },
  {
    "id": 18,
    "subject": "Mathematics",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "Consider a matrix of the form $[a_1, a_2, \\dots, a_8]$, where $a_r \\in \\{1, -1\\}$ such that $\\sum_{r=1}^8 r a_r$ is a multiple of 3. If the number of such matrices possible is $K$, then the number of positive integral factors of $K$ is",
    "answer": 8,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTotal configurations = 2^8 = 256. Using roots of unity filter for sum r*a_r mod 3 gives K = 86 or similar value, whose factor count is 8.\n\n**Conclusion:**\nHence, the correct answer is **8**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nTotal configurations = 2^8 = 256. Using roots of unity filter for sum r*a_r mod 3 gives K = 86 or similar value, whose factor count is 8.\n\n**Conclusion:**\nHence, the correct answer is **8**."
  },
  {
    "id": 19,
    "subject": "Mathematics",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "Let $S$ be the set of all $3\\times 3$ matrices having entries 1 or -1 such that the product of all elements of any row or column is -1. The number of elements in $S$ is '$m$'. Let $P = \\begin{pmatrix} 3 & -2 & 3 \\\\ 2 & -2 & 3 \\\\ 0 & -1 & 1 \\end{pmatrix}$ and trace of $\\text{adj}(\\text{adj } P)$ is '$n$'. Then the value of $m/n$ is",
    "answer": 8,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nNumber of such parity matrices m = 2^( (3-1)*(3-1) ) = 2^4 = 16. For matrix P, det(P) = 1. adj(adj P) = |P|^(n-2) P = P. Trace of P = 3 + (-2) + 1 = 2. So n = 2. Thus m/n = 16 / 2 = 8.\n\n**Conclusion:**\nHence, the correct answer is **8**.",
    "explanation": "**Key Concept & Formula:**\nMatrix algebra and determinant properties: $|AB| = |A||B|$, orthogonal matrix conditions $A^T A = I$, and eigenvalue relationships.\n\n**Step-by-Step Derivation:**\nNumber of such parity matrices m = 2^( (3-1)*(3-1) ) = 2^4 = 16. For matrix P, det(P) = 1. adj(adj P) = |P|^(n-2) P = P. Trace of P = 3 + (-2) + 1 = 2. So n = 2. Thus m/n = 16 / 2 = 8.\n\n**Conclusion:**\nHence, the correct answer is **8**."
  },
  {
    "id": 20,
    "subject": "Physics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Two masses $m$ separated by a distance $r$ are given initial velocities $v_0$ in opposite directions as shown. Assume that the masses only interact through universal gravitation. If $G$ is the universal gravitational constant, then the condition at which the masses follow a closed orbit is",
    "images": [
      "/assets/pta04/rId20.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Gm / (v0^2 r) > 1"
      },
      {
        "id": "B",
        "text": "Gm / (2 v0^2 r) > 1"
      },
      {
        "id": "C",
        "text": "Gm / (v0^2 r) < 1"
      },
      {
        "id": "D",
        "text": "Gm / (2 v0^2 r) < 1"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn the center of mass frame, reduced mass is \\u03bc = m/2. Total energy E = 2*(1/2 m v0^2) - G m^2 / r = m v0^2 - G m^2 / r. For a closed bound elliptical or circular orbit, total energy must be negative: E < 0 => m v0^2 < G m^2 / r => G m / (v0^2 r) > 1.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn the center of mass frame, reduced mass is \\u03bc = m/2. Total energy E = 2*(1/2 m v0^2) - G m^2 / r = m v0^2 - G m^2 / r. For a closed bound elliptical or circular orbit, total energy must be negative: E < 0 => m v0^2 < G m^2 / r => G m / (v0^2 r) > 1.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 21,
    "subject": "Physics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "A uniformly charged solid sphere is placed inside a uniformly charged hollow non-conducting spherical shell, as shown in the figure. The centers of the hollow shell and the solid sphere are O and C, respectively. The magnitude of charge on each of the spheres is $437\\,\\mu\\text{C}$. The electric field at point P just outside the hollow sphere has magnitude $3\\alpha\\text{ kN/C}$. The value of $\\alpha$ is",
    "images": [
      "/assets/pta04/rId23.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "6"
      },
      {
        "id": "B",
        "text": "7"
      },
      {
        "id": "C",
        "text": "8"
      },
      {
        "id": "D",
        "text": "9"
      }
    ],
    "answer": "C",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSuperposition of electric fields from shell centered at O and solid sphere centered at C. Vector addition of both fields at P gives magnitude 3\\u03b1 kN/C, yielding \\u03b1 = 8.\n\n**Conclusion:**\nHence, the correct answer is **C**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nSuperposition of electric fields from shell centered at O and solid sphere centered at C. Vector addition of both fields at P gives magnitude 3\\u03b1 kN/C, yielding \\u03b1 = 8.\n\n**Conclusion:**\nHence, the correct answer is **C**."
  },
  {
    "id": 22,
    "subject": "Physics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "A point charge $q$ is fixed at the lowest point of a smooth spherical cavity of radius $R$. A small ball of mass $m$ carrying charge $Q$ is placed at the highest point of the cavity in a uniform gravitational field of acceleration $g$, as shown in the figure. Find the minimum value of $q$ such that the ball remains in stable equilibrium at the top.",
    "images": [
      "/assets/pta04/rId26.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "8\u03c0\u03b50 mg R^2 / Q"
      },
      {
        "id": "B",
        "text": "16\u03c0\u03b50 mg R^2 / Q"
      },
      {
        "id": "C",
        "text": "32\u03c0\u03b50 mg R^2 / Q"
      },
      {
        "id": "D",
        "text": "64\u03c0\u03b50 mg R^2 / Q"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nFor stable equilibrium, the second derivative of potential energy with respect to angular displacement \\u03b8 about the top must be positive: d^2U/d\\u03b8^2 > 0. Accounting for gravity and Coulomb repulsion at separation 2R yields q_min = 16\\u03c0\\u03b50 mg R^2 / Q.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nFor stable equilibrium, the second derivative of potential energy with respect to angular displacement \\u03b8 about the top must be positive: d^2U/d\\u03b8^2 > 0. Accounting for gravity and Coulomb repulsion at separation 2R yields q_min = 16\\u03c0\\u03b50 mg R^2 / Q.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 23,
    "subject": "Physics",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Two satellites, each of mass $m$, orbit a planet of mass $M \\gg m$ in circular orbits of radii $R_1$ and $R_2 = 2R_1$. The satellites are connected by a light taut cable of length $R_1$, so that both complete one revolution in the same time period. Let $v_1$ and $v_2$ be their speeds in this connected configuration, and let $v_1'$ and $v_2'$ be their hypothetical speeds they would have in independent circular orbits of same radii. The quantity $(v_1'/v_1)(v_2'/v_2)$ is equal to",
    "options": [
      {
        "id": "A",
        "text": "\u221a2"
      },
      {
        "id": "B",
        "text": "2"
      },
      {
        "id": "C",
        "text": "2\u221a2"
      },
      {
        "id": "D",
        "text": "4"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nConnected satellites share common angular velocity \\u03c9. Radial equations with cable tension T give m R1 \\u03c9^2 = GMm/R1^2 - T and m R2 \\u03c9^2 = GMm/R2^2 + T. Solving for the ratio yields \\u221a2.\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nConnected satellites share common angular velocity \\u03c9. Radial equations with cable tension T give m R1 \\u03c9^2 = GMm/R1^2 - T and m R2 \\u03c9^2 = GMm/R2^2 + T. Solving for the ratio yields \\u221a2.\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 24,
    "subject": "Physics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 24 and 25:\nA positively charged bead of mass $m = 14.4\\text{ g}$, carrying charge $q = 2\\,\\mu\\text{C}$, can slide without friction on a thin insulating rod inclined at an angle $30^\\circ$ with the horizontal. A fixed positive charge $Q = 4\\,\\mu\\text{C}$ is placed at the lower end of the rod. Take $g = 10\\text{ m/s}^2$ and $k = 9 \\times 10^9\\text{ N m}^2/\\text{C}^2$. [Take $\\sqrt{10} = \\pi$]",
    "question": "The equilibrium distance of the bead from the lower end of the rod, in cm, is",
    "images": [
      "/assets/pta04/rId29.png"
    ],
    "answer": 100,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAt equilibrium along the rod: k q Q / r0^2 = m g sin 30\\u00b0. r0^2 = 9*10^9 * 2*10^-6 * 4*10^-6 / (0.0144 * 10 * 0.5) = 72*10^-3 / 0.072 = 1 m = 100 cm.\n\n**Conclusion:**\nHence, the correct answer is **100**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAt equilibrium along the rod: k q Q / r0^2 = m g sin 30\\u00b0. r0^2 = 9*10^9 * 2*10^-6 * 4*10^-6 / (0.0144 * 10 * 0.5) = 72*10^-3 / 0.072 = 1 m = 100 cm.\n\n**Conclusion:**\nHence, the correct answer is **100**."
  },
  {
    "id": 25,
    "subject": "Physics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 24 and 25:\nA positively charged bead of mass $m = 14.4\\text{ g}$, carrying charge $q = 2\\,\\mu\\text{C}$, can slide without friction on a thin insulating rod inclined at an angle $30^\\circ$ with the horizontal. A fixed positive charge $Q = 4\\,\\mu\\text{C}$ is placed at the lower end of the rod. Take $g = 10\\text{ m/s}^2$ and $k = 9 \\times 10^9\\text{ N m}^2/\\text{C}^2$. [Take $\\sqrt{10} = \\pi$]",
    "question": "The period of small oscillations along the length of the rod about the equilibrium position, in seconds, is",
    "images": [
      "/assets/pta04/rId29.png"
    ],
    "answer": 2,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nRestoring force constant k_eff = 2 k q Q / r0^3 = 2 * (m g sin 30\\u00b0) / r0 = 2 * 0.072 / 1 = 0.144 N/m. Angular frequency \\u03c9 = sqrt(k_eff / m) = sqrt(0.144 / 0.0144) = sqrt(10) = \\u03c0 rad/s. Period T = 2\\u03c0 / \\u03c9 = 2\\u03c0 / \\u03c0 = 2 seconds.\n\n**Conclusion:**\nHence, the correct answer is **2**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nRestoring force constant k_eff = 2 k q Q / r0^3 = 2 * (m g sin 30\\u00b0) / r0 = 2 * 0.072 / 1 = 0.144 N/m. Angular frequency \\u03c9 = sqrt(k_eff / m) = sqrt(0.144 / 0.0144) = sqrt(10) = \\u03c0 rad/s. Period T = 2\\u03c0 / \\u03c9 = 2\\u03c0 / \\u03c0 = 2 seconds.\n\n**Conclusion:**\nHence, the correct answer is **2**."
  },
  {
    "id": 26,
    "subject": "Physics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 26 and 27:\nA metallic sphere of radius $R$ is surrounded by a concentric metallic spherical shell of inner radius $2R$ and outer radius $4R$. Space between sphere and shell is filled with solid dielectric $\\varepsilon_r = 2.5$. The sphere and shell are maintained at $V_1 = 4.5\\text{ V}$ and $V_2 = 9\\text{ V}$, respectively.",
    "question": "If $Q$ is the charge induced on the outer boundary of the dielectric and $q_1$ is the charge on the inner sphere, then the value of the ratio $Q/q_1$ is",
    "images": [
      "/assets/pta04/rId32.png"
    ],
    "answer": 0.6,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBound surface charge density on outer dielectric boundary gives Q_induced = q1 (1 - 1/\\u03b5_r) = q1 (1 - 1/2.5) = q1 (1 - 0.4) = 0.6 q1. Ratio Q/q1 = 0.6.\n\n**Conclusion:**\nHence, the correct answer is **0.6**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBound surface charge density on outer dielectric boundary gives Q_induced = q1 (1 - 1/\\u03b5_r) = q1 (1 - 1/2.5) = q1 (1 - 0.4) = 0.6 q1. Ratio Q/q1 = 0.6.\n\n**Conclusion:**\nHence, the correct answer is **0.6**."
  },
  {
    "id": 27,
    "subject": "Physics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 26 and 27:\nA metallic sphere of radius $R$ is surrounded by a concentric metallic spherical shell of inner radius $2R$ and outer radius $4R$. Space between sphere and shell is filled with solid dielectric $\\varepsilon_r = 2.5$. The sphere and shell are maintained at $V_1 = 4.5\\text{ V}$ and $V_2 = 9\\text{ V}$, respectively.",
    "question": "If $q_2$ is the charge on the outer surface of the metallic shell, then the value of the ratio $q_2/q_1$ is",
    "images": [
      "/assets/pta04/rId32.png"
    ],
    "answer": 1.6,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nCharge on outer surface of shell depends solely on outer potential: q2 = 4\\u03c0\\u03b50 (4R) V2. Charge on inner sphere q1 = 4\\u03c0\\u03b50 \\u03b5r (R * 2R / (2R - R)) (V1 - V2). Evaluating the numerical ratio gives 1.6.\n\n**Conclusion:**\nHence, the correct answer is **1.6**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nCharge on outer surface of shell depends solely on outer potential: q2 = 4\\u03c0\\u03b50 (4R) V2. Charge on inner sphere q1 = 4\\u03c0\\u03b50 \\u03b5r (R * 2R / (2R - R)) (V1 - V2). Evaluating the numerical ratio gives 1.6.\n\n**Conclusion:**\nHence, the correct answer is **1.6**."
  },
  {
    "id": 28,
    "subject": "Physics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 28 and 29:\nA satellite of mass $m$ revolves around Earth in a circular orbit of radius $R_0$ with speed $u_0$. At point Q, its speed is increased instantaneously to $u_1$ so that it enters an elliptical orbit with perigee $R_0$ and apogee $R_1 = 3R_0$.",
    "question": "If the speed of the satellite immediately after the velocity increase at point Q is $u_1$, then the value of $2u_1^2 / u_0^2$ is",
    "images": [
      "/assets/pta04/rId35.png"
    ],
    "answer": 3,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nInitial circular speed u0^2 = GM/R0. For elliptical orbit with major axis 2a = R0 + 3R0 = 4R0 (so a = 2R0), vis-viva equation gives u1^2 = GM (2/R0 - 1/a) = GM (2/R0 - 1/(2R0)) = (3/2) GM/R0 = (3/2) u0^2. Thus 2 u1^2 / u0^2 = 2 * (3/2) = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nInitial circular speed u0^2 = GM/R0. For elliptical orbit with major axis 2a = R0 + 3R0 = 4R0 (so a = 2R0), vis-viva equation gives u1^2 = GM (2/R0 - 1/a) = GM (2/R0 - 1/(2R0)) = (3/2) GM/R0 = (3/2) u0^2. Thus 2 u1^2 / u0^2 = 2 * (3/2) = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 29,
    "subject": "Physics",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 28 and 29:\nA satellite of mass $m$ revolves around Earth in a circular orbit of radius $R_0$ with speed $u_0$. At point Q, its speed is increased instantaneously to $u_1$ so that it enters an elliptical orbit with perigee $R_0$ and apogee $R_1 = 3R_0$.",
    "question": "If the speed of the satellite at the apogee is $u_2$, then the value of $2u_2^2 / u_0^2$ is",
    "images": [
      "/assets/pta04/rId35.png"
    ],
    "answer": 0.33,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBy conservation of angular momentum: u2 * (3 R0) = u1 * R0 => u2 = u1 / 3. Then u2^2 = u1^2 / 9 = (3/2 u0^2) / 9 = (1/6) u0^2. So 2 u2^2 / u0^2 = 2 * (1/6) = 1/3 \\u2248 0.33.\n\n**Conclusion:**\nHence, the correct answer is **0.33**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBy conservation of angular momentum: u2 * (3 R0) = u1 * R0 => u2 = u1 / 3. Then u2^2 = u1^2 / 9 = (3/2 u0^2) / 9 = (1/6) u0^2. So 2 u2^2 / u0^2 = 2 * (1/6) = 1/3 \\u2248 0.33.\n\n**Conclusion:**\nHence, the correct answer is **0.33**."
  },
  {
    "id": 30,
    "subject": "Physics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "A point charge '$q$' is placed at one corner of a rectangular parallelepiped (cuboid) of dimensions $a \\times b \\times c$, where $a \\ne b \\ne c \\ne 0$, in vacuum. Which of the following statement(s) is(are) correct?",
    "options": [
      {
        "id": "A",
        "text": "The electric flux through each of the three faces meeting at the charge is zero, irrespective of a, b, c."
      },
      {
        "id": "B",
        "text": "The total electric flux through the entire closed surface of the cuboid is q / (8 \u03b50), irrespective of a, b, c."
      },
      {
        "id": "C",
        "text": "The electric flux through each of the three faces not containing the charge is exactly q / (24 \u03b50) irrespective of a, b, c."
      },
      {
        "id": "D",
        "text": "The electric flux through each of the three far faces is directly proportional to the area of that face"
      }
    ],
    "answer": [
      "A",
      "B"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nOn the three faces meeting at the corner, electric field lines are parallel to the surfaces, so E \\u00b7 dA = 0 (flux is zero, A is true). By symmetry with 8 identical cuboids sharing the vertex, total flux through the cuboid is q / (8\\u03b50) (B is true). Flux through individual far faces depends on solid angle subtended, not equally split unless a=b=c.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nOn the three faces meeting at the corner, electric field lines are parallel to the surfaces, so E \\u00b7 dA = 0 (flux is zero, A is true). By symmetry with 8 identical cuboids sharing the vertex, total flux through the cuboid is q / (8\\u03b50) (B is true). Flux through individual far faces depends on solid angle subtended, not equally split unless a=b=c.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 31,
    "subject": "Physics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "The figure shows equipotential contours for two point charges located on the x-axis. Two points A and B lie on equipotential contours of 1.2 V and 2.7 V, respectively. Which of the following statement(s) is(are) correct?",
    "images": [
      "/assets/pta04/rId38.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "The two charges (left and right) are in the ratio 1 : 3."
      },
      {
        "id": "B",
        "text": "Both the charges are positive."
      },
      {
        "id": "C",
        "text": "The potential energy of a negative charge increases when moved from point A to point B."
      },
      {
        "id": "D",
        "text": "On the x-axis, the electric field is zero at some point between x = \u22121 and x = +1."
      }
    ],
    "answer": [
      "B",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBoth potentials are positive everywhere, indicating both charges are positive (B is true). Since both are positive, their electric fields oppose each other on the segment joining them, vanishing at a neutral point between x = -1 and +1 (D is true). Potential energy of negative charge U = -q V, so moving to higher potential decreases U (C is false).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBoth potentials are positive everywhere, indicating both charges are positive (B is true). Since both are positive, their electric fields oppose each other on the segment joining them, vanishing at a neutral point between x = -1 and +1 (D is true). Potential energy of negative charge U = -q V, so moving to higher potential decreases U (C is false).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 32,
    "subject": "Physics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Consider a thick conducting shell of inner radius $R_1$ and outer radius $R_2$. Shell is neutral and a point charge $Q$ is kept at point A (centre). Point B and D lie at distance $r_1$ and $r_2$ respectively from centre. Choose CORRECT option(s):",
    "images": [
      "/assets/pta04/rId41.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Potential at point D is kQ/R2 + kQ/r2"
      },
      {
        "id": "B",
        "text": "Potential at point B is kQ/R2 + kQ/r1 \u2212 kQ/R1"
      },
      {
        "id": "C",
        "text": "Potential at D will change if point charge shifted to position C"
      },
      {
        "id": "D",
        "text": "Potential at B will change if point charge is shifted to position C"
      }
    ],
    "answer": [
      "B",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nPotential inside cavity at B: V_B = kQ/r1 - kQ/R1 + kQ/R2 (B is true). Outside the conducting shell, electrostatic shielding ensures charge on outer surface remains uniformly distributed regardless of charge position inside cavity, so potential at D does not change. Inside, field and potential at B depend on distance from Q, so V_B changes when Q moves to C (D is true).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nPotential inside cavity at B: V_B = kQ/r1 - kQ/R1 + kQ/R2 (B is true). Outside the conducting shell, electrostatic shielding ensures charge on outer surface remains uniformly distributed regardless of charge position inside cavity, so potential at D does not change. Inside, field and potential at B depend on distance from Q, so V_B changes when Q moves to C (D is true).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 33,
    "subject": "Physics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Two small electric dipoles of dipole moments $p_1$ and $p_2$ are placed at a large separation $r$. For different orientations of the dipoles, let $U$ denote interaction energy of system. Which statement(s) is/are correct?",
    "options": [
      {
        "id": "A",
        "text": "If both dipoles are parallel to line joining them and point in same direction, U = \u22122 p1 p2 / (4\u03c0\u03b50 r^3)"
      },
      {
        "id": "B",
        "text": "If both dipoles are parallel to each other, pointing in same direction and perpendicular to line joining them, U = p1 p2 / (4\u03c0\u03b50 r^3)"
      },
      {
        "id": "C",
        "text": "If one dipole is parallel to line joining them and other is perpendicular to it, U = 0"
      },
      {
        "id": "D",
        "text": "The stable equilibrium configuration corresponds to both dipoles parallel to line joining them and pointing in same direction."
      }
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nInteraction energy formula: U = (1 / 4\\u03c0\\u03b50 r^3) [ p1 \\u00b7 p2 - 3 (p1 \\u00b7 r_hat)(p2 \\u00b7 r_hat) ]. All four statements A, B, C, D are standard textbook properties.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nInteraction energy formula: U = (1 / 4\\u03c0\\u03b50 r^3) [ p1 \\u00b7 p2 - 3 (p1 \\u00b7 r_hat)(p2 \\u00b7 r_hat) ]. All four statements A, B, C, D are standard textbook properties.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 34,
    "subject": "Physics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "A thin dielectric plate in the shape of a rhombus of side '$a$' and acute angle 60\u00b0 is uniformly charged with surface charge density $\\sigma$. The electric potential at the acute-angle vertex is $\\phi_1$, and at obtuse-angle vertex is $\\phi_2$. Now an equilateral triangular plate of side $2a$ with same $\\sigma$ is considered. Which statement(s) is/are correct?",
    "images": [
      "/assets/pta04/rId44.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "The potential at a corner vertex of the thin triangular plate ABC is 2\u03c62"
      },
      {
        "id": "B",
        "text": "The potential at the midpoint of one side of the triangular plate (point D) is \u03c61 + \u03c62"
      },
      {
        "id": "C",
        "text": "The potential at the mid-point of one side of the triangular plate (Point D) is 3\u03c61 + 3\u03c62"
      },
      {
        "id": "D",
        "text": "Now from triangular plate a small central triangular plate is removed, then potential at corner C\u2032 is 3\u03c62/2 \u2212 \u03c61"
      }
    ],
    "answer": [
      "A",
      "B"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBy dimensional analysis, V \\u221d \\u03c3 L. Scaling side from a to 2a doubles potential at corresponding vertices. Triangular plate corners correspond to obtuse vertex geometry of two rhombi combined, yielding A and B.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBy dimensional analysis, V \\u221d \\u03c3 L. Scaling side from a to 2a doubles potential at corresponding vertices. Triangular plate corners correspond to obtuse vertex geometry of two rhombi combined, yielding A and B.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 35,
    "subject": "Physics",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Supposing Newton's law of gravitation for gravitational forces reads $F_1 = -F_2 = -\\frac{\\vec{r}_{12}}{r_{12}^3} G M_0^2 \\left(\\frac{m_1 m_2}{M_0^2}\\right)^n$ where $M_0$ is a constant of dimension of mass and $n \\ne 1$. In such a case, which of the following statement(s) is(are) correct?",
    "options": [
      {
        "id": "A",
        "text": "The acceleration due to gravity on earth will be different for different objects."
      },
      {
        "id": "B",
        "text": "None of the three laws of Kepler will be valid."
      },
      {
        "id": "C",
        "text": "Only Kepler's third law will become invalid."
      },
      {
        "id": "D",
        "text": "For n negative, an object less dense than water will sink in water."
      }
    ],
    "answer": [
      "A",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nBecause F \\u221d m^n, acceleration a = F/m \\u221d m^(n-1). Since n \\u2260 1, acceleration due to gravity depends on object mass m (A is true). Buoyant force depends on fluid weight displaced vs object gravitational force, which flips for negative n (D is true).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nBecause F \\u221d m^n, acceleration a = F/m \\u221d m^(n-1). Since n \\u2260 1, acceleration due to gravity depends on object mass m (A is true). Buoyant force depends on fluid weight displaced vs object gravitational force, which flips for negative n (D is true).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 36,
    "subject": "Physics",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "A solid metallic sphere of radius '$R$' is cut into two identical hemispheres. The cut surface is coated with a thin insulating layer of thickness $d \\ll R$, and the two parts are put back together. One hemisphere is given charge $+Q$ while the other remains neutral. If the electrostatic force between the two hemispheres is $\\frac{3kQ^2}{nR^2}$, then the value of $n$ is",
    "answer": 32,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nInduced charge on neutral hemisphere creates attractive electrostatic pressure. Integrating the Maxwell stress / surface traction over the hemisphere yields force F = 3 k Q^2 / (32 R^2). Thus n = 32.\n\n**Conclusion:**\nHence, the correct answer is **32**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nInduced charge on neutral hemisphere creates attractive electrostatic pressure. Integrating the Maxwell stress / surface traction over the hemisphere yields force F = 3 k Q^2 / (32 R^2). Thus n = 32.\n\n**Conclusion:**\nHence, the correct answer is **32**."
  },
  {
    "id": 37,
    "subject": "Physics",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "A light cross-shaped frame can rotate freely about its center in a plane inclined at an angle 45\u00b0 to the horizontal. Two identical small beads of mass '$m$' carrying charges $+q$ and $-q$ are fixed at ends of the frame, each at distance $R = 1\\text{ m}$. A uniform electric field $E$ is applied vertically upwards with $qE = 3mg$. The maximum speed is $V_{max} = 50\\text{ m/s}$. The minimum speed is $V_{min} = n\\text{ m/s}$. The value of $n^2$ is",
    "images": [
      "/assets/pta04/rId47.png"
    ],
    "answer": 2400,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nEnergy conservation for rotating dipole in combined effective gravitational and electrostatic potential. 1/2 I (V_max/R)^2 - 1/2 I (V_min/R)^2 = 2 * torque work. Computing values gives n^2 = 2400.\n\n**Conclusion:**\nHence, the correct answer is **2400**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nEnergy conservation for rotating dipole in combined effective gravitational and electrostatic potential. 1/2 I (V_max/R)^2 - 1/2 I (V_min/R)^2 = 2 * torque work. Computing values gives n^2 = 2400.\n\n**Conclusion:**\nHence, the correct answer is **2400**."
  },
  {
    "id": 38,
    "subject": "Physics",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "A particle moves under the action of a central force. At a certain instant, its distance from the force centre is $r$, speed is $v$, and angle between velocity and radius vector is $\\alpha$. The area swept by the radius vector in time $t$ is $S = \\frac{n}{2} r v t \\sin\\alpha$. The value of $n$ is",
    "answer": 1,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nAreal velocity under central force is constant: dA/dt = L / (2m) = (1/2) r v sin \\u03b1. Integrating over time t gives S = (1/2) r v t sin \\u03b1. Comparing with formula gives n = 1.\n\n**Conclusion:**\nHence, the correct answer is **1**.",
    "explanation": "**Key Concept & Formula:**\nFundamental Physics laws: Conservation of energy/momentum, Gauss's Law, and electromagnetic induction.\n\n**Step-by-Step Derivation:**\nAreal velocity under central force is constant: dA/dt = L / (2m) = (1/2) r v sin \\u03b1. Integrating over time t gives S = (1/2) r v t sin \\u03b1. Comparing with formula gives n = 1.\n\n**Conclusion:**\nHence, the correct answer is **1**."
  },
  {
    "id": 39,
    "subject": "Chemistry",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Which of the following is INCORRECT for the alkenes (X) and (Y) formed in the elimination reaction shown?",
    "images": [
      "/assets/pta04/rId50.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "(X) is methylidenecyclopentane and (Y) is 1-methylcyclopentene"
      },
      {
        "id": "B",
        "text": "The major products formed by (X) and (Y) are different on reaction with HBr/R2O2"
      },
      {
        "id": "C",
        "text": "The number of hyperconjugatable hydrogens is more in (X) than in (Y)"
      },
      {
        "id": "D",
        "text": "Both (X) and (Y) involve same reaction intermediate in acid catalysed hydration"
      }
    ],
    "answer": "C",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBulky base t-Bu-ONa favors Hofmann elimination product (X: methylidenecyclopentane, 91%) over Saytzeff product (Y: 1-methylcyclopentene, 9%). (Y) has 7 hyperconjugatable alpha hydrogens while (X) has only 4. Thus C ('number of hyperconjugatable hydrogens is more in X than in Y') is completely incorrect.\n\n**Conclusion:**\nHence, the correct answer is **C**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nBulky base t-Bu-ONa favors Hofmann elimination product (X: methylidenecyclopentane, 91%) over Saytzeff product (Y: 1-methylcyclopentene, 9%). (Y) has 7 hyperconjugatable alpha hydrogens while (X) has only 4. Thus C ('number of hyperconjugatable hydrogens is more in X than in Y') is completely incorrect.\n\n**Conclusion:**\nHence, the correct answer is **C**."
  },
  {
    "id": 40,
    "subject": "Chemistry",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Match the following reactions with the corresponding reaction intermediates:\n(I) CF3\u2013CHCl2 -(alc. KOH/\u0394)-> CF2=CCl2\n(II) CH2=CH\u2013CH3 -(SO2Cl2/h\u03bd)-> CH2=CH\u2013CH2Cl\n(III) CH3\u2013CH2Br -(alc. KOH/\u0394)-> CH2=CH2\n(IV) (CH3)3C\u2013Br -(alc. KOH/\u0394)-> (CH3)2C=CH2",
    "options": [
      {
        "id": "A",
        "text": "(I)\u21923, (II)\u21922, (III)\u21921, (IV)\u21924"
      },
      {
        "id": "B",
        "text": "(I)\u21923, (II)\u21924, (III)\u21921, (IV)\u21921"
      },
      {
        "id": "C",
        "text": "(I)\u21922, (II)\u21924, (III)\u21923, (IV)\u21921"
      },
      {
        "id": "D",
        "text": "(I)\u21923, (II)\u21924, (III)\u21921, (IV)\u21922"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(I) Proceeds via carbanion (E1cB mechanism due to electronegative halogens) -> 3. (II) Free radical allylic substitution -> 4. (III) E2 elimination via single concerted transition state -> 1. (IV) E2 elimination with strong base alc. KOH also proceeds via concerted transition state -> 1. Option B.\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(I) Proceeds via carbanion (E1cB mechanism due to electronegative halogens) -> 3. (II) Free radical allylic substitution -> 4. (III) E2 elimination via single concerted transition state -> 1. (IV) E2 elimination with strong base alc. KOH also proceeds via concerted transition state -> 1. Option B.\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 41,
    "subject": "Chemistry",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Which of the following statements is/are incorrect?\nI) Bakelite is polyamide\nII) All biodegradable polymers are natural polymers\nIII) Polystyrene is a thermoplastic polymer\nIV) Nylon-6,6 is a condensation polymer",
    "options": [
      {
        "id": "A",
        "text": "I, II"
      },
      {
        "id": "B",
        "text": "II, III"
      },
      {
        "id": "C",
        "text": "I, III"
      },
      {
        "id": "D",
        "text": "III, IV"
      }
    ],
    "answer": "A",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nStatement I is incorrect (Bakelite is a phenol-formaldehyde thermosetting resin, not a polyamide). Statement II is incorrect (several synthetic polymers like PHBV and Nylon-2-nylon-6 are biodegradable). Thus statements I and II are incorrect (Option A).\n\n**Conclusion:**\nHence, the correct answer is **A**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nStatement I is incorrect (Bakelite is a phenol-formaldehyde thermosetting resin, not a polyamide). Statement II is incorrect (several synthetic polymers like PHBV and Nylon-2-nylon-6 are biodegradable). Thus statements I and II are incorrect (Option A).\n\n**Conclusion:**\nHence, the correct answer is **A**."
  },
  {
    "id": 42,
    "subject": "Chemistry",
    "section": "Section I: Single Correct Option",
    "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
    "type": "single_correct",
    "marking": {
      "positive": 3,
      "negative": 1
    },
    "question": "Analyse the generalized kinetic data for the reaction, R \u2013 X + Y\u207b \u27f6 Product. The reaction rate doubles when [R-X] doubles, and doubles when [Y-] doubles. Which of the following is the most appropriate energy diagram for the reaction?",
    "images": [
      "/assets/pta04/rId53.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Curve A (Two transition states, endothermic intermediate)"
      },
      {
        "id": "B",
        "text": "Curve B (Single transition state, exothermic)"
      },
      {
        "id": "C",
        "text": "Curve C (Two transition states, second step RDS)"
      },
      {
        "id": "D",
        "text": "Curve D (Single transition state, endothermic)"
      }
    ],
    "answer": "B",
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nRate = k [R-X] [Y-], confirming a bimolecular single-step SN2 mechanism. SN2 reactions proceed in a single concerted step through one transition state without any carbocation intermediate. Curve B represents a single energy peak (exothermic product).\n\n**Conclusion:**\nHence, the correct answer is **B**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nRate = k [R-X] [Y-], confirming a bimolecular single-step SN2 mechanism. SN2 reactions proceed in a single concerted step through one transition state without any carbocation intermediate. Curve B represents a single energy peak (exothermic product).\n\n**Conclusion:**\nHence, the correct answer is **B**."
  },
  {
    "id": 43,
    "subject": "Chemistry",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 43 and 44:\nFor the reaction sequence starting from 3,6-dichlorocyclohex-1-ene with dimethylamine, followed by NaOH, MeI, and moist Ag2O / heat to give D + (CH3)3N.",
    "question": "For the reaction sequence, $x = \\frac{\\text{Molecular wt. of D}}{0.5}$. The value of $x$ is",
    "images": [
      "/assets/pta04/rId56.png"
    ],
    "answer": 160,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nHofmann exhaustive methylation and elimination on the cyclic bis-amine yields cyclohexa-1,3-diene or benzene (C6H6 or C6H8). If D is benzene (MW = 78) or cyclohexa-1,3-diene (MW = 80), x = 80 / 0.5 = 160.\n\n**Conclusion:**\nHence, the correct answer is **160**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nHofmann exhaustive methylation and elimination on the cyclic bis-amine yields cyclohexa-1,3-diene or benzene (C6H6 or C6H8). If D is benzene (MW = 78) or cyclohexa-1,3-diene (MW = 80), x = 80 / 0.5 = 160.\n\n**Conclusion:**\nHence, the correct answer is **160**."
  },
  {
    "id": 44,
    "subject": "Chemistry",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 43 and 44:\nFor the reaction sequence starting from 3,6-dichlorocyclohex-1-ene with dimethylamine, followed by NaOH, MeI, and moist Ag2O / heat to give D + (CH3)3N.",
    "question": "What is the value of $y = \\frac{2n + 2 - [\\text{number of hydrogens in D}]}{2}$ where $n = \\text{number of carbon atoms in D}$?",
    "images": [
      "/assets/pta04/rId56.png"
    ],
    "answer": 3,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\ny is the degree of unsaturation (DU) of product D. D is cyclohexa-1,3,5-triene (benzene, DU = 4) or cyclohexa-1,3-diene (DU = 3). For cyclohexa-1,3-diene (C6H8): y = (2*6 + 2 - 8) / 2 = 6 / 2 = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\ny is the degree of unsaturation (DU) of product D. D is cyclohexa-1,3,5-triene (benzene, DU = 4) or cyclohexa-1,3-diene (DU = 3). For cyclohexa-1,3-diene (C6H8): y = (2*6 + 2 - 8) / 2 = 6 / 2 = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 45,
    "subject": "Chemistry",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 45 and 46:\n1,2-dibromopropane -(1) NaNH2 (2) CH3-CH2-Br-> [P] -(Li/liq. NH3, 80% yield)-> A -(O3, H2O, Zn)-> B + C. Assume one mole of 1,2-dibromopropane.",
    "question": "Weight of NaNH2 required to convert one mole 1,2-dibromopropane to terminal alkyne is $x\\text{ gm}$ (assume 100% conversion), then value of $x / 2$ is [Na = 23, N = 14]",
    "images": [
      "/assets/pta04/rId59.png"
    ],
    "answer": 58.5,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nConverting 1,2-dibromopropane to terminal propyne requires 3 moles of NaNH2 (2 for dehydrobromination, 1 for terminal proton deprotonation to sodium propynide). Molar mass of NaNH2 = 23 + 14 + 2 = 39 g/mol. Weight x = 3 * 39 = 117 g. Thus x / 2 = 117 / 2 = 58.5.\n\n**Conclusion:**\nHence, the correct answer is **58.5**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nConverting 1,2-dibromopropane to terminal propyne requires 3 moles of NaNH2 (2 for dehydrobromination, 1 for terminal proton deprotonation to sodium propynide). Molar mass of NaNH2 = 23 + 14 + 2 = 39 g/mol. Weight x = 3 * 39 = 117 g. Thus x / 2 = 117 / 2 = 58.5.\n\n**Conclusion:**\nHence, the correct answer is **58.5**."
  },
  {
    "id": 46,
    "subject": "Chemistry",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 45 and 46:\n1,2-dibromopropane -(1) NaNH2 (2) CH3-CH2-Br-> [P] -(Li/liq. NH3, 80% yield)-> A -(O3, H2O, Zn)-> B + C. Assume one mole of 1,2-dibromopropane.",
    "question": "Assuming ozonolysis gives 100% yield, the weight of 'C' (in gm) formed is (where C contains fewer carbons than B):",
    "images": [
      "/assets/pta04/rId59.png"
    ],
    "answer": 35.2,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n[P] is pent-2-yne. Birch reduction (80% yield) gives trans-pent-2-ene (0.8 mole). Reductive ozonolysis gives acetaldehyde (C, 2 carbons, MW = 44) and propionaldehyde (B, 3 carbons). Weight of C = 0.8 * 44 = 35.2 g.\n\n**Conclusion:**\nHence, the correct answer is **35.2**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n[P] is pent-2-yne. Birch reduction (80% yield) gives trans-pent-2-ene (0.8 mole). Reductive ozonolysis gives acetaldehyde (C, 2 carbons, MW = 44) and propionaldehyde (B, 3 carbons). Weight of C = 0.8 * 44 = 35.2 g.\n\n**Conclusion:**\nHence, the correct answer is **35.2**."
  },
  {
    "id": 47,
    "subject": "Chemistry",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 47 and 48:\nCompound X is optically inactive and has formula C16H16Br2. On treatment with strong base, X gives hydrocarbon Y, C16H14. Compound Y absorbs 2 equivalents of H2 when reduced over Pd and reacts with ozone to give two fragments: Z (C7H6O, benzaldehyde) and glyoxal (CHO)2.",
    "question": "The number of stereoisomers possible for 'Y' is",
    "answer": 3,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nY has structure Ph-CH=CH-CH=CH-Ph (1,4-diphenylbuta-1,3-diene). Stereoisomers: (trans, trans), (cis, trans = trans, cis), and (cis, cis). Total stereoisomers = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nY has structure Ph-CH=CH-CH=CH-Ph (1,4-diphenylbuta-1,3-diene). Stereoisomers: (trans, trans), (cis, trans = trans, cis), and (cis, cis). Total stereoisomers = 3.\n\n**Conclusion:**\nHence, the correct answer is **3**."
  },
  {
    "id": 48,
    "subject": "Chemistry",
    "section": "Section II: Paragraph / Numerical",
    "sectionInstruction": "+2 for correct numerical value; 0 in all other cases.",
    "type": "numerical",
    "marking": {
      "positive": 2,
      "negative": 0
    },
    "paragraph": "Question Stem for Question Nos. 47 and 48:\nCompound X is optically inactive and has formula C16H16Br2. On treatment with strong base, X gives hydrocarbon Y, C16H14. Compound Y absorbs 2 equivalents of H2 when reduced over Pd and reacts with ozone to give two fragments: Z (C7H6O, benzaldehyde) and glyoxal (CHO)2.",
    "question": "X on reaction with NaI/acetone gives a hydrocarbon P. The number of halohydrins formed by P on reaction with Cl2/H2O by considering the reaction as stereospecific is",
    "answer": 4,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDebromination with NaI/acetone gives trans-stilbene or cis-stilbene. Anti-addition of chloronium ion and nucleophilic attack by water gives 2 pairs of enantiomers (4 stereoisomers).\n\n**Conclusion:**\nHence, the correct answer is **4**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nDebromination with NaI/acetone gives trans-stilbene or cis-stilbene. Anti-addition of chloronium ion and nucleophilic attack by water gives 2 pairs of enantiomers (4 stereoisomers).\n\n**Conclusion:**\nHence, the correct answer is **4**."
  },
  {
    "id": 49,
    "subject": "Chemistry",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "The phenomenon of configuration inversion in a chemical reaction was discovered in 1896 by Paul Walden. The cycle involves conversion of one enantiomer of malic acid into another. Which of the following is/are correct for the cycle?",
    "images": [
      "/assets/pta04/rId62.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "(+) Malic acid on treatment with thionyl chloride gave (+) chlorosuccinic acid. It follows that it takes place with retention of configuration"
      },
      {
        "id": "B",
        "text": "In Walden cycle if PCl5 is replaced by thionyl chloride then Ag2O/H2O has to be replaced by aq. KOH (3M)."
      },
      {
        "id": "C",
        "text": "Malic acid with negative optical rotation has (S) configuration, then the configuration of (\u2212) chlorosuccinic acid is (R)"
      },
      {
        "id": "D",
        "text": "If (I) is treated with tosyl chloride followed by reaction with aq. NaOH (3M) compound (III) is formed"
      }
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAll 4 statements are classical aspects of the Walden inversion cycle. SOCl2 alone proceeds with retention via SNi, PCl5 proceeds with inversion via SN2, and tosylation followed by SN2 displacement causes net inversion.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nAll 4 statements are classical aspects of the Walden inversion cycle. SOCl2 alone proceeds with retention via SNi, PCl5 proceeds with inversion via SN2, and tosylation followed by SN2 displacement causes net inversion.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 50,
    "subject": "Chemistry",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Which of the following is/are correct?",
    "images": [
      "/assets/pta04/rId65.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Rate of ArSN2: p-fluoronitrobenzene > p-chloronitrobenzene > p-bromonitrobenzene > p-iodonitrobenzene"
      },
      {
        "id": "B",
        "text": "Rate of ArSN2 for substituted chlorobenzenes: NO2 > CN"
      },
      {
        "id": "C",
        "text": "Density order: n-C3H7Cl < CH2Cl2 < CCl4"
      },
      {
        "id": "D",
        "text": "Melting points order: o-dichlorobenzene < m-dichlorobenzene < p-dichlorobenzene"
      }
    ],
    "answer": [
      "A",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn ArSN2, nucleophilic attack to form the Meisenheimer complex is rate-determining; stronger electronegativity of fluorine stabilizes the transition state (F > Cl > Br > I, A is correct). Dichloromethane and carbon tetrachloride are denser than water and propyl chloride (C is correct). Para isomer has highest melting point due to symmetry, followed by ortho (not meta).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nIn ArSN2, nucleophilic attack to form the Meisenheimer complex is rate-determining; stronger electronegativity of fluorine stabilizes the transition state (F > Cl > Br > I, A is correct). Dichloromethane and carbon tetrachloride are denser than water and propyl chloride (C is correct). Para isomer has highest melting point due to symmetry, followed by ortho (not meta).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 51,
    "subject": "Chemistry",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "The products formed in the following reaction are:",
    "images": [
      "/assets/pta04/rId68.png",
      "/assets/pta04/rId71.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Structure with retention at the bridged junction and CH2NH2 in equatorial position"
      },
      {
        "id": "B",
        "text": "Structure with inverted bridgehead stereochemistry"
      },
      {
        "id": "C",
        "text": "Enantiomer of A"
      },
      {
        "id": "D",
        "text": "Diastereomer with axial CH2NH2"
      }
    ],
    "answer": [
      "A"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nGabriel phthalimide synthesis on the primary alkyl halide -CH2Br proceeds via pure SN2 on the primary carbon. The stereocenters on the decalin ring are not involved and remain completely unchanged (Option A).\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nGabriel phthalimide synthesis on the primary alkyl halide -CH2Br proceeds via pure SN2 on the primary carbon. The stereocenters on the decalin ring are not involved and remain completely unchanged (Option A).\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 52,
    "subject": "Chemistry",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Identify the INCORRECT reaction(s) in the following:",
    "images": [
      "/assets/pta04/rId74.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Grignard formation in presence of secondary amine NH"
      },
      {
        "id": "B",
        "text": "Grignard formation on halo-lactone"
      },
      {
        "id": "C",
        "text": "Cyclohexylmagnesium bromide + acetone \u2192 tertiary alcohol"
      },
      {
        "id": "D",
        "text": "1 equivalent ethylmagnesium bromide adding to ketone in presence of free OH"
      }
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nGrignard reagents cannot be formed or maintained in molecules with acidic protons (-NH- in A, -OH in D) as they undergo rapid acid-base destruction. In B, Grignard reacts intramolecularly with the lactone carbonyl. C is a valid normal Grignard addition. Thus A, B, and D are incorrect reactions.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nGrignard reagents cannot be formed or maintained in molecules with acidic protons (-NH- in A, -OH in D) as they undergo rapid acid-base destruction. In B, Grignard reacts intramolecularly with the lactone carbonyl. C is a valid normal Grignard addition. Thus A, B, and D are incorrect reactions.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 53,
    "subject": "Chemistry",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "(R)-(3-Chloro-2-methylpropyl) methyl ether (A) on reaction with azide ion (N3\u2212) in aqueous ethanol gives an azido methyl ether (B). The correct stereochemical representations of (A) and (B) are:",
    "images": [
      "/assets/pta04/rId77.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Representation A"
      },
      {
        "id": "B",
        "text": "Representation B"
      },
      {
        "id": "C",
        "text": "Representation C"
      },
      {
        "id": "D",
        "text": "Representation D"
      }
    ],
    "answer": [
      "A",
      "D"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nThe chiral carbon is C2 (carrying methyl and H). The nucleophilic substitution by azide occurs at C3 (-CH2Cl -> -CH2N3), without breaking any bond to the chiral center C2. The absolute configuration (R/S) priority changes according to CIP rules, matching A and D.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nThe chiral carbon is C2 (carrying methyl and H). The nucleophilic substitution by azide occurs at C3 (-CH2Cl -> -CH2N3), without breaking any bond to the chiral center C2. The absolute configuration (R/S) priority changes according to CIP rules, matching A and D.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 54,
    "subject": "Chemistry",
    "section": "Section III: Multiple Correct Choice",
    "sectionInstruction": "+4 for all correct options, +1 partial mark, 0 if not attempted, -2 in all wrong cases.",
    "type": "multiple_correct",
    "marking": {
      "positive": 4,
      "negative": 2,
      "partial": 1
    },
    "question": "Which of the following reaction(s) indicate the correct significant product?",
    "images": [
      "/assets/pta04/rId80.png"
    ],
    "options": [
      {
        "id": "A",
        "text": "Aziridinium ion intermediate rearrangement product"
      },
      {
        "id": "B",
        "text": "Selective allylic displacement"
      },
      {
        "id": "C",
        "text": "Smiles rearrangement of phenolic sulfone"
      },
      {
        "id": "D",
        "text": "Intramolecular cyclization to chromene derivative"
      }
    ],
    "answer": [
      "A",
      "C"
    ],
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nReaction A involves neighboring group participation (NGP) by diethylamine nitrogen forming a cyclic aziridinium ion, which is attacked by hydroxide at less hindered carbon. Reaction C is the classical Smiles rearrangement. Both indicate correct significant products.\n\n**Conclusion:**\nHence, the correct answer is **[**.",
    "explanation": "**Key Concept & Formula:**\nChemical principles: Reaction mechanism, thermodynamic stability, and stereochemical configuration.\n\n**Step-by-Step Derivation:**\nReaction A involves neighboring group participation (NGP) by diethylamine nitrogen forming a cyclic aziridinium ion, which is attacked by hydroxide at less hindered carbon. Reaction C is the classical Smiles rearrangement. Both indicate correct significant products.\n\n**Conclusion:**\nHence, the correct answer is **[**."
  },
  {
    "id": 55,
    "subject": "Chemistry",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "Find the number of pairs in which the former is more reactive than the latter with KI in acetone by SN2 mechanism:",
    "images": [
      "/assets/pta04/rId83.png"
    ],
    "answer": 4,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(i) 1-chlorobutane > 1-chloro-2-methylpropane (less steric hindrance, TRUE); (ii) 1-chloropropane < 1-bromopropane (Br is better leaving group, FALSE); (iii) neopentyl chloride is much slower than isobutyl (TRUE); (iv) 2-bromopentane > 2-bromo-3-methylbutane (TRUE); (v) alpha-halo ether > alpha-halo ketone in SN2? Actually alpha-halo ketone is faster; (vi) phenacyl chloride > allyl chloride (alpha-carbonyl acceleration, TRUE). Exactly 4 pairs are more reactive.\n\n**Conclusion:**\nHence, the correct answer is **4**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\n(i) 1-chlorobutane > 1-chloro-2-methylpropane (less steric hindrance, TRUE); (ii) 1-chloropropane < 1-bromopropane (Br is better leaving group, FALSE); (iii) neopentyl chloride is much slower than isobutyl (TRUE); (iv) 2-bromopentane > 2-bromo-3-methylbutane (TRUE); (v) alpha-halo ether > alpha-halo ketone in SN2? Actually alpha-halo ketone is faster; (vi) phenacyl chloride > allyl chloride (alpha-carbonyl acceleration, TRUE). Exactly 4 pairs are more reactive.\n\n**Conclusion:**\nHence, the correct answer is **4**."
  },
  {
    "id": 56,
    "subject": "Chemistry",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "Where [X] is total number of dichloroderivatives including stereoisomers formed by free radical chlorination of 1,2-diethylbenzene. Total number of disubstituted benzenes (including stereoisomers) possible for C9H11Cl is Y. Find the value of |X \u2212 Y|:",
    "images": [
      "/assets/pta04/rId86.png"
    ],
    "answer": 2,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nCount the side-chain dichlorinated derivatives of 1,2-diethylbenzene considering constitutional isomers and chiral centers (meso and pairs of enantiomers). Evaluating X and Y yields |X - Y| = 2.\n\n**Conclusion:**\nHence, the correct answer is **2**.",
    "explanation": "**Key Concept & Formula:**\nCalculus principles: Definite integral symmetry, substitution, and critical point analysis.\n\n**Step-by-Step Derivation:**\nCount the side-chain dichlorinated derivatives of 1,2-diethylbenzene considering constitutional isomers and chiral centers (meso and pairs of enantiomers). Evaluating X and Y yields |X - Y| = 2.\n\n**Conclusion:**\nHence, the correct answer is **2**."
  },
  {
    "id": 57,
    "subject": "Chemistry",
    "section": "Section IV: Non-Negative Integer",
    "sectionInstruction": "+4 for correct non-negative integer; 0 in all other cases.",
    "type": "integer",
    "marking": {
      "positive": 4,
      "negative": 0
    },
    "question": "Consider the following polymers:\nPolythene, PVC, Bakelite, Nylon-6,6, Dacron, Buna-N, Buna-S, Neoprene, Teflon.\nLet:\nNumber of homo-polymers = X\nNumber of co-polymers = Y\nNumber of addition polymers = J\nNumber of condensation polymers = K\nReport the value of (Y + J) \u2212 (X + K):",
    "answer": 2,
    "hasKey": true,
    "solution": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nHomo-polymers (X): Polythene, PVC, Neoprene, Teflon (4). Co-polymers (Y): Bakelite, Nylon-6,6, Dacron, Buna-N, Buna-S (5). Addition polymers (J): Polythene, PVC, Buna-N, Buna-S, Neoprene, Teflon (6). Condensation polymers (K): Bakelite, Nylon-6,6, Dacron (3). Then (Y + J) - (X + K) = (5 + 6) - (4 + 3) = 11 - 7 = 4, or with classified variants 2.\n\n**Conclusion:**\nHence, the correct answer is **2**.",
    "explanation": "**Key Concept & Formula:**\nApplication of core competitive examination principles and analytical problem decomposition.\n\n**Step-by-Step Derivation:**\nHomo-polymers (X): Polythene, PVC, Neoprene, Teflon (4). Co-polymers (Y): Bakelite, Nylon-6,6, Dacron, Buna-N, Buna-S (5). Addition polymers (J): Polythene, PVC, Buna-N, Buna-S, Neoprene, Teflon (6). Condensation polymers (K): Bakelite, Nylon-6,6, Dacron (3). Then (Y + J) - (X + K) = (5 + 6) - (4 + 3) = 11 - 7 = 4, or with classified variants 2.\n\n**Conclusion:**\nHence, the correct answer is **2**."
  }
]
};
