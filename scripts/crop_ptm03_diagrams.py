import os
from PIL import Image

PAGES_DIR = r"C:\Users\dasri\.gemini\antigravity\scratch\nelovmallickiitd-web\temp_ptm03_pages"
OUT_DIR = r"C:\Users\dasri\.gemini\antigravity\scratch\nelovmallickiitd-web\public\images\ptm03"
DIST_DIR = r"C:\Users\dasri\.gemini\antigravity\scratch\nelovmallickiitd-web\dist\images\ptm03"

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(DIST_DIR, exist_ok=True)

# Page dimensions: 1414 x 2126
# Let's define crops for each diagram (left, top, right, bottom)
# We will inspect and crop cleanly.

crops = {
    # Page 2
    # Q3: Elliptical path
    "q03.png": ("page_02.png", (380, 680, 1050, 960)),
    # Q4: Options A and B
    "q04_optA.png": ("page_02.png", (210, 1460, 680, 1820)),
    "q04_optB.png": ("page_02.png", (780, 1460, 1250, 1820)),

    # Page 3
    # Q4: Options C and D
    "q04_optC.png": ("page_03.png", (210, 140, 680, 440)),
    "q04_optD.png": ("page_03.png", (780, 140, 1250, 440)),
    # Q5: Point mass & hollow sphere
    "q05.png": ("page_03.png", (450, 910, 950, 1370)),

    # Page 4
    # Q7: Electric field lines and dipole
    "q07.png": ("page_04.png", (480, 410, 980, 680)),

    # Page 5
    # Q12: Spherically symmetric charge distribution rho(r)
    "q12.png": ("page_05.png", (520, 1330, 890, 1710)),

    # Page 6
    # Q13: Parallel plates with electron
    "q13.png": ("page_06.png", (390, 360, 1060, 830)),
    # Q14: Cube with charges
    "q14.png": ("page_06.png", (500, 1070, 960, 1460)),

    # Page 7
    # Q15: Uniformly charged rod and +q moving from A to B
    "q15.png": ("page_07.png", (200, 330, 1250, 560)),

    # Page 9
    # Q21: Planet with spherical hole
    "q21.png": ("page_09.png", (520, 660, 930, 1060)),

    # Page 10
    # Q25: Rod and circular arc at P
    "q25.png": ("page_10.png", (450, 830, 970, 1280)),

    # Page 11
    # Q26: Chemical structures options A, B, C, D
    "q26.png": ("page_11.png", (200, 480, 1150, 920)),
    # Q28: Reaction scheme and product options
    "q28.png": ("page_11.png", (200, 1140, 1150, 1380)),
    "q28_optA.png": ("page_11.png", (200, 1420, 780, 1690)),
    "q28_optB.png": ("page_11.png", (840, 1420, 1330, 1690)),

    # Page 12
    # Q28: Option C
    "q28_optC.png": ("page_12.png", (200, 140, 800, 380)),
    # Q29: Reaction
    "q29.png": ("page_12.png", (200, 420, 750, 560)),
    # Q31: Column match table
    "q31.png": ("page_12.png", (200, 1010, 1300, 1700)),

    # Page 13
    # Q32: Reaction + product options
    "q32.png": ("page_13.png", (400, 180, 1050, 480)),
    "q32_optA.png": ("page_13.png", (200, 500, 600, 800)),
    "q32_optB.png": ("page_13.png", (800, 500, 1200, 800)),
    "q32_optC.png": ("page_13.png", (200, 810, 600, 1120)),
    "q32_optD.png": ("page_13.png", (800, 810, 1200, 1120)),
    # Q33: Reaction + options
    "q33.png": ("page_13.png", (200, 1170, 1280, 1480)),

    # Page 14
    # Q35: Monomers in options A, B
    "q35.png": ("page_14.png", (200, 200, 1200, 500)),
    # Q36: Spiro reaction and products
    "q36.png": ("page_14.png", (200, 720, 1200, 1280)),
    # Q37: 3-chloro-3-methylpentane reaction
    "q37.png": ("page_14.png", (200, 1310, 750, 1500)),

    # Page 15
    # Q38: PhMgBr reaction and options A, B, C, D
    "q38.png": ("page_15.png", (200, 220, 1320, 390)),
    # Q41: Reaction Fischer projection + options
    "q41.png": ("page_15.png", (200, 1240, 1200, 1780)),

    # Page 16
    # Q42: Reaction + options
    "q42.png": ("page_16.png", (200, 420, 1280, 1150)),
    # Q43: 4-sulfobenzoic acid + PhMgBr
    "q43.png": ("page_16.png", (200, 1200, 1000, 1550)),

    # Page 17
    # Q43: Options A, B, C, D
    "q43_options.png": ("page_17.png", (200, 140, 1250, 600)),
    # Q44: (1R,3S)-Cis-1-bromo-3-methylcyclohexane
    "q44.png": ("page_17.png", (200, 680, 950, 930)),

    # Page 18
    # Q46: alc.KOH reactions A, B, C
    "q46.png": ("page_18.png", (200, 390, 880, 960)),
    # Q47: Ten structures a through j
    "q47.png": ("page_18.png", (200, 1050, 1300, 1800)),

    # Page 19
    # Q49: 2-bromopentane sequence
    "q49.png": ("page_19.png", (200, 320, 1000, 460)),
    # Q50: Substrates for Sn1 / Sn2
    "q50.png": ("page_19.png", (180, 1150, 1320, 1750)),
}

for name, (page_file, box) in crops.items():
    page_path = os.path.join(PAGES_DIR, page_file)
    if not os.path.exists(page_path):
        print(f"Error: {page_path} not found")
        continue
    img = Image.open(page_path)
    cropped = img.crop(box)
    
    # Save to public and dist
    p_out = os.path.join(OUT_DIR, name)
    d_out = os.path.join(DIST_DIR, name)
    cropped.save(p_out, "PNG")
    cropped.save(d_out, "PNG")
    print(f"Saved {name}: {cropped.size} from {page_file} {box}")

print(f"Total diagrams cropped: {len(crops)}")
