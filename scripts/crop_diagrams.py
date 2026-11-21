import os
from PIL import Image

pages_dir = r"C:\Users\dasri\.gemini\antigravity\scratch\nelovmallickiitd-web\temp_ptm01_pages"
out_dir = r"C:\Users\dasri\.gemini\antigravity\scratch\nelovmallickiitd-web\public\assets\tests\jee-main-2027\ptm-01"
os.makedirs(out_dir, exist_ok=True)

# Page size is 1414 x 2126. Let's crop diagrams with appropriate bounding boxes.
# Each box is (left, top, right, bottom)
crops = {
    # Page 1: Q1 graph (rho vs P)
    "q01_graph.png": ("page_01.png", (400, 750, 1050, 1150)),
    
    # Page 2: Q2 elliptical cycle
    "q02_diagram.png": ("page_02.png", (450, 260, 1050, 600)),
    
    # Page 2: Q5 T-P graph AB
    "q05_diagram.png": ("page_02.png", (450, 1400, 1050, 1680)),
    
    # Page 3: Q8 P-V straight line 37 deg
    "q08_diagram.png": ("page_03.png", (380, 850, 1020, 1150)),
    
    # Page 3: Q9 cycle ABCA
    "q09_cycle.png": ("page_03.png", (460, 1420, 950, 1780)),
    
    # Page 4: Q9 options A, B, C, D
    "q09_options.png": ("page_04.png", (150, 180, 1250, 730)),
    
    # Page 6: Q21 P-V graph isothermal/adiabatic
    "q21_graph.png": ("page_06.png", (450, 1370, 950, 1750)),
    
    # Page 7: Q26 aromatic structures (6 structures)
    "q26_structures.png": ("page_07.png", (180, 520, 1250, 1550)),
    
    # Page 8: Q27 skeletal monobromination
    "q27_reaction.png": ("page_08.png", (180, 260, 1300, 480)),
    
    # Page 8: Q29 reaction scheme
    "q29_reaction.png": ("page_08.png", (180, 780, 1250, 930)),
    
    # Page 8: Q31 options
    "q31_options.png": ("page_08.png", (180, 1350, 1250, 1750)),
    
    # Page 9: Q32 alkene stability options
    "q32_options.png": ("page_09.png", (180, 200, 1320, 1150)),
    
    # Page 9: Q33 reaction and options
    "q33_reaction.png": ("page_09.png", (180, 1180, 1250, 1780)),
    
    # Page 10: Q35 reactant and options
    "q35_reaction.png": ("page_10.png", (180, 650, 1250, 1680)),
    
    # Page 12: Q39 structures A to E
    "q39_structures.png": ("page_12.png", (180, 180, 1280, 850)),
    
    # Page 12: Q41 diene reaction and options
    "q41_reaction.png": ("page_12.png", (180, 1350, 1250, 1880)),
    
    # Page 13: Q42 alkyne-diene reaction
    "q42_reaction.png": ("page_13.png", (100, 240, 1320, 570)),
    
    # Page 14: Q46 Wurtz/Fittig reaction
    "q46_reaction.png": ("page_14.png", (120, 950, 1320, 1250)),
    
    # Page 14: Q47 TLC chromatogram
    "q47_chromatogram.png": ("page_14.png", (380, 1380, 1050, 1730)),
    
    # Page 15: Q49 12 substituted benzene rings
    "q49_structures.png": ("page_15.png", (180, 470, 1300, 1280)),
    
    # Page 15: Q50 Friedel-Crafts reaction
    "q50_reaction.png": ("page_15.png", (250, 1350, 1150, 1600)),
}

for filename, (page_name, bbox) in crops.items():
    page_img_path = os.path.join(pages_dir, page_name)
    im = Image.open(page_img_path)
    cropped = im.crop(bbox)
    
    # Optional autocrop white margins around the crop
    # Convert to grayscale to check bounding box
    gray = cropped.convert("L")
    # Invert so black text is high value
    inv = gray.point(lambda p: 255 if p < 240 else 0)
    actual_bbox = inv.getbbox()
    if actual_bbox:
        # Add a 10px padding
        pad = 12
        left = max(0, actual_bbox[0] - pad)
        top = max(0, actual_bbox[1] - pad)
        right = min(cropped.width, actual_bbox[2] + pad)
        bottom = min(cropped.height, actual_bbox[3] + pad)
        cropped = cropped.crop((left, top, right, bottom))
    
    target_path = os.path.join(out_dir, filename)
    cropped.save(target_path, "PNG")
    print(f"Saved {filename} ({cropped.width}x{cropped.height})")

print("All diagrams cropped successfully!")
