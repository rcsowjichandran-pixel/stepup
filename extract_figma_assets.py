from PIL import Image

# Media 1: Home page
m1 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792429973036_5df46051.png")
# Media 3: About Us
m3 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792429995546_6e3df001.png")
# Media 4: Contact Us
m4 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792430001519_2941abe3.png")

# Let's crop hero banner from m1:
# In m1, left is 383, right is 670, hero is from y=170 to y=250 approx
# Let's inspect y range of hero
hero_banner = m1.crop((383, 170, 670, 255))
hero_banner.save(r"E:\Stepup\stepupimages\hero_banner_figma.png")
print("Hero banner saved:", hero_banner.size)

# From m3 (About Us), let's crop the side illustration:
about_illustration = m3.crop((580, 240, 660, 390))
about_illustration.save(r"E:\Stepup\stepupimages\about_illustration.png")
print("About illustration saved:", about_illustration.size)

# From m3, let's crop the circular shoes (mission shoes):
mission_shoes = m3.crop((460, 350, 560, 440))
mission_shoes.save(r"E:\Stepup\stepupimages\mission_shoes.png")
print("Mission shoes saved:", mission_shoes.size)

# From m4 (Contact Us), crop the shoe collage:
contact_collage = m4.crop((480, 220, 650, 340))
contact_collage.save(r"E:\Stepup\stepupimages\contact_collage.png")
print("Contact collage saved:", contact_collage.size)
