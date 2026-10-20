from PIL import Image

im = Image.open(r"E:\Stepup\stepupimages\figma_logo_clean.png").convert("RGBA")
# print unique dominant colors
colors = sorted(im.getcolors(maxcolors=1000) or [], reverse=True, key=lambda x: x[0])
for count, (r, g, b, a) in colors[:15]:
    print(f"rgba({r},{g},{b},{a}) - {count} pixels")
