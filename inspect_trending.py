from PIL import Image

# Let's inspect image (40), (41), (42), (43)
for i in [40, 41, 42, 43]:
    im = Image.open(f"E:/Stepup/stepupimages/image ({i}).png")
    print(f"image ({i}).png", im.size)

# Also let's inspect the 8 items in Figma New & Trending
