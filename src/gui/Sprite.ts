export class Sprite {
  x: number;
  y: number;
  z: number;
  tex: number;
  col: number;
  removed: boolean = false;

  constructor(x: number, y: number, z: number, tex: number, color: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.tex = tex;
    this.col = color;
  }

  tick(): void {}
}
