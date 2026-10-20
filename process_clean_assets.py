from PIL import Image
import os
import shutil

f_dir = r"E:\Stepup\frontend\public\images"
m_dir = r"E:\Stepup\backend\media"

# 1. Exact circular logo from Asset 5
im5 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792433511005_0cedf7ea.png")
# Circle in im5 is around x: 19 to 77, y: 7 to 65
logo_crop = im5.crop((19, 7, 77, 65))
# Create circular mask
mask = Image.new("L", logo_crop.size, 0)
from PIL import ImageDraw
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, logo_crop.size[0], logo_crop.size[1]), fill=255)
logo_clean = Image.new("RGBA", logo_crop.size, (0,0,0,0))
logo_clean.paste(logo_crop, (0,0), mask=mask)

logo_clean.save(os.path.join(f_dir, "stepup_logo.png"))
logo_clean.save(os.path.join(m_dir, "stepup_logo.png"))
logo_clean.save(r"E:\Stepup\frontend\public\stepup_logo.png")
print("Saved clean circular stepup_logo.png:", logo_clean.size)

# 2. Four exact hero banners
target_w, target_h = 1024, 330

b1 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792433370618_5bfa2189.png")
b2 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792433392207_e8e4bc83.png")
b3 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792433410900_1ff10a50.png")
b4 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792433448738_31885ac6.png")

def format_banner(img, target_w, target_h):
    w, h = img.size
    # crop center to match aspect ratio
    crop_h = min(h, int(w * (target_h / target_w)))
    top = (h - crop_h) // 2
    cropped = img.crop((0, top, w, top + crop_h))
    return cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

res1 = format_banner(b1, target_w, target_h)
res2 = format_banner(b2, target_w, target_h)
res3 = format_banner(b3, target_w, target_h)
res4 = format_banner(b4, target_w, target_h)

res1.save(os.path.join(f_dir, "hero_slide_1_red.png"))
res1.save(os.path.join(m_dir, "hero_slide_1_red.png"))

res2.save(os.path.join(f_dir, "hero_slide_2_kids.png"))
res2.save(os.path.join(m_dir, "hero_slide_2_kids.png"))

res3.save(os.path.join(f_dir, "hero_slide_3_men.png"))
res3.save(os.path.join(m_dir, "hero_slide_3_men.png"))

res4.save(os.path.join(f_dir, "hero_slide_4_blue.png"))
res4.save(os.path.join(m_dir, "hero_slide_4_blue.png"))

print("All 4 hero banners formatted to 1024x330 and saved!")
