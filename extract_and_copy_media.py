from PIL import Image
import os
import shutil

media_dir = r"E:\Stepup\backend\media"
frontend_images_dir = r"E:\Stepup\frontend\public\images"
os.makedirs(media_dir, exist_ok=True)
os.makedirs(frontend_images_dir, exist_ok=True)

m1 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792432572334_0dcc7261.png")
m2 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792432594640_c90c1b56.png")
m3 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792432598956_35841965.png")
m4 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792432603663_554d58d6.png")
m5 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792432611765_6bde6224.png")

# 1. Exact StepUp circular logo (from m2: x=143 to 219, y=105 to 179)
logo_crop = m2.crop((143, 105, 219, 179))
logo_crop.save(os.path.join(frontend_images_dir, "stepup_logo.png"))
logo_crop.save(os.path.join(media_dir, "stepup_logo.png"))
print("Saved stepup_logo.png:", logo_crop.size)

# 2. Hero Banners:
# The hero box is from x=165 to 865, y=385 to 558 in m2, m3, m4, m5
hero_box = (165, 385, 865, 558)

# Slide 1: Red high heels
h_red = m2.crop(hero_box)
h_red.save(os.path.join(frontend_images_dir, "hero_red_heels.png"))
h_red.save(os.path.join(media_dir, "hero_red_heels.png"))
print("Saved hero_red_heels.png:", h_red.size)

# Slide 2: Kids 3D sneakers
h_kids = m3.crop(hero_box)
h_kids.save(os.path.join(frontend_images_dir, "hero_kids_3d.png"))
h_kids.save(os.path.join(media_dir, "hero_kids_3d.png"))
print("Saved hero_kids_3d.png:", h_kids.size)

# Slide 3: Ice blue high heels
h_blue = m4.crop(hero_box)
h_blue.save(os.path.join(frontend_images_dir, "hero_blue_heels.png"))
h_blue.save(os.path.join(media_dir, "hero_blue_heels.png"))
print("Saved hero_blue_heels.png:", h_blue.size)

# Slide 4: Men's high heel office shoe
h_men = m5.crop(hero_box)
h_men.save(os.path.join(frontend_images_dir, "hero_men_office.png"))
h_men.save(os.path.join(media_dir, "hero_men_office.png"))
print("Saved hero_men_office.png:", h_men.size)

# 3. Cart Page Shoe (from m1)
# In m1, locate the cart item image: around x: 420-460, y: 420-480
cart_shoe = m1.crop((418, 420, 465, 485))
cart_shoe.save(os.path.join(frontend_images_dir, "cart_shoe_comfy.png"))
cart_shoe.save(os.path.join(media_dir, "cart_shoe_comfy.png"))
print("Saved cart_shoe_comfy.png:", cart_shoe.size)

# 4. Copy all existing images from stepupimages to backend/media as requested:
# "take images from this folder and add it to media file in backend"
src_stepup_images = r"E:\Stepup\stepupimages"
for f in os.listdir(src_stepup_images):
    s_path = os.path.join(src_stepup_images, f)
    if os.path.isfile(s_path):
        shutil.copy2(s_path, os.path.join(media_dir, f))

# Also copy all frontend/public/images to backend/media
for f in os.listdir(frontend_images_dir):
    s_path = os.path.join(frontend_images_dir, f)
    if os.path.isfile(s_path):
        shutil.copy2(s_path, os.path.join(media_dir, f))

print("Total files in backend media:", len(os.listdir(media_dir)))
