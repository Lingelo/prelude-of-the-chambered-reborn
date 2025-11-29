import { Sprite } from "./Sprite";

export class PoofSprite extends Sprite {
  life: number = 20;

  constructor(x: number, y: number, z: number) {
    super(x, y, z, 5, 0x222222);
  }

  tick(): void {
    if (this.life-- <= 0) this.removed = true;
  }
}
