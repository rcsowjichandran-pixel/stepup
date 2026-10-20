from PIL import Image

# Check hero_banner_figma.png
im = Image.open(r"E:\Stepup\frontend\public\images\hero_banner_figma.png")
print("Figma hero banner size:", im.size)

# Also let's check if we can extract the clean office shoes image for the hero slider
# In media 1, the shoes are located in the left half of the hero banner (x=383 to 550, y=170 to 255)
m1 = Image.open(r"C:/Users/ADMIN/.gemini/antigravity/brain/b53f8cc0-22a4-4585-afb9-02febcfce7ba/.user_uploaded/media_1792429973036_5df46051.png")
hero_shoe = m1.crop((395, 172, 545, 252))
hero_shoe.save(r"E:\Stepup\frontend\public\images\hero_office_shoe.png")
print("hero_office_shoe.png saved:", hero_shoe.size)

# Let's also crop the women's glamour heel and kids shoes for slide 2 & 3
# Slide 2: Ophelia silver glamour heel
h2 = Image.open(r"E:\Stepup\frontend\public\images\product_ophelia_silver.png")
h2.save(r"E:\Stepup\frontend\public\images\hero_women_heels.png")

# Slide 3: Canny kids sneaker
h3 = Image.open(r"E:\Stepup\frontend\public\images\product_canny_boys_blue.png")
h3.save(r"E:\Stepup\frontend\public\images\hero_kids_shoes.png")

# Slide 4: Power sneaker
h4 = Image.open(r"E:\Stepup\frontend\public\images\product_power_men_white.png")
h4.save(r"E:\Stepup\frontend\public\images\hero_nature_sneakers.png")
print("All hero slide images ready!")
