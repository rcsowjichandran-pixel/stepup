import os
import glob

p = r"E:\Stepup\stepupimages"
html = ["<html><body><h1>StepUp Images Preview</h1><div style='display:flex;flex-wrap:wrap;gap:10px;'>"]
for f in sorted(os.listdir(p)):
    if f.lower().endswith(('.png', '.jpg', '.jpeg')):
        html.append(f"<div style='border:1px solid #ccc;padding:5px;text-align:center;'><img src='file:///{p.replace(chr(92), '/')}/{f}' style='max-height:120px;max-width:120px;display:block;margin:auto;'/><small>{f}</small></div>")
html.append("</div></body></html>")

with open(r"E:\Stepup\preview.html", "w", encoding="utf-8") as out:
    out.write("\n".join(html))
print("Preview HTML written")
