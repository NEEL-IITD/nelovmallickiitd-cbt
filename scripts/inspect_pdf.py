import fitz

pdf_path = r'C:\Users\dasri\.gemini\antigravity\brain\891ec41f-d0f8-46a7-adac-6aa0cddea39e\.user_uploaded\media_1795459798132_3a1c1fad.pdf'
doc = fitz.open(pdf_path)
for i in range(len(doc)):
    imgs = doc[i].get_images()
    if imgs:
        xref = imgs[0][0]
        base_img = doc.extract_image(xref)
        w = base_img["width"]
        h = base_img["height"]
        ext = base_img["ext"]
        print(f"Page {i+1}: {w}x{h}, {ext}")
