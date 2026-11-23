import os
from PIL import Image, ImageChops

def trim(im, border_bg=255, padding=12):
    bg = Image.new(im.mode, im.size, (border_bg, border_bg, border_bg) if im.mode == 'RGB' else border_bg)
    diff = ImageChops.difference(im, bg)
    bbox = diff.getbbox()
    if bbox:
        w, h = im.size
        l = max(0, bbox[0] - padding)
        t = max(0, bbox[1] - padding)
        r = min(w, bbox[2] + padding)
        b = min(h, bbox[3] + padding)
        return im.crop((l, t, r, b))
    return im

os.makedirs('public/images/ptm02', exist_ok=True)
os.makedirs('dist/images/ptm02', exist_ok=True)

crops = {
    # Page 2: Q3 Spherical shell
    'q03.png': ('page_2.png', (450, 800, 950, 1220)),
    
    # Page 3: Q8 Wall Rod-1 Rod-2 Wall
    'q08.png': ('page_3.png', (400, 1440, 1000, 1730)),
    
    # Page 5: Q13 Blocks Config I and II
    'q13.png': ('page_5.png', (180, 520, 1280, 870)),
    
    # Page 6: Q15 Slabs arrangement (a) and (b)
    'q15.png': ('page_6.png', (120, 530, 1300, 1020)),
    
    # Page 6: Q16 Furnace wall graph T vs X
    'q16.png': ('page_6.png', (460, 1370, 950, 1780)),
    
    # Page 7: Q18 Rods AB, CD, CF, DE junction
    'q18.png': ('page_7.png', (460, 1310, 950, 1760)),
    
    # Page 9: Q23 Copper & Steel cylindrical bar
    'q23.png': ('page_9.png', (320, 780, 1120, 1070)),
    
    # Page 10: Q25 Table containers C1, C2, C3
    'q25.png': ('page_10.png', (350, 370, 1060, 720)),
    
    # Page 10: Q27 Most acidic hydrogen structures
    'q27.png': ('page_10.png', (160, 1240, 1260, 1780)),
    'q27_optA.png': ('page_10.png', (160, 1240, 680, 1500)),
    'q27_optB.png': ('page_10.png', (720, 1240, 1260, 1500)),
    'q27_optC.png': ('page_10.png', (160, 1510, 680, 1780)),
    'q27_optD.png': ('page_10.png', (720, 1510, 1260, 1780)),
    
    # Page 11: Q31 1,4-cyclohexanediol conformers
    'q31.png': ('page_11.png', (160, 1160, 1260, 1680)),
    'q31_optA.png': ('page_11.png', (160, 1160, 680, 1420)),
    'q31_optB.png': ('page_11.png', (720, 1160, 1260, 1420)),
    'q31_optC.png': ('page_11.png', (160, 1430, 680, 1680)),
    'q31_optD.png': ('page_11.png', (720, 1430, 1260, 1680)),
    
    # Page 12: Q33 Fischer projections P, Q, R
    'q33.png': ('page_12.png', (160, 430, 1260, 760)),
    
    # Page 12: Q34 Carbocation structures (I) and (II)
    'q34.png': ('page_12.png', (160, 900, 520, 1240)),
    
    # Page 13: Q39 Radicals (P), (Q), (R)
    'q39.png': ('page_13.png', (160, 1200, 1260, 1480)),
    
    # Page 14: Q44 Resonance structures A, B, C, D
    'q44.png': ('page_14.png', (160, 900, 1260, 1440)),
    'q44_optA.png': ('page_14.png', (160, 900, 680, 1160)),
    'q44_optB.png': ('page_14.png', (720, 900, 1260, 1160)),
    'q44_optC.png': ('page_14.png', (160, 1170, 680, 1440)),
    'q44_optD.png': ('page_14.png', (720, 1170, 1260, 1440)),
}

for name, (page_file, box) in crops.items():
    page_path = os.path.join('temp_pages', page_file)
    im = Image.open(page_path)
    cropped = im.crop(box)
    trimmed = trim(cropped)
    
    # Ensure RGB / clean white background
    if trimmed.mode in ('RGBA', 'LA'):
        bg = Image.new('RGB', trimmed.size, (255, 255, 255))
        bg.paste(trimmed, mask=trimmed.split()[-1])
        trimmed = bg
    elif trimmed.mode != 'RGB':
        trimmed = trimmed.convert('RGB')
        
    out_public = os.path.join('public', 'images', 'ptm02', name)
    out_dist = os.path.join('dist', 'images', 'ptm02', name)
    trimmed.save(out_public, 'PNG', optimize=True)
    trimmed.save(out_dist, 'PNG', optimize=True)
    size = os.path.getsize(out_public)
    print(f"Extracted {name}: {trimmed.size[0]}x{trimmed.size[1]} ({size} bytes)")

print("\nAll diagrams successfully extracted and trimmed!")
