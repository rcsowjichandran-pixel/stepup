from PIL import Image

im = Image.open(r"E:\Stepup\stepupimages\figma_logo_clean.png")
print("figma_logo_clean.png size:", im.size)

# Let's save a clean 2x and 4x upscaled version with high quality resampling
im_hi = im.resize((120, 120), Image.Resampling.LANCZOS)
im_hi.save(r"E:\Stepup\frontend\public\images\stepup_logo.png")
print("Saved stepup_logo.png")
