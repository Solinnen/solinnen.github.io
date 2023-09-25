import os
from PIL import Image

for path in os.listdir("."):
	if path.endswith(".png") or path.endswith(".jpg"):
		image = Image.open(path)
		image.save(path[:-4]+".webp", format="webp")