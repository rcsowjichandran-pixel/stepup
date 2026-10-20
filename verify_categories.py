from PIL import Image

for name in ["image.png", "image (2).png", "image (3).png"]:
    im = Image.open(r"E:\Stepup\stepupimages\\" + name)
    print(name, im.size)
