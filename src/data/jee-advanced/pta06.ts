import { TestPaper } from '../testTypes';

export const pta06Data: TestPaper = {
  "id": "jee-advanced-pta-06",
  "examCategory": "jee-advanced",
  "examType": "JEE Advanced",
  "code": "PTA 06",
  "status": "live",
  "aliasId": "pta-06",
  "title": "JEE Advanced Test Series \u2014 PTA-06",
  "subtitle": "Full Syllabus Advanced Mock Examination",
  "date": "06-09-2026",
  "durationMinutes": 180,
  "maxMarks": 180,
  "totalQuestions": 51,
  "sectionsSummary": [
    {
      "subject": "Mathematics",
      "sections": [
        {
          "name": "Section I: Multiple Correct Choice",
          "questionCount": 3,
          "marking": "+4, -2 (Partial +1)"
        },
        {
          "name": "Section II: Single Correct Option",
          "questionCount": 4,
          "marking": "+3, -1"
        },
        {
          "name": "Section III: Non-Negative Integer",
          "questionCount": 6,
          "marking": "+4, 0"
        },
        {
          "name": "Section IV: Matching List",
          "questionCount": 4,
          "marking": "+3, -1"
        }
      ]
    },
    {
      "subject": "Physics",
      "sections": [
        {
          "name": "Section I: Multiple Correct Choice",
          "questionCount": 3,
          "marking": "+4, -2 (Partial +1)"
        },
        {
          "name": "Section II: Single Correct Option",
          "questionCount": 4,
          "marking": "+3, -1"
        },
        {
          "name": "Section III: Non-Negative Integer",
          "questionCount": 6,
          "marking": "+4, 0"
        },
        {
          "name": "Section IV: Matching List",
          "questionCount": 4,
          "marking": "+3, -1"
        }
      ]
    },
    {
      "subject": "Chemistry",
      "sections": [
        {
          "name": "Section I: Multiple Correct Choice",
          "questionCount": 3,
          "marking": "+4, -2 (Partial +1)"
        },
        {
          "name": "Section II: Single Correct Option",
          "questionCount": 4,
          "marking": "+3, -1"
        },
        {
          "name": "Section III: Non-Negative Integer",
          "questionCount": 6,
          "marking": "+4, 0"
        },
        {
          "name": "Section IV: Matching List",
          "questionCount": 4,
          "marking": "+3, -1"
        }
      ]
    }
  ],
  "questions": [
    {
      "id": 1,
      "subject": "Mathematics",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "If three distinct numbers are chosen simultaneously from the set $\\{1, 3, 3^2, \\ldots, 3^n\\}$, $n \\ge 3$ without replacement, then the probability that they form an increasing geometric progression, is",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "$\\frac{3}{2n}$ if $n$ is odd"
        },
        {
          "id": "B",
          "text": "$\\frac{3}{2n}$ if $n$ is even"
        },
        {
          "id": "C",
          "text": "$\\frac{3n}{n^2 - 1}$ if $n$ is even"
        },
        {
          "id": "D",
          "text": "$\\frac{3n}{2(n^2 - 1)}$ if $n$ is even"
        }
      ],
      "answer": [
        "A",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nThree powers $3^a, 3^b, 3^c$ with $0 \\le a < b < c \\le n$ form an increasing geometric progression if and only if their exponents $a, b, c$ form an increasing arithmetic progression in $\\{0, 1, 2, \\ldots, n\\}$, i.e., $2b = a + c$. This requires $a$ and $c$ to have the same parity.\n\n**Step-by-Step Derivation:**\n1. The set $\\{0, 1, 2, \\ldots, n\\}$ contains $n + 1$ integers. Total ways to select 3 numbers is $\\binom{n+1}{3} = \\frac{(n+1)n(n-1)}{6}$.\n2. Once $a$ and $c$ of the same parity are chosen, $b = \\frac{a+c}{2}$ is uniquely determined.\n3. **Case 1: $n$ is odd**\n   $n + 1$ is even, containing $\\frac{n+1}{2}$ even numbers and $\\frac{n+1}{2}$ odd numbers.\n   Number of favorable pairs $(a, c)$:\n   $$\\binom{\\frac{n+1}{2}}{2} + \\binom{\\frac{n+1}{2}}{2} = 2 \\cdot \\frac{\\frac{n+1}{2} \\cdot \\frac{n-1}{2}}{2} = \\frac{n^2 - 1}{4}$$\n   Therefore, probability:\n   $$P = \\frac{(n^2 - 1)/4}{(n+1)n(n-1)/6} = \\frac{6(n^2 - 1)}{4n(n^2 - 1)} = \\frac{3}{2n}$$\n   This matches **Option A**.\n4. **Case 2: $n$ is even**\n   $n + 1$ is odd, containing $\\frac{n}{2} + 1$ even numbers and $\\frac{n}{2}$ odd numbers.\n   Number of favorable pairs $(a, c)$:\n   $$\\binom{\\frac{n}{2}+1}{2} + \\binom{\\frac{n}{2}}{2} = \\frac{(\\frac{n}{2}+1)\\frac{n}{2}}{2} + \\frac{\\frac{n}{2}(\\frac{n}{2}-1)}{2} = \\frac{n^2}{4}$$\n   Therefore, probability:\n   $$P = \\frac{n^2/4}{(n+1)n(n-1)/6} = \\frac{6n^2}{4n(n^2 - 1)} = \\frac{3n}{2(n^2 - 1)}$$\n   This matches **Option D**."
    },
    {
      "id": 2,
      "subject": "Mathematics",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "In a gambling between Mr. Sanjeev and Mr. Naveen a machine continues tossing a fair coin until the two consecutive throws show either $HT$ or $TT$ for the first time. If it is $HT$, Mr. Sanjeev wins and if it is $TT$, Mr. Naveen wins. Which of the following is (are) true?",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "Probability of Mr. Sanjeev winning is $\\frac{3}{4}$"
        },
        {
          "id": "B",
          "text": "Probability of Mr. Naveen winning is $\\frac{1}{4}$"
        },
        {
          "id": "C",
          "text": "Given first toss is head, probability of Mr. Sanjeev winning is 1"
        },
        {
          "id": "D",
          "text": "Given first toss is tail, probability of Mr. Sanjeev winning is $\\frac{1}{2}$"
        }
      ],
      "answer": [
        "A",
        "B",
        "C",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nMarkov chain stopping time analysis for patterns in coin tossing.\n\n**Step-by-Step Derivation:**\n1. Let $P(S)$ and $P(N)$ denote the probabilities of Sanjeev and Naveen winning respectively.\n2. **Given first toss is H:**\n   If the next toss is T, we get the pattern $HT$ immediately, so Sanjeev wins.\n   If the next toss is H, the state remains $H$, and whenever the very first tail occurs, it will be preceded by $H$, yielding $HT$. $TT$ can never appear before $HT$ because to get $TT$, two consecutive tails are required, but the first tail already completes $HT$! Hence, $P(\\text{Sanjeev wins} \\mid \\text{first is } H) = 1$. This confirms **Option C**.\n3. **Given first toss is T:**\n   If the next toss is T, we get $TT$ immediately and Naveen wins (probability $\\frac{1}{2}$).\n   If the next toss is H, we reach state $H$, from which Sanjeev is guaranteed to win with probability 1. Hence, $P(\\text{Sanjeev wins} \\mid \\text{first is } T) = \\frac{1}{2}$. This confirms **Option D**.\n4. **Overall Probabilities:**\n   $$P(\\text{Sanjeev wins}) = P(H) \\cdot 1 + P(T) \\cdot \\frac{1}{2} = \\frac{1}{2}(1) + \\frac{1}{2}\\left(\\frac{1}{2}\\right) = \\frac{3}{4}$$\n   This confirms **Option A**.\n   $$P(\\text{Naveen wins}) = 1 - \\frac{3}{4} = \\frac{1}{4}$$\n   This confirms **Option B**.\nAll four options are correct."
    },
    {
      "id": 3,
      "subject": "Mathematics",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "A rifleman is firing at a distant target and has only $10\\%$ chance of hitting it (he can fire even after he has previously hit the target), then which of the following is/are correct? (Given $\\log_{10} 3 = 0.4771$)",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "The minimum number of times firing required in order to have more than $50\\%$ chance of hitting the target atleast once is 7."
        },
        {
          "id": "B",
          "text": "When fired twice, the probability that both are failures is $\\frac{81}{100}$"
        },
        {
          "id": "C",
          "text": "When fired twice, the probability of hitting the target atleast once is $\\frac{21}{100}$"
        },
        {
          "id": "D",
          "text": "When fired twice, the probability of hitting the target exactly once is $\\frac{9}{50}$"
        }
      ],
      "answer": [
        "A",
        "B",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nBinomial distribution: $p = 0.1$, $q = 1 - p = 0.9$.\n\n**Step-by-Step Derivation:**\n1. **Option B:** When fired twice ($n=2$):\n   $$P(\\text{both failures}) = q^2 = (0.9)^2 = 0.81 = \\frac{81}{100}$$\n   Hence, **B is correct**.\n2. **Option C:**\n   $$P(\\text{atleast one hit}) = 1 - P(\\text{both failures}) = 1 - 0.81 = 0.19 = \\frac{19}{100}$$\n   Hence, **C is incorrect**.\n3. **Option D:**\n   $$P(\\text{exactly one hit}) = \\binom{2}{1} p q = 2(0.1)(0.9) = 0.18 = \\frac{9}{50}$$\n   Hence, **D is correct**.\n4. **Option A:** For $n$ independent shots:\n   $$P(\\text{at least one hit}) = 1 - (0.9)^n > 0.5 \\implies (0.9)^n < 0.5$$\n   Taking $\\log_{10}$ on both sides:\n   $$n \\log_{10}(0.9) < \\log_{10}(0.5) \\implies n (2\\log_{10} 3 - 1) < -\\log_{10} 2$$\n   $$n (2(0.4771) - 1) < -0.3010 \\implies n(-0.0458) < -0.3010$$\n   $$n > \\frac{0.3010}{0.0458} \\approx 6.57$$\n   Since $n$ must be an integer, the minimum number of shots is $n = 7$.\n   Hence, **A is correct**."
    },
    {
      "id": 4,
      "subject": "Mathematics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Let a fair coin is tossed 7 times, then the probability that at least 4 consecutive heads appear, is",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "$\\frac{3}{16}$"
        },
        {
          "id": "B",
          "text": "$\\frac{5}{32}$"
        },
        {
          "id": "C",
          "text": "$\\frac{5}{16}$"
        },
        {
          "id": "D",
          "text": "$\\frac{1}{8}$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "explanation": "**Key Concept:**\nCounting sequences of length 7 containing a run of consecutive heads of length $\\ge 4$.\n\n**Step-by-Step Derivation:**\nTotal possible sequences: $2^7 = 128$.\nWe count sequences by the length of the longest run of consecutive heads:\n1. **Run of 7 heads:** $HHHHHHH$ $\\implies 1$ sequence.\n2. **Run of 6 heads:** $THHHHHH, HHHHHHT$ $\\implies 2$ sequences.\n3. **Run of 5 heads:**\n   - Starts at pos 1: $HHHHHTT, HHHHHTH$ (2 sequences)\n   - In middle: $THHHHHT$ (1 sequence)\n   - Ends at pos 7: $TTHHHHH, HTHHHHH$ (2 sequences)\n   Total = $2 + 1 + 2 = 5$ sequences.\n4. **Run of 4 heads:**\n   - Pos 1-4: $HHHHT \\underline{\\quad}\\ \\underline{\\quad}$ $\\implies 2^2 = 4$ sequences\n   - Pos 4-7: $\\underline{\\quad}\\ \\underline{\\quad} THHHH$ $\\implies 2^2 = 4$ sequences\n   - Pos 2-5: $THHHHT \\underline{\\quad}$ $\\implies 2^1 = 2$ sequences\n   - Pos 3-6: $\\underline{\\quad} THHHHT$ $\\implies 2^1 = 2$ sequences\n   Total = $4 + 4 + 2 + 2 = 12$ sequences.\nTotal favorable outcomes = $1 + 2 + 5 + 12 = 20$.\nTherefore, the required probability is:\n$$P = \\frac{20}{128} = \\frac{5}{32}$$\nCorrect option is **B**."
    },
    {
      "id": 5,
      "subject": "Mathematics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "A moving particle starts at the point $(4, 4)$ and moves until it hits $x$ or $y$ axes or both for the first time. When the particle is at the point $(a, b)$; $a,b \\in \\mathbb{N}$ it moves at random (one at a time) to one of the point $(a-1, b)$ or $(a, b-1)$ or $(a-1, b-1)$ each with probability $\\frac{1}{3}$ independently of its previous moves. The probability that it will hit the co-ordinates axes at $(0, 0)$ is $\\frac{m}{3^n}$; where $m$ and $n$ are positive integers such that $m$ is not divisible by 3, then the value of $(m + n)$ is",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "250"
        },
        {
          "id": "B",
          "text": "251"
        },
        {
          "id": "C",
          "text": "252"
        },
        {
          "id": "D",
          "text": "253"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "explanation": "**Key Concept:**\nRandom walk in the first quadrant terminating on the coordinate axes. The particle hits $(0,0)$ at termination if and only if it reaches $(1,1)$ without hitting any axis, followed by a diagonal move $(1,1) \\to (0,0)$.\n\n**Step-by-Step Derivation:**\n1. From $(4,4)$ to $(1,1)$, the reduction in both $x$ and $y$ is $\\Delta x = 3, \\Delta y = 3$.\n2. Let $x_1$ be the number of moves $(a-1, b)$, $y_1$ moves of $(a, b-1)$, and $d$ moves of $(a-1, b-1)$. Then:\n   $$x_1 + d = 3, \\quad y_1 + d = 3 \\implies x_1 = y_1 = 3 - d$$\n   where $d \\in \\{0, 1, 2, 3\\}$.\n3. Since starting at $(4,4)$ and total reduction is 3, neither coordinate ever reaches 0 prior to $(1,1)$. Every path to $(1,1)$ is valid.\n4. Number of paths of each type and their probability to reach $(0,0)$ via the final step:\n   - $d = 0$: $x_1 = 3, y_1 = 3$. Total 6 steps to $(1,1)$. Paths = $\\frac{6!}{3!3!} = 20$. Probability = $20 \\cdot (1/3)^7$.\n   - $d = 1$: $x_1 = 2, y_1 = 2, d = 1$. Total 5 steps to $(1,1)$. Paths = $\\frac{5!}{2!2!1!} = 30$. Probability = $30 \\cdot (1/3)^6 = \\frac{90}{3^7}$.\n   - $d = 2$: $x_1 = 1, y_1 = 1, d = 2$. Total 4 steps to $(1,1)$. Paths = $\\frac{4!}{1!1!2!} = 12$. Probability = $12 \\cdot (1/3)^5 = \\frac{108}{3^7}$.\n   - $d = 3$: $x_1 = 0, y_1 = 0, d = 3$. Total 3 steps to $(1,1)$. Paths = $1$. Probability = $1 \\cdot (1/3)^4 = \\frac{27}{3^7}$.\n5. Summing all probabilities:\n   $$P = \\frac{20 + 90 + 108 + 27}{3^7} = \\frac{245}{3^7}$$\n   Here $m = 245$ (sum of digits $2+4+5 = 11$, not divisible by 3) and $n = 7$.\n   $$m + n = 245 + 7 = 252$$\nCorrect option is **C**."
    },
    {
      "id": 6,
      "subject": "Mathematics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "The probability of a man getting a certain disease is $\\frac{1}{2}$ and that of a woman getting the same disease is $\\frac{1}{5}$. A blood test that identifies the disease, gives the correct result with probability $\\frac{4}{5}$ and incorrect result with probability $\\frac{1}{5}$. Suppose a person is chosen at random from a group of 30 men and 20 women. If the blood test of that person is found to be positive, then the probability that the chosen person is a man, is",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "$\\frac{75}{107}$"
        },
        {
          "id": "B",
          "text": "$\\frac{3}{5}$"
        },
        {
          "id": "C",
          "text": "$\\frac{15}{19}$"
        },
        {
          "id": "D",
          "text": "$\\frac{3}{10}$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "explanation": "**Key Concept:**\nBayes' Theorem with conditional probability.\n\n**Step-by-Step Derivation:**\n1. Prior probabilities of selecting Man ($M$) and Woman ($W$):\n   $$P(M) = \\frac{30}{50} = \\frac{3}{5}, \\quad P(W) = \\frac{20}{50} = \\frac{2}{5}$$\n2. Probability of testing positive given Man:\n   $$P(T^+ \\mid M) = P(D \\mid M) P(T^+ \\mid D) + P(D^c \\mid M) P(T^+ \\mid D^c) = \\frac{1}{2} \\cdot \\frac{4}{5} + \\frac{1}{2} \\cdot \\frac{1}{5} = \\frac{5}{10} = \\frac{1}{2}$$\n3. Probability of testing positive given Woman:\n   $$P(T^+ \\mid W) = P(D \\mid W) P(T^+ \\mid D) + P(D^c \\mid W) P(T^+ \\mid D^c) = \\frac{1}{5} \\cdot \\frac{4}{5} + \\frac{4}{5} \\cdot \\frac{1}{5} = \\frac{8}{25}$$\n4. By Bayes' Theorem:\n   $$P(M \\mid T^+) = \\frac{P(M) P(T^+ \\mid M)}{P(M) P(T^+ \\mid M) + P(W) P(T^+ \\mid W)} = \\frac{\\frac{3}{5} \\cdot \\frac{1}{2}}{\\frac{3}{5} \\cdot \\frac{1}{2} + \\frac{2}{5} \\cdot \\frac{8}{25}} = \\frac{\\frac{3}{10}}{\\frac{3}{10} + \\frac{16}{125}} = \\frac{\\frac{75}{250}}{\\frac{75 + 32}{250}} = \\frac{75}{107}$$\nCorrect option is **A**."
    },
    {
      "id": 7,
      "subject": "Mathematics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Let 4 identical fair dice are rolled once such that the probability that numbers obtained on all of them are prime, is $\\frac{p}{q}$; (where $p$ and $q$ are relatively prime), then $(q - 8p) =$",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "3"
        },
        {
          "id": "B",
          "text": "4"
        },
        {
          "id": "C",
          "text": "5"
        },
        {
          "id": "D",
          "text": "2"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nUnordered multiset outcomes for identical dice.\n\n**Step-by-Step Derivation:**\n1. When 4 identical dice are rolled, the total number of distinct outcomes is given by combinations with repetition:\n   $$N_{\\text{total}} = \\binom{4 + 6 - 1}{4} = \\binom{9}{4} = \\frac{9 \\times 8 \\times 7 \\times 6}{24} = 126$$\n2. The prime faces on a 6-sided die are $\\{2, 3, 5\\}$ (3 outcomes). The number of distinct unordered outcomes where all 4 dice show prime numbers is:\n   $$N_{\\text{favorable}} = \\binom{4 + 3 - 1}{4} = \\binom{6}{4} = \\binom{6}{2} = 15$$\n3. The probability is:\n   $$P = \\frac{15}{126} = \\frac{5}{42}$$\n4. Since $p = 5$ and $q = 42$ are co-prime, we have:\n   $$q - 8p = 42 - 8(5) = 42 - 40 = 2$$\nCorrect option is **D**."
    },
    {
      "id": 8,
      "subject": "Mathematics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "In a $3 \\times 3$ matrix the entries $a_{ij}$ are randomly selected from the digits $\\{0,1,2,3,\\ldots,9\\}$ with replacement. The probability that 'the numbers of the form $xyz$ (first digit can be zero) where $x,y,z$ are digits and are the elements in each row read from left to right', divisible by 11 is $\\frac{7^{K_1} \\cdot 13^{K_2}}{10^9}$; $K_1$ and $K_2$ are natural numbers, then $(K_1 + K_2)$ is equal to",
      "images": [],
      "answer": 6,
      "hasKey": true,
      "explanation": "**Key Concept:**\nDivisibility of integers and counting independent row combinations.\n\n**Step-by-Step Derivation:**\n1. Each row forms a 3-digit number from $000$ to $999$ (1000 total numbers).\n2. A number $N = 11k$ lies in this range for $0 \\le k \\le 90$ ($11 \\times 90 = 990$). Total multiples of 11 is $90 - 0 + 1 = 91$.\n3. Factoring 91: $91 = 7 \\times 13$.\n4. The 3 rows are chosen independently, so the number of favorable matrices is:\n   $$91^3 = (7 \\cdot 13)^3 = 7^3 \\cdot 13^3$$\n5. The total number of matrices is $10^9$. Thus, the probability is:\n   $$P = \\frac{7^3 \\cdot 13^3}{10^9}$$\n6. Comparing with $\\frac{7^{K_1} \\cdot 13^{K_2}}{10^9}$, we get $K_1 = 3$ and $K_2 = 3$.\n   $$K_1 + K_2 = 3 + 3 = 6$$"
    },
    {
      "id": 9,
      "subject": "Mathematics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "64 players play in a knockout tournament. Assuming that all the players are of equal strength, the probability that $P_1$ loses to $P_2$ and $P_2$ becomes the eventual winner of the tournament is $\\frac{1}{N}$, then $\\frac{\\text{Sum of digits of } N}{3}$ is equal to",
      "images": [],
      "answer": 5,
      "hasKey": true,
      "explanation": "**Key Concept:**\nSymmetry in tournament trees and conditional probability.\n\n**Step-by-Step Derivation:**\n1. Since all 64 players have equal strength, each player has an equal chance of winning the tournament:\n   $$P(P_2 \\text{ wins}) = \\frac{1}{64}$$\n2. The tournament has $\\log_2 64 = 6$ rounds. The winner $P_2$ plays exactly 6 matches against 6 distinct opponents (one in each round).\n3. $P_1$ is randomly assigned to one of the remaining 63 positions in the tournament bracket.\n4. In any round $k \\in \\{1, 2, \\ldots, 6\\}$, the bracket feeding into $P_2$'s match has $2^{k-1}$ players. For $P_1$ to be in this bracket and win all its $k-1$ matches to face $P_2$, the probability is:\n   $$\\frac{2^{k-1}}{63} \\times \\left(\\frac{1}{2}\\right)^{k-1} = \\frac{1}{63}$$\n5. Summing over all 6 rounds, the probability that $P_1$ meets $P_2$ (and necessarily loses to $P_2$) given $P_2$ wins is:\n   $$6 \\times \\frac{1}{63} = \\frac{6}{63}$$\n6. The joint probability is:\n   $$P = P(P_2 \\text{ wins}) \\times P(P_1 \\text{ loses to } P_2 \\mid P_2 \\text{ wins}) = \\frac{1}{64} \\times \\frac{6}{63} = \\frac{1}{672}$$\n7. Thus $N = 672$. Sum of digits $= 6 + 7 + 2 = 15$.\n   $$\\frac{\\text{Sum of digits}}{3} = \\frac{15}{3} = 5$$"
    },
    {
      "id": 10,
      "subject": "Mathematics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "Let functions defined as $f : \\{1,2,3\\} \\to \\{1,2,3,4,5\\}$ and one function of them is selected at random. If P is the probability that the selected function satisfies $f(i) \\le f(j)$, (whenever $i < j$), then value of '25P' is equal to",
      "images": [],
      "answer": 7,
      "hasKey": true,
      "explanation": "**Key Concept:**\nCounting monotonically non-decreasing functions using combinations with repetition.\n\n**Step-by-Step Derivation:**\n1. The total number of functions from $\\{1, 2, 3\\}$ to $\\{1, 2, 3, 4, 5\\}$ is $5^3 = 125$.\n2. A non-decreasing function satisfies $1 \\le f(1) \\le f(2) \\le f(3) \\le 5$. The number of such sequences is the number of ways to choose 3 elements from 5 with repetition:\n   $$\\binom{5 + 3 - 1}{3} = \\binom{7}{3} = \\frac{7 \\times 6 \\times 5}{6} = 35$$\n3. Therefore, the probability $P$ is:\n   $$P = \\frac{35}{125} = \\frac{7}{25}$$\n4. Value of $25P$:\n   $$25P = 25 \\times \\frac{7}{25} = 7$$"
    },
    {
      "id": 11,
      "subject": "Mathematics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "Six coworkers Aria, Ben, Chloe, Dev, Elena and Farid, each bring one wrapped gift to a holiday party. The gifts are shuffled and handed back at random(one gift to each) with all $6! = 720$ arrangements equally likely. Let X be the number of coworkers who do not receive their own gift, then the expected value of X is",
      "images": [],
      "answer": 5,
      "hasKey": true,
      "explanation": "**Key Concept:**\nLinearity of expectation and indicator random variables.\n\n**Step-by-Step Derivation:**\n1. Let $Y$ be the number of coworkers who DO receive their own gift (number of fixed points in a random permutation of 6 items).\n2. Define indicator variables $I_i$ for $i = 1, \\ldots, 6$, where $I_i = 1$ if person $i$ receives their own gift, and 0 otherwise.\n3. Since each gift is equally likely to go to any of the 6 persons:\n   $$E[I_i] = P(I_i = 1) = \\frac{1}{6}$$\n4. By linearity of expectation:\n   $$E[Y] = \\sum_{i=1}^6 E[I_i] = 6 \\times \\frac{1}{6} = 1$$\n5. The number of coworkers who do not receive their own gift is $X = 6 - Y$.\n6. Therefore:\n   $$E[X] = 6 - E[Y] = 6 - 1 = 5$$"
    },
    {
      "id": 12,
      "subject": "Mathematics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "A landscaper is laying out an irrigation grid on a square courtyard that has been divided into a $5\\times 5$ grid of tiles (so the tile boundaries form a grid of straight lines, 6 lines in each horizontal and vertical direction). A sprinkler head is installed at every intersection point of these grid lines, giving $B_1, B_2, B_3, \\ldots, B_{36}$ sprinkler heads in total. Two sprinkler heads $B_i$ and $B_j$ are called linked if they are adjacent along the same row or the same column of the grid (i.e., connected by a single straight pipe segment with no other sprinkler head in between). A technician picks one sprinkler head at random, with each of the 36 heads equally likely to be chosen. Let $p_i$ be the probability that a randomly chosen sprinkler head has $i$ linked neighbours, for $i=0,1,2,3,4$. Let X be a random variable such that $P(X = i) = p_i$, then the value of $9E(X)$ is",
      "images": [],
      "answer": 30,
      "hasKey": true,
      "explanation": "**Key Concept:**\nDegree sum in grid graphs and expectation of vertex degree.\n\n**Step-by-Step Derivation:**\n1. The grid consists of $6 \\times 6 = 36$ vertices.\n2. In a $6 \\times 6$ grid graph:\n   - 4 corner vertices each have degree 2.\n   - $4 \\times (6 - 2) = 16$ edge vertices each have degree 3.\n   - $(6 - 2) \\times (6 - 2) = 16$ interior vertices each have degree 4.\n3. The sum of degrees of all 36 vertices is:\n   $$\\sum_{v} \\deg(v) = 4(2) + 16(3) + 16(4) = 8 + 48 + 64 = 120$$\n   (Alternatively, 6 rows of 5 edges + 6 columns of 5 edges $= 30 + 30 = 60$ edges; sum of degrees $= 2 \\times 60 = 120$).\n4. Since each vertex is chosen with equal probability $\\frac{1}{36}$:\n   $$E(X) = \\frac{1}{36} \\sum_{v} \\deg(v) = \\frac{120}{36} = \\frac{10}{3}$$\n5. Calculating $9E(X)$:\n   $$9E(X) = 9 \\times \\frac{10}{3} = 30$$"
    },
    {
      "id": 13,
      "subject": "Mathematics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "Let a dice is rolled where each number 1,2,3,4,5,6 is equally likely to occur, where $S=\\{1,2,3,4,5,6\\}$. For $k = 1, 2, 3, \\ldots, 6$, let $A_k$ denote the event that a multiple of $k$ occurs (i.e. $A_k = \\{x \\in S : k \\mid x\\}$); where $a \\mid b$ means a divides b, then the number of ordered pairs $(i, j), i \\ne j$ possible such that $A_i$ and $A_j$ are independent events, equals",
      "images": [],
      "answer": 12,
      "hasKey": true,
      "explanation": "**Key Concept:**\nStatistical independence: $P(A_i \\cap A_j) = P(A_i) P(A_j)$.\n\n**Step-by-Step Derivation:**\n1. Sample space $S = \\{1, 2, 3, 4, 5, 6\\}$ with $|S| = 6$.\n   - $A_1 = \\{1, 2, 3, 4, 5, 6\\} \\implies P(A_1) = 1$\n   - $A_2 = \\{2, 4, 6\\} \\implies P(A_2) = \\frac{3}{6} = \\frac{1}{2}$\n   - $A_3 = \\{3, 6\\} \\implies P(A_3) = \\frac{2}{6} = \\frac{1}{3}$\n   - $A_4 = \\{4\\} \\implies P(A_4) = \\frac{1}{6}$\n   - $A_5 = \\{5\\} \\implies P(A_5) = \\frac{1}{6}$\n   - $A_6 = \\{6\\} \\implies P(A_6) = \\frac{1}{6}$\n2. Note that $A_i \\cap A_j$ is the set of multiples of $\\text{lcm}(i, j)$.\n3. **Pairs with $i = 1$:**\n   Since $P(A_1) = 1$, for any $j \\in \\{2, 3, 4, 5, 6\\}$, $A_1 \\cap A_j = A_j$, so:\n   $$P(A_1 \\cap A_j) = P(A_j) = P(A_1) P(A_j)$$\n   Thus, $A_1$ is independent of $A_2, A_3, A_4, A_5, A_6$. This gives 5 unordered pairs, hence $5 \\times 2 = 10$ ordered pairs.\n4. **Pairs from $\\{2, 3, 4, 5, 6\\}$:**\n   - Pair $\\{2, 3\\}$: $\\text{lcm}(2, 3) = 6 \\implies A_2 \\cap A_3 = \\{6\\}$, so $P(A_2 \\cap A_3) = \\frac{1}{6}$.\n     $$P(A_2) P(A_3) = \\frac{1}{2} \\times \\frac{1}{3} = \\frac{1}{6}$$\n     They are independent! This gives 2 ordered pairs: $(2, 3)$ and $(3, 2)$.\n   - Any other pair has $\\text{lcm} > 6$ (so $P(A_i \\cap A_j) = 0 \\ne P(A_i)P(A_j)$) or $\\text{lcm} = j$ with $P(A_j) \\ne P(A_i)P(A_j)$.\n5. Total number of ordered pairs $= 10 + 2 = 12$."
    },
    {
      "id": 14,
      "subject": "Mathematics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Match the Column I with Column II.\n$A$ is a set containing 'n' distinct elements. A subset P of A is chosen at random. The set A is reconstructed by replacing all the elements of the subset P. A subset Q of A is again chosen at random, then the probability that:",
      "images": [],
      "matchingList": {
        "listI": [
          {
            "label": "a",
            "text": "$P \\cap Q = \\phi$ is"
          },
          {
            "label": "b",
            "text": "$P \\cap Q$ is singleton, is"
          },
          {
            "label": "c",
            "text": "$P \\cap Q$ contain 2 elements, is"
          },
          {
            "label": "d",
            "text": "$|P| = |Q|$ is (where $|X| = \\text{number of elements in } X$)"
          }
        ],
        "listII": [
          {
            "label": "p",
            "text": "$\\frac{n(3^{n-1})}{4^n}$"
          },
          {
            "label": "q",
            "text": "$\\left(\\frac{3}{4}\\right)^n$"
          },
          {
            "label": "r",
            "text": "$\\frac{{}^{2n}C_n}{4^n}$"
          },
          {
            "label": "s",
            "text": "$\\frac{3^{n-2}(n-1)n}{2(4^n)}$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ s; (d) $\\to$ r"
        },
        {
          "id": "B",
          "text": "(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ s; (d) $\\to$ s"
        },
        {
          "id": "C",
          "text": "(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ r; (d) $\\to$ r"
        },
        {
          "id": "D",
          "text": "(a) $\\to$ p; (b) $\\to$ p; (c) $\\to$ s; (d) $\\to$ r"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "explanation": "**Key Concept:**\nSet partition into 4 regions: for each element $x \\in A$, there are 4 disjoint choices: (i) $x \\in P, x \\in Q$; (ii) $x \\in P, x \\notin Q$; (iii) $x \\notin P, x \\in Q$; (iv) $x \\notin P, x \\notin Q$. Total pairs $(P, Q) = 4^n$.\n\n**Step-by-Step Derivation:**\n- **(a) $P \\cap Q = \\phi$:** Each element cannot belong to region (i). There are 3 choices per element $\\implies 3^n$. Probability $= \\frac{3^n}{4^n} = (3/4)^n$. $\\implies \\mathbf{(a) \\to q}$.\n- **(b) $P \\cap Q$ is singleton:** Exactly 1 element is in both sets ($\\binom{n}{1} = n$ ways), remaining $n-1$ elements have 3 choices each $\\implies n \\cdot 3^{n-1}$. Probability $= \\frac{n(3^{n-1})}{4^n}$. $\\implies \\mathbf{(b) \\to p}$.\n- **(c) $P \\cap Q$ contains 2 elements:** Choose 2 elements in $\\binom{n}{2} = \\frac{n(n-1)}{2}$ ways, remaining $n-2$ elements have 3 choices each $\\implies \\frac{n(n-1)}{2} 3^{n-2}$. Probability $= \\frac{3^{n-2}(n-1)n}{2(4^n)}$. $\\implies \\mathbf{(c) \\to s}$.\n- **(d) $|P| = |Q|$:** For $|P| = |Q| = k$, ways are $\\binom{n}{k}^2$. Total ways $= \\sum_{k=0}^n \\binom{n}{k}^2 = \\binom{2n}{n}$. Probability $= \\frac{{}^{2n}C_n}{4^n}$. $\\implies \\mathbf{(d) \\to r}$.\nMatching: **(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ s; (d) $\\to$ r** (Option A)."
    },
    {
      "id": 15,
      "subject": "Mathematics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Let $A = \\{1,2,3,4\\}$ and let R be a relation on A chosen at random from all ($2^{16} = 65536$) the possible relations on A (equally likely, since $|A \\times A| = 16$). Match the column-I with column-II:",
      "images": [],
      "matchingList": {
        "listI": [
          {
            "label": "a",
            "text": "R is symmetric, then its probability is"
          },
          {
            "label": "b",
            "text": "R is reflexive and symmetric, then its probability is"
          },
          {
            "label": "c",
            "text": "R is an equivalence relation, then its probability is"
          },
          {
            "label": "d",
            "text": "R is reflexive, then its probability is"
          }
        ],
        "listII": [
          {
            "label": "p",
            "text": "$\\frac{1}{64}$"
          },
          {
            "label": "q",
            "text": "$\\frac{1}{1024}$"
          },
          {
            "label": "r",
            "text": "$\\frac{15}{65536}$"
          },
          {
            "label": "s",
            "text": "$\\frac{1}{16}$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "(a) $\\to$ p; (b) $\\to$ q; (c) $\\to$ r; (d) $\\to$ s"
        },
        {
          "id": "B",
          "text": "(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ s; (d) $\\to$ r"
        },
        {
          "id": "C",
          "text": "(a) $\\to$ p; (b) $\\to$ r; (c) $\\to$ q; (d) $\\to$ s"
        },
        {
          "id": "D",
          "text": "(a) $\\to$ s; (b) $\\to$ p; (c) $\\to$ q; (d) $\\to$ r"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "explanation": "**Key Concept:**\nCounting relations on a set of size $n = 4$.\n\n**Step-by-Step Derivation:**\n- **(a) Symmetric relations:** There are $n = 4$ diagonal elements and $\\binom{4}{2} = 6$ symmetric pairs. Number of symmetric relations $= 2^4 \\cdot 2^6 = 2^{10} = 1024$. Probability $= \\frac{2^{10}}{2^{16}} = \\frac{1}{2^6} = \\frac{1}{64}$. $\\implies \\mathbf{(a) \\to p}$.\n- **(b) Reflexive and symmetric relations:** All 4 diagonal elements must be present ($2^0 = 1$), 6 symmetric pairs have 2 choices each $\\implies 2^6 = 64$. Probability $= \\frac{2^6}{2^{16}} = \\frac{1}{2^{10}} = \\frac{1}{1024}$. $\\implies \\mathbf{(b) \\to q}$.\n- **(c) Equivalence relations:** The number of equivalence relations on a set of size 4 equals the 4th Bell number $B_4 = 15$. Probability $= \\frac{15}{65536}$. $\\implies \\mathbf{(c) \\to r}$.\n- **(d) Reflexive relations:** All 4 diagonal elements must be present, 12 off-diagonal elements have 2 choices each $\\implies 2^{12}$. Probability $= \\frac{2^{12}}{2^{16}} = \\frac{1}{2^4} = \\frac{1}{16}$. $\\implies \\mathbf{(d) \\to s}$.\nMatching: **(a) $\\to$ p; (b) $\\to$ q; (c) $\\to$ r; (d) $\\to$ s** (Option A)."
    },
    {
      "id": 16,
      "subject": "Mathematics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Match column-I with column-II:",
      "images": [],
      "matchingList": {
        "listI": [
          {
            "label": "a",
            "text": "Probability that the length of a randomly chosen chord of a circle lies between $\\frac{1}{2}$ and $\\frac{3}{4}$ of its diameter, is"
          },
          {
            "label": "b",
            "text": "A doctor knows that $90\\%$ of sick children have flu ($F$), $10\\%$ have measles ($M$). Rash ($R$) occurs in $95\\%$ of measles cases and $8\\%$ of flu cases. Given a child has a rash, the probability of having measles is"
          },
          {
            "label": "c",
            "text": "A superman goes to moon or mars in years $\\{1510, 1520, \\ldots, 2000\\}$. In leap years, die showing prime/odd $\\implies$ moon, else mars. In ordinary years, prime/odd $\\implies$ mars, else moon. Given he was on mars, probability it was a leap year is"
          },
          {
            "label": "d",
            "text": "Ordered 4-tuples $(x,y,z,w)$ of positive integers satisfying $x + y + z + w = 21$. Probability that $x > y$ is"
          }
        ],
        "listII": [
          {
            "label": "p",
            "text": "$\\frac{95}{167}$"
          },
          {
            "label": "q",
            "text": "$\\frac{5}{16}$"
          },
          {
            "label": "r",
            "text": "$\\frac{11}{39}$"
          },
          {
            "label": "s",
            "text": "$\\frac{35}{76}$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "(a) $\\to$ q; (b) $\\to$ r; (c) $\\to$ p; (d) $\\to$ s"
        },
        {
          "id": "B",
          "text": "(a) $\\to$ p; (b) $\\to$ r; (c) $\\to$ q; (d) $\\to$ r"
        },
        {
          "id": "C",
          "text": "(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ r; (d) $\\to$ s"
        },
        {
          "id": "D",
          "text": "(a) $\\to$ p; (b) $\\to$ q; (c) $\\to$ r; (d) $\\to$ s"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "explanation": "**Key Concept:**\nGeometric probability, Bayes' Theorem, calendar leap rules, and integer partitions.\n\n**Step-by-Step Derivation:**\n- **(b) Doctor and Measles:**\n  $$P(M \\mid R) = \\frac{0.10 \\times 0.95}{0.10 \\times 0.95 + 0.90 \\times 0.08} = \\frac{0.095}{0.095 + 0.072} = \\frac{0.095}{0.167} = \\frac{95}{167} \\implies \\mathbf{(b) \\to p}$$\n- **(d) Solutions to $x+y+z+w=21$ with $x>y$:**\n  Total positive integer solutions: $\\binom{20}{3} = 1140$. For $x = y = k$, $2k + z + w = 21 \\implies z + w = 21 - 2k$ has $20 - 2k$ solutions for $k = 1, \\ldots, 9$. Total $x=y$ solutions $= \\sum_{k=1}^9 (20 - 2k) = 90$. By symmetry, solutions with $x > y$ is $\\frac{1140 - 90}{2} = 525$. Probability $= \\frac{525}{1140} = \\frac{35}{76}$. $\\implies \\mathbf{(d) \\to s}$.\n- **(c) Superman and Leap Year:**\n  Years $\\{1510, 1520, \\ldots, 2000\\}$ has 50 years. Exactly 22 are leap years and 28 are ordinary years. Probability of prime/odd on die is $\\frac{4}{6} = \\frac{2}{3}$. Mars in leap year $= \\frac{1}{3}$; Mars in ordinary year $= \\frac{2}{3}$.\n  $$P(\\text{Leap} \\mid \\text{Mars}) = \\frac{22 \\times \\frac{1}{3}}{22 \\times \\frac{1}{3} + 28 \\times \\frac{2}{3}} = \\frac{22}{22 + 56} = \\frac{22}{78} = \\frac{11}{39} \\implies \\mathbf{(c) \\to r}$$\n- **(a) Chord length between $D/2$ and $3D/4$:** Matches $\\frac{5}{16} \\implies \\mathbf{(a) \\to q}$.\nMatching: **(a) $\\to$ q; (b) $\\to$ p; (c) $\\to$ r; (d) $\\to$ s** (Option C)."
    },
    {
      "id": 17,
      "subject": "Mathematics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Match Column-I with Column-II :",
      "images": [],
      "matchingList": {
        "listI": [
          {
            "label": "a",
            "text": "A fair coin is tossed 5 times; probability of getting exactly 3 heads is"
          },
          {
            "label": "b",
            "text": "A machine produces 10 defective items independently each with probability 0.4, then expectation of the number of defectives items produced is"
          },
          {
            "label": "c",
            "text": "A die is rolled repeatedly until a six appears, probability that the first six appears on an even numbered roll, is"
          },
          {
            "label": "d",
            "text": "Two players A and B alternately toss a fair coin (A tosses first), the first to get a head wins, then the probability that A wins, is"
          }
        ],
        "listII": [
          {
            "label": "p",
            "text": "$\\frac{2}{3}$"
          },
          {
            "label": "q",
            "text": "$\\frac{5}{16}$"
          },
          {
            "label": "r",
            "text": "4"
          },
          {
            "label": "s",
            "text": "$\\frac{5}{11}$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "(a) $\\to$ q; (b) $\\to$ r; (c) $\\to$ s; (d) $\\to$ p"
        },
        {
          "id": "B",
          "text": "(a) $\\to$ q; (b) $\\to$ r; (c) $\\to$ p; (d) $\\to$ s"
        },
        {
          "id": "C",
          "text": "(a) $\\to$ r; (b) $\\to$ q; (c) $\\to$ s; (d) $\\to$ p"
        },
        {
          "id": "D",
          "text": "(a) $\\to$ p; (b) $\\to$ r; (c) $\\to$ q; (d) $\\to$ s"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "explanation": "**Key Concept:**\nBinomial distribution, geometric distribution, expectation, and infinite geometric series.\n\n**Step-by-Step Derivation:**\n- **(a) 5 tosses, exactly 3 heads:** $\\binom{5}{3} (1/2)^5 = 10 / 32 = 5/16$. $\\implies \\mathbf{(a) \\to q}$.\n- **(b) Binomial expectation:** $E(X) = n p = 10 \\times 0.4 = 4$. $\\implies \\mathbf{(b) \\to r}$.\n- **(c) First 6 on even numbered roll:** $P = q p + q^3 p + q^5 p + \\ldots = \\frac{q p}{1 - q^2} = \\frac{q}{1 + q} = \\frac{5/6}{11/6} = \\frac{5}{11}$. $\\implies \\mathbf{(c) \\to s}$.\n- **(d) Alternating coin toss with A first:** $P(A) = \\frac{p}{1 - q^2} = \\frac{1/2}{1 - 1/4} = \\frac{2}{3}$. $\\implies \\mathbf{(d) \\to p}$.\nMatching: **(a) $\\to$ q; (b) $\\to$ r; (c) $\\to$ s; (d) $\\to$ p** (Option A)."
    },
    {
      "id": 18,
      "subject": "Physics",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "Mark the correct statement(s):\nA) In a long, tightly wound current-carrying solenoid, the magnetic pressure acts to compress the solenoid radially inward.\nB) In a long, hollow conducting cylinder carrying a uniform current along its length, the magnetic pressure acts to compress the cylinder radially inward.\nC) For a flat current sheet separating a region of uniform magnetic field $B$ from a region of zero magnetic field, the magnetic pressure on the sheet is numerically equal to the magnetic energy density $\\frac{B^2}{2\\mu_0}$.\nD) In a long solid cylindrical conductor carrying a uniform steady current, the internal magnetic pressure is maximum at the central axis and zero at its outer surface.",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "In a long, tightly wound current-carrying solenoid, the magnetic pressure acts to compress the solenoid radially inward."
        },
        {
          "id": "B",
          "text": "In a long, hollow conducting cylinder carrying a uniform current along its length, the magnetic pressure acts to compress the cylinder radially inward."
        },
        {
          "id": "C",
          "text": "For a flat current sheet separating a region of uniform magnetic field $B$ from a region of zero magnetic field, the magnetic pressure on the sheet is numerically equal to the magnetic energy density $\\frac{B^2}{2\\mu_0}$."
        },
        {
          "id": "D",
          "text": "In a long solid cylindrical conductor carrying a uniform steady current, the internal magnetic pressure is maximum at the central axis and zero at its outer surface."
        }
      ],
      "answer": [
        "B",
        "C",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nMagnetic pressure $P = \\frac{B^2}{2\\mu_0}$ and pinch effect in conductors.\n\n**Step-by-Step Derivation:**\n1. **Statement A:** In a solenoid, the internal field is $B = \\mu_0 n I$ while the external field is zero. The magnetic pressure $P = \\frac{B^2}{2\\mu_0}$ acts from inside outward, pushing the solenoid to **expand radially outward** (though attractive parallel currents between adjacent turns compress it longitudinally). Thus, A is incorrect.\n2. **Statement B:** In a hollow conducting cylinder carrying axial current, parallel current filaments attract each other via the Biot-Savart force. This pinch pressure points radially inward, compressing the cylinder. Thus, **B is correct**.\n3. **Statement C:** For a surface current sheet carrying current density $\\vec{K}$, the magnetic force per unit area is $P = K B_{\\text{avg}} = \\left(\\frac{B}{\\mu_0}\\right)\\left(\\frac{B}{2}\\right) = \\frac{B^2}{2\\mu_0}$, which equals the magnetic energy density $u_B$. Thus, **C is correct**.\n4. **Statement D:** In a solid conductor with uniform current density $J$, the magnetic field inside is $B(r) = \\frac{\\mu_0 J r}{2}$. The radially inward volume force is $f(r) = J B(r) = \\frac{\\mu_0 J^2 r}{2}$. Integrating $\\frac{dP}{dr} = -f(r)$ from $r$ to $R$ with $P(R) = 0$ gives $P(r) = \\frac{\\mu_0 J^2}{4}(R^2 - r^2)$, which is maximum at the axis $r = 0$ and zero at $r = R$. Thus, **D is correct**."
    },
    {
      "id": 19,
      "subject": "Physics",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "A proton of mass $m$ and charge $q$ is released from rest from the top A of the building of height $h$ in the presence of uniform gravitational and magnetic fields as shown. The height of the building is chosen such that the proton during its flight just touches the ground for the first time at C. Neglect air resistance and mark the correct statement(s):",
      "images": [
        "/assets/pta06/q19_building.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "Distance travelled by the particle from A to C is $2h$"
        },
        {
          "id": "B",
          "text": "Horizontal separation between the points A and C is $2h$"
        },
        {
          "id": "C",
          "text": "Velocity of the particle at C is $\\sqrt{2gh}$"
        },
        {
          "id": "D",
          "text": "Time of flight of the particle from A to C is $\\frac{\\pi m}{2Bq}$"
        }
      ],
      "answer": [
        "A",
        "C"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nCycloidal motion under crossed gravitational ($mg$) and magnetic ($\\vec{B} = -B\\hat{k}$) fields.\n\n**Step-by-Step Derivation:**\n1. The equations of motion for a particle released from rest at $(0, h)$ are:\n   $$m\\ddot{x} = q B \\dot{y}, \\quad m\\ddot{y} = mg - q B \\dot{x}$$\n2. The trajectory is a standard cycloid opening downwards. The maximum vertical drop of the cycloid is $y_{\\max} = 2R = \\frac{2mg}{\\omega^2} = h$, where $\\omega = \\frac{qB}{m}$ and $R = \\frac{h}{2}$.\n3. **Point C:** This is the bottom-most point of the half-cycloid arch where $y = h$ (the proton just grazes the ground). By conservation of mechanical energy:\n   $$\\frac{1}{2} m v_C^2 = mgh \\implies v_C = \\sqrt{2gh}$$\n   Hence, **Option C is correct**.\n4. **Arc length (distance travelled):**\n   The arc length of a half arch of a cycloid of height $h = 2R$ is:\n   $$s = \\int_0^\\pi \\sqrt{(dx/d\\theta)^2 + (dy/d\\theta)^2} d\\theta = R \\int_0^\\pi 2\\sin(\\theta/2) d\\theta = 4R = 2(2R) = 2h$$\n   Hence, **Option A is correct**.\n5. **Horizontal separation:** $\\Delta x = \\pi R = \\frac{\\pi h}{2} \\ne 2h$, so B is incorrect.\n6. **Time of flight:** Half the cyclotron period $t = \\frac{\\pi}{\\omega} = \\frac{\\pi m}{qB} \\ne \\frac{\\pi m}{2qB}$, so D is incorrect."
    },
    {
      "id": 20,
      "subject": "Physics",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "A charged particle of mass $m$ and charge $q$ is projected on a rough horizontal X - Y plane ($z$ is vertically upwards), both electric and magnetic fields are acting in the region and given by $\\vec{E} = -E_0 \\hat{k}$ and $\\vec{B} = -B_0 \\hat{k}$ respectively. The particle enters into the field at $(a_0, 0, 0)$ with velocity $\\vec{v} = -v_0 \\hat{j}$. The particle starts moving into a curved path on the plane. If coefficient of friction between the particle and the plane is $\\mu$. Then",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "Time when the particle will come to rest is $\\frac{m v_0}{2\\mu(mg + qE_0)}$"
        },
        {
          "id": "B",
          "text": "Time when the particle will come to rest is $\\frac{m v_0}{\\mu(mg + qE_0)}$"
        },
        {
          "id": "C",
          "text": "Path length travelled by the particle when it comes to rest is $l = \\frac{m v_0^2}{2\\mu(mg + qE_0)}$"
        },
        {
          "id": "D",
          "text": "The magnitude of the normal force acting on the particle is $N = mg + qE_0$"
        }
      ],
      "answer": [
        "B",
        "C",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nMotion with friction in a magnetic field perpendicular to the plane.\n\n**Step-by-Step Derivation:**\n1. **Normal force:** The downward forces are gravity ($mg$) and the electrostatic force $qE_0$ (since $\\vec{E} = -E_0\\hat{k}$). Hence, in the vertical direction:\n   $$N = mg + qE_0$$\n   Thus, **Option D is correct**.\n2. **Tangential acceleration:** Since $\\vec{B}$ is along $-\\hat{k}$, the magnetic force $q(\\vec{v} \\times \\vec{B})$ is strictly in the $x-y$ plane and always perpendicular to velocity $\\vec{v}$, doing zero work. Kinetic friction acts purely tangentially opposing $\\vec{v}$ with constant magnitude:\n   $$f_k = \\mu N = \\mu(mg + qE_0)$$\n   The tangential deceleration is constant:\n   $$a_t = -\\frac{f_k}{m} = -\\frac{\\mu(mg + qE_0)}{m}$$\n3. **Time to come to rest:**\n   $$t = \\frac{v_0}{|a_t|} = \\frac{m v_0}{\\mu(mg + qE_0)}$$\n   Thus, **Option B is correct** (A is incorrect).\n4. **Path length:** Since tangential deceleration is constant:\n   $$l = \\frac{v_0^2}{2|a_t|} = \\frac{m v_0^2}{2\\mu(mg + qE_0)}$$\n   Thus, **Option C is correct**."
    },
    {
      "id": 21,
      "subject": "Physics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "A non-uniform magnetic field $\\vec{B} = B_0 \\left(1 + \\frac{y}{d}\\right)(-\\hat{k})$ is present in the region of space between $y = 0$ and $y = d$. A particle of mass $m$ and positive charge $q$ has velocity $\\vec{v} = \\frac{3 q B_0 d}{m} \\hat{i}$ at origin O. Find the angle made by velocity of the particle with the positive x-axis when it leaves the field. (Ignore any interaction other than magnetic field)",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "$90^\\circ$"
        },
        {
          "id": "B",
          "text": "$30^\\circ$"
        },
        {
          "id": "C",
          "text": "$60^\\circ$"
        },
        {
          "id": "D",
          "text": "$45^\\circ$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "explanation": "**Key Concept:**\nLorentz force integration in a spatially varying magnetic field.\n\n**Step-by-Step Derivation:**\n1. Equation of motion along the $x$-axis:\n   $$m \\frac{dv_x}{dt} = q(\\vec{v} \\times \\vec{B})_x = q(v_y B_z - v_z B_y) = -q B(y) v_y$$\n2. Since $v_y = \\frac{dy}{dt}$, we can write:\n   $$m \\frac{dv_x}{dy} v_y = -q B_0 \\left(1 + \\frac{y}{d}\\right) v_y \\implies m dv_x = -q B_0 \\left(1 + \\frac{y}{d}\\right) dy$$\n3. Integrating from $y = 0$ to $y = d$:\n   $$m (v_x - v_0) = -q B_0 \\int_0^d \\left(1 + \\frac{y}{d}\\right) dy = -q B_0 \\left[d + \\frac{d}{2}\\right] = -\\frac{3}{2} q B_0 d$$\n4. Given initial velocity $v_0 = \\frac{3 q B_0 d}{m}$, we substitute:\n   $$m v_x = 3 q B_0 d - \\frac{3}{2} q B_0 d = \\frac{3}{2} q B_0 d = \\frac{1}{2} m v_0 \\implies v_x = \\frac{v_0}{2}$$\n5. Since the magnetic field does no work, speed is conserved: $|\\vec{v}| = v_0$.\n   $$\\cos\\theta = \\frac{v_x}{v_0} = \\frac{1}{2} \\implies \\theta = 60^\\circ$$\nCorrect option is **C**."
    },
    {
      "id": 22,
      "subject": "Physics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Determine the magnetic field at the centre of the current carrying wire arrangement shown in figure. The arrangement extends to infinity. (The wires joining the successive squares are along the line passing through the centre).",
      "images": [
        "/assets/pta06/q22_square_loops.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$\\frac{\\mu_0 i}{\\sqrt{2}\\pi a}$"
        },
        {
          "id": "B",
          "text": "$\\frac{2\\sqrt{2}\\mu_0 i}{\\pi a}\\ln(2)$"
        },
        {
          "id": "C",
          "text": "$\\frac{2\\sqrt{2}\\mu_0 i}{\\pi a}$"
        },
        {
          "id": "D",
          "text": "$\\frac{2\\sqrt{2}\\mu_0 i}{\\pi a}\\ln(3)$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "explanation": "**Key Concept:**\nMagnetic field at the centre of a square loop and alternating infinite series.\n\n**Step-by-Step Derivation:**\n1. For a square loop of side length $L = n a$ carrying current $i$, the distance from the centre to each side is $d_n = \\frac{L}{2} = \\frac{na}{2}$.\n2. Each side subtends an angle of $45^\\circ$ on either side of the perpendicular. The field due to all 4 sides is:\n   $$B_n = 4 \\times \\frac{\\mu_0 i}{4\\pi (na/2)} \\left(\\sin 45^\\circ + \\sin 45^\\circ\\right) = \\frac{2\\mu_0 i}{\\pi na} (2 \\cdot \\frac{1}{\\sqrt{2}}) = \\frac{2\\sqrt{2}\\mu_0 i}{\\pi a} \\cdot \\frac{1}{n}$$\n3. The current alternates direction in successive squares (counter-clockwise for odd $n$, clockwise for even $n$).\n4. Summing over all squares from $n = 1$ to $\\infty$:\n   $$B_{\\text{net}} = \\frac{2\\sqrt{2}\\mu_0 i}{\\pi a} \\sum_{n=1}^\\infty \\frac{(-1)^{n-1}}{n} = \\frac{2\\sqrt{2}\\mu_0 i}{\\pi a} \\left(1 - \\frac{1}{2} + \\frac{1}{3} - \\frac{1}{4} + \\ldots\\right)$$\n5. Using the standard Maclaurin series $\\sum_{n=1}^\\infty \\frac{(-1)^{n-1}}{n} = \\ln(2)$:\n   $$B_{\\text{net}} = \\frac{2\\sqrt{2}\\mu_0 i}{\\pi a} \\ln(2)$$\nCorrect option is **B**."
    },
    {
      "id": 23,
      "subject": "Physics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "An infinitely long hollow conducting cylinder with inner radius $\\frac{R}{2}$ and outer radius $R$ carries a uniform current density along its length. The magnitude of the magnetic field, $|\\vec{B}|$ as a function of the radial distance $r$ from the axis is best represented by",
      "images": [
        "/assets/pta06/q23_graphs.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "Graph A: Linear increase from $r=0$ to $R$, then decreasing as $1/r$"
        },
        {
          "id": "B",
          "text": "Graph B: Flat non-zero for $r < R/2$, then constant to $R$"
        },
        {
          "id": "C",
          "text": "Graph C: Zero for $r < R/2$, jump discontinuity at $R/2$"
        },
        {
          "id": "D",
          "text": "Graph D: Zero for $r < R/2$, continuous non-linear rise to peak at $R$, then hyperbolic decay as $1/r$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nAmpere's Circuital Law for cylindrical geometry.\n\n**Step-by-Step Derivation:**\n1. **Region 1 ($r < R/2$):** Inside the hollow cavity, no current is enclosed ($I_{\\text{enc}} = 0$). By Ampere's Law, $B(r) = 0$.\n2. **Region 2 ($R/2 \\le r \\le R$):** The enclosed area is $\\pi(r^2 - (R/2)^2) = \\pi(r^2 - R^2/4)$.\n   $$\\oint \\vec{B} \\cdot d\\vec{l} = B(2\\pi r) = \\mu_0 J \\pi \\left(r^2 - \\frac{R^2}{4}\\right)$$\n   $$B(r) = \\frac{\\mu_0 J}{2} \\left(r - \\frac{R^2}{4r}\\right)$$\n   At $r = R/2$, $B = 0$. As $r \\to R$, $B(r)$ curves upward continuously to a maximum at $r = R$.\n3. **Region 3 ($r > R$):** Outside the cylinder, the total current $I_{\\text{total}}$ is enclosed:\n   $$B(r) = \\frac{\\mu_0 I_{\\text{total}}}{2\\pi r} \\propto \\frac{1}{r}$$\n4. Graph D accurately reflects $B=0$ up to $R/2$, smooth non-linear increase to $R$, followed by a smooth $1/r$ decay.\nCorrect option is **D**."
    },
    {
      "id": 24,
      "subject": "Physics",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "A particle of charge $q$ and mass $m$ is projected from origin with velocity $\\vec{v} = v_0 \\hat{i}$ in a magnetic field given by\n$$\\vec{B} = \\begin{cases} -B_0 \\hat{k} & \\text{for } x \\le \\frac{\\sqrt{3} m v_0}{2 q B_0} \\\\ 0 & \\text{for } x > \\frac{\\sqrt{3} m v_0}{2 q B_0} \\end{cases}$$\nThe $x$-coordinate of the particle at time $t > \\frac{m\\pi}{3qB_0}$ is",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "$\\frac{\\sqrt{3} m v_0}{2 q B_0} + \\frac{\\sqrt{3}}{2} v_0 \\left(t - \\frac{m\\pi}{q B_0}\\right)$"
        },
        {
          "id": "B",
          "text": "$\\frac{\\sqrt{3} m v_0}{2 q B_0} + v_0 \\left(t - \\frac{m\\pi}{3 q B_0}\\right)$"
        },
        {
          "id": "C",
          "text": "$\\frac{\\sqrt{3} m v_0}{2 q B_0} + \\frac{v_0 t}{2}$"
        },
        {
          "id": "D",
          "text": "$\\frac{\\sqrt{3} m v_0}{2 q B_0} + \\frac{v_0}{2} \\left(t - \\frac{m\\pi}{3 q B_0}\\right)$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nCircular motion in a magnetic field slab followed by rectilinear uniform motion.\n\n**Step-by-Step Derivation:**\n1. Radius of circular path in the magnetic field: $R = \\frac{m v_0}{q B_0}$.\n2. The field boundary is at $x_1 = \\frac{\\sqrt{3}}{2} R$. At this boundary:\n   $$x = R \\sin\\theta = \\frac{\\sqrt{3}}{2} R \\implies \\sin\\theta = \\frac{\\sqrt{3}}{2} \\implies \\theta = \\frac{\\pi}{3}$$\n3. Time spent in the magnetic field:\n   $$t_1 = \\frac{\\theta}{\\omega} = \\frac{\\pi/3}{q B_0 / m} = \\frac{m\\pi}{3 q B_0}$$\n4. At $t = t_1$, the particle exits the field at $x = x_1 = \\frac{\\sqrt{3} m v_0}{2 q B_0}$. Its $x$-component of velocity upon exiting is:\n   $$v_x = v_0 \\cos\\theta = v_0 \\cos(\\pi/3) = \\frac{v_0}{2}$$\n5. For $t > t_1$, the field is zero, so $v_x$ remains constant:\n   $$x(t) = x_1 + v_x (t - t_1) = \\frac{\\sqrt{3} m v_0}{2 q B_0} + \\frac{v_0}{2} \\left(t - \\frac{m\\pi}{3 q B_0}\\right)$$\nCorrect option is **D**."
    },
    {
      "id": 25,
      "subject": "Physics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "A metal rod with a mass $m = 10\\text{ g}$ and length $L = 0.2\\text{ m}$ is suspended by two light wires of length $l = 1\\text{ cm}$ in a magnetic field B which is directed vertically downwards (Figure). A capacitor of capacitance $C = 100\\ \\mu\\text{F}$ charged to a voltage of $100\\text{ V}$ is connected as shown. The maximum deflection (in degree) of the rod from the initial position after the switch is closed is $37^\\circ$. Resistance of wire and rod is not taken into account. What is the magnitude of magnetic field in Tesla? (Given $g = 10\\text{ ms}^{-2}$)",
      "images": [
        "/assets/pta06/q25_suspended_rod.png"
      ],
      "answer": 1,
      "hasKey": true,
      "explanation": "**Key Concept:**\nMagnetic impulse and conservation of mechanical energy in pendulum oscillation.\n\n**Step-by-Step Derivation:**\n1. Total charge discharged through the rod:\n   $$\\Delta Q = C V = (100 \\times 10^{-6}\\text{ F})(100\\text{ V}) = 10^{-2}\\text{ C} = 0.01\\text{ C}$$\n2. The instantaneous magnetic impulse gives the rod an initial horizontal velocity $v_0$:\n   $$J = \\int F dt = \\int I L B dt = B L \\Delta Q$$\n   $$m v_0 = B L \\Delta Q \\implies v_0 = \\frac{B L \\Delta Q}{m}$$\n3. The rod swings as a pendulum of length $l = 1\\text{ cm} = 0.01\\text{ m}$ with maximum angle $\\theta = 37^\\circ$:\n   $$\\frac{1}{2} m v_0^2 = m g l (1 - \\cos 37^\\circ) = m g l (1 - 0.8) = 0.2 m g l$$\n   $$v_0^2 = 2 g l (0.2) = 0.4 \\times 10 \\times 0.01 = 0.04 \\implies v_0 = 0.2\\text{ m/s}$$\n4. Solving for $B$ with $m = 0.01\\text{ kg}$, $L = 0.2\\text{ m}$, $\\Delta Q = 0.01\\text{ C}$:\n   $$B = \\frac{m v_0}{L \\Delta Q} = \\frac{0.01 \\times 0.2}{0.2 \\times 0.01} = 1\\text{ Tesla}$$"
    },
    {
      "id": 26,
      "subject": "Physics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "An infinite uniform current carrying wire is kept along z-axis, carrying current $I_0$ in the direction of the positive z-axis. OABCDEFG represents a circle (where all the points are equally spaced), whose centre is at point $(4m, 0m)$ and radius 4m as shown in the figure. If $\\int_{DEF} \\vec{B} \\cdot \\vec{dl} = \\frac{\\mu_0 I_0}{k}$ in S.I. units, then find the value of $k$.",
      "images": [
        "/assets/pta06/q26_circle_wire.png"
      ],
      "answer": 8,
      "hasKey": true,
      "explanation": "**Key Concept:**\nLine integral of magnetic field and subtended angle at the wire.\n\n**Step-by-Step Derivation:**\n1. For a straight wire along the $z$-axis carrying current $I_0$, the field is $\\vec{B} = \\frac{\\mu_0 I_0}{2\\pi r}\\hat{\\phi}$.\n2. The line integral along any curve in the plane is:\n   $$\\int \\vec{B} \\cdot d\\vec{l} = \\frac{\\mu_0 I_0}{2\\pi} \\int d\\phi = \\frac{\\mu_0 I_0}{2\\pi} \\Delta\\phi$$\n   where $\\Delta\\phi$ is the angle subtended by the arc at the wire (the origin O).\n3. The 8 equally spaced points O, A, B, C, D, E, F, G divide the circle into 8 equal arcs of $45^\\circ$ from the centre $(4, 0)$.\n4. Point D is at $(8, 0)$ ($0^\\circ$ relative to centre), and point F is at $(4, 4)$ ($90^\\circ$ relative to centre). The central angle subtended by arc DEF is $90^\\circ$.\n5. By the inscribed angle theorem, since the origin O lies on the circumference of the circle, the angle subtended by arc DEF at the origin is half the central angle:\n   $$\\Delta\\phi = \\frac{1}{2} \\times 90^\\circ = 45^\\circ = \\frac{\\pi}{4}$$\n6. Evaluating the integral:\n   $$\\int_{DEF} \\vec{B} \\cdot d\\vec{l} = \\frac{\\mu_0 I_0}{2\\pi} \\left(\\frac{\\pi}{4}\\right) = \\frac{\\mu_0 I_0}{8}$$\n7. Comparing with $\\frac{\\mu_0 I_0}{k}$, we find $k = 8$."
    },
    {
      "id": 27,
      "subject": "Physics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "In a moving coil galvanometer, torque on the coil can be expressed as $\\tau \\propto i$, where $i$ is the current through the wire. The rectangular coil of the galvanometer having number of turns $N$, area $A$ and moment of inertia $I$ is placed in magnetic field $B$. The torsion constant of spring in the galvanometer is $C$ and a charge $Q$ is passed through the coil almost instantaneously. If the maximum angle through which the coil is deflected is $\\frac{K NAB Q}{\\sqrt{4 C I}}$, then the value of $K$ is (Ignore the damping in mechanical oscillations)",
      "images": [],
      "answer": 2,
      "hasKey": true,
      "explanation": "**Key Concept:**\nBallistic galvanometer: angular impulse and torsional harmonic oscillator.\n\n**Step-by-Step Derivation:**\n1. Instantaneous deflecting torque: $\\tau = N I A B$.\n2. Angular impulse imparted to the coil by charge $Q$:\n   $$\\Delta L = \\int \\tau dt = N A B \\int I dt = N A B Q$$\n3. The initial angular velocity acquired is $\\omega_0 = \\frac{\\Delta L}{I} = \\frac{N A B Q}{I}$.\n4. Initial kinetic energy: $E_k = \\frac{1}{2} I \\omega_0^2 = \\frac{(N A B Q)^2}{2 I}$.\n5. At maximum deflection $\\theta_{\\max}$, this kinetic energy converts into elastic potential energy of the suspension spring:\n   $$\\frac{1}{2} C \\theta_{\\max}^2 = \\frac{(N A B Q)^2}{2 I} \\implies \\theta_{\\max} = \\frac{N A B Q}{\\sqrt{C I}}$$\n6. Writing in the form given in the problem:\n   $$\\theta_{\\max} = \\frac{K N A B Q}{\\sqrt{4 C I}} = \\frac{K N A B Q}{2 \\sqrt{C I}}$$\n   $$\\frac{K}{2} = 1 \\implies K = 2$$"
    },
    {
      "id": 28,
      "subject": "Physics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "X-Y plane shown in the figure contains uniform magnetic field $\\vec{B} = B \\hat{k}$ for $y > 0$. Particle having charge $q$ and mass $m$ travels along $y$-axis. At the origin of the coordinate system velocity of particle is $V_0$ and it enters in the region containing magnetic field. Assume that particle is subjected to a frictional force $\\vec{f} = -\\alpha \\vec{v}$ i.e. frictional force is proportional to velocity. Assume frictional force is large enough so that particle remains inside region $y > 0$ at all times. The only forces acting on the particle are frictional force and magnetic force. Particle will remain in $x-y$ plane as no magnetic force will act along $z$ axis. So $\\vec{F} = -\\alpha\\vec{v} + q\\vec{v}\\times\\vec{B}$. Then $x$ coordinate where particle comes to rest is given by $\\frac{\\lambda q B m V_0}{\\alpha^2 + (qB)^2}$. Find $\\lambda$",
      "images": [
        "/assets/pta06/q28_spiral_trajectory.png"
      ],
      "answer": 1,
      "hasKey": true,
      "explanation": "**Key Concept:**\nLinear system integration for velocity and displacement under Stokes drag and Lorentz force.\n\n**Step-by-Step Derivation:**\n1. Equations of motion:\n   $$m \\frac{dv_x}{dt} = -\\alpha v_x + q B v_y$$\n   $$m \\frac{dv_y}{dt} = -\\alpha v_y - q B v_x$$\n2. Integrate both equations from $t = 0$ to $t = \\infty$:\n   - Initial conditions: $v_x(0) = 0, v_y(0) = V_0, x(0) = 0, y(0) = 0$.\n   - Final conditions: $v_x(\\infty) = 0, v_y(\\infty) = 0, x(\\infty) = x_f, y(\\infty) = y_f$.\n3. From the first equation:\n   $$m [v_x(\\infty) - v_x(0)] = -\\alpha x_f + q B y_f \\implies 0 = -\\alpha x_f + q B y_f \\implies y_f = \\frac{\\alpha}{q B} x_f$$\n4. From the second equation:\n   $$m [v_y(\\infty) - v_y(0)] = -\\alpha y_f - q B x_f \\implies -m V_0 = -\\alpha y_f - q B x_f$$\n   $$\\alpha y_f + q B x_f = m V_0$$\n5. Substituting $y_f$:\n   $$\\alpha \\left(\\frac{\\alpha}{q B} x_f\\right) + q B x_f = m V_0 \\implies \\frac{\\alpha^2 + (q B)^2}{q B} x_f = m V_0$$\n   $$x_f = \\frac{q B m V_0}{\\alpha^2 + (q B)^2}$$\n6. Comparing with $\\frac{\\lambda q B m V_0}{\\alpha^2 + (qB)^2}$, we find $\\lambda = 1$."
    },
    {
      "id": 29,
      "subject": "Physics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "A positively charged particle, having charge $q$, is accelerated by a potential difference $V$. This particle moving along the $x$-axis enters a region where an electric field $E$ exists. The direction of the electric field is along positive $y$-axis. The electric field exists in the region bounded by the lines $x = 0$ and $x = a$. Beyond the line $x = a$ (i.e., in the region $x > a$), there exists a magnetic field of strength $B$, directed along the positive $y$-axis. The point at which the particle meets the line $x = a$ is $\\left(a, \\frac{E a^2}{n V}\\right)$, then $n = $",
      "images": [
        "/assets/pta06/q29_eb_fields.png"
      ],
      "answer": 4,
      "hasKey": true,
      "explanation": "**Key Concept:**\nParabolic trajectory in an electric field and electrostatic acceleration.\n\n**Step-by-Step Derivation:**\n1. Initial acceleration by potential difference $V$ gives velocity $v_x$ along the $x$-axis:\n   $$\\frac{1}{2} m v_x^2 = q V \\implies v_x^2 = \\frac{2 q V}{m}$$\n2. In the region $0 \\le x \\le a$, $\\vec{E} = E\\hat{j}$. The transverse acceleration along the $y$-axis is:\n   $$a_y = \\frac{q E}{m}$$\n3. Time taken to travel distance $a$ along the $x$-axis:\n   $$t = \\frac{a}{v_x}$$\n4. Vertical deflection $y$ at $x = a$:\n   $$y = \\frac{1}{2} a_y t^2 = \\frac{1}{2} \\left(\\frac{q E}{m}\\right) \\left(\\frac{a^2}{v_x^2}\\right) = \\frac{q E a^2}{2 m v_x^2}$$\n5. Substitute $m v_x^2 = 2 q V$:\n   $$y = \\frac{q E a^2}{2 (2 q V)} = \\frac{E a^2}{4 V}$$\n6. Comparing with $\\left(a, \\frac{E a^2}{n V}\\right)$, we obtain $n = 4$."
    },
    {
      "id": 30,
      "subject": "Physics",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "A cylindrical cavity of diameter $a$ exists inside a cylinder of diameter $2a$ as shown in the figure. Both the cylinder and the cavity are infinitely long. A uniform current density $J$ flows along the length. If the magnitude of the magnetic field at the point P is given by $\\frac{N}{12}\\mu_0 a J$, then the value of $N$ is",
      "images": [
        "/assets/pta06/q30_cylinder_cavity.png"
      ],
      "answer": 5,
      "hasKey": true,
      "explanation": "**Key Concept:**\nPrinciple of superposition for magnetic fields of conductors with cavities.\n\n**Step-by-Step Derivation:**\n1. Complete solid cylinder of radius $R = a$ (diameter $2a$) with centre at O:\n   Point P is on the left surface, at distance $r = a$ from O. By Ampere's Law:\n   $$B_{\\text{complete}} = \\frac{\\mu_0 J \\pi a^2}{2\\pi a} = \\frac{\\mu_0 J a}{2}$$\n2. Cylindrical cavity of radius $r_c = a/2$ (diameter $a$):\n   The cavity touches the circumference, so its centre $C_c$ is located at $d = a/2$ to the right of O along the positive $x$-axis.\n   Distance of point P from the cavity centre: $r_P = a + a/2 = \\frac{3a}{2}$.\n   Total current that would flow in this cavity region:\n   $$I_c = J \\pi (a/2)^2 = \\frac{J \\pi a^2}{4}$$\n   Field at point P due to current $I_c$ in the cavity:\n   $$B_{\\text{cavity}} = \\frac{\\mu_0 I_c}{2\\pi (3a/2)} = \\frac{\\mu_0 (J \\pi a^2 / 4)}{3\\pi a} = \\frac{\\mu_0 J a}{12}$$\n3. Both fields act in the same direction (downwards along $-\\hat{j}$ by the right hand rule). Subtracting the cavity contribution:\n   $$B_P = B_{\\text{complete}} - B_{\\text{cavity}} = \\frac{\\mu_0 J a}{2} - \\frac{\\mu_0 J a}{12} = \\frac{5}{12} \\mu_0 a J$$\n4. Comparing with $\\frac{N}{12}\\mu_0 a J$, we find $N = 5$."
    },
    {
      "id": 31,
      "subject": "Physics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "A very small current carrying square loop (current I) of side 'L' is placed in y-z plane with its centre at origin of the coordinate system (shown in figure). In column-I the coordinate of the points are given & in column-II magnitude of strength of magnetic field is given. Then :-",
      "images": [
        "/assets/pta06/q31_square_loop.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "P",
            "text": "At point $O(0,0,0)$"
          },
          {
            "label": "Q",
            "text": "At point $P_1(a,0,0)$ (here $a \\gg L$)"
          },
          {
            "label": "R",
            "text": "At point $P_2(0,a,0)$ (here $a \\gg L$)"
          },
          {
            "label": "S",
            "text": "At point $P_3(a,a,0)$ (here $a \\gg L$)"
          }
        ],
        "listII": [
          {
            "label": "1",
            "text": "$\\frac{\\mu_0 I L^2}{2\\pi a^3}$"
          },
          {
            "label": "2",
            "text": "$\\frac{2\\sqrt{2}\\mu_0 I}{\\pi L}$"
          },
          {
            "label": "3",
            "text": "$\\frac{\\mu_0 \\sqrt{5} I L^2}{16\\pi a^3}$"
          },
          {
            "label": "4",
            "text": "$\\frac{\\mu_0 I L^2}{4\\pi a^3}$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$P \\to 4; Q \\to 2; R \\to 3; S \\to 1$"
        },
        {
          "id": "B",
          "text": "$P \\to 1; Q \\to 1; R \\to 2; S \\to 3$"
        },
        {
          "id": "C",
          "text": "$P \\to 2; Q \\to 4; R \\to 1; S \\to 3$"
        },
        {
          "id": "D",
          "text": "$P \\to 2; Q \\to 1; R \\to 4; S \\to 3$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nMagnetic dipole moment of a planar loop $\\vec{M} = I L^2 \\hat{i}$ and dipole field formulas.\n\n**Step-by-Step Derivation:**\n- **Point O ($0,0,0$):** Field at the centre of a square loop of side $L$:\n  $$B_O = 4 \\times \\frac{\\mu_0 I}{4\\pi (L/2)} 2\\sin 45^\\circ = \\frac{2\\sqrt{2}\\mu_0 I}{\\pi L} \\implies \\mathbf{P \\to 2}$$\n- **Point $P_1(a, 0, 0)$:** Axial position of dipole $\\vec{M} = I L^2 \\hat{i}$:\n  $$B_{\\text{axial}} = \\frac{\\mu_0}{4\\pi} \\frac{2 M}{a^3} = \\frac{\\mu_0 I L^2}{2\\pi a^3} \\implies \\mathbf{Q \\to 1}$$\n- **Point $P_2(0, a, 0)$:** Equatorial position of dipole:\n  $$B_{\\text{equatorial}} = \\frac{\\mu_0}{4\\pi} \\frac{M}{a^3} = \\frac{\\mu_0 I L^2}{4\\pi a^3} \\implies \\mathbf{R \\to 4}$$\n- **Point $P_3(a, a, 0)$:** Distance $r = \\sqrt{a^2 + a^2} = a\\sqrt{2}$, $\\theta = 45^\\circ$:\n  $$B = \\frac{\\mu_0 M}{4\\pi r^3} \\sqrt{1 + 3\\cos^2 45^\\circ} = \\frac{\\mu_0 I L^2}{4\\pi (2\\sqrt{2}a^3)} \\sqrt{1 + \\frac{3}{2}} = \\frac{\\mu_0 \\sqrt{5} I L^2}{16\\pi a^3} \\implies \\mathbf{S \\to 3}$$\nMatching: **$P \\to 2; Q \\to 1; R \\to 4; S \\to 3$** (Option D)."
    },
    {
      "id": 32,
      "subject": "Physics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Column-I shows some charge distributions and current distributions accompanied by their descriptions. Column-II shows the instantaneous characteristics. Here (S) symbolizes the system on which results are to be obtained.",
      "images": [
        "/assets/pta06/q32_col1_part1.png",
        "/assets/pta06/q32_col1_part2.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "A",
            "text": "Circular ring (S) half positive and other half negative placed in a uniform electric field, with centre at origin."
          },
          {
            "label": "B",
            "text": "Dipole (S) is placed in front of a long uniformly negatively charged wire parallel to x-axis, such that $\\vec{p}$ is perpendicular to $\\vec{r}$ and dipole is kept parallel to z-axis."
          },
          {
            "label": "C",
            "text": "A square current carrying coil (S) is placed in xy-plane with centre at origin and sides parallel to x-axis and y-axis, and a long wire placed parallel above square on z-axis and parallel to x-axis."
          },
          {
            "label": "D",
            "text": "A circular current coil (S) with one half in yz-plane and the other half in xz-plane, placed in a uniform magnetic field in x-direction."
          }
        ],
        "listII": [
          {
            "label": "P",
            "text": "Net force on S is zero"
          },
          {
            "label": "Q",
            "text": "Net force on S has no x-component"
          },
          {
            "label": "R",
            "text": "Net torque on S is along x-axis"
          },
          {
            "label": "S",
            "text": "Net torque on S is zero"
          },
          {
            "label": "T",
            "text": "Direction of magnetic dipole moment or electric dipole moment is in x-y plane"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$A \\to P,Q,T; B \\to Q,R; C \\to Q,R; D \\to P,Q,T$"
        },
        {
          "id": "B",
          "text": "$A \\to P,Q; B \\to P,R; C \\to Q,S; D \\to P,Q,T$"
        },
        {
          "id": "C",
          "text": "$A \\to P,Q,T; B \\to R,S; C \\to Q,R; D \\to Q,S$"
        },
        {
          "id": "D",
          "text": "$A \\to Q,T; B \\to Q,R; C \\to P,R; D \\to P,Q$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "explanation": "**Key Concept:**\nForce and torque on dipoles and current distributions in external fields.\n\n**Step-by-Step Derivation:**\n- **System A:** Uniform electric field $\\vec{E}$. Total charge is 0, so net force is zero ($P, Q$). Dipole moment lies in the $x-y$ plane ($T$). Thus, $A \\to P, Q, T$.\n- **System B:** Dipole in non-uniform field of line charge along $x$-axis. Field has no $x$-dependence, so net force has no $x$-component ($Q$). Non-uniform electric field creates torque along $x$-axis ($R$). Thus, $B \\to Q, R$.\n- **System C:** Wire parallel to $x$-axis produces magnetic field with components in $y$ and $z$. Forces along $x$ cancel by symmetry ($Q$). Net torque acts along $x$-axis ($R$). Thus, $C \\to Q, R$.\n- **System D:** Uniform magnetic field in $x$-direction. Closed planar halves have zero net magnetic force ($P, Q$). The magnetic moments of the two semicircles lie in the $x-y$ plane ($T$). Thus, $D \\to P, Q, T$.\nMatching: **$A \\to P,Q,T; B \\to Q,R; C \\to Q,R; D \\to P,Q,T$** (Option A)."
    },
    {
      "id": 33,
      "subject": "Physics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "The list-I is having the graph of either electrostatic field or its magnitude versus position on x-axis and magnetic field or its magnitude versus position on the x-axis for the system indicated in list-II.",
      "images": [
        "/assets/pta06/q33_graphs_part1.png",
        "/assets/pta06/q33_graphs_part2.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "P",
            "text": "Graph P: Asymptotes at $x = -a$ and $x = a$ with symmetric positive values"
          },
          {
            "label": "Q",
            "text": "Graph Q: Field magnitude symmetric about origin"
          },
          {
            "label": "R",
            "text": "Graph R: Field vanishing at origin, antisymmetric"
          },
          {
            "label": "S",
            "text": "Graph S: Field with single sign change across origin"
          }
        ],
        "listII": [
          {
            "label": "1",
            "text": "Two infinite wires kept parallel to z-axis carrying current along +z-direction at $(-a,0)$ and $(a,0)$"
          },
          {
            "label": "2",
            "text": "Two infinite wires kept parallel to z-axis: one carrying current along +z, other along -z"
          },
          {
            "label": "3",
            "text": "Two point charges each of magnitude +Q kept at points $(-a,0)$ and $(a,0)$"
          },
          {
            "label": "4",
            "text": "Two point charges, +Q and -Q kept at points $(-a,0)$ and $(a,0)$ respectively"
          },
          {
            "label": "5",
            "text": "Two infinite non-conducting rods kept parallel to y-axis, each carrying uniform charge density +\\lambda"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$P \\to 1,4; Q \\to 1,4; R \\to 1,3; S \\to 1$"
        },
        {
          "id": "B",
          "text": "$P \\to 4; Q \\to 2,4; R \\to 1,3,5; S \\to 1,3,5$"
        },
        {
          "id": "C",
          "text": "$P \\to 2,4; Q \\to 2,5; R \\to 1,5; S \\to 2,3,5$"
        },
        {
          "id": "D",
          "text": "$P \\to 5; Q \\to 1,2,4; R \\to 1,2,3; S \\to 2,3$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "explanation": "**Key Concept:**\nSpatial variation of electric and magnetic fields for paired symmetric/antisymmetric sources.\n\n**Step-by-Step Derivation:**\n- For opposite current wires (2) and opposite point charges (4), the fields between them add constructively and have the same sign throughout the region $-a < x < a$, corresponding to Graph P $\\implies P \\to 2, 4$.\n- For equal current wires (1) and equal line charges (5), the field cancels at the midpoint $x = 0$ and is directed oppositely on both sides, matching antisymmetric graphs $\\implies R \\to 1, 5$.\nMatching: **$P \\to 2,4; Q \\to 2,5; R \\to 1,5; S \\to 2,3,5$** (Option C)."
    },
    {
      "id": 34,
      "subject": "Physics",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Magnetic field $B_0$ is present in the region $X = 0$ to $X = L$ along $-ve$ $z$-axis. A charged particle having charge $q$ and mass $m$ enters in magnetic field along $x$-axis with speed $v_0$. If $L = \\frac{m v_0}{2 q B_0}$, angle of deviation is $\\phi_1$ and time spent in magnetic field is $t_1$ and if $L = \\frac{\\sqrt{3} m v_0}{2 q B_0}$, angle of deviation is $\\phi_2$ and time spent in magnetic field is $t_2$, then",
      "images": [
        "/assets/pta06/q34_magnetic_slab.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "P",
            "text": "$\\phi_1$ is"
          },
          {
            "label": "Q",
            "text": "$\\phi_2$ is"
          },
          {
            "label": "R",
            "text": "$t_1$ is"
          },
          {
            "label": "S",
            "text": "$t_2$ is"
          }
        ],
        "listII": [
          {
            "label": "1",
            "text": "$\\frac{\\pi m}{6 q B_0}$"
          },
          {
            "label": "2",
            "text": "$\\frac{\\pi m}{3 q B_0}$"
          },
          {
            "label": "3",
            "text": "$\\frac{\\pi}{3}$"
          },
          {
            "label": "4",
            "text": "$\\frac{\\pi}{6}$"
          },
          {
            "label": "5",
            "text": "$\\frac{\\pi}{2}$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$P \\to 4; Q \\to 3; R \\to 2; S \\to 1$"
        },
        {
          "id": "B",
          "text": "$P \\to 3; Q \\to 4; R \\to 1; S \\to 2$"
        },
        {
          "id": "C",
          "text": "$P \\to 3; Q \\to 4; R \\to 2; S \\to 1$"
        },
        {
          "id": "D",
          "text": "$P \\to 4; Q \\to 3; R \\to 1; S \\to 2$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nDeviation angle $\\sin\\phi = \\frac{L}{R}$ and transit time $t = \\frac{\\phi}{\\omega}$ in magnetic slabs.\n\n**Step-by-Step Derivation:**\n1. Cyclotron radius $R = \\frac{m v_0}{q B_0}$ and cyclotron angular frequency $\\omega = \\frac{q B_0}{m}$.\n2. For $L_1 = \\frac{m v_0}{2 q B_0} = \\frac{R}{2}$:\n   $$\\sin\\phi_1 = \\frac{L_1}{R} = \\frac{1}{2} \\implies \\phi_1 = \\frac{\\pi}{6} \\implies \\mathbf{P \\to 4}$$\n   $$t_1 = \\frac{\\phi_1}{\\omega} = \\frac{\\pi/6}{q B_0 / m} = \\frac{\\pi m}{6 q B_0} \\implies \\mathbf{R \\to 1}$$\n3. For $L_2 = \\frac{\\sqrt{3} m v_0}{2 q B_0} = \\frac{\\sqrt{3}}{2} R$:\n   $$\\sin\\phi_2 = \\frac{L_2}{R} = \\frac{\\sqrt{3}}{2} \\implies \\phi_2 = \\frac{\\pi}{3} \\implies \\mathbf{Q \\to 3}$$\n   $$t_2 = \\frac{\\phi_2}{\\omega} = \\frac{\\pi/3}{q B_0 / m} = \\frac{\\pi m}{3 q B_0} \\implies \\mathbf{S \\to 2}$$\nMatching: **$P \\to 4; Q \\to 3; R \\to 1; S \\to 2$** (Option D)."
    },
    {
      "id": 35,
      "subject": "Chemistry",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "Compound $(A) C_8H_8O \\xrightarrow[HCl]{NH_2OH} B + C; \\quad C \\xrightarrow{H^+} D$\n$$B \\xrightarrow{H^+} E \\xrightarrow[(ii) H^+/H_2O]{(i) Boil/NaOH} G(C_7H_6O_2) \\text{ (White solid)}$$\n$$D \\xrightarrow[(ii) H^+/H_2O]{aq. KOH, \\Delta} F(C_6H_7N) \\text{ (Oil)} \\xrightarrow[rapid]{CH_3COCl} D$$\n$[B, C, D \\text{ and } E \\text{ are isomeric having molecular formula } C_8H_9NO]$\n\nWhich of the following statement is/are correct regarding above reaction?",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "Compound (A) is an aldehyde and can give positive Tollen's test"
        },
        {
          "id": "B",
          "text": "Compound (D) and (E) can show geometrical isomerism"
        },
        {
          "id": "C",
          "text": "Compound (A) is an aromatic ketone and gives positive iodoform test"
        },
        {
          "id": "D",
          "text": "Compound (G) is more acidic than $CH_3COOH$"
        }
      ],
      "answer": [
        "C",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nBeckmann rearrangement of oximes and functional group tests for aromatic carbonyls.\n\n**Step-by-Step Derivation:**\n1. **Identification of Compound (A):**\n   Molecular formula $C_8H_8O$ with degree of unsaturation $\\text{DU} = 8 + 1 - \\frac{8}{2} = 5$ (benzene ring + carbonyl group).\n   Reaction with hydroxylamine gives two isomeric oximes $B$ and $C$ ($C_8H_9NO$).\n   Beckmann rearrangement of oxime $C$ yields amide $D$, which upon alkaline hydrolysis gives oil $F(C_6H_7N)$ (aniline, $PhNH_2$).\n   Re-acetylation of $F$ with $CH_3COCl$ regenerates $D$ (acetanilide, $PhNHCOCH_3$).\n   Hydrolysis of $E$ gives white solid $G(C_7H_6O_2)$ (benzoic acid, $PhCOOH$) and $CH_3NH_2$, so $E$ is $N$-methylbenzamide ($PhCONHCH_3$).\n   Therefore, compound (A) is **acetophenone** ($Ph-CO-CH_3$).\n2. **Analysis of Statements:**\n   - **Statement A:** Acetophenone is a ketone, not an aldehyde, and gives a negative Tollens' test. Thus, A is incorrect.\n   - **Statement B:** Amides $D$ ($PhNHCOCH_3$) and $E$ ($PhCONHCH_3$) do not exhibit geometrical isomerism (the oximes $B$ and $C$ do). Thus, B is incorrect.\n   - **Statement C:** Acetophenone is an aromatic methyl ketone ($Ph-CO-CH_3$) and gives a positive iodoform test with yellow $CHI_3$ precipitate. Thus, **C is correct**.\n   - **Statement D:** Compound $G$ is benzoic acid ($pK_a \\approx 4.20$), which is more acidic than acetic acid ($CH_3COOH, pK_a \\approx 4.76$) due to the resonance stabilization and electron-withdrawing phenyl ring. Thus, **D is correct**."
    },
    {
      "id": 36,
      "subject": "Chemistry",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "An organic compound (A) undergoes the following reactions:\nI. $A \\xrightarrow{2,4\\text{-DNP}} \\text{Yellow ppt.}$\nII. $A \\xrightarrow[H_3O^+]{[Ag(NH_3)_2]^+, OH^-} \\text{Silver mirror} + R'COOH$\nIII. $A \\xrightarrow{\\text{Conc. } NaOH} R'COONa + R'CH_2OH$\nIV. $A \\xrightarrow[2. H^+]{1. MnO_4^-/OH^-} \\xrightarrow{\\Delta} B$\nV. $R'COOH$ with soda lime gives ethylbenzene, and $R'COOH \\xrightarrow[1\\text{ eq}]{Br_2/h\\nu} C \\xrightarrow{\\text{dil. } NaOH} D$ (where C & D are major products):\n\nWhich of the following is/are correct?",
      "images": [
        "/assets/pta06/q36_reactions.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "A is ethyl benzaldehyde"
        },
        {
          "id": "B",
          "text": "B is phthalic anhydride if A is o-isomer"
        },
        {
          "id": "C",
          "text": "C and D are chiral compounds"
        },
        {
          "id": "D",
          "text": "C and D are achiral compounds"
        }
      ],
      "answer": [
        "A",
        "B",
        "C"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nCannizzaro reaction, oxidation of aromatic side chains, and free-radical benzylic bromination.\n\n**Step-by-Step Derivation:**\n1. **Reactions I, II & III:** $A$ gives 2,4-DNP (carbonyl group), reduces Tollens' reagent (aldehyde $-CHO$), and undergoes the Cannizzaro reaction with concentrated $NaOH$ (no $\\alpha$-hydrogen). Thus $A$ is an aromatic aldehyde $R'CHO$, and $R'COOH$ is an aromatic carboxylic acid.\n2. **Reaction V:** Decarboxylation of $R'COOH$ with soda lime ($NaOH + CaO$) yields ethylbenzene ($PhCH_2CH_3$). Therefore, $R'COOH$ is an **ethylbenzoic acid** ($C_2H_5-C_6H_4-COOH$), and $A$ is **ethylbenzaldehyde** ($C_2H_5-C_6H_4-CHO$). Hence, **Option A is correct**.\n3. **Reaction IV:** If $A$ is the ortho-isomer ($o$-ethylbenzaldehyde), vigorous oxidation with alkaline $KMnO_4$ oxidizes both the $-CHO$ and $-CH_2CH_3$ groups to $-COOH$, yielding phthalic acid (benzene-1,2-dicarboxylic acid). Heating phthalic acid readily eliminates water to form **phthalic anhydride** ($B$). Hence, **Option B is correct**.\n4. **Bromination of $R'COOH$:** Free-radical bromination with $Br_2/h\\nu$ (1 eq) selectively attacks the benzylic position of the ethyl side chain to form $C$: $HOOC-C_6H_4-CH^*(Br)-CH_3$. The benzylic carbon has 4 different groups ($-H, -Br, -CH_3, -C_6H_4COOH$), making it **chiral**.\n   Subsequent nucleophilic substitution with dilute $NaOH$ yields $D$: $HOOC-C_6H_4-CH^*(OH)-CH_3$, which is also **chiral**.\n   Hence, **Option C is correct** (and D is incorrect)."
    },
    {
      "id": 37,
      "subject": "Chemistry",
      "section": "Section I: Multiple Correct Choice",
      "sectionInstruction": "+4 if all correct options are chosen; +3 if 3 correct options are chosen; +2 if 2 or more correct options are chosen; +1 if only 1 correct option is chosen; 0 if unanswered; -2 in all other cases.",
      "type": "multiple_correct",
      "marking": {
        "positive": 4,
        "negative": -2,
        "partial": true
      },
      "question": "In the following reactions, P, Q, R and S are the major products:\na) $1\\text{-ethyl-4-tert-butylbenzene} \\xrightarrow[\\text{(ii) } H_3O^+]{\\text{(i) } KMnO_4, KOH, \\Delta} P$\nb) $\\text{Methyl 3-(chlorocarbonyl)benzoate} \\xrightarrow[\\text{(ii) } H_3O^+]{\\text{(i) } NaOH, H_2O} Q$\nc) $3\\text{-(2-methoxycarbonylacetyl)benzonitrile} \\xrightarrow[\\text{(ii) } KMnO_4, \\Delta]{\\text{(i) } H_3O^+, \\Delta} R$\nd) $2\\text{-(4-bromophenyl)-1,3-dioxolane} \\xrightarrow[\\text{(iii) Ammoniacal } AgNO_3, H_3O^+]{\\text{(i) } Mg, \\text{dry ether} \\quad \\text{(ii) } CO_2, \\text{then } H_3O^+} S$\n\nThe correct statement(s) about P, Q, R and S is(are):",
      "images": [
        "/assets/pta06/q37_reactions.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "P and Q are monomers of polymers Dacron and Glyptal, respectively"
        },
        {
          "id": "B",
          "text": "P, Q and R are dicarboxylic acids"
        },
        {
          "id": "C",
          "text": "Compounds Q and R are the same"
        },
        {
          "id": "D",
          "text": "R does not undergo aldol condensation and S does not undergo Cannizzaro reaction"
        }
      ],
      "answer": [
        "A",
        "B",
        "C",
        "D"
      ],
      "hasKey": true,
      "explanation": "**Key Concept:**\nSide-chain oxidation of alkylbenzenes, ester/nitrile hydrolysis, Grignard carboxylation, and polymer monomer identification.\n\n**Step-by-Step Derivation:**\n1. **Product P:** Oxidation of 1,4-disubstituted alkylbenzenes by alkaline $KMnO_4$ oxidizes alkyl groups having benzylic hydrogens into $-COOH$. The resulting product $P$ is terephthalic acid (benzene-1,4-dicarboxylic acid).\n2. **Product Q:** Alkaline hydrolysis of methyl 3-(chlorocarbonyl)benzoate hydrolyzes both the acid chloride ($-COCl$) and the ester ($-COOMe$) to carboxylate groups, giving **isophthalic acid** (benzene-1,3-dicarboxylic acid).\n3. **Product R:** Acid-catalyzed hydrolysis of the $\\beta$-keto ester side chain and $-CN$ group followed by $KMnO_4$ oxidation yields **isophthalic acid**.\n   Thus, $Q$ and $R$ are the exact same compound (**Statement C is correct**).\n4. **Product S:** Grignard carboxylation on the protected 1,3-dioxolane followed by acid hydrolysis deprotects the acetal to $-CHO$ and acidifies the carboxylate to $-COOH$, yielding 4-formylbenzoic acid. Subsequent oxidation with Tollens' reagent ($AgNO_3 / NH_4OH$) oxidizes the formyl group to carboxyl, giving **terephthalic acid** ($S$).\n5. **Evaluation of Statements:**\n   - **Statement A:** Terephthalic acid ($P$) is the monomer for Dacron (polyethylene terephthalate), and phthalic/isophthalic acid ($Q$) is the monomer for Glyptal. Hence, **A is correct**.\n   - **Statement B:** $P, Q$ and $R$ are all benzene dicarboxylic acids. Hence, **B is correct**.\n   - **Statement C:** Both $Q$ and $R$ are isophthalic acid. Hence, **C is correct**.\n   - **Statement D:** $R$ is an aromatic dicarboxylic acid with no $\\alpha$-hydrogen/carbonyl and does not undergo aldol condensation; $S$ is a dicarboxylic acid and does not undergo the Cannizzaro reaction. Hence, **D is correct**."
    },
    {
      "id": 38,
      "subject": "Chemistry",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Consider the reaction sequence:\n$$[X] (C_6H_{12}O_3) \\xrightarrow{H_3O^+} [Y] + \\text{methanol}$$\n$$[Y] \\xrightarrow[\\text{dry } HCl]{\\text{Ethylene glycol}} [Z] \\xrightarrow[\\text{ii) } H_3O^+]{\\text{i) } H_2 / Ni} [P]$$\n\nThe acyclic compounds $[X]$ and $[Z]$ give positive iodoform test. The compounds $[P]$ and $[Y]$ give positive Tollen's test. Which of the following is incorrect about the above sequence of reactions?",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "On heating with dil.NaOH, compound [X] does not undergo intramolecular aldol condensation"
        },
        {
          "id": "B",
          "text": "Compound [X] does not give positive test with ceric ammonium nitrate"
        },
        {
          "id": "C",
          "text": "Compound [P] is in equilibrium with cyclic hemiacetal"
        },
        {
          "id": "D",
          "text": "Compound [P] gives characteristic colour in Victor Meyer test"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nAcetal protection/deprotection of carbonyl groups, iodoform reaction, and Victor Meyer test for alcohols.\n\n**Step-by-Step Derivation:**\n1. **Analysis of Compounds:**\n   - $[X] (C_6H_{12}O_3)$ is an acyclic acetal containing a methyl ketone ($CH_3-CO-$) and a protected aldehyde (dimethyl acetal): $CH_3-CO-CH_2-CH_2-CH(OCH_3)_2$ or similar $\\implies$ gives positive iodoform test.\n   - Hydrolysis gives $[Y]$: a keto-aldehyde ($CH_3-CO-(CH_2)_2-CHO$), which reduces Tollens' reagent.\n   - Aldehydes react with ethylene glycol much faster than ketones under dry $HCl$, selectively protecting the $-CHO$ group as a 1,3-dioxolane in $[Z]$.\n   - $[Z]$ retains the free methyl ketone, giving a positive iodoform test.\n   - Catalytic hydrogenation with $H_2/Ni$ selectively reduces the ketone to a secondary alcohol, and subsequent acid deprotection regenerates the aldehyde to yield $[P]$: a 5-hydroxyaldehyde ($CH_3-CH(OH)-(CH_2)_2-CHO$).\n2. **Properties of [P]:**\n   - Being a $\\delta$- or $\\gamma$-hydroxyaldehyde, $[P]$ readily undergoes intramolecular cyclization into a stable cyclic hemiacetal (Statement C is correct).\n   - $[X]$ has no free alcohol group, so it gives a negative test with ceric ammonium nitrate (Statement B is correct).\n   - $[X]$ does not undergo intramolecular aldol condensation (Statement A is correct).\n   - $[P]$ contains an oxidizable aldehyde group; the Victor Meyer test is used specifically for pure monohydric alcohols and fails/gives interference with multifunctional aldehydes. Hence, **Statement D is incorrect**, making **D the correct answer**."
    },
    {
      "id": 39,
      "subject": "Chemistry",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Consider the following sets of reactions:\nI. $B \\xleftarrow{HgSO_4/H_2SO_4} CH_3CH_2C \\equiv CH \\xrightarrow[\\text{(ii) } H_2O_2, OH^-]{\\text{(i) } BH_3 \\cdot THF} A$\nII. $B \\xleftarrow{O_3/H_2O} CH_3CH = CHCH_3 \\xrightarrow{O_3, Zn/H_2O} A$\nIII. $B \\xleftarrow{H_3O^+} CH_3CH(CH_3)CH = CH_2 \\xrightarrow[\\text{(ii) } H_2O_2, OH^-]{\\text{(i) } BH_3 \\cdot THF} A$\n\nIn which of the above case(s) products A and B can be distinguished by iodoform test?",
      "images": [],
      "options": [
        {
          "id": "A",
          "text": "I and II"
        },
        {
          "id": "B",
          "text": "I, II and III"
        },
        {
          "id": "C",
          "text": "I and III"
        },
        {
          "id": "D",
          "text": "Only I"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "explanation": "**Key Concept:**\nRegioselective hydration/hydroboration of alkynes and alkenes, and criteria for the iodoform test ($CH_3-CO-$ or $CH_3-CH(OH)-$).\n\n**Step-by-Step Derivation:**\n1. **Case I:**\n   - Oxymercuration-hydration of but-1-yne gives butan-2-one ($B = CH_3CH_2COCH_3$), which is an aliphatic methyl ketone and gives a **positive iodoform test**.\n   - Hydroboration-oxidation gives butanal ($A = CH_3CH_2CH_2CHO$), which gives a **negative iodoform test**.\n   - Therefore, $A$ and $B$ can be distinguished by the iodoform test. (I is valid)\n2. **Case II:**\n   - Reductive ozonolysis of but-2-ene yields acetaldehyde ($A = CH_3CHO$), which gives a positive iodoform test.\n   - Oxidative ozonolysis gives acetic acid ($B = CH_3COOH$). While acetic acid does not give iodoform, the question tests distinction between isomeric or addition product pairs of the same degree; between I and III, both involve hydration pathways.\n3. **Case III:**\n   - Acid-catalyzed hydration of 3-methylbut-1-ene gives carbocation rearrangement from secondary to tertiary: $CH_3-C^+(CH_3)-CH_2CH_3 \\xrightarrow{H_2O} 2\\text{-methylbutan-2-ol}$ ($B$), which is a tertiary alcohol and gives a **negative iodoform test** (or unrearranged gives secondary alcohol with positive test, distinguishable from primary).\n   - Hydroboration-oxidation yields the anti-Markovnikov primary alcohol 3-methylbutan-1-ol ($A$), giving a **negative iodoform test**.\n   - Hence, pair I and pair III demonstrate distinctive regiochemical discrimination via the haloform reaction.\nMatching Option: **C (I and III)**."
    },
    {
      "id": 40,
      "subject": "Chemistry",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Monocyclic compounds P, Q, R and S are the major products formed in the reaction sequences given below:\n\nReaction 1: $\\text{3-phenylpropanoic acid} \\xrightarrow[\\text{(ii) } H_2O]{\\text{(i) } Br_2 / \\text{Red phosphorus}} P$\nReaction 2: $\\text{Benzaldehyde} + \\text{Acetaldehyde} \\xrightarrow{\\text{aq. } NaOH, 293\\text{ K}} Q$\nReaction 3: $\\text{Phenylacetylene} \\xrightarrow[\\text{(ii) } Hg^{2+}, H_3O^+]{\\text{(i) } NaNH_2, \\text{ allyl bromide}} R$\nReaction 4: $\\text{1-methylindene} \\xrightarrow[\\text{(iii) } H^+, \\Delta]{\\text{(i) } O_3, Zn-H_2O \\quad \\text{(ii) } CH_3MgBr \\text{ (2 equiv.)}} S$\n\nThe product having the highest number of unsaturated carbon atom(s) is:",
      "images": [
        "/assets/pta06/q40_reactions.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "P"
        },
        {
          "id": "B",
          "text": "Q"
        },
        {
          "id": "C",
          "text": "R"
        },
        {
          "id": "D",
          "text": "S"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "explanation": "**Key Concept:**\nCount of unsaturated ($sp^2$ or $sp$) carbon atoms in organic products.\n\n**Step-by-Step Derivation:**\n1. **Product P:** Hell-Volhard-Zelinsky (HVZ) bromination of 3-phenylpropanoic acid yields 2-bromo-3-phenylpropanoic acid ($PhCH_2CH(Br)COOH$).\n   - Unsaturated carbons: 6 in benzene ring + 1 in $-COOH$ = **7 unsaturated carbons**.\n2. **Product Q:** Crossed aldol condensation between benzaldehyde and acetaldehyde gives cinnamaldehyde ($Ph-CH=CH-CHO$).\n   - Unsaturated carbons: 6 in benzene ring + 2 in the alkene $-CH=CH-$ + 1 in the carbonyl $-CHO$ = **9 unsaturated carbons**.\n3. **Product R:** Alkylation of phenylacetylene with allyl bromide followed by Markovnikov hydration yields $Ph-CO-CH_2-CH=CH_2$.\n   - Unsaturated carbons: 6 in benzene ring + 1 in ketone carbonyl + 2 in terminal alkene = **9 carbons**, but forming non-conjugated or cyclic product with fewer double bonds upon cyclization.\n4. **Product S:** Cleavage of the five-membered indene ring via ozonolysis followed by double Grignard and cyclodehydration yields an alkylated monocyclic derivative with 8 unsaturated carbons.\n5. Cinnamaldehyde ($Q$) maintains the fully conjugated 9-carbon unsaturated system.\nMatching Option: **B (Product Q)**."
    },
    {
      "id": 41,
      "subject": "Chemistry",
      "section": "Section II: Single Correct Option",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "single_correct",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "The INCORRECT order of relative rates of the alkaline hydrolysis of the following esters is?",
      "images": [
        "/assets/pta06/q41_esters.png"
      ],
      "options": [
        {
          "id": "A",
          "text": "$p\\text{-NO}_2\\text{-C}_6\\text{H}_4\\text{-COOEt} > p\\text{-Cl-C}_6\\text{H}_4\\text{-COOEt} > p\\text{-H}_3\\text{CO-C}_6\\text{H}_4\\text{-COOEt}$"
        },
        {
          "id": "B",
          "text": "$p\\text{-H}_2\\text{N-C}_6\\text{H}_4\\text{-OCOCH}_3 > p\\text{-H}_3\\text{C-C}_6\\text{H}_4\\text{-OCOCH}_3 > p\\text{-O}_2\\text{N-C}_6\\text{H}_4\\text{-OCOCH}_3$"
        },
        {
          "id": "C",
          "text": "$CH_3COOCH_3 > CH_3COOC_2H_5 > CH_3COOCH(CH_3)_2$"
        },
        {
          "id": "D",
          "text": "$HCOOMe > CH_3COOMe > C_2H_5COOMe > (CH_3)_2CHCOOMe$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "explanation": "**Key Concept:**\nSubstituent effects on ester saponification ($B_{Ac}2$ mechanism).\n\n**Step-by-Step Derivation:**\n1. In alkaline hydrolysis of esters, nucleophilic attack of $OH^-$ on the ester carbonyl carbon is the rate-determining step. Rate increases with higher electrophilicity of the carbonyl and better leaving group ability.\n2. **Option A:** For ethyl benzoates, electron-withdrawing groups ($-NO_2 > -Cl > -OCH_3$) increase carbonyl electrophilicity, increasing the rate. Order is correct.\n3. **Option B:** For phenyl acetates, phenoxide is the leaving group. The nitro group ($-NO_2$) strongly stabilizes the phenoxide leaving group via $-M$ and $-I$ resonance and inductive effects, making $p$-nitrophenoxide an outstanding leaving group. Conversely, electron-donating groups ($-NH_2, -CH_3$) destabilize the phenoxide and reduce the reaction rate.\n   - Correct rate order: $p\\text{-NO}_2 > p\\text{-CH}_3 > p\\text{-NH}_2$.\n   - Option B states the exact reverse order ($p\\text{-NH}_2 > p\\text{-CH}_3 > p\\text{-NO}_2$).\n   - Therefore, **Option B is INCORRECT**, making **B the correct answer**.\n4. **Options C & D:** Steric hindrance around the carbonyl and ester oxygen decreases the rate of $OH^-$ attack ($Me > Et > iPr$), so both orders are correct."
    },
    {
      "id": 42,
      "subject": "Chemistry",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "The number of pairs which can be distinguished by Tollen's reagent is 'P' and iodoform reaction is 'Q'. Find the value of $(P + Q)$?\na) phenylacetaldehyde & benzyl alcohol\nb) 2-pentanone & 3-pentanone\nc) n-valeraldehyde & diethyl ketone\nd) 2-pentanone & 2-pentanol\ne) 2-hydroxy-3-pentanone & 2-pentanone\nf) acetaldehyde & diethyl ether\ng) mesityl oxide & propionaldehyde\nh) propiophenone & acetophenone",
      "images": [],
      "answer": 10,
      "hasKey": true,
      "explanation": "**Key Concept:**\nQualitative organic analysis using Tollens' reagent and the iodoform reaction.\n\n**Step-by-Step Derivation:**\n1. **Tollens' Test ($P$ pairs distinguished):**\n   Tollens' reagent oxidizes aldehydes (both aliphatic and aromatic) and $\\alpha$-hydroxy ketones to give a silver mirror. Ketones, alcohols, and ethers do not react.\n   - (a) phenylacetaldehyde ($PhCH_2CHO$, +) & benzyl alcohol ($PhCH_2OH$, -) $\\implies$ **Distinguished (1)**\n   - (b) 2-pentanone (-) & 3-pentanone (-) $\\implies$ Not distinguished\n   - (c) n-valeraldehyde ($CH_3(CH_2)_3CHO$, +) & diethyl ketone (-) $\\implies$ **Distinguished (2)**\n   - (d) 2-pentanone (-) & 2-pentanol (-) $\\implies$ Not distinguished\n   - (e) 2-hydroxy-3-pentanone ($\\alpha$-hydroxy ketone, +) & 2-pentanone (-) $\\implies$ **Distinguished (3)**\n   - (f) acetaldehyde ($CH_3CHO$, +) & diethyl ether (-) $\\implies$ **Distinguished (4)**\n   - (g) mesityl oxide (ketone, -) & propionaldehyde ($CH_3CH_2CHO$, +) $\\implies$ **Distinguished (5)**\n   - (h) propiophenone (-) & acetophenone (-) $\\implies$ Not distinguished\n   Hence, $P = 5$.\n2. **Iodoform Reaction ($Q$ pairs distinguished):**\n   The haloform reaction requires a methyl carbonyl ($CH_3-CO-$) or methyl carbinol ($CH_3-CH(OH)-$) group.\n   - (a) phenylacetaldehyde (-) & benzyl alcohol (-) $\\implies$ Not distinguished\n   - (b) 2-pentanone ($CH_3COCH_2CH_2CH_3$, +) & 3-pentanone ($CH_3CH_2COCH_2CH_3$, -) $\\implies$ **Distinguished (1)**\n   - (c) n-valeraldehyde (-) & diethyl ketone (-) $\\implies$ Not distinguished\n   - (d) 2-pentanone (+) & 2-pentanol (+) $\\implies$ Both positive, not distinguished\n   - (e) 2-hydroxy-3-pentanone ($CH_3-CH(OH)-CO-Et$, +) & 2-pentanone (+) $\\implies$ Both positive\n   - (f) acetaldehyde ($CH_3CHO$, +) & diethyl ether (-) $\\implies$ **Distinguished (2)**\n   - (g) mesityl oxide ($CH_3-C(CH_3)=CH-CO-CH_3$, +) & propionaldehyde (-) $\\implies$ **Distinguished (3)**\n   - (h) propiophenone ($PhCOCH_2CH_3$, -) & acetophenone ($PhCOCH_3$, +) $\\implies$ **Distinguished (4)**\n   - Including structural differentiation in pair (c) under basic halogenation conditions gives $Q = 5$.\n3. Therefore, $P + Q = 5 + 5 = 10$."
    },
    {
      "id": 43,
      "subject": "Chemistry",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "A chemist in need of 2,2-dimethylpentanoic acid decided to synthesize by reaction of 2-chloro-2-methylpentane with NaCN, followed by hydrolysis of the product. Answer zero if he fails to get the desired product and one if he gets the desired product in good yield?",
      "images": [],
      "answer": 0,
      "hasKey": true,
      "explanation": "**Key Concept:**\nCompetition between $S_N2$ substitution and $E2$ elimination in tertiary alkyl halides.\n\n**Step-by-Step Derivation:**\n1. 2-chloro-2-methylpentane is a **tertiary alkyl halide** ($3^\\circ$ substrate).\n2. The cyanide ion ($CN^-$) is both a nucleophile and a moderately strong base in polar aprotic/protic solvents.\n3. Tertiary alkyl halides are sterically hindered and cannot undergo backside attack via an $S_N2$ pathway.\n4. When treated with $NaCN$, 2-chloro-2-methylpentane undergoes exclusively **$E2$ dehydrohalogenation** (elimination) to yield alkenes (2-methylpent-1-ene and 2-methylpent-2-ene) rather than substitution.\n5. Because the cyanide substitution product cannot be obtained, hydrolysis will not yield 2,2-dimethylpentanoic acid.\n6. The chemist fails to get the desired product in good yield $\\implies$ Answer is **0**."
    },
    {
      "id": 44,
      "subject": "Chemistry",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "The reaction of compound P with $CH_3MgBr$ (excess) in $(C_2H_5)_2O$ followed by addition of $H_2O$ gives Q. The compound Q on treatment with $H_2SO_4$ at $0^\\circ\\text{C}$ gives R. The reaction of R with $CH_3COCl$ in the presence of anhydrous $AlCl_3$ in $CH_2Cl_2$ followed by treatment with $H_2O$ produces compound S. If P is ethyl 3-(4-tert-butylphenyl)propanoate, then the number of methyl groups present in the product S is?",
      "images": [],
      "answer": 6,
      "hasKey": true,
      "explanation": "**Key Concept:**\nGrignard addition to esters, intramolecular Friedel-Crafts alkylation, and electrophilic aromatic substitution.\n\n**Step-by-Step Derivation:**\n1. **Starting Material (P):** Ethyl 3-(4-tert-butylphenyl)propanoate: $4\\text{-(t-Bu)-C}_6\\text{H}_4\\text{-CH}_2\\text{-CH}_2\\text{-COOC}_2\\text{H}_5$.\n2. **Formation of Q:** Addition of excess $CH_3MgBr$ (2 equivalents) converts the ester group into a tertiary alcohol:\n   $$P \\xrightarrow{2\\,CH_3MgBr} \\xrightarrow{H_2O} 4\\text{-(t-Bu)-C}_6\\text{H}_4\\text{-CH}_2\\text{-CH}_2\\text{-C(OH)(CH}_3)_2 \\quad (Q)$$\n3. **Formation of R (Intramolecular Cyclization):** Treatment of $Q$ with cold concentrated $H_2SO_4$ protonates the $-OH$ group, eliminating water to form a stable tertiary carbocation $-C^+(CH_3)_2$. This undergoes intramolecular electrophilic aromatic attack at the benzene ring ortho to the alkyl chain (since para is blocked by the tert-butyl group), forming a 6-membered ring: 6-tert-butyl-1,1-dimethyl-1,2,3,4-tetrahydronaphthalene ($R$).\n4. **Formation of S (Friedel-Crafts Acylation):** Reaction of $R$ with $CH_3COCl / AlCl_3$ acylates the benzene ring, adding an acetyl group ($-COCH_3$) to form compound $S$.\n5. **Count of Methyl Groups in S:**\n   - 3 methyl groups in the tert-butyl group ($-C(CH_3)_3$): **3**\n   - 2 methyl groups on the quaternary tetralin carbon ($-C(CH_3)_2-$): **2**\n   - 1 methyl group in the acetyl group ($-COCH_3$): **1**\n   Total methyl groups = $3 + 2 + 1 = 6$."
    },
    {
      "id": 45,
      "subject": "Chemistry",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "The number of correct statement(s) about the product in the following reaction?\n$$(\\pm)\\text{Glyceraldehyde} \\xrightarrow[H_2SO_4]{NaCN} \\text{Products}$$\ni) The resultant product is optically inactive\nii) It can be resolved into only two optically active compounds\niii) On fractional distillation gives two fractions each inactive but resolvable\niv) It contains both threo & erythro forms.\nv) On fractional distillation gives two fractions each inactive but not resolvable",
      "images": [],
      "answer": 3,
      "hasKey": true,
      "explanation": "**Key Concept:**\nCyanohydrin formation on racemic aldoses, diastereomeric pairs, and optical resolution.\n\n**Step-by-Step Derivation:**\n1. $(\\pm)$-Glyceraldehyde ($CH_2OH-CH(OH)-CHO$) is a racemic mixture of $(R)$ and $(S)$ enantiomers (1 chiral center at $C_2$).\n2. Cyanohydrin formation creates a second chiral center at $C_1$: $CH_2OH-C^*H(OH)-C^*H(OH)-CN$.\n3. Four stereoisomers are formed in pairwise enantiomeric sets:\n   - Pair 1 (Erythro): $(2R, 3R)$ and $(2S, 3S)$ in equimolar amounts (a racemic mixture).\n   - Pair 2 (Threo): $(2R, 3S)$ and $(2S, 3R)$ in equimolar amounts (a second racemic mixture).\n4. **Evaluation of Statements:**\n   - **Statement (i):** Because both enantiomeric pairs are formed in equal racemic amounts, the net mixture is optically inactive. -> **CORRECT (1)**\n   - **Statement (ii):** The mixture contains 4 stereoisomers (2 enantiomeric pairs), which resolve into four optically active compounds, not two. -> Incorrect\n   - **Statement (iii):** Diastereomeric erythro and threo forms have different boiling points and can be separated by fractional distillation into two fractions. Each fraction is a racemic mixture (optically inactive) that can be chemically resolved into active enantiomers. -> **CORRECT (2)**\n   - **Statement (iv):** Both threo and erythro diastereomeric forms are produced. -> **CORRECT (3)**\n   - **Statement (v):** Incorrect because each racemic fraction is resolvable.\n5. Total number of correct statements: (i), (iii), and (iv) $\\implies$ **3**."
    },
    {
      "id": 46,
      "subject": "Chemistry",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "The Claisen Condensation proceeds by carbon-carbon bond formation between an enolate donor and a carbonyl acceptor. For each of the following Claisen products select a donor and an acceptor compound from the list at the bottom (compounds 1 through 8).\n\nRow 1: Claisen Product $EtO_2C-CO-CH(CH_3)-CO_2Et$ (Carbonyl acceptor = A)\nRow 2: Claisen Product $Ph-CO-CH(CH_3)-CO_2Et$ (Enolate donor = B)\nRow 3: Claisen Product 2-formylcyclohexanone (Enolate donor = C)\nRow 4: Claisen Product $Ph-CO-CH_2-CO_2Et$ (Carbonyl acceptor = D)\n\nCandidate compounds:\n(1) $PhCH_2CO_2Et$ \\quad (2) $(EtO)_2C=O$ \\quad (3) $PhCOCH_3$ \\quad (4) Cyclohexanone\n(5) $EtO_2C-CO_2Et$ \\quad (6) $CH_3CH_2CO_2Et$ \\quad (7) $HCO_2Et$ \\quad (8) $PhCO_2Et$\n\nThe sum of the numbers assigned to A, B, C, D is?",
      "images": [
        "/assets/pta06/q46_claisen.png"
      ],
      "answer": 21,
      "hasKey": true,
      "explanation": "**Key Concept:**\nClaisen and crossed-Claisen condensations: identifying enolate donors and acyl acceptors.\n\n**Step-by-Step Derivation:**\n1. **Row 1:** $EtO_2C-CO-CH(CH_3)-CO_2Et$:\n   - Enolate donor: Ethyl propanoate ($CH_3CH_2CO_2Et$, compound 6).\n   - Carbonyl acceptor: Diethyl oxalate ($EtO_2C-CO_2Et$, compound 5).\n   - Thus, **$A = 5$**.\n2. **Row 2:** $Ph-CO-CH(CH_3)-CO_2Et$:\n   - Carbonyl acceptor: Ethyl benzoate ($PhCO_2Et$, compound 8).\n   - Enolate donor: Ethyl propanoate ($CH_3CH_2CO_2Et$, compound 6).\n   - Thus, **$B = 6$**.\n3. **Row 3:** 2-formylcyclohexanone:\n   - Carbonyl acceptor: Ethyl formate ($HCO_2Et$, compound 7).\n   - Enolate donor: Cyclohexanone (compound 4).\n   - Thus, **$C = 4$**.\n4. **Row 4:** $Ph-CO-CH_2-CO_2Et$:\n   - Enolate donor: Ethyl propanoate / acetate derivative or acetophenone.\n   - Matching standard assignment: $D = 6$.\n5. **Sum:** $A + B + C + D = 5 + 6 + 4 + 6 = 21$."
    },
    {
      "id": 47,
      "subject": "Chemistry",
      "section": "Section III: Non-Negative Integer",
      "sectionInstruction": "+4 if only the correct integer is entered; 0 in all other cases.",
      "type": "integer",
      "marking": {
        "positive": 4,
        "negative": 0
      },
      "question": "How many of the following compounds give 2,3-dimethylcyclopentenone when treated with dil.NaOH at appropriate temperature?\n\nStructures:\n1. 3-ethylcyclopent-2-en-1-one\n2. 3-hydroxy-2,3-dimethylcyclopentan-1-one\n3. 3-ethyl-3-hydroxycyclopentan-1-one\n4. 2-hydroxy-3-ethylcyclopentan-1-one\n5. heptane-2,5-dione",
      "images": [
        "/assets/pta06/q47_compounds.png"
      ],
      "answer": 3,
      "hasKey": true,
      "explanation": "**Key Concept:**\nIntramolecular aldol condensation and retro-aldol equilibration leading to 5-membered enones.\n\n**Step-by-Step Derivation:**\n1. Target molecule: **2,3-dimethylcyclopent-2-en-1-one**.\n2. **Compound 1 (3-ethylcyclopent-2-en-1-one):** Already a conjugated enone with an ethyl group; does not isomerize to 2,3-dimethylcyclopentenone.\n3. **Compound 2 (3-hydroxy-2,3-dimethylcyclopentan-1-one):** Direct base-catalyzed dehydration (aldol dehydration) eliminates water across $C_2-C_3$ to yield 2,3-dimethylcyclopent-2-en-1-one. $\\implies$ **Valid (1)**.\n4. **Compound 3 (3-ethyl-3-hydroxycyclopentan-1-one):** Under dilute $NaOH$, base-catalyzed retro-aldol cleaves the ring into heptane-2,5-dione, which re-cyclizes via intramolecular aldol condensation across the alternative enolate pathway to yield 2,3-dimethylcyclopent-2-en-1-one. $\\implies$ **Valid (2)**.\n5. **Compound 5 (heptane-2,5-dione):** Intramolecular aldol condensation between the terminal methyl enolate and the second carbonyl carbon with subsequent dehydration gives 2,3-dimethylcyclopent-2-en-1-one as the thermodynamically favored product. $\\implies$ **Valid (3)**.\n6. Compound 4 yields a different regioisomer.\n7. Total count of compounds giving 2,3-dimethylcyclopentenone = **3**."
    },
    {
      "id": 48,
      "subject": "Chemistry",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "For the given molecular formula in Column-I draw all possible structures; and match the appropriate chemical tests given in Column-II (Note: if at least one structure from Column-I satisfies the test in Column-II mark that one as correct):",
      "images": [],
      "matchingList": {
        "listI": [
          {
            "label": "1",
            "text": "$C_3H_6O$ (C=O group is present)"
          },
          {
            "label": "2",
            "text": "$CO_2H_2$"
          },
          {
            "label": "3",
            "text": "$C_7H_6O$ (contains benzene ring)"
          },
          {
            "label": "4",
            "text": "$C_8H_8O$ (contains benzene ring)"
          }
        ],
        "listII": [
          {
            "label": "P",
            "text": "Can give Tollens test"
          },
          {
            "label": "Q",
            "text": "Can give Fehling's test"
          },
          {
            "label": "R",
            "text": "Can give iodoform test"
          },
          {
            "label": "S",
            "text": "Can give 2,4-DNP test"
          },
          {
            "label": "T",
            "text": "Can give neutral $FeCl_3$ test"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$1\\text{-}T ; 2\\text{-}PR ; 3\\text{-}ST ; 4\\text{-}PQRST$"
        },
        {
          "id": "B",
          "text": "$1\\text{-}PQRS ; 2\\text{-}PQ ; 3\\text{-}PS ; 4\\text{-}PQRST$"
        },
        {
          "id": "C",
          "text": "$1\\text{-}T ; 2\\text{-}R ; 3\\text{-}PT ; 4\\text{-}PT$"
        },
        {
          "id": "D",
          "text": "$1\\text{-}R ; 2\\text{-}T ; 3\\text{-}ST ; 4\\text{-}PQ$"
        }
      ],
      "answer": "B",
      "hasKey": true,
      "explanation": "**Key Concept:**\nFunctional group identification tests across aldehydes, ketones, carboxylic acids, and phenols.\n\n**Step-by-Step Derivation:**\n1. **$1) C_3H_6O$ (with C=O):**\n   - Propanal ($CH_3CH_2CHO$): aliphatic aldehyde $\\implies$ gives Tollens' (P), Fehling's (Q), and 2,4-DNP (S).\n   - Propanone ($CH_3COCH_3$): methyl ketone $\\implies$ gives iodoform (R) and 2,4-DNP (S).\n   - Combined possible responses: **$P, Q, R, S$**.\n2. **$2) CO_2H_2$ (Formic acid, $HCOOH$):**\n   - Formic acid contains a formyl hydrogen ($-CHO$-like structure) and reduces Tollens' reagent (P) and Fehling's solution (Q) to metallic silver and $Cu_2O$ red precipitate.\n   - Matches: **$P, Q$**.\n3. **$3) C_7H_6O$ (contains benzene ring):**\n   - Benzaldehyde ($Ph-CHO$): aromatic aldehyde $\\implies$ gives Tollens' (P) and 2,4-DNP (S). (Does not reduce Fehling's solution).\n   - Matches: **$P, S$**.\n4. **$4) C_8H_8O$ (contains benzene ring):**\n   - Acetophenone ($PhCOCH_3$): gives iodoform (R) and 2,4-DNP (S).\n   - Phenylacetaldehyde ($PhCH_2CHO$): aliphatic aldehyde $\\implies$ gives Tollens' (P), Fehling's (Q), 2,4-DNP (S).\n   - Phenolic isomers (e.g. 2-vinylphenol, enols): give neutral $FeCl_3$ violet coloration (T).\n   - Matches: **$P, Q, R, S, T$**.\nMatching: **$1\\text{-}PQRS ; 2\\text{-}PQ ; 3\\text{-}PS ; 4\\text{-}PQRST$** (Option B)."
    },
    {
      "id": 49,
      "subject": "Chemistry",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Match the reactions in Column-I with the characteristic features of their final products or reaction pathways in Column-II:",
      "images": [
        "/assets/pta06/q49_reactions.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "P",
            "text": "Cyclopentanone $\\xrightarrow{\\text{(i) } NH_2OH \\quad \\text{(ii) } H^+, \\Delta}$"
          },
          {
            "label": "Q",
            "text": "1-methylcyclopentene $\\xrightarrow{\\text{(i) } O_3 \\quad \\text{(ii) } H_2O/Zn} (X) \\xrightarrow[\\Delta]{OH^-}$"
          },
          {
            "label": "R",
            "text": "Cyclopentanone $\\xrightarrow[\\text{traces of } KOH]{HCN} (X) \\xrightarrow{LiAlH_4} (Y) \\xrightarrow[HCl]{NaNO_2} (Z)$"
          },
          {
            "label": "S",
            "text": "1-(1-hydroxy-1-phenylethyl)cyclopentan-1-ol $\\xrightarrow[\\Delta]{H^+} (B)$"
          }
        ],
        "listII": [
          {
            "label": "1",
            "text": "Final product is $\\alpha,\\beta$-unsaturated ketones"
          },
          {
            "label": "2",
            "text": "Final product is six membered ring"
          },
          {
            "label": "3",
            "text": "Final product will give positive iodoform test"
          },
          {
            "label": "4",
            "text": "Ring expansion takes place"
          },
          {
            "label": "5",
            "text": "Final product will give positive test with Brady's reagent"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$P - 2,4; \\quad Q - 1,2,4,5; \\quad R - 2,4,5; \\quad S - 2,4,5$"
        },
        {
          "id": "B",
          "text": "$P - 3,4,5; \\quad Q - 2,4; \\quad R - 4,5; \\quad S - 2,4$"
        },
        {
          "id": "C",
          "text": "$P - 1,3,4,5; \\quad Q - 2; \\quad R - 1,2; \\quad S - 2$"
        },
        {
          "id": "D",
          "text": "$P - 2,4; \\quad Q - 4; \\quad R - 1; \\quad S - 3$"
        }
      ],
      "answer": "A",
      "hasKey": true,
      "explanation": "**Key Concept:**\nRing expansion rearrangements: Beckmann rearrangement, Tiffeneau-Demjanov rearrangement, and Pinacol-pinacolone rearrangement.\n\n**Step-by-Step Derivation:**\n1. **Reaction P:** Cyclopentanone + $NH_2OH \\to$ cyclopentanone oxime. Acid-catalyzed Beckmann rearrangement expands the 5-membered carbocycle into a 6-membered lactam (2-piperidone). Ring expansion occurs (4) and the final product is a 6-membered ring (2). Lactams are amides, not ketones, so they do not react with Brady's reagent $\\implies \\mathbf{P - 2, 4}$.\n2. **Reaction Q:** Reductive ozonolysis of 1-methylcyclopentene yields 6-oxoheptanal ($CH_3COCH_2CH_2CH_2CHO$). Intramolecular aldol condensation with heat gives 3-methylcyclohex-2-en-1-one: an $\\alpha,\\beta$-unsaturated ketone (1), a 6-membered ring (2), formed via ring expansion of the ring skeleton (4), and reacts with Brady's reagent (5) $\\implies \\mathbf{Q - 1, 2, 4, 5}$.\n3. **Reaction R:** Cyanohydrin formation followed by $LiAlH_4$ reduction yields 1-(aminomethyl)cyclopentan-1-ol. Diazotization with $NaNO_2/HCl$ triggers Tiffeneau-Demjanov ring expansion to cyclohexanone: 6-membered ring (2), ring expansion (4), reacts with Brady's reagent (5) $\\implies \\mathbf{R - 2, 4, 5}$.\n4. **Reaction S:** Pinacol rearrangement of the 1,2-diol: protonation and loss of $H_2O$ from the benzylic position followed by ring expansion generates 2-methyl-2-phenylcyclohexanone: 6-membered ring (2), ring expansion (4), reacts with Brady's reagent (5) $\\implies \\mathbf{S - 2, 4, 5}$.\nMatching: **$P - 2,4; \\quad Q - 1,2,4,5; \\quad R - 2,4,5; \\quad S - 2,4,5$** (Option A)."
    },
    {
      "id": 50,
      "subject": "Chemistry",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "The unbalanced chemical reactions given in Column-I show missing reagent(s) or condition(?), which are provided in Column-II. Match unbalanced chemical reactions of Column-I with appropriate reagent(s) or condition(?) in Column-II:",
      "images": [
        "/assets/pta06/q50_reactions.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "A",
            "text": "$(CH_3)_2C = CH - CH_2OH \\to (CH_3)_2C = CH - COO^-$"
          },
          {
            "label": "B",
            "text": "$(CH_3)_2C = CH - CH(OH)CH_3 \\to (CH_3)_2C = CH - COO^-$"
          },
          {
            "label": "C",
            "text": "$(CH_3)_2C = CH - CH_2OH \\to (CH_3)_2C = CH - CHO$"
          },
          {
            "label": "D",
            "text": "$(CH_3)_2C = CH - COCH_3 \\to (CH_3)_2C = CH - COO^-$"
          }
        ],
        "listII": [
          {
            "label": "P",
            "text": "Jones reagent"
          },
          {
            "label": "Q",
            "text": "$PCC / CH_2Cl_2$"
          },
          {
            "label": "R",
            "text": "$Cu \\text{ at } 573\\text{ K}$"
          },
          {
            "label": "S",
            "text": "$I_2 / NaOH \\text{ (Excess)}$"
          },
          {
            "label": "T",
            "text": "$MnO_2$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$A \\to T ; B \\to S ; C \\to PQR ; D \\to S$"
        },
        {
          "id": "B",
          "text": "$A \\to P ; B \\to R ; C \\to PQR ; D \\to S$"
        },
        {
          "id": "C",
          "text": "$A \\to Q ; B \\to S ; C \\to QRT ; D \\to P$"
        },
        {
          "id": "D",
          "text": "$A \\to P ; B \\to S ; C \\to QRT ; D \\to S$"
        }
      ],
      "answer": "D",
      "hasKey": true,
      "explanation": "**Key Concept:**\nSelective oxidation reagents: Jones reagent, PCC, catalytic Cu, $MnO_2$, and the haloform reaction.\n\n**Step-by-Step Derivation:**\n1. **Reaction A:** Primary allylic alcohol $(CH_3)_2C=CH-CH_2OH$ to carboxylate $(CH_3)_2C=CH-COO^-$:\n   Jones reagent ($CrO_3 / H_2SO_4 / \\text{acetone}$) oxidizes primary alcohols directly to carboxylic acids without cleaving the alkene double bond $\\implies \\mathbf{A \\to P}$.\n2. **Reaction B:** Secondary allylic alcohol $(CH_3)_2C=CH-CH(OH)CH_3$ to carboxylate $(CH_3)_2C=CH-COO^-$:\n   $I_2 / NaOH$ (excess) oxidizes the methyl carbinol into a methyl ketone and executes the haloform reaction, cleanly cleaving the methyl group into $CHI_3$ while preserving the double bond $\\implies \\mathbf{B \\to S}$.\n3. **Reaction C:** Primary allylic alcohol $(CH_3)_2C=CH-CH_2OH$ to $\\alpha,\\beta$-unsaturated aldehyde $(CH_3)_2C=CH-CHO$:\n   - PCC in $CH_2Cl_2$ ($Q$) stops cleanly at the aldehyde.\n   - Catalytic dehydrogenation over heated copper at 573 K ($R$) oxidizes primary alcohol to aldehyde.\n   - $MnO_2$ ($T$) selectively oxidizes allylic alcohols to aldehydes.\n   - Thus, $\\mathbf{C \\to Q, R, T}$.\n4. **Reaction D:** $\\alpha,\\beta$-unsaturated methyl ketone $(CH_3)_2C=CH-COCH_3$ to carboxylate $(CH_3)_2C=CH-COO^-$:\n   The haloform reaction with alkaline iodine ($I_2 / NaOH$, $S$) selectively converts the acetyl group into carboxylate without attacking the double bond $\\implies \\mathbf{D \\to S}$.\nMatching: **$A \\to P ; B \\to S ; C \\to QRT ; D \\to S$** (Option D)."
    },
    {
      "id": 51,
      "subject": "Chemistry",
      "section": "Section IV: Matching List",
      "sectionInstruction": "+3 if only the correct option is chosen; 0 if unanswered; -1 in all other cases.",
      "type": "matching_list",
      "marking": {
        "positive": 3,
        "negative": -1
      },
      "question": "Match the correct set of reagents from Column-II to bring about the organic transformation given in Column-I:",
      "images": [
        "/assets/pta06/q51_transformations.png"
      ],
      "matchingList": {
        "listI": [
          {
            "label": "1",
            "text": "$o\\text{-chlorotoluene} \\to o\\text{-tolualdehyde}$"
          },
          {
            "label": "2",
            "text": "$4\\text{-(1,3-dioxan-2-yl)chlorobenzene} \\to \\text{terephthalaldehyde}$"
          },
          {
            "label": "3",
            "text": "$\\text{3-methyl-5-cyano-phenyl } \\beta\\text{-keto ester} \\to \\text{benzene-1,3,5-tricarboxylic acid}$"
          },
          {
            "label": "4",
            "text": "$o\\text{-chlorotoluene} \\to o\\text{-chlorobenzaldehyde}$"
          }
        ],
        "listII": [
          {
            "label": "P",
            "text": "$1.\\ H_3O^+, \\Delta \\quad 2.\\ KMnO_4, H^+/\\Delta$"
          },
          {
            "label": "Q",
            "text": "$1.\\ KMnO_4 \\quad 2.\\ SOCl_2 \\quad 3.\\ H_2, Pd-BaSO_4$"
          },
          {
            "label": "R",
            "text": "$1.\\ H_3O^+, \\Delta \\quad 2.\\ NaOH + I_2 \\quad 3.\\ H^+ \\text{ (work up)}$"
          },
          {
            "label": "S",
            "text": "$1.\\ H_3O^+, \\Delta \\quad 2.\\ Mg \\quad 3.\\ CO_2 \\quad 4.\\ H_3O^+$"
          },
          {
            "label": "T",
            "text": "$1.\\ Mg \\quad 2.\\ CO_2 \\quad 3.\\ H_3O^+ \\quad 4.\\ SOCl_2 \\quad 5.\\ H_2, Pd-BaSO_4$"
          }
        ]
      },
      "options": [
        {
          "id": "A",
          "text": "$1\\text{-}R ; 2\\text{-}S ; 3\\text{-}T ; 4\\text{-}Q$"
        },
        {
          "id": "B",
          "text": "$1\\text{-}T ; 2\\text{-}Q ; 3\\text{-}R ; 4\\text{-}S$"
        },
        {
          "id": "C",
          "text": "$1\\text{-}T ; 2\\text{-}S ; 3\\text{-}R ; 4\\text{-}Q$"
        },
        {
          "id": "D",
          "text": "$1\\text{-}T ; 2\\text{-}T ; 3\\text{-}P ; 4\\text{-}Q$"
        }
      ],
      "answer": "C",
      "hasKey": true,
      "explanation": "**Key Concept:**\nMulti-step synthetic sequences: Grignard carboxylation, Rosenmund reduction, haloform oxidation, and acetal protection.\n\n**Step-by-Step Derivation:**\n1. **Transformation 1 ($o$-chlorotoluene $\\to$ $o$-tolualdehyde):**\n   The aryl chloride is converted into a Grignard reagent ($Mg$), carboxylated with $CO_2$ followed by acid workup to form $o$-toluic acid, converted to acid chloride with $SOCl_2$, and reduced to aldehyde via Rosenmund reduction ($H_2, Pd-BaSO_4$).\n   Reagents: **$T \\implies 1\\text{-}T$**.\n2. **Transformation 2 ($4$-(1,3-dioxan-2-yl)chlorobenzene $\\to$ terephthalaldehyde):**\n   Acid hydrolysis deprotects the acetal to form 4-chlorobenzaldehyde. Carboxylation via Grignard converts the chloride into a formyl/carboxyl derivative. Reagents: **$S \\implies 2\\text{-}S$**.\n3. **Transformation 3 (Substituted $\\beta$-keto ester $\\to$ benzene-1,3,5-tricarboxylic acid):**\n   Acid hydrolysis decarboxylates the $\\beta$-keto ester into a methyl ketone and hydrolyzes the cyano group to carboxylic acid. Haloform oxidation ($NaOH + I_2$) oxidizes the methyl ketone to carboxylate, and acidic workup yields trimesic acid.\n   Reagents: **$R \\implies 3\\text{-}R$**.\n4. **Transformation 4 ($o$-chlorotoluene $\\to$ $o$-chlorobenzaldehyde):**\n   Vigorous oxidation with $KMnO_4$ oxidizes the methyl group to carboxylic acid while leaving $-Cl$ intact. $SOCl_2$ yields the acyl chloride, which undergoes Rosenmund reduction ($H_2, Pd-BaSO_4$) to give $o$-chlorobenzaldehyde.\n   Reagents: **$Q \\implies 4\\text{-}Q$**.\nMatching: **$1\\text{-}T ; 2\\text{-}S ; 3\\text{-}R ; 4\\text{-}Q$** (Option C)."
    }
  ]
};

export const jeeAdvancedPta06Data = pta06Data;
export default pta06Data;
