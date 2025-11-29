import { Art } from "../Art";

export class Bitmap {
  static readonly chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?\"'/\\<>()[]{}" +
    "abcdefghijklmnopqrstuvwxyz_               " +
    "0123456789+-=*:;♥♦↑↓                      ";

  width: number;
  height: number;
  pixels: number[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = new Array(width * height);
  }

  draw(bitmap: Bitmap, xOffs: number, yOffs: number): void {
    xOffs <<= 0;
    yOffs <<= 0;

    for (let y = 0; y < bitmap.height; y++) {
      const yPix = y + yOffs;
      if (yPix < 0 || yPix >= this.height) continue;

      for (let x = 0; x < bitmap.width; x++) {
        const xPix = x + xOffs;
        if (xPix < 0 || xPix >= this.width) continue;

        const src = bitmap.pixels[x + y * bitmap.width];
        this.pixels[xPix + yPix * this.width] = src!;
      }
    }
  }

  flipDraw(bitmap: Bitmap, xOffs: number, yOffs: number): void {
    xOffs <<= 0;
    yOffs <<= 0;

    for (let y = 0; y < bitmap.height; y++) {
      const yPix = y + yOffs;
      if (yPix < 0 || yPix >= this.height) continue;

      for (let x = 0; x < bitmap.width; x++) {
        const xPix = xOffs + bitmap.width - x - 1;
        if (xPix < 0 || xPix >= this.width) continue;

        const src = bitmap.pixels[x + y * bitmap.width];
        this.pixels[xPix + yPix * this.width] = src!;
      }
    }
  }

  drawPart(
    bitmap: Bitmap,
    xOffs: number,
    yOffs: number,
    xo: number,
    yo: number,
    w: number,
    h: number,
    col: number
  ): void {
    xOffs <<= 0;
    yOffs <<= 0;
    xo <<= 0;
    yo <<= 0;
    w <<= 0;
    h <<= 0;

    for (let y = 0; y < h; y++) {
      const yPix = y + yOffs;
      if (yPix < 0 || yPix >= this.height) continue;

      for (let x = 0; x < w; x++) {
        const xPix = x + xOffs;
        if (xPix < 0 || xPix >= this.width) continue;

        const src = bitmap.pixels[x + xo + (y + yo) * bitmap.width]!;
        if (src >= 0) {
          this.pixels[xPix + yPix * this.width] = src * col;
        }
      }
    }
  }

  scaleDraw(
    bitmap: Bitmap,
    scale: number,
    xOffs: number,
    yOffs: number,
    xo: number,
    yo: number,
    w: number,
    h: number,
    col: number
  ): void {
    for (let y = 0; y < h * scale; y++) {
      const yPix = y + yOffs;
      if (yPix < 0 || yPix >= this.height) continue;

      for (let x = 0; x < w * scale; x++) {
        const xPix = x + xOffs;
        if (xPix < 0 || xPix >= this.width) continue;

        const src =
          bitmap.pixels[((x / scale) << 0) + xo + (((y / scale) << 0) + yo) * bitmap.width]!;
        if (src >= 0) {
          this.pixels[xPix + yPix * this.width] = src * col;
        }
      }
    }
  }

  drawString(str: string, x: number, y: number, col: number): void {
    x <<= 0;
    y <<= 0;

    for (let i = 0; i < str.length; i++) {
      const ch = Bitmap.chars.indexOf(str[i]!);
      if (ch < 0) continue;

      const xx = ch % 42;
      const yy = (ch / 42) << 0;
      this.drawPart(Art.font!, x + i * 6, y, xx * 6, yy * 8, 5, 8, col);
    }
  }

  fill(x0: number, y0: number, x1: number, y1: number, color: number): void {
    x0 <<= 0;
    y0 <<= 0;
    x1 <<= 0;
    y1 <<= 0;

    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        this.pixels[x + y * this.width] = color;
      }
    }
  }
}
