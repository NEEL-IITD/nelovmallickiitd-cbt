# scripts/build_full_ptm01.py
import json
import os

qs = []

def add_mcq(qid, subject, sec, qtext, opts, ans, exp, imgs=None):
    q = {
        'id': qid,
        'subject': subject,
        'section': sec,
        'type': 'single_correct',
        'marking': {'positive': 4, 'negative': 1},
        'question': qtext,
        'options': opts,
        'answer': ans,
        'hasKey': True,
        'solution': exp,
        'explanation': exp
    }
    if imgs:
        q['images'] = imgs
    qs.append(q)

def add_num(qid, subject, sec, qtext, ans, exp, imgs=None):
    q = {
        'id': qid,
        'subject': subject,
        'section': sec,
        'type': 'numerical',
        'marking': {'positive': 4, 'negative': 1},
        'question': qtext,
        'answer': ans,
        'hasKey': True,
        'solution': exp,
        'explanation': exp
    }
    if imgs:
        q['images'] = imgs
    qs.append(q)

# ----------------- PHYSICS (Q1 - Q25) -----------------
# Q1
add_mcq(1, 'Physics', 'Section A: Single Correct (20 Qs)',
    'For a certain ideal gas, density of gas ($\\rho$) versus pressure of gas ($P$) are given at different temperatures of $T_1$ and $T_2$. Identify correct relation between $T_1$ and $T_2$.',
    [{'id': 'A', 'text': '$T_1 = T_2$'}, {'id': 'B', 'text': '$T_1 > T_2$'}, {'id': 'C', 'text': '$T_1 < T_2$'}, {'id': 'D', 'text': 'None of these'}],
    'C',
    'From the ideal gas equation $PM = \\rho R T \\implies \\rho = \\left(\\frac{M}{RT}\\right)P$. The slope of the $\\rho-P$ graph is $\\frac{M}{RT}$. Since the line for $T_1$ has a steeper slope than $T_2$, $\\frac{M}{RT_1} > \\frac{M}{RT_2} \\implies T_1 < T_2$.',
    ['/assets/tests/jee-main-2027/ptm-01/q01_graph.png']
)

# Q2
add_mcq(2, 'Physics', 'Section A: Single Correct (20 Qs)',
    'A monoatomic gas undergoes a part of elliptical shaped process as shown in figure from state $A$ to state $B$. Find work done by gas.',
    [{'id': 'A', 'text': '$(8-\\pi)P_0V_0$'}, {'id': 'B', 'text': '$-(8-\\pi)P_0V_0$'}, {'id': 'C', 'text': '$-(6+\\pi)P_0V_0$'}, {'id': 'D', 'text': '$-(10-\\pi)P_0V_0$'}],
    'C',
    'The process proceeds from $A(5P_0, 4V_0)$ to $B(3P_0, 2V_0)$ with decreasing volume, so work done by the gas is negative. Area under the curve = Area of rectangular base + quarter-ellipse area = $(3P_0)(2V_0) + \\frac{1}{4}\\pi(2P_0)(2V_0) = 6P_0V_0 + \\pi P_0V_0 = (6+\\pi)P_0V_0$. Since $\\Delta V < 0$, $W = -(6+\\pi)P_0V_0$.',
    ['/assets/tests/jee-main-2027/ptm-01/q02_diagram.png']
)

# Q3
add_mcq(3, 'Physics', 'Section A: Single Correct (20 Qs)',
    '$3\\text{ moles}$ of oxygen gas is filled in a rectangular box of $\\text{length} = 5\\text{ m}$, $\\text{breadth} = 2\\text{ m}$, $\\text{height} = 1\\text{ m}$. If pressure of gas is $3.2\\text{ kPa}$, the root mean square speed of molecules is___',
    [{'id': 'A', 'text': '$1000\\text{ m/s}$'}, {'id': 'B', 'text': '$\\sqrt{1000}\\text{ m/s}$'}, {'id': 'C', 'text': '$40\\sqrt{2}\\text{ m/s}$'}, {'id': 'D', 'text': '$80\\sqrt{5}\\text{ m/s}$'}],
    'A',
    'Volume $V = 5 \\times 2 \\times 1 = 10\\text{ m}^3$. Total mass $M = 3 \\times 32\\text{ g} = 0.096\\text{ kg}$. Density $\\rho = \\frac{0.096}{10} = 0.0096\\text{ kg/m}^3$. Root mean square speed $v_{rms} = \\sqrt{\\frac{3P}{\\rho}} = \\sqrt{\\frac{3 \\times 3200}{0.0096}} = \\sqrt{10^6} = 1000\\text{ m/s}$.'
)

# Q4
add_mcq(4, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Two samples of oxygen of $32\\text{ g}$ and $320\\text{ g}$ are kept in containers of volume $5\\text{ L}$ and $10\\text{ L}$ respectively at same temperature. The ratio of mean relaxation time for random molecular motion for these samples is___ (Given $k_B = 1.38 \\times 10^{-23}\\text{ SI units}$)',
    [{'id': 'A', 'text': '$2:5$'}, {'id': 'B', 'text': '$1:\\sqrt{5}$'}, {'id': 'C', 'text': '$1:5$'}, {'id': 'D', 'text': 'None of these'}],
    'D',
    'Mean relaxation time $\\tau = \\frac{\\lambda}{v_{avg}} \\propto \\frac{V}{N\\sqrt{T}}$. At constant temperature, $\\tau \\propto \\frac{V}{m}$. For sample 1: $\\tau_1 \\propto \\frac{5}{32}$. For sample 2: $\\tau_2 \\propto \\frac{10}{320} = \\frac{1}{32}$. Ratio $\\frac{\\tau_1}{\\tau_2} = \\frac{5/32}{1/32} = 5:1$. Since $5:1$ is not among options A, B, or C, the correct choice is (D) None of these.'
)

# Q5
add_mcq(5, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Consider the following thermodynamic process $AB$ for an ideal gas and mark correct option.',
    [{'id': 'A', 'text': 'Work done is positive'}, {'id': 'B', 'text': 'Work done is $\\frac{RT_0}{3}\\ln 2$'}, {'id': 'C', 'text': 'Work done is $\\frac{RT_0}{3}\\ln 3$'}, {'id': 'D', 'text': 'Work done is negative'}],
    'A',
    'The line $AB$ in $T-P$ coordinates passes through $(4P_0, 3T_0)$ and $(P_0, T_0)$. Equation of line is $T = \\frac{2T_0}{3P_0}P + \\frac{T_0}{3}$. For $n=1$, $V = \\frac{RT}{P} = R\\left(\\frac{2T_0}{3P_0} + \\frac{T_0}{3P}\\right) \\implies dV = -\\frac{RT_0}{3P^2}dP$. $W = \\int_{4P_0}^{P_0} P dV = \\int_{4P_0}^{P_0} -\\frac{RT_0}{3P}dP = \\frac{RT_0}{3}\\ln\\left(\\frac{4P_0}{P_0}\\right) = \\frac{2RT_0}{3}\\ln 2 > 0$. Hence, work done is positive.',
    ['/assets/tests/jee-main-2027/ptm-01/q05_diagram.png']
)

# Q6
add_mcq(6, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Find total kinetic energy of $80\\text{ moles}$ of $\\text{H}_2$ gas at temperature $300\\text{ K}$. (Given $R = 8.3\\text{ SI units}$)',
    [{'id': 'A', 'text': '$498\\text{ J}$'}, {'id': 'B', 'text': '$298.8\\text{ kJ}$'}, {'id': 'C', 'text': '$996\\text{ kJ}$'}, {'id': 'D', 'text': '$498\\text{ kJ}$'}],
    'D',
    'For hydrogen (diatomic gas), degree of freedom $f = 5$. Total internal kinetic energy $E = n\\left(\\frac{f}{2}RT\\right) = 80 \\times \\frac{5}{2} \\times 8.3 \\times 300 = 498,000\\text{ J} = 498\\text{ kJ}$.'
)

# Q7
add_mcq(7, 'Physics', 'Section A: Single Correct (20 Qs)',
    'For an ideal gas, when work is done on the gas by a movable piston, mark correct option.',
    [{'id': 'A', 'text': 'Heat must be released from gas for heating process.'}, {'id': 'B', 'text': 'Heat is released from gas for cooling process.'}, {'id': 'C', 'text': 'Heat may be absorbed by gas for cooling process.'}, {'id': 'D', 'text': 'All of these.'}],
    'B',
    'First Law of Thermodynamics gives $\\Delta U = Q - W_{by} = Q + |W_{on}|$. For a cooling process, internal energy must decrease ($\\Delta U < 0$), which requires $Q + |W_{on}| < 0 \\implies Q < -|W_{on}| < 0$. Therefore, heat must definitely be released from the gas for a cooling process.'
)

# Q8
add_mcq(8, 'Physics', 'Section A: Single Correct (20 Qs)',
    'An ideal gas undergoes a thermodynamic process $AB$ (straight line) as given in figure. If temperature of gas at state $A$ and state $B$ is equal, find coordinates of state $B$.',
    [{'id': 'A', 'text': '$\\left(\\frac{P_0}{3}, \\frac{V_0}{4}\\right)$'}, {'id': 'B', 'text': '$\\left(\\frac{7V_0}{4}, \\frac{8P_0}{3}\\right)$'}, {'id': 'C', 'text': '$\\left(\\frac{4V_0}{3}, \\frac{3P_0}{4}\\right)$'}, {'id': 'D', 'text': 'Not possible'}],
    'C',
    "State $A$ has coordinates $(V_0, P_0)$. The line has slope $-\\tan 37^\\circ = -\\frac{3}{4}\\frac{P_0}{V_0}$. Since $T_A = T_B$, Boyle's Law requires $P_B V_B = P_A V_A = P_0 V_0$. With $(V_B, P_B) = \\left(\\frac{4V_0}{3}, \\frac{3P_0}{4}\\right)$, the product is $P_0 V_0$ and the slope is $\\frac{3/4 P_0 - P_0}{4/3 V_0 - V_0} = -\\frac{3}{4}\\frac{P_0}{V_0}$, which perfectly matches.",
    ['/assets/tests/jee-main-2027/ptm-01/q08_diagram.png']
)

# Q9
add_mcq(9, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Temperature ($T$) versus pressure ($P$) graph of a thermodynamic cycle ($ABCA$) of an ideal gas is as shown in figure. Which of the following graphs represents the same thermodynamic process in the $P-V$ plane?',
    [
        {'id': 'A', 'text': 'Cycle A', 'image': '/assets/tests/jee-main-2027/ptm-01/q09_opt_a.png'},
        {'id': 'B', 'text': 'Cycle B', 'image': '/assets/tests/jee-main-2027/ptm-01/q09_opt_b.png'},
        {'id': 'C', 'text': 'Cycle C', 'image': '/assets/tests/jee-main-2027/ptm-01/q09_opt_c.png'},
        {'id': 'D', 'text': 'Cycle D', 'image': '/assets/tests/jee-main-2027/ptm-01/q09_opt_d.png'}
    ],
    'C',
    'In the $T-P$ graph: $A \\to B$ is vertical ($P = \\text{const}$, isobaric heating, $V$ increases). $B \\to C$ is horizontal ($T = \\text{const}$, isothermal compression, $P$ increases). $C \\to A$ passes through the origin ($T \\propto P$, isochoric cooling, $V = \\text{const}$, $P$ decreases). In the $P-V$ plane: $A \\to B$ is a horizontal line to the right, $B \\to C$ is an isothermal compression curve upward-left, and $C \\to A$ is a vertical line downward to $A$. This is Option C.',
    ['/assets/tests/jee-main-2027/ptm-01/q09_cycle.png']
)

# Q10
add_mcq(10, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Statement-1: In an adiabatic process, change in internal energy of a gas is equal to work done on/by the gas in the process.\nStatement-2: The temperature of a gas remains constant in an adiabatic process.',
    [{'id': 'A', 'text': 'Statement-1 is true, Statement-2 is true, Statement - 2 is a correct explanation of Statement-1'}, {'id': 'B', 'text': 'Statement-1 is true, Statement-2 is false.'}, {'id': 'C', 'text': 'Statement-1 is false, Statement-2 is true.'}, {'id': 'D', 'text': 'Statement-1 is false, Statement-2 is false.'}],
    'B',
    'In an adiabatic process $Q = 0$, so by First Law $\\Delta U = -W = W_{on}$. Hence Statement-1 is true. But since $\\Delta U = n C_v \\Delta T \\ne 0$, temperature varies during adiabatic compression/expansion, making Statement-2 false.'
)

# Q11
add_mcq(11, 'Physics', 'Section A: Single Correct (20 Qs)',
    'How much percentage of total mass of a diatomic gas should be leaked out from a container isothermally so that pressure reduces to $75\\%$ of its initial value?',
    [{'id': 'A', 'text': '$75\\%$'}, {'id': 'B', 'text': '$33.3\\%$'}, {'id': 'C', 'text': '$25\\%$'}, {'id': 'D', 'text': 'Data insufficient'}],
    'C',
    'From $PV = \\frac{m}{M}RT$, at constant $T$ and $V$, $P \\propto m$. When $P_f = 0.75 P_i$, the remaining mass is $m_f = 0.75 m_i$. The percentage of mass leaked out is $\\frac{m_i - 0.75 m_i}{m_i} \\times 100\\% = 25\\%$.'
)

# Q12
add_mcq(12, 'Physics', 'Section A: Single Correct (20 Qs)',
    '$5\\text{ moles}$ of $\\text{H}_2$ gas is contained in a box of volume $V = 2\\text{ m}^3$ at temperature $T = 300\\text{ K}$. The gas is heated to temperature $T = 3300\\text{ K}$ and so that it gets converted to a gas of hydrogen atoms. The final pressure will be',
    [{'id': 'A', 'text': 'Same as the initial pressure'}, {'id': 'B', 'text': '$22\\text{ times the initial pressure}$'}, {'id': 'C', 'text': '$11\\text{ times the initial pressure}$'}, {'id': 'D', 'text': '$55\\text{ times the initial pressure}$'}],
    'B',
    'Initially: $n_1 = 5\\text{ mol}$, $T_1 = 300\\text{ K} \\implies P_1 \\propto n_1 T_1 = 1500$. After dissociation into atoms: $\\text{H}_2 \\to 2\\text{H} \\implies n_2 = 10\\text{ mol}$, $T_2 = 3300\\text{ K} \\implies P_2 \\propto n_2 T_2 = 33,000$. Ratio $\\frac{P_2}{P_1} = \\frac{33,000}{1500} = 22$.'
)

# Q13
add_mcq(13, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Five moles of hydrogen gas initially at $0^\\circ\\text{C}$ is compressed adiabatically so that its temperature becomes $673\\text{ K}$. The increase in internal energy of the gas in $\\text{kJ}$, is___ ($R = 8.3\\text{ SI units}$).',
    [{'id': 'A', 'text': '41.5'}, {'id': 'B', 'text': '24.9'}, {'id': 'C', 'text': '69.8'}, {'id': 'D', 'text': '41500'}],
    'A',
    'For hydrogen gas (diatomic), $C_v = \\frac{5}{2}R$. Temperature change $\\Delta T = 673\\text{ K} - 273\\text{ K} = 400\\text{ K}$. $\\Delta U = n C_v \\Delta T = 5 \\times \\frac{5}{2} \\times 8.3 \\times 400 = 41,500\\text{ J} = 41.5\\text{ kJ}$.'
)

# Q14
add_mcq(14, 'Physics', 'Section A: Single Correct (20 Qs)',
    'A Carnot engine uses first an ideal monoatomic gas ($\\gamma = 5/3$) and then an ideal diatomic gas ($\\gamma = 7/5$) as its working substance. The source and sink temperature are $411^\\circ\\text{C}$ and $69^\\circ\\text{C}$ respectively and the engine extracts $1000\\text{ J}$ of heat from the source in each cycle. Then',
    [{'id': 'A', 'text': 'the efficiencies of the engine in the two cases are in the ratio $21 : 25$'}, {'id': 'B', 'text': 'the area enclosed by the PV diagram in the first case only is $500\\text{ J}$'}, {'id': 'C', 'text': 'the area enclosed by the PV diagram in both cases is $500\\text{ J}$'}, {'id': 'D', 'text': 'the heat energy rejected by the engine in the first case is $600\\text{ J}$ while that in the second case is $714.3\\text{ J}$'}],
    'C',
    'The efficiency of a Carnot cycle is completely independent of the working substance: $\\eta = 1 - \\frac{T_2}{T_1} = 1 - \\frac{342}{684} = 0.5$. Work done per cycle = area enclosed in $P-V$ diagram = $\\eta Q_{in} = 0.5 \\times 1000\\text{ J} = 500\\text{ J}$ in both cases.'
)

# Q15
add_mcq(15, 'Physics', 'Section A: Single Correct (20 Qs)',
    'A curve drawn between two points on P-V diagram represents',
    [{'id': 'A', 'text': 'heat absorbed'}, {'id': 'B', 'text': 'work done on or by the system'}, {'id': 'C', 'text': 'work done in a cyclic process'}, {'id': 'D', 'text': 'a thermodynamic process'}],
    'D',
    'A continuous curve between two equilibrium states on a $P-V$ diagram specifies the path and successive equilibrium states of a thermodynamic process.'
)

# Q16
add_mcq(16, 'Physics', 'Section A: Single Correct (20 Qs)',
    'A Carnot engine works first between $100^\\circ\\text{C}$ and $0^\\circ\\text{C}$ and then between $0^\\circ\\text{C}$ and $-100^\\circ\\text{C}$. The ratio of its efficiency in these two cases is',
    [{'id': 'A', 'text': '0.732'}, {'id': 'B', 'text': '0.577'}, {'id': 'C', 'text': '0.34'}, {'id': 'D', 'text': '1'}],
    'A',
    'Case 1: $\\eta_1 = 1 - \\frac{273}{373} = \\frac{100}{373}$. Case 2: $\\eta_2 = 1 - \\frac{173}{273} = \\frac{100}{273}$. Ratio $\\frac{\\eta_1}{\\eta_2} = \\frac{273}{373} \\approx 0.7319 \\approx 0.732$.'
)

# Q17
add_mcq(17, 'Physics', 'Section A: Single Correct (20 Qs)',
    'During adiabatic process temperature ($T$) versus density ($\\rho$) relation is___',
    [{'id': 'A', 'text': '$T\\rho^{-\\gamma} = \\text{constant}$'}, {'id': 'B', 'text': '$T\\rho^{\\gamma-1} = \\text{constant}$'}, {'id': 'C', 'text': '$T^{1-\\gamma}\\rho = \\text{constant}$'}, {'id': 'D', 'text': '$T\\rho^{1-\\gamma} = \\text{constant}$'}],
    'D',
    'For an adiabatic process, $TV^{\\gamma-1} = \\text{constant}$. Since density $\\rho = \\frac{m}{V} \\implies V \\propto \\rho^{-1}$, we get $T(\\rho^{-1})^{\\gamma-1} = T\\rho^{1-\\gamma} = \\text{constant}$.'
)

# Q18
add_mcq(18, 'Physics', 'Section A: Single Correct (20 Qs)',
    'Three samples of the same gas A, B and C ($\\gamma = 3/2$) have initially equal volume. Now the volume of each sample is doubled. The process is adiabatic for A, isobaric for B and isothermal for C. If the final pressures are equal for all the three samples, the ratio of their initial pressure is',
    [{'id': 'A', 'text': '$2\\sqrt{2} : 1 : 2$'}, {'id': 'B', 'text': '$2 : 1 : \\sqrt{2}$'}, {'id': 'C', 'text': '$\\sqrt{2} : 1 : 2$'}, {'id': 'D', 'text': '$2\\sqrt{2} : 2 : 1$'}],
    'A',
    'Let final pressure be $P$. For A (adiabatic): $P_A V^\\gamma = P(2V)^\\gamma \\implies P_A = P \\cdot 2^{3/2} = 2\\sqrt{2}P$. For B (isobaric): $P_B = P$. For C (isothermal): $P_C V = P(2V) \\implies P_C = 2P$. Ratio $P_A : P_B : P_C = 2\\sqrt{2} : 1 : 2$.'
)

# Q19
add_mcq(19, 'Physics', 'Section A: Single Correct (20 Qs)',
    'The relation between internal energy U, pressure P and volume V of a gas in an adiabatic process is $U = 3 + 4PV$. What is the value of the ratio of the molar specific heats?',
    [{'id': 'A', 'text': '$4/3$'}, {'id': 'B', 'text': '$5/4$'}, {'id': 'C', 'text': '$7/4$'}, {'id': 'D', 'text': '$5/3$'}],
    'B',
    'For an ideal gas, $U = \\frac{PV}{\\gamma - 1} + \\text{constant}$. Comparing with $U = 4PV + 3$, we have $\\frac{1}{\\gamma - 1} = 4 \\implies \\gamma - 1 = \\frac{1}{4} \\implies \\gamma = \\frac{5}{4}$.'
)

# Q20
add_mcq(20, 'Physics', 'Section A: Single Correct (20 Qs)',
    'A container having $2\\text{ mole}$ of a gas at a temperature $127^\\circ\\text{C}$ has a movable piston which maintains a constant pressure in container of $5\\text{ atm}$. The gas is compressed until temperature becomes $227^\\circ\\text{C}$. The magnitude of work done is (given that $C_p$ for gas is $7.03\\text{ J/mol-K}$, Gas constant is $8.3\\text{ J/mol-K}$)',
    [{'id': 'A', 'text': '$703\\text{ J}$'}, {'id': 'B', 'text': '$830\\text{ J}$'}, {'id': 'C', 'text': '$1660\\text{ J}$'}, {'id': 'D', 'text': '$1406\\text{ J}$'}],
    'C',
    'At constant pressure, work done is $W = P\\Delta V = n R \\Delta T$. Magnitude $|W| = 2 \\times 8.3 \\times (227 - 127) = 2 \\times 8.3 \\times 100 = 1660\\text{ J}$.'
)

# Q21
add_num(21, 'Physics', 'Section B: Numerical Value (5 Qs)',
    'Consider thermodynamic process AB (isothermal) and BC (adiabatic) for an ideal gas. Find degree of freedom of the gas. (Given $\\log_{10} 2 = 0.3$)',
    6,
    'Isothermal process $AB$: $P_A V_A = P_B V_B \\implies 500 \\times 40 = P_B \\times 80 \\implies P_B = 250\\text{ Pa}$. Adiabatic process $BC$: $P_B V_B^\\gamma = P_C V_C^\\gamma \\implies 250 \\times (80)^\\gamma = 100 \\times (160)^\\gamma \\implies 2.5 = 2^\\gamma$. Taking $\\log_{10}$: $1 - 2(0.3) = 0.3\\gamma \\implies 0.4 = 0.3\\gamma \\implies \\gamma = 4/3$. Then $\\gamma = 1 + 2/f \\implies 2/f = 1/3 \\implies f = 6$.',
    ['/assets/tests/jee-main-2027/ptm-01/q21_graph.png']
)

# Q22
add_num(22, 'Physics', 'Section B: Numerical Value (5 Qs)',
    'Two vessels contain $16\\text{ g}$ of molecular oxygen at $27^\\circ\\text{C}$ and $16\\text{ g}$ of molecular hydrogen at $327^\\circ\\text{C}$ respectively. The ratio of their most probable speeds is $1 : \\sqrt{n}$. Find value of $n$.',
    32,
    '$v_{mp} = \\sqrt{\\frac{2RT}{M}}$. For $\\text{O}_2$: $T_1 = 300\\text{ K}, M_1 = 32\\text{ g/mol}$. For $\\text{H}_2$: $T_2 = 600\\text{ K}, M_2 = 2\\text{ g/mol}$. Ratio $\\frac{v_{mp, O_2}}{v_{mp, H_2}} = \\sqrt{\\frac{300/32}{600/2}} = \\sqrt{\\frac{1}{32}} = \\frac{1}{\\sqrt{32}}$. Thus $n = 32$.'
)

# Q23
add_num(23, 'Physics', 'Section B: Numerical Value (5 Qs)',
    '$\\gamma$ value of gas $A$ and gas $B$ are $1.4$ and $1.2$ respectively. When both gases are mixed in a certain ratio, the mixture has $\\gamma = 1.32$. Find the ratio of number of moles of gas $A$ to gas $B$ in the mixture.',
    3,
    'For gas mixture: $\\frac{n_A + n_B}{\\gamma_{mix}-1} = \\frac{n_A}{\\gamma_A-1} + \\frac{n_B}{\\gamma_B-1}$. $\\frac{n_A + n_B}{0.32} = \\frac{n_A}{0.4} + \\frac{n_B}{0.2}$. Let $x = n_A / n_B \\implies \\frac{x+1}{0.32} = 2.5x + 5 \\implies 2.5(x+1) = 2x + 4 \\implies 0.5x = 1.5 \\implies x = 3$.'
)

# Q24
add_num(24, 'Physics', 'Section B: Numerical Value (5 Qs)',
    'Bulk modulus for an adiabatic process of an ideal gas is found to be $1.5\\text{ times}$ its pressure. Find degree of freedom of the gas.',
    4,
    'For an adiabatic process, bulk modulus is $B = \\gamma P$. Given $B = 1.5P \\implies \\gamma = 1.5 = 3/2$. Since $\\gamma = 1 + 2/f \\implies 2/f = 0.5 \\implies f = 4$.'
)

# Q25
add_num(25, 'Physics', 'Section B: Numerical Value (5 Qs)',
    'A heat engine is involved with exchange of heat of $1915\\text{ J}$, $-40\\text{ J}$, $+125\\text{ J}$ and $-Q\\text{ J}$, during one cycle achieving an efficiency of $50.0\\%$. The value of $Q$ is',
    980,
    'Total heat input $Q_{in} = 1915 + 125 = 2040\\text{ J}$. Net work done $W = \\sum Q = 2040 - (40 + Q) = 2000 - Q$. Efficiency $\\eta = \\frac{W}{Q_{in}} = 0.5 \\implies 2000 - Q = 1020 \\implies Q = 980\\text{ J}$.'
)

# ----------------- CHEMISTRY (Q26 - Q50) -----------------
# Q26
add_mcq(26, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'The total number of aromatic compounds/species from the following is',
    [{'id': 'A', 'text': '6'}, {'id': 'B', 'text': '4'}, {'id': 'C', 'text': '3'}, {'id': 'D', 'text': '5'}],
    'C',
    'Among the given species: 1. p-Benzoquinone is non-aromatic (cross-conjugated). 2. Cycloheptatrienyl cation (tropylium cation) is planar, fully conjugated with $6\\pi$ electrons $\\implies$ Aromatic. 3. Phenanthrene is a tricyclic benzenoid system ($14\\pi$ electrons) $\\implies$ Aromatic. 4. Partially reduced naphthalene ring is non-aromatic across the whole bicyclic core. 5. Cyclobutadiene dication ($2\\pi$ electrons, $n=0$ in $4n+2$) $\\implies$ Aromatic. 6. Cyclohexadienyl anion has an $sp^3$ ring carbon $\\implies$ non-aromatic. Exactly 3 species are aromatic (Option C).',
    ['/assets/tests/jee-main-2027/ptm-01/q26_structures.png']
)

# Q27
add_mcq(27, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'For the given reaction how many products will obtain (all isomers) On monobromination?',
    [{'id': 'A', 'text': '1'}, {'id': 'B', 'text': '6'}, {'id': 'C', 'text': '4'}, {'id': 'D', 'text': '3'}],
    'A',
    'Due to the high selectivity of bromine free radicals ($3^\\circ : 2^\\circ : 1^\\circ \\approx 1600 : 82 : 1$), monobromination of 2,2,4-trimethylpentane occurs exclusively at the sole tertiary C-H bond at C4 to give 2-bromo-2,4,4-trimethylpentane (which has no asymmetric carbon atom) as 1 major product.',
    ['/assets/tests/jee-main-2027/ptm-01/q27_reaction.png']
)

# Q28
add_mcq(28, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'When $100\\text{ gm}$ Ethene polymerises entirely to poly ethene. the weight of poly ethene formed as per the equation $n\\text{CH}_2=\\text{CH}_2 \\to (-\\text{CH}_2-\\text{CH}_2-)_n$ is',
    [{'id': 'A', 'text': '$\\frac{n}{2}\\text{ g}$'}, {'id': 'B', 'text': '$100\\text{ g}$'}, {'id': 'C', 'text': '$\\frac{100}{n}\\text{ g}$'}, {'id': 'D', 'text': '$100n\\text{ g}$'}],
    'B',
    'By the Law of Conservation of Mass, the complete addition polymerization of $100\\text{ g}$ of ethene gives exactly $100\\text{ g}$ of polyethene.',
    None
)

# Q29
add_mcq(29, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    '$(\\text{CH}_3)_3\\text{C}-\\text{CH}(\\text{OH})-\\text{CH}_3 \\xrightarrow{\\text{Conc. H}_2\\text{SO}_4} X (\\text{Major}) \\xrightarrow{\\text{Reductive Ozonolysis}} Y \\text{ then } Y \\text{ is}$',
    [{'id': 'A', 'text': 'Acetone'}, {'id': 'B', 'text': 'Methanal'}, {'id': 'C', 'text': 'Dimethylpropanal'}, {'id': 'D', 'text': '(B) and (C)'}],
    'A',
    'Dehydration of 3,3-dimethylbutan-2-ol forms a $2^\\circ$ carbocation which undergoes a 1,2-methyl shift to a more stable $3^\\circ$ carbocation $(\\text{CH}_3)_2\\text{C}^+-\\text{CH}(\\text{CH}_3)_2$. Elimination of $H^+$ gives the highly substituted alkene $(\\text{CH}_3)_2\\text{C}=\\text{C}(\\text{CH}_3)_2$ (tetramethylethylene) as major product $X$. Reductive ozonolysis cleaves this symmetrical alkene to yield 2 molecules of Acetone ($\\text{CH}_3\\text{COCH}_3$).',
    ['/assets/tests/jee-main-2027/ptm-01/q29_reaction.png']
)

# Q30
add_mcq(30, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    '$\\text{CH}_3-\\text{CH}=\\text{CH}_2 \\xrightarrow[(2)\\text{CH}_3\\text{CO}_2\\text{T}]{(1)\\text{THF}, \\text{BD}_3} (A)$ \nProduct A of the reaction is:',
    [{'id': 'A', 'text': '$\\text{CH}_3-\\text{CHD}-\\text{CH}_2\\text{D}$'}, {'id': 'B', 'text': '$\\text{CH}_3-\\text{CHT}-\\text{CH}_2\\text{T}$'}, {'id': 'C', 'text': '$\\text{CH}_3-\\text{CHD}-\\text{CH}_2\\text{T}$'}, {'id': 'D', 'text': '$\\text{CH}_3-\\text{CHT}-\\text{CH}_2\\text{D}$'}],
    'C',
    'Hydroboration of propene with $\\text{BD}_3$ delivers deuterium to the internal carbon C2 (anti-Markovnikov syn-addition) forming $(\\text{CH}_3-\\text{CHD}-\\text{CH}_2)_3\\text{B}$. Protolysis with tritiated acetic acid $\\text{CH}_3\\text{CO}_2\\text{T}$ cleaves the organoborane to add tritium to C1, yielding $\\text{CH}_3-\\text{CHD}-\\text{CH}_2\\text{T}$.'
)

# Q31
add_mcq(31, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    '$\\text{CH}_3-\\text{C}(\\text{CH}_3)=\\text{CH}-\\text{CH}_3 \\xrightarrow{\\text{Hg(OAc)}_2 / \\text{EtOH}} (A) \\ (90\\%)$ \nProduct (A) of the reaction is:',
    [
        {'id': 'A', 'text': 'Product A', 'image': '/assets/tests/jee-main-2027/ptm-01/q31_opt_a.png'},
        {'id': 'B', 'text': 'Product B', 'image': '/assets/tests/jee-main-2027/ptm-01/q31_opt_b.png'},
        {'id': 'C', 'text': 'Product C', 'image': '/assets/tests/jee-main-2027/ptm-01/q31_opt_c.png'},
        {'id': 'D', 'text': 'Product D', 'image': '/assets/tests/jee-main-2027/ptm-01/q31_opt_d.png'}
    ],
    'B',
    'In solvomercuration with ethanol (solvo-mercuration), electrophilic attack of $\\text{Hg(OAc)}^+$ creates a cyclic mercurinium ion. The nucleophile $\\text{EtOH}$ attacks regioselectively at the more substituted tertiary carbon to form an ethoxy ether group ($-\\text{OEt}$) at C2, leaving $-\\text{HgOAc}$ at C3 (Option B).',
    None
)

# Q32
add_mcq(32, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Which of the following is correct order of stability of alkene?',
    [
        {'id': 'A', 'text': 'Order A', 'image': '/assets/tests/jee-main-2027/ptm-01/q32_opt_a.png'},
        {'id': 'B', 'text': 'Order B', 'image': '/assets/tests/jee-main-2027/ptm-01/q32_opt_b.png'},
        {'id': 'C', 'text': 'Order C', 'image': '/assets/tests/jee-main-2027/ptm-01/q32_opt_c.png'},
        {'id': 'D', 'text': 'Order D', 'image': '/assets/tests/jee-main-2027/ptm-01/q32_opt_d.png'}
    ],
    'B',
    'Alkene stability is governed by hyperconjugation and steric hindrance: propene (3 $\\alpha$-H) < cis-but-2-ene (6 $\\alpha$-H, cis strain) < trans-but-2-ene (6 $\\alpha$-H, trans stability) < 2,3-dimethylbut-2-ene (12 $\\alpha$-H, tetrasubstituted). This order is given in Option B.',
    None
)

# Q33
add_mcq(33, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Heating 1,1,2,2-tetrabromoethane with Zn dust and heat gives:',
    [
        {'id': 'A', 'text': '1,1,2-tribromoethene', 'image': '/assets/tests/jee-main-2027/ptm-01/q33_opt_a.png'},
        {'id': 'B', 'text': '1,2-dibromoethene', 'image': '/assets/tests/jee-main-2027/ptm-01/q33_opt_b.png'},
        {'id': 'C', 'text': 'HC ≡ CH'},
        {'id': 'D', 'text': '1,1-dibromoethane', 'image': '/assets/tests/jee-main-2027/ptm-01/q33_opt_d.png'}
    ],
    'C',
    'Heating 1,1,2,2-tetrabromoethane with zinc dust induces two consecutive dehalogenation eliminations: $\\text{CHBr}_2-\\text{CHBr}_2 + 2\\text{Zn} \\xrightarrow{\\Delta} \\text{HC}\\equiv\\text{CH} + 2\\text{ZnBr}_2$, producing acetylene ($\\text{HC}\\equiv\\text{CH}$).',
    ['/assets/tests/jee-main-2027/ptm-01/q33_reaction.png']
)

# Q34
add_mcq(34, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    '$29.5\\text{ mg}$ of an organic compound containing nitrogen was digested according to Kjeldahl\'s method and the evolved ammonia was absorbed in $20\\text{ ml}$ of $0.1\\text{ M HCl}$ solution. The excess of the acid required $15\\text{ ml}$ of $0.1\\text{ M NaOH}$ solution for complete neutralization. What will be the percentage of nitrogen in the compound?\n(Given: Atomic weights of $C=12, H=1, O=16, N=14$)',
    [{'id': 'A', 'text': '19.7'}, {'id': 'B', 'text': '23.7'}, {'id': 'C', 'text': '27.7'}, {'id': 'D', 'text': '29.7'}],
    'B',
    'Millimoles of $\\text{HCl}$ taken $= 20 \\times 0.1 = 2.0\\text{ mmol}$. Millimoles of $\\text{NaOH}$ for unreacted acid $= 15 \\times 0.1 = 1.5\\text{ mmol}$. Millimoles of acid neutralized by $\\text{NH}_3 = 2.0 - 1.5 = 0.5\\text{ mmol}$. Mass of nitrogen $= 0.5 \\times 14\\text{ mg} = 7.0\\text{ mg}$. Nitrogen percentage $= \\frac{7.0}{29.5} \\times 100\\% \\approx 23.73\\% \\approx 23.7\\%$.',
    None
)

# Q35
add_mcq(35, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Reaction of 1-ethyl-4-nitrobenzene with $\\text{Br}_2$, heat or U.V. light gives product \'X\':',
    [
        {'id': 'A', 'text': 'Ring brominated product', 'image': '/assets/tests/jee-main-2027/ptm-01/q35_opt_a.png'},
        {'id': 'B', 'text': '1-(1-bromoethyl)-4-nitrobenzene', 'image': '/assets/tests/jee-main-2027/ptm-01/q35_opt_b.png'},
        {'id': 'C', 'text': '4-(1-bromoethyl)nitrosobenzene', 'image': '/assets/tests/jee-main-2027/ptm-01/q35_opt_c.png'},
        {'id': 'D', 'text': '1-(2-bromoethyl)-4-nitrobenzene', 'image': '/assets/tests/jee-main-2027/ptm-01/q35_opt_d.png'}
    ],
    'B',
    'Free radical bromination selectively abstracts the benzylic hydrogen to form the resonance-stabilized benzylic radical, yielding 1-(1-bromoethyl)-4-nitrobenzene as the major product (Option B).',
    ['/assets/tests/jee-main-2027/ptm-01/q35_reaction.png']
)

# Q36
add_mcq(36, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Match the type of mixture of compounds in Column I with the technique of separation / purification given in Column II:\nColumn I:\ni) Two solids which have different solubilities in a solvent and which do not undergo reaction when dissolved in it.\nii) Liquid that decomposes at its boiling point.\niii) Steam volatile liquid.\niv) Two liquids which have boiling points close to each other.\nv) Two liquids with large difference in boiling points.\nColumn II:\na) Steam distillation\nb) Fractional distillation\nc) Simple distillation\nd) Distillation under reduced pressure\ne) Crystallisation',
    [{'id': 'A', 'text': 'i-e, ii-d, iii-a, iv-b, v-c'}, {'id': 'B', 'text': 'i-c, ii-d, iii-b, iv-a, v-e'}, {'id': 'C', 'text': 'i-c, ii-d, iii-e, iv-a, v-b'}, {'id': 'D', 'text': 'i-c, ii-a, iii-b, iv-e, v-d'}],
    'A',
    'i matches e (Crystallisation), ii matches d (Distillation under reduced pressure), iii matches a (Steam distillation), iv matches b (Fractional distillation), and v matches c (Simple distillation).'
)

# Q37
add_mcq(37, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'During hearing of a court case, the judge suspected that some changes in the document been carried out. He asked the forensic department to check the ink used at two different places. According to you which technique can give the best results?',
    [{'id': 'A', 'text': 'Column chromatography'}, {'id': 'B', 'text': 'Solvent extraction'}, {'id': 'C', 'text': 'Distillation'}, {'id': 'D', 'text': 'Thin layer chromatography'}],
    'D',
    'Thin Layer Chromatography (TLC) requires microscopic sample sizes and provides rapid, distinct resolution of ink dyes, making it the technique of choice in forensic document examination.'
)

# Q38
add_mcq(38, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Correct order of dipole moment of methyl halides is',
    [{'id': 'A', 'text': '$\\text{CH}_3-\\text{F} > \\text{CH}_3-\\text{Cl} > \\text{CH}_3-\\text{Br} > \\text{CH}_3-\\text{I}$'}, {'id': 'B', 'text': '$\\text{CH}_3-\\text{I} > \\text{CH}_3-\\text{Br} > \\text{CH}_3-\\text{Cl} > \\text{CH}_3-\\text{F}$'}, {'id': 'C', 'text': '$\\text{CH}_3-\\text{Cl} > \\text{CH}_3\\text{I} > \\text{CH}_3-\\text{Br} > \\text{CH}_3-\\text{F}$'}, {'id': 'D', 'text': '$\\text{CH}_3-\\text{Cl} > \\text{CH}_3-\\text{F} > \\text{CH}_3-\\text{Br} > \\text{CH}_3-\\text{I}$'}],
    'D',
    'Dipole moment $\\mu = q \\times d$. The significantly longer C-Cl bond distance compensates for the slightly lower electronegativity of Cl compared to F, resulting in $\\text{CH}_3\\text{Cl}$ (1.86 D) > $\\text{CH}_3\\text{F}$ (1.84 D) > $\\text{CH}_3\\text{Br}$ (1.83 D) > $\\text{CH}_3\\text{I}$ (1.63 D).'
)

# Q39
add_mcq(39, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Increasing order of $pK_a$ values of the following compounds is___',
    [{'id': 'A', 'text': '$E < B < A < D < C$'}, {'id': 'B', 'text': '$D < E < C < B < A$'}, {'id': 'C', 'text': '$E < D < B < A < C$'}, {'id': 'D', 'text': '$B < D < A < C < E$'}],
    'A',
    'Acidic strength: Picric acid (E) > 4-nitrophenol (B) > Phenol (A) > 4-methylphenol (D) > Ethanol (C). Since $pK_a = -\\log K_a$, stronger acids have lower $pK_a$ values, giving the increasing order: $E < B < A < D < C$.',
    ['/assets/tests/jee-main-2027/ptm-01/q39_structures.png']
)

# Q40
add_mcq(40, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Statement - I: Addition of HBr to unsymmetrical alkenes like propene in presence of peroxide takes place contrary to the Markovnikov\'s rule.\nStatement - II: Peroxide effect is not observed in addition of HCl and HI to unsymmetrical alkene',
    [{'id': 'A', 'text': 'Statement-I is true, Statement-2 is true'}, {'id': 'B', 'text': 'Statement-I is false, Statement-2 is false'}, {'id': 'C', 'text': 'Statement-I is true, Statement-2 is false'}, {'id': 'D', 'text': 'Statement-I is false, Statement-2 is true'}],
    'A',
    'Both statements are true. In the free radical chain mechanism of the Kharasch effect, only HBr undergoes both propagation steps exothermically. For HCl, the H-Cl bond energy is too high for radical abstraction, while for HI, iodine radicals dimerize to $\\text{I}_2$ rather than attacking the alkene.'
)

# Q41
add_mcq(41, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Reaction of 2-methylbuta-1,3-diene with $\\text{HBr (1 eq)}$ under heating ($\\Delta$) gives the major product:',
    [
        {'id': 'A', 'text': '1,2-addition product', 'image': '/assets/tests/jee-main-2027/ptm-01/q41_opt_a.png'},
        {'id': 'B', 'text': '3-bromo-3-methylbut-1-ene', 'image': '/assets/tests/jee-main-2027/ptm-01/q41_opt_b.png'},
        {'id': 'C', 'text': '4-bromo-2-methylbut-1-ene', 'image': '/assets/tests/jee-main-2027/ptm-01/q41_opt_c.png'},
        {'id': 'D', 'text': '1-bromo-3-methylbut-2-ene', 'image': '/assets/tests/jee-main-2027/ptm-01/q41_opt_d.png'}
    ],
    'D',
    'At higher temperatures (thermodynamic control), 1,4-addition predominates over 1,2-addition to yield the more highly substituted, thermodynamically stable alkene: 1-bromo-3-methylbut-2-ene (trisubstituted double bond), Option D.',
    ['/assets/tests/jee-main-2027/ptm-01/q41_reaction.png']
)

# Q42
add_mcq(42, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Total number of hydroxyl groups present in a molecule of the major product P is:\nReactant undergoes: i) $\\text{H}_2, \\text{Pd}-\\text{BaSO}_4, \\text{quinoline}$, ii) dil. alkaline $\\text{KMnO}_4\\ (\\text{excess}), 273\\text{ K} \\to P$',
    [{'id': 'A', 'text': '4'}, {'id': 'B', 'text': '6'}, {'id': 'C', 'text': '3'}, {'id': 'D', 'text': '0'}],
    'B',
    'Lindlar\'s catalyst reduces the central internal alkyne to a cis-alkene without reducing the two cycloalkene double bonds, giving 3 alkene double bonds. Cold dilute alkaline $\\text{KMnO}_4$ (Baeyer\'s reagent) adds two hydroxyl groups across each double bond via syn-dihydroxylation: $3 \\times 2 = 6$ hydroxyl groups.',
    ['/assets/tests/jee-main-2027/ptm-01/q42_reaction.png']
)

# Q43
add_mcq(43, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Given below are two statements:\nStatement I: One mole of propyne reacts with excess of sodium to liberate half a mole of $\\text{H}_2$ gas at STP.\nStatement II: Four gram of propyne reacts with $\\text{NaNH}_2$ to liberate $\\text{NH}_3$ gas which occupies $224\\text{ ml}$ at STP.\nIn the light of the above statements, choose the most appropriate answer from the options given below:',
    [{'id': 'A', 'text': 'Statement I is correct but Statement II is incorrect'}, {'id': 'B', 'text': 'Both Statement I and Statement II are incorrect'}, {'id': 'C', 'text': 'Statement I is incorrect but Statement II is correct'}, {'id': 'D', 'text': 'Both Statement I and Statement II are correct'}],
    'A',
    'Propyne has one acidic acetylenic hydrogen: $\\text{CH}_3\\text{C}\\equiv\\text{CH} + \\text{Na} \\to \\text{CH}_3\\text{C}\\equiv\\text{C}^-\\text{Na}^+ + \\frac{1}{2}\\text{H}_2$, so 1 mole yields 0.5 mole of $\\text{H}_2$ (Statement I is correct). Molar mass of propyne is $40\\text{ g/mol}$, so $4\\text{ g} = 0.1\\text{ mol}$. $0.1\\text{ mol}$ of propyne liberates $0.1\\text{ mol}$ of $\\text{NH}_3$, which occupies $2240\\text{ ml}$ at STP, not $224\\text{ ml}$ (Statement II is incorrect).'
)

# Q44
add_mcq(44, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Which of the following reactions are correct:\ni) $2\\text{CH}_4(g) + \\text{O}_2(g) \\xrightarrow[100\\text{ atm}]{\\text{Cu}, 523\\text{ K}} 2\\text{CH}_3\\text{COOH}$\nii) $\\text{CH}_4 + \\text{O}_2 \\xrightarrow[\\Delta]{\\text{Mo}_2\\text{O}_3} \\text{H}-\\text{C}(=\\text{O})-\\text{OH} + \\text{H}_2\\text{O}$\niii) $2\\text{C}_2\\text{H}_6 + 3\\text{O}_2(g) \\xrightarrow[(\\text{CH}_3\\text{COO})_2\\text{Mn}]{\\Delta} 2\\text{CH}_3\\text{COOH} + 2\\text{H}_2\\text{O}$\niv) $\\text{CH}_4 + \\text{H}_2\\text{O} \\xrightarrow{\\text{Ni}/\\Delta} \\text{CO} + 3\\text{H}_2\\uparrow$',
    [{'id': 'A', 'text': 'i, ii, iii, iv'}, {'id': 'B', 'text': 'ii & iii'}, {'id': 'C', 'text': 'iii & iv'}, {'id': 'D', 'text': 'i, iii & iv'}],
    'C',
    'Reaction i is incorrect because $\\text{Cu}/523\\text{ K}/100\\text{ atm}$ oxidizes methane to methanol ($\\text{CH}_3\\text{OH}$). Reaction ii is incorrect because $\\text{Mo}_2\\text{O}_3$ yields formaldehyde ($\\text{HCHO}$). Reactions iii and iv are correct standard NCERT catalytic alkane transformations.'
)

# Q45
add_mcq(45, 'Chemistry', 'Section A: Single Correct (20 Qs)',
    'Match List - I with List - II:\nList - I (Mixture):\na) Chloroform and Aniline\nb) Glycerol from spent - lye\nc) Water and Aniline\nd) Naphthalene and sodium chloride\n\nList - II (Purification Process):\nI) Steam distillation\nII) Sublimation\nIII) Distillation\nIV) Vacuum distillation',
    [{'id': 'A', 'text': 'a-IV, b-III, c-I, d-II'}, {'id': 'B', 'text': 'a-III, b-I, c-IV, d-II'}, {'id': 'C', 'text': 'a-III, b-IV, c-II, d-I'}, {'id': 'D', 'text': 'a-III, b-IV, c-I, d-II'}],
    'D',
    'Chloroform and Aniline have widely separated boiling points and are separated by simple distillation (a-III). Glycerol decomposes at normal pressure so is purified by vacuum distillation (b-IV). Aniline is immiscible with water and steam volatile (c-I). Naphthalene readily sublimes while NaCl does not (d-II).'
)

# Q46
add_num(46, 'Chemistry', 'Section B: Numerical Value (5 Qs)',
    'Benzene reacts with $\\text{Br}_2/\\text{FeBr}_3$ to form bromobenzene, which then reacts with $\\text{Na}$ in dry ether to give compound \'X\' (Major organic Product). The number of pi bonds in the compound \'X\' is $\\frac{24}{y}$. The value of \'y\' is____',
    4,
    'The reaction of bromobenzene with sodium in dry ether is the Fittig reaction, forming Biphenyl ($\\text{C}_6\\text{H}_5-\\text{C}_6\\text{H}_5$). Biphenyl has two benzene rings with 3 pi bonds each, giving 6 pi bonds. Since $\\frac{24}{y} = 6 \\implies y = 4$.',
    ['/assets/tests/jee-main-2027/ptm-01/q46_reaction.png']
)

# Q47
add_num(47, 'Chemistry', 'Section B: Numerical Value (5 Qs)',
    'Following chromatogram was developed by adsorption of compound \'A\' on a $6\\text{ cm}$ TLC glass plate. Retardation factor of the compound \'A\' is ____ $\\times 10^{-1}$.',
    6,
    'Total plate length $= 6.0\\text{ cm}$. Baseline is $0.5\\text{ cm}$ from bottom and solvent front is $0.5\\text{ cm}$ from top. Distance moved by solvent front from baseline $= 6.0 - 0.5 - 0.5 = 5.0\\text{ cm}$. Distance moved by Compound A from baseline $= 3.5 - 0.5 = 3.0\\text{ cm}$. $R_f = \\frac{3.0}{5.0} = 0.6 = 6 \\times 10^{-1}$.',
    ['/assets/tests/jee-main-2027/ptm-01/q47_chromatogram.png']
)

# Q48
add_num(48, 'Chemistry', 'Section B: Numerical Value (5 Qs)',
    'How many of the following reagents are physically distinguished by 1-butyne and 2-butyne (including gases and precipitates):\ni) $\\text{AgNO}_3 / \\text{NH}_4\\text{OH}$\nii) $\\text{Cu}_2\\text{Cl}_2 / \\text{NH}_4\\text{OH}$\niii) $\\text{Na}$\niv) $\\text{Br}_2 / \\text{H}_2\\text{O}$\nv) cold $\\text{KMnO}_4 / \\text{OH}^-$',
    3,
    '1-butyne has a terminal acetylenic C-H and forms a white precipitate with Tollens reagent (i), a red precipitate with ammoniacal cuprous chloride (ii), and hydrogen gas bubbles with metallic sodium (iii). Both 1-butyne and 2-butyne decolorize bromine water and Baeyer\'s reagent without distinguishing precipitates. Total = 3.'
)

# Q49
add_num(49, 'Chemistry', 'Section B: Numerical Value (5 Qs)',
    'Identify compounds which react faster than benzene in electrophilic aromatic substitution reaction?',
    6,
    'Activating groups faster than benzene: i) $-\\text{OH}$ ($+M$), ii) $-\\text{NH}_2$ ($+M$), viii) $-\\text{CH}_3$ ($+H$), ix) $-\\text{CD}_3$ ($+H$), x) $-\\text{NHCOR}$ ($+M$), xi) $-\\text{OCOR}$ ($+M$). The electron withdrawing deactivating groups ($-\\text{BH}_2, -\\text{CN}, -\\text{NO}_2, -\\text{COOEt}, -\\text{CHO}, -\\text{NO}$) react slower than benzene. Total = 6.',
    ['/assets/tests/jee-main-2027/ptm-01/q49_structures.png']
)

# Q50
add_num(50, 'Chemistry', 'Section B: Numerical Value (5 Qs)',
    'If \'x\' is the number of rings in [P] and \'y\' is the number of methyl substituent\'s in [P]. What is the value of $x + y$ ____',
    4,
    'Friedel-Crafts dialkylation between benzene and 1-(1-chloropropan-2-yl)-2-(2-chloroethyl)benzene forms a tricyclic anthracene-like framework ($x = 3$ rings) carrying 1 methyl substituent ($y = 1$). Therefore, $x + y = 3 + 1 = 4$.',
    ['/assets/tests/jee-main-2027/ptm-01/q50_reaction.png']
)

# ----------------- MATHEMATICS (Q51 - Q75) -----------------
# Q51
add_mcq(51, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $x \\in (0, \\pi/2)$, $\\log_{10} \\sin x + \\log_{10} \\cos x = -1$ and $\\log_{10}(\\sin x + \\cos x) = \\frac{1}{2}((\\log_{10} n) - 1)$, $n > 0$, then the value of $n$ is',
    [{'id': 'A', 'text': '16'}, {'id': 'B', 'text': '20'}, {'id': 'C', 'text': '12'}, {'id': 'D', 'text': '9'}],
    'C',
    '$\\log_{10}(\\sin x \\cos x) = -1 \\implies \\sin x \\cos x = 1/10$. Then $(\\sin x + \\cos x)^2 = 1 + 2\\sin x \\cos x = 1 + 2/10 = 12/10$. Taking logarithms: $\\log_{10}(\\sin x + \\cos x) = \\frac{1}{2}\\log_{10}(12/10) = \\frac{1}{2}(\\log_{10} 12 - 1)$. Comparing with the given formula gives $n = 12$.'
)

# Q52
add_mcq(52, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $\\sin\\theta + \\cos\\theta = \\frac{1}{2}$, then $16(\\sin 2\\theta + \\cos 4\\theta + \\sin 6\\theta) = $',
    [{'id': 'A', 'text': '-27'}, {'id': 'B', 'text': '-19'}, {'id': 'C', 'text': '-23'}, {'id': 'D', 'text': '27'}],
    'C',
    'Squaring both sides gives $1 + \\sin 2\\theta = 1/4 \\implies \\sin 2\\theta = -3/4$. Then $\\cos 4\\theta = 1 - 2\\sin^2 2\\theta = 1 - 2(9/16) = -1/8$. Also $\\sin 6\\theta = 3\\sin 2\\theta - 4\\sin^3 2\\theta = 3(-3/4) - 4(-27/64) = -9/4 + 27/16 = -9/16$. Sum is $-3/4 - 1/8 - 9/16 = -23/16$. Multiplying by 16 gives $-23$.'
)

# Q53
add_mcq(53, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $\\cot\\alpha = 1$ and $\\sec\\beta = -\\frac{5}{3}$, where $\\pi < \\alpha < \\frac{3\\pi}{2}$ and $\\frac{\\pi}{2} < \\beta < \\pi$, then the value of $\\tan(\\alpha+\\beta)$ and the quadrant in which $\\alpha+\\beta$ lies, respectively are',
    [{'id': 'A', 'text': '$-1/7$ and Ist quadrant'}, {'id': 'B', 'text': '7 and Ist quadrant'}, {'id': 'C', 'text': '$-7$ and IVth quadrant'}, {'id': 'D', 'text': '$-1/7$ and IVth quadrant'}],
    'D',
    'In quadrant III, $\\tan\\alpha = 1$. In quadrant II, $\\sec\\beta = -5/3 \\implies \\tan\\beta = -4/3$. Then $\\tan(\\alpha+\\beta) = \\frac{1 + (-4/3)}{1 - (1)(-4/3)} = \\frac{-1/3}{7/3} = -\\frac{1}{7}$. Since $\\pi < \\alpha < 3\\pi/2$ and $\\pi/2 < \\beta < \\pi$, we have $3\\pi/2 < \\alpha+\\beta < 5\\pi/2$. Negative tangent in this range locates $\\alpha+\\beta$ in the IVth quadrant.'
)

# Q54
add_mcq(54, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    '$\\alpha = \\sin 36^\\circ$ is a root of which of the following equation',
    [{'id': 'A', 'text': '$10x^4 - 10x^2 - 5 = 0$'}, {'id': 'B', 'text': '$16x^4 + 20x^2 - 5 = 0$'}, {'id': 'C', 'text': '$16x^4 - 20x^2 + 5 = 0$'}, {'id': 'D', 'text': '$16x^4 - 10x^2 + 5 = 0$'}],
    'C',
    '$\\sin 36^\\circ = \\frac{\\sqrt{10-2\\sqrt{5}}}{4} \\implies x^2 = \\frac{10-2\\sqrt{5}}{16} \\implies 8x^2 - 5 = -\\sqrt{5}$. Squaring gives $64x^4 - 80x^2 + 25 = 5 \\implies 64x^4 - 80x^2 + 20 = 0$. Dividing by 4 gives $16x^4 - 20x^2 + 5 = 0$.'
)

# Q55
add_mcq(55, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $\\tan 15^\\circ + \\frac{1}{\\tan 75^\\circ} + \\frac{1}{\\tan 105^\\circ} + \\tan 195^\\circ = 2a$, then the number of positive divisors of $\\left(a - \\frac{1}{a}\\right)^2$ are',
    [{'id': 'A', 'text': '6'}, {'id': 'B', 'text': '2'}, {'id': 'C', 'text': '3'}, {'id': 'D', 'text': '12'}],
    'A',
    '$\\tan 15^\\circ = 2-\\sqrt{3}$, $\\cot 75^\\circ = 2-\\sqrt{3}$, $\\cot 105^\\circ = -(2-\\sqrt{3})$, $\\tan 195^\\circ = 2-\\sqrt{3}$. The sum is $2(2-\\sqrt{3}) = 2a \\implies a = 2-\\sqrt{3}$. Then $1/a = 2+\\sqrt{3}$, so $a - 1/a = -2\\sqrt{3}$. Its square is $(-2\\sqrt{3})^2 = 12$. The number of positive divisors of $12 = 2^2 \\times 3^1$ is $(2+1)(1+1) = 6$.'
)

# Q56
add_mcq(56, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $\\sin^3 x \\sin 3x = \\sum_{m=0}^6 C_m \\cos^m x$ where $C_0, C_1, \\dots, C_6$ are constants then',
    [{'id': 'A', 'text': '$C_0 + C_2 + C_4 + C_6 = 0$'}, {'id': 'B', 'text': '$C_1 + C_3 + C_5 = 6$'}, {'id': 'C', 'text': '$2C_2 + 3C_6 = 0$'}, {'id': 'D', 'text': '$C_4 + 2C_6 = 0$'}],
    'A',
    '$\\sin^3 x \\sin 3x = 3\\sin^4 x - 4\\sin^6 x = 3(1-\\cos^2 x)^2 - 4(1-\\cos^2 x)^3 = -1 + 6\\cos^2 x - 9\\cos^4 x + 4\\cos^6 x$. Thus $C_0 = -1, C_2 = 6, C_4 = -9, C_6 = 4$. Their sum $C_0 + C_2 + C_4 + C_6 = -1 + 6 - 9 + 4 = 0$.'
)

# Q57
add_mcq(57, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The value of $(1 + \\sec 20^\\circ)(1 + \\sec 40^\\circ)(1 + \\sec 80^\\circ) = $',
    [{'id': 'A', 'text': '$\\tan^2 10^\\circ$'}, {'id': 'B', 'text': '$\\cot^2 10^\\circ$'}, {'id': 'C', 'text': '$\\tan^2 40^\\circ$'}, {'id': 'D', 'text': '$\\cot^2 20^\\circ$'}],
    'B',
    'Using $1 + \\sec 2\\theta = \\frac{\\tan 2\\theta}{\\tan\\theta}$, the product telescopes: $\\frac{\\tan 20^\\circ}{\\tan 10^\\circ} \\times \\frac{\\tan 40^\\circ}{\\tan 20^\\circ} \\times \\frac{\\tan 80^\\circ}{\\tan 40^\\circ} = \\frac{\\tan 80^\\circ}{\\tan 10^\\circ} = \\frac{\\cot 10^\\circ}{\\tan 10^\\circ} = \\cot^2 10^\\circ$.'
)

# Q58
add_mcq(58, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $\\alpha, \\beta, \\gamma, \\delta$ are the smallest positive angles in ascending order of magnitude which have their sines equal to the positive quantity k, then the value of $4\\sin\\frac{\\alpha}{2} + 3\\sin\\frac{\\beta}{2} + 2\\sin\\frac{\\gamma}{2} + \\sin\\frac{\\delta}{2}$ is equal to',
    [{'id': 'A', 'text': '$2\\sqrt{1-k}$'}, {'id': 'B', 'text': '$2\\sqrt{1+k}$'}, {'id': 'C', 'text': '$\\frac{\\sqrt{1+k}}{2}$'}, {'id': 'D', 'text': '$\\frac{\\sqrt{1-k}}{2}$'}],
    'B',
    'For $k > 0$ and $\\alpha \\in (0, \\pi/2)$: $\\beta = \\pi - \\alpha$, $\\gamma = 2\\pi + \\alpha$, $\\delta = 3\\pi - \\alpha$. Then $\\sin\\frac{\\beta}{2} = \\cos\\frac{\\alpha}{2}$, $\\sin\\frac{\\gamma}{2} = -\\sin\\frac{\\alpha}{2}$, $\\sin\\frac{\\delta}{2} = -\\cos\\frac{\\alpha}{2}$. The sum simplifies to $2\\sin\\frac{\\alpha}{2} + 2\\cos\\frac{\\alpha}{2} = 2\\sqrt{1+\\sin\\alpha} = 2\\sqrt{1+k}$.'
)

# Q59
add_mcq(59, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $M = \\cos(23^\\circ) - \\sin(23^\\circ)$, $G = \\cos(43^\\circ) - \\sin(43^\\circ)$ and $R = \\cos(63^\\circ) - \\sin(63^\\circ)$ then which of the following is correct',
    [{'id': 'A', 'text': '$M < G < R$'}, {'id': 'B', 'text': '$M > G > R$'}, {'id': 'C', 'text': '$M > R > G$'}, {'id': 'D', 'text': '$M < R < G$'}],
    'B',
    'Since $\\cos\\theta - \\sin\\theta = \\sqrt{2}\\cos(\\theta+45^\\circ)$, we have $M = \\sqrt{2}\\cos 68^\\circ > 0$, $G = \\sqrt{2}\\cos 88^\\circ > 0$, and $R = \\sqrt{2}\\cos 108^\\circ < 0$. Because $\\cos 68^\\circ > \\cos 88^\\circ > \\cos 108^\\circ$, we have $M > G > R$.'
)

# Q60
add_mcq(60, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The period of the function $f(x) = \\frac{\\sin 7x + 6\\sin 5x + 17\\sin 3x + 12\\sin x}{\\sin 6x + 5\\sin 4x + 12\\sin 2x}$ is',
    [{'id': 'A', 'text': '$\\pi$'}, {'id': 'B', 'text': '$2\\pi$'}, {'id': 'C', 'text': '$\\frac{\\pi}{4}$'}, {'id': 'D', 'text': '$\\frac{\\pi}{2}$'}],
    'B',
    'Multiplying the denominator by $2\\cos x$ gives $(\\sin 7x + \\sin 5x) + 5(\\sin 5x + \\sin 3x) + 12(\\sin 3x + \\sin x) = \\sin 7x + 6\\sin 5x + 17\\sin 3x + 12\\sin x$, which is the numerator. Hence $f(x) = 2\\cos x$, whose fundamental period is $2\\pi$.'
)

# Q61
add_mcq(61, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If the range of $\\frac{\\sin(3x)}{\\sin(x)}$ is $(a, b) \\ \\forall x \\in \\left(0, \\frac{\\pi}{2}\\right)$, then $\\frac{a}{b} + \\frac{b}{a} =$',
    [{'id': 'A', 'text': '$\\frac{-10}{7}$'}, {'id': 'B', 'text': '$\\frac{-10}{3}$'}, {'id': 'C', 'text': '$\\frac{-3}{10}$'}, {'id': 'D', 'text': '$\\frac{10}{3}$'}],
    'B',
    '$\\frac{\\sin 3x}{\\sin x} = 3 - 4\\sin^2 x$. For $x \\in (0, \\pi/2)$, $\\sin^2 x \\in (0, 1)$, so $3 - 4\\sin^2 x \\in (-1, 3)$. Hence $a = -1, b = 3$. Then $\\frac{a}{b} + \\frac{b}{a} = -\\frac{1}{3} - 3 = -\\frac{10}{3}$.'
)

# Q62
add_mcq(62, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The average of $2\\sin(2^\\circ), 4\\sin(4^\\circ), 6\\sin(6^\\circ), \\dots, 180\\sin(180^\\circ)$',
    [{'id': 'A', 'text': '$\\tan(1^\\circ)$'}, {'id': 'B', 'text': '$\\cot(1^\\circ)$'}, {'id': 'C', 'text': '$\\sin(1^\\circ)$'}, {'id': 'D', 'text': '$\\cos(1^\\circ)$'}],
    'B',
    'There are 90 terms. Using the summation formula $\\sum_{k=1}^n 2k\\sin(2k\\theta)$, for $\\theta = 1^\\circ$ and $n = 90$, the sum evaluates to $90\\cot(1^\\circ)$. Dividing by 90 gives the average as $\\cot(1^\\circ)$.'
)

# Q63
add_mcq(63, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The value of $[\\cos^4(1^\\circ) + \\cos^4(2^\\circ) + \\dots + \\cos^4(179^\\circ)] - [\\sin^4(1^\\circ) + \\sin^4(2^\\circ) + \\dots + \\sin^4(179^\\circ)] = $',
    [{'id': 'A', 'text': '-1'}, {'id': 'B', 'text': '1'}, {'id': 'C', 'text': '0'}, {'id': 'D', 'text': '-2'}],
    'A',
    'Since $\\cos^4\\theta - \\sin^4\\theta = \\cos 2\\theta$, the expression equals $\\sum_{k=1}^{179} \\cos(2k^\\circ) = -\\cos(360^\\circ) = -1$.'
)

# Q64
add_mcq(64, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The period of $f(x) = [x] + [2x] + [3x] + [4x] + \\dots + [100x] - 5050x$, (where [.] GIF)',
    [{'id': 'A', 'text': '2'}, {'id': 'B', 'text': '0'}, {'id': 'C', 'text': '3'}, {'id': 'D', 'text': '1'}],
    'D',
    'Since $[kx] - kx = -\\{kx\\}$, $f(x) = -\\sum_{k=1}^{100} \\{kx\\}$. Because $\\{k(x+1)\\} = \\{kx + k\\} = \\{kx\\}$ for every integer $k$, $f(x+1) = f(x)$. The fundamental period is 1.'
)

# Q65
add_mcq(65, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The minimum value of $\\sqrt{(3\\sin x - 4\\cos x - 10)(3\\sin x + 4\\cos x - 10)}$ is',
    [{'id': 'A', 'text': '6'}, {'id': 'B', 'text': '7'}, {'id': 'C', 'text': '8'}, {'id': 'D', 'text': '9'}],
    'B',
    'The expression under the radical is $(3\\sin x - 10)^2 - 16\\cos^2 x = (5\\sin x - 6)^2 + 48$. For $\\sin x \\in [-1, 1]$, the minimum occurs when $\\sin x = 1$, giving $(5-6)^2 + 48 = 49$. The minimum value is $\\sqrt{49} = 7$.'
)

# Q66
add_mcq(66, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $0 < x, y < \\pi$ and $\\cos x + \\cos y - \\cos(x+y) = 3/2$, then $[\\sin x + \\cos y]$ is equal to (where [.] GIF)',
    [{'id': 'A', 'text': '1'}, {'id': 'B', 'text': '10'}, {'id': 'C', 'text': '2'}, {'id': 'D', 'text': '3'}],
    'A',
    'The maximum value of $\\cos x + \\cos y - \\cos(x+y)$ is $3/2$, occurring uniquely at $x = y = \\pi/3$. Then $\\sin x + \\cos y = \\sin(\\pi/3) + \\cos(\\pi/3) = \\frac{\\sqrt{3}+1}{2} \\approx 1.366$. Its greatest integer part is $[1.366] = 1$.'
)

# Q67
add_mcq(67, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The set of all values of $\\lambda$ for which the equation $\\cos^2(2x) - 2\\sin^4 x - 2\\cos^2 x = \\lambda$ has a solution $\\forall x \\in \\mathbb{R}$ is $[a, b]$. Find $2(a+b)$',
    [{'id': 'A', 'text': '-2'}, {'id': 'B', 'text': '-4'}, {'id': 'C', 'text': '-5'}, {'id': 'D', 'text': '-7'}],
    'C',
    'In terms of $t = \\cos 2x \\in [-1, 1]$, the LHS is $\\frac{1}{2}t^2 - \\frac{3}{2}$. For $t^2 \\in [0, 1]$, the range is $[-\\frac{3}{2}, -1] = [a, b]$. Then $2(a+b) = 2(-\\frac{5}{2}) = -5$.'
)

# Q68
add_mcq(68, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'The number of the real solutions of $x$ for the equation $\\frac{3\\cos 2x + \\cos^3 2x}{\\cos^6 x - \\sin^6 x} = x^3 - x^2 + 6$ is',
    [{'id': 'A', 'text': '0'}, {'id': 'B', 'text': '1'}, {'id': 'C', 'text': '-1'}, {'id': 'D', 'text': '3'}],
    'B',
    'The LHS simplifies to 4. Then $x^3 - x^2 + 6 = 4 \\implies x^3 - x^2 + 2 = (x+1)(x^2 - 2x + 2) = 0$. Since $x^2 - 2x + 2 = 0$ has complex conjugate roots, $x = -1$ is the only real root (1 solution).'
)

# Q69
add_mcq(69, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $\\left(\\sin x - \\frac{1}{\\sqrt{2}}\\right)^2 + \\left(\\cos x - \\frac{1}{\\sqrt{2}}\\right)^2 + (\\sin x - \\cos x)^2 = 0$ then find the median of all solutions of $x, \\ \\forall x \\in [0, 2026\\pi]$',
    [{'id': 'A', 'text': '$\\frac{4045\\pi}{4}$'}, {'id': 'B', 'text': '$\\frac{4049\\pi}{4}$'}, {'id': 'C', 'text': '$\\frac{4051\\pi}{4}$'}, {'id': 'D', 'text': '$\\frac{4045\\pi}{2}$'}],
    'B',
    'The sum of squares is 0 iff $\\sin x = \\cos x = 1/\\sqrt{2} \\implies x = 2k\\pi + \\pi/4$. In $[0, 2026\\pi]$, $k = 0, 1, \\dots, 1012$ (1013 roots). The median is the 507th root ($k = 506$): $x_{506} = 2(506)\\pi + \\pi/4 = 1012\\pi + \\pi/4 = \\frac{4049\\pi}{4}$.'
)

# Q70
add_mcq(70, 'Mathematics', 'Section A: Single Correct (20 Qs)',
    'If $m$ and $n$ respectively are the number of positive and negative values of $\\theta$ in the interval $[-\\pi, \\pi]$ that satisfy the equation $\\cos 2\\theta \\cos\\frac{\\theta}{2} = \\cos 3\\theta \\cos\\frac{9\\theta}{2}$ then $\\frac{m}{n}$ is equal to',
    [{'id': 'A', 'text': '1'}, {'id': 'B', 'text': '2'}, {'id': 'C', 'text': '3'}, {'id': 'D', 'text': '4'}],
    'A',
    'Since cosine is an even function, $f(\\theta) = \\cos 2\\theta \\cos(\\theta/2) - \\cos 3\\theta \\cos(9\\theta/2)$ is strictly even: $f(-\\theta) = f(\\theta)$. Thus, every positive solution $\\theta$ has a corresponding negative solution $-\\theta$. Hence $m = n \\implies \\frac{m}{n} = 1$.'
)

# Q71
add_num(71, 'Mathematics', 'Section B: Numerical Value (5 Qs)',
    'The value of $36(4\\cos^2 9^\\circ - 1)(4\\cos^2 27^\\circ - 1)(4\\cos^2 81^\\circ - 1)(4\\cos^2 243^\\circ - 1) = $',
    36,
    'Using $4\\cos^2\\theta - 1 = \\frac{\\sin 3\\theta}{\\sin\\theta}$, the product telescopes: $\\frac{\\sin 27^\\circ}{\\sin 9^\\circ} \\times \\frac{\\sin 81^\\circ}{\\sin 27^\\circ} \\times \\frac{\\sin 243^\\circ}{\\sin 81^\\circ} \\times \\frac{\\sin 729^\\circ}{\\sin 243^\\circ} = \\frac{\\sin 9^\\circ}{\\sin 9^\\circ} = 1$. Multiplying by 36 yields 36.'
)

# Q72
add_num(72, 'Mathematics', 'Section B: Numerical Value (5 Qs)',
    'If the value of $\\frac{3\\cos 36^\\circ + 5\\sin 18^\\circ}{5\\cos 36^\\circ - 3\\sin 18^\\circ}$ is $\\frac{a\\sqrt{5} - b}{c}$, where $a, b, c$ are natural numbers and $\\gcd(a, c) = 1$, then $a + b + c$ is equal to',
    52,
    'Substitute $\\cos 36^\\circ = \\frac{\\sqrt{5}+1}{4}$ and $\\sin 18^\\circ = \\frac{\\sqrt{5}-1}{4}$. Numerator is $\\frac{4\\sqrt{5}-1}{2}$ and denominator is $\\frac{\\sqrt{5}+4}{2}$. Fraction is $\\frac{4\\sqrt{5}-1}{4+\\sqrt{5}} = \\frac{(4\\sqrt{5}-1)(4-\\sqrt{5})}{16-5} = \\frac{17\\sqrt{5}-24}{11}$. Thus $a = 17, b = 24, c = 11$, and $a+b+c = 17+24+11 = 52$.'
)

# Q73
add_num(73, 'Mathematics', 'Section B: Numerical Value (5 Qs)',
    'If $\\csc\\frac{\\pi}{32} + \\csc\\frac{\\pi}{16} + \\csc\\frac{\\pi}{8} + \\csc\\frac{\\pi}{4} + \\csc\\frac{\\pi}{2} = \\cot\\frac{\\pi}{k} \\ (k \\in \\mathbb{N})$, then $k = $',
    64,
    'Using $\\csc\\theta = \\cot(\\theta/2) - \\cot\\theta$, the series telescopes to $\\cot\\frac{\\pi}{64} - \\cot\\frac{\\pi}{2} = \\cot\\frac{\\pi}{64}$. Hence $k = 64$.'
)

# Q74
add_num(74, 'Mathematics', 'Section B: Numerical Value (5 Qs)',
    'If $P = \\tan(3^{n+1}\\theta) - \\tan\\theta$, $Q = \\sum_{r=0}^n \\frac{\\sin(3^r\\theta)}{\\cos(3^{r+1}\\theta)}$ then $\\frac{P}{Q} = $',
    2,
    'Using $\\tan(3^{r+1}\\theta) - \\tan(3^r\\theta) = \\frac{2\\sin(3^r\\theta)}{\\cos(3^{r+1}\\theta)}$, each term in $Q$ is $\\frac{1}{2}[\\tan(3^{r+1}\\theta) - \\tan(3^r\\theta)]$. Telescoping sum gives $Q = \\frac{1}{2}P$, so $P/Q = 2$.'
)

# Q75
add_num(75, 'Mathematics', 'Section B: Numerical Value (5 Qs)',
    'Let $S = \\{ \\theta \\in [0, 2\\pi) : \\tan(\\pi\\cos\\theta) + \\tan(\\pi\\sin\\theta) = 0 \\}$. If $\\sum_{\\theta \\in S} \\sin^2\\left(\\theta + \\frac{\\pi}{4}\\right) = K$, then $\\frac{3K}{2} = $',
    3,
    '$\\tan(\\pi\\cos\\theta) = -\\tan(\\pi\\sin\\theta) \\implies \\pi(\\cos\\theta + \\sin\\theta) = n\\pi \\implies \\cos\\theta + \\sin\\theta = n \\in \\{-1, 0, 1\\}$. For $n=0$: $\\theta = 3\\pi/4, 7\\pi/4$, $\\sin^2(\\theta+\\pi/4) = 0$. For $n=1$: $\\theta = 0, \\pi/2$, $\\sin^2(\\theta+\\pi/4) = 1/2$. For $n=-1$: $\\theta = \\pi, 3\\pi/2$, $\\sin^2(\\theta+\\pi/4) = 1/2$. Sum $K = 0 + 0 + 1/2 + 1/2 + 1/2 + 1/2 = 2$. Then $\\frac{3K}{2} = 3$.'
)

print(f"Total questions generated: {len(qs)}")
assert len(qs) == 75, f"Expected 75 questions, got {len(qs)}"

# Assemble paper
paper = {
  "id": "jee-mains-ptm-01",
  "aliasId": "ptm-01",
  "examCategory": "jee-mains",
  "examType": "JEE Mains",
  "code": "PTM 01",
  "title": "JEE Mains 2027 Test Series — PTM 01",
  "subtitle": "Part Test 03 Syllabus (KTG, Thermodynamics, Hydrocarbons, GOC, Trigonometric Functions & Equations)",
  "status": "live",
  "durationMinutes": 180,
  "maxMarks": 300,
  "totalQuestions": 75,
  "scheduledStartTime": "2026-08-14T09:00:00+05:30",
  "scheduledEndTime": "2026-08-14T12:00:00+05:30",
  "syllabus": {
    "physics": [
      "Kinetic Theory of Gases (degrees of freedom, RMS, average and most probable speeds, Maxwell distribution, mean free path, relaxation time)",
      "Thermodynamics (First Law of Thermodynamics, work done in isobaric, isothermal, adiabatic, isochoric and cyclic processes, Carnot engine efficiency, adiabatic bulk modulus)"
    ],
    "chemistry": [
      "Hydrocarbons (alkanes, alkenes, alkynes, free-radical halogenation, oxymercuration-demercuration, conjugated dienes, Wurtz-Fittig reaction)",
      "General Organic Chemistry (Aromaticity, Huckel's rule, acidic strength and pKa, dipole moment of alkyl halides)",
      "Purification & Separation Methods (distillation types: simple, fractional, steam, vacuum; chromatography: TLC; Kjeldahl's method)"
    ],
    "mathematics": [
      "Trigonometric Ratios & Identities (compound angles, multiple & submultiple angles, transformation formulas, summation of trigonometric series)",
      "Trigonometric Functions & Properties (domain, range, periodicity, greatest integer combinations)",
      "Trigonometric Equations (number of roots, general solutions, system of equations)"
    ]
  },
  "sectionsSummary": [
    {
      "subject": "Physics",
      "sections": [
        { "name": "Section A: Single Correct (20 Qs)", "questionCount": 20, "marking": "+4, -1" },
        { "name": "Section B: Numerical Value (5 Qs)", "questionCount": 5, "marking": "+4, -1" }
      ]
    },
    {
      "subject": "Chemistry",
      "sections": [
        { "name": "Section A: Single Correct (20 Qs)", "questionCount": 20, "marking": "+4, -1" },
        { "name": "Section B: Numerical Value (5 Qs)", "questionCount": 5, "marking": "+4, -1" }
      ]
    },
    {
      "subject": "Mathematics",
      "sections": [
        { "name": "Section A: Single Correct (20 Qs)", "questionCount": 20, "marking": "+4, -1" },
        { "name": "Section B: Numerical Value (5 Qs)", "questionCount": 5, "marking": "+4, -1" }
      ]
    }
  ],
  "questions": qs
}

# 1. Write src/data/tests/jee-main-2027/ptm-01.json
os.makedirs("src/data/tests/jee-main-2027", exist_ok=True)
with open("src/data/tests/jee-main-2027/ptm-01.json", "w", encoding="utf-8") as f:
    json.dump(paper, f, indent=2, ensure_ascii=False)
print("Saved src/data/tests/jee-main-2027/ptm-01.json")

# 2. Write public/data/tests/jee-main-2027/ptm-01.json
os.makedirs("public/data/tests/jee-main-2027", exist_ok=True)
with open("public/data/tests/jee-main-2027/ptm-01.json", "w", encoding="utf-8") as f:
    json.dump(paper, f, indent=2, ensure_ascii=False)
print("Saved public/data/tests/jee-main-2027/ptm-01.json")

# 3. Write src/data/jee-mains/ptm01.ts
ts_content = f"import {{ TestPaper }} from '../testTypes';\n\nexport const jeeMainsPtm01Data: TestPaper = {json.dumps(paper, indent=2, ensure_ascii=False)};\n"
with open("src/data/jee-mains/ptm01.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)
print("Saved src/data/jee-mains/ptm01.ts")

# 4. Write public/data/jee-mains/ptm01.js
os.makedirs("public/data/jee-mains", exist_ok=True)
js_content = f"window.ptm01Data = {json.dumps(paper, indent=2, ensure_ascii=False)};\n"
with open("public/data/jee-mains/ptm01.js", "w", encoding="utf-8") as f:
    f.write(js_content)
print("Saved public/data/jee-mains/ptm01.js")

print("All 4 target files generated successfully!")
