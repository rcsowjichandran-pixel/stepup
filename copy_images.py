import os
import shutil
import subprocess
import sys
from PIL import Image

project_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.join(project_dir, "stepupimages")
dest_dir = os.path.join(project_dir, "frontend", "public", "images")
os.makedirs(dest_dir, exist_ok=True)

# 1. Copy category images:
# image.png -> category_men.png (345x362)
# image (2).png -> category_women.png (345x362)
# image (3).png -> category_kids.png (345x362)
shutil.copy2(os.path.join(src_dir, "image.png"), os.path.join(dest_dir, "category_men.png"))
shutil.copy2(os.path.join(src_dir, "image (2).png"), os.path.join(dest_dir, "category_women.png"))
shutil.copy2(os.path.join(src_dir, "image (3).png"), os.path.join(dest_dir, "category_kids.png"))

# 2. Copy the 8 catalog items from stepupimages (400x400)
catalog_mapping = {
    "125098_2_B02.20240229000136.jpg": "product_ophelia_silver.png",
    "12552_2_B02.20240226000125.jpg": "product_millie_silver.png",
    "14832_2_B02.20250530000126.jpg": "product_upn_blush.png",
    "14833_2_B02.20250530000126.jpg": "product_upn_navy.png",
    "20741_2_B02.20240304000134.jpg": "product_canny_boys_blue.png",
    "292091_2_B02.20240807000251.jpg": "product_canny_kids_pink.png",
    "830166_2_B02.20240925000409.jpg": "product_men_black_navy.png",
    "830252_2_B02.20240925000249.jpg": "product_power_men_white.png"
}

for src_name, dest_name in catalog_mapping.items():
    s_path = os.path.join(src_dir, src_name)
    if os.path.exists(s_path):
        shutil.copy2(s_path, os.path.join(dest_dir, dest_name))

# 3. Copy the men's, women's, and kids' catalog images (image (4).png to image (39).png).
for i in range(4, 40):
    src_f = f"image ({i}).png"
    s_path = os.path.join(src_dir, src_f)
    if os.path.exists(s_path):
        shutil.copy2(s_path, os.path.join(dest_dir, f"shoe_item_{i}.png"))

# 4. Copy 843x843 images
for f in os.listdir(src_dir):
    if f.startswith("IMG_") and f.endswith(".jpg"):
        shutil.copy2(os.path.join(src_dir, f), os.path.join(dest_dir, f))

# 5. Copy figma extracted assets if they exist
for f in ["hero_banner_figma.png", "about_illustration.png", "mission_shoes.png", "contact_collage.png", "figma_logo_clean.png"]:
    sp = os.path.join(src_dir, f)
    if os.path.exists(sp):
        shutil.copy2(sp, os.path.join(dest_dir, f))

print("Copied images successfully! Total in dest:", len(os.listdir(dest_dir)))

# Import every source image into Django media and sync hero slides to SQLite.
backend_dir = os.path.join(project_dir, "backend")
subprocess.run(
    [sys.executable, os.path.join(backend_dir, "manage.py"), "import_stepup_images"],
    cwd=backend_dir,
    check=True,
)

media_dir = os.path.join(backend_dir, "media")
os.makedirs(media_dir, exist_ok=True)
for filename in os.listdir(dest_dir):
    source_file = os.path.join(dest_dir, filename)
    if os.path.isfile(source_file):
        shutil.copy2(source_file, os.path.join(media_dir, filename))
