import { Bitmap } from "./gui/Bitmap";

export class Art {
  static walls: Bitmap | null = null;
  static floors: Bitmap | null = null;
  static sprites: Bitmap | null = null;
  static font: Bitmap | null = null;
  static panel: Bitmap | null = null;
  static items: Bitmap | null = null;
  static sky: Bitmap | null = null;
  static logo: Bitmap | null = null;

  static async loadBitmap(name: string, filename: string): Promise<string> {
    const response = await fetch(filename);
    const blob = await response.blob();
    const img = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const result = new Bitmap(img.width, img.height);

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const i = (x + y * img.width) * 4;
        const r = imageData.data[i]!;
        const g = imageData.data[i + 1]!;
        const b = imageData.data[i + 2]!;

        const rgb = (r << 16) | (g << 8) | b;
        // Check for magenta transparency (0xFF00FF)
        let col: number;
        if (rgb === 0xff00ff) {
          col = -1; // Transparent
        } else {
          // Convert to 2-bit grayscale (0-3) based on blue channel's lower bits
          col = (b & 0xf) >> 2;
        }
        result.pixels[x + y * img.width] = col;
      }
    }

    (Art as unknown as Record<string, Bitmap | null>)[name] = result;
    return name;
  }

  static getCol(c: number): number {
    let r = (c >> 16) & 0xff;
    let g = (c >> 8) & 0xff;
    let b = c & 0xff;

    r = (r * 0x55) / 0xff;
    g = (g * 0x55) / 0xff;
    b = (b * 0x55) / 0xff;

    return (r << 16) | (g << 8) | b;
  }
}
