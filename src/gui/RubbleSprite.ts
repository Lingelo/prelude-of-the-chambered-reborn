import { Sprite } from "./Sprite";

export class RubbleSprite extends Sprite {
  xa: number;
  ya: number;
  za: number;

  constructor() {
    super(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.5, 2, 0x555555);
    this.xa = Math.random() - 0.5;
    this.ya = Math.random();
    this.za = Math.random() - 0.5;
  }

  tick(): void {
    this.x += this.xa * 0.03;
    this.y += this.ya * 0.03;
    this.z += this.za * 0.03;
    this.ya -= 0.1;
    if (this.y < 0) {
      this.y = 0;
      this.xa *= 0.8;
      this.za *= 0.8;
      if (Math.random() < 0.04) this.removed = true;
    }
  }
}
