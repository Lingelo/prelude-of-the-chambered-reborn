import { Art } from "../../Art";
import { Sprite } from "../../gui/Sprite";
import type { Entity } from "../../entities/Entity";
import { Bullet } from "../../entities/Bullet";
import { Block } from "./Block";

export class SpiritWallBlock extends Block {
  constructor() {
    super();
    this.blocksMotion = true;
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 0.8;
      const y = (Math.random() - 0.5) * 0.8;
      const z = (Math.random() - 0.5) * 0.8;
      this.sprites.push(new Sprite(0.5 + x, y, 0.5 + z, 4 * 8 + 6, Art.getCol(0x4a4a6a)));
    }
  }

  blocks(entity: Entity): boolean {
    if (entity instanceof Bullet) return false;
    return this.blocksMotion;
  }
}
