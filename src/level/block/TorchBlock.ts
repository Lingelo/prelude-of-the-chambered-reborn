import { Art } from "../../Art";
import { Sprite } from "../../gui/Sprite";
import type { Level } from "../Level";
import { Block } from "./Block";
import { VanishBlock } from "./VanishBlock";

export class TorchBlock extends Block {
  torchSprite: Sprite;

  constructor() {
    super();
    this.torchSprite = new Sprite(0, 0, 0, 3, Art.getCol(0xffff00));
    this.sprites.push(this.torchSprite);
  }

  decorate(level: Level, x: number, y: number): void {
    const r = 0.4;

    for (let i = 0; i < 1000; i++) {
      const face = (Math.random() * 4) << 0;
      let block;

      block = level.getBlock(x - 1, y);
      if (face === 0 && block.solidRender && !(block instanceof VanishBlock)) {
        this.torchSprite.x -= r;
        break;
      }

      block = level.getBlock(x, y - 1);
      if (face === 1 && block.solidRender && !(block instanceof VanishBlock)) {
        this.torchSprite.z -= r;
        break;
      }

      block = level.getBlock(x + 1, y);
      if (face === 2 && block.solidRender && !(block instanceof VanishBlock)) {
        this.torchSprite.x += r;
        break;
      }

      block = level.getBlock(x, y + 1);
      if (face === 3 && block.solidRender && !(block instanceof VanishBlock)) {
        this.torchSprite.z += r;
        break;
      }
    }
  }

  tick(): void {
    super.tick();
    const br = 1 - Math.random() * Math.random() * Math.random() * 0.6;
    const rr = (Math.random() * 40) << 0;
    this.torchSprite.col = Art.getCol(
      (((0xff * br) << 0) << 16) | ((((0xff - rr) * br) << 0) << 8) | (((0x00 * br) << 0) << 0)
    );
  }
}
