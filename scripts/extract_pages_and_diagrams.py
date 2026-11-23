import fitz
import os
from PIL import Image

pdf_path = r'C:\Users\dasri\.gemini\antigravity\brain\891ec41f-d0f8-46a7-adac-6aa0cddea39e\.user_uploaded\media_1795459798132_3a1c1fad.pdf'
os.makedirs('temp_pages', exist_ok=True)
doc = fitz.open(pdf_path)

for i in range(len(doc)):
    page = doc[i]
    imgs = page.get_images()
    if imgs:
        xref = imgs[0][0]
        base_img = doc.extract_image(xref)
        img_bytes = base_img["image"]
        with open(f"temp_pages/page_{i+1}.png", "wb") as f:
            f.write(img_bytes)
print("All 20 pages extracted to temp_pages/")
