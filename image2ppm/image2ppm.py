from PIL import Image


class ImageToPPM:

    def __init__(self, image):
        self.rotation = 90
        self.im = Image.open(image).rotate(self.rotation)
        self.pixels = list(self.im.getdata())
        self.width, self.height = self.im.size

    def preview_coin(self):
        pixel_string = ''
        for i in range(self.height):
            pixel_line = ''
            for pixel in self.pixels[i * self.width:(i + 1) * self.width]:
                pixel_line = pixel_line + str(pixel)
            pixel_string = pixel_string + pixel_line + '\n'
        return pixel_string

    def output_coin_ppm(self):
        ppm_string = ''
        for i in range(self.height):
            pixel_line = ''
            for pixel in self.pixels[i * self.width:(i + 1) * self.width]:
                pixel_line = pixel_line + str(pixel)
            ppm_string = ppm_string + pixel_line + '.'
        return ppm_string[:-1]

i2ppm = ImageToPPM("kittycoin-base.gif")
print(i2ppm.preview_coin())
print(i2ppm.output_coin_ppm())