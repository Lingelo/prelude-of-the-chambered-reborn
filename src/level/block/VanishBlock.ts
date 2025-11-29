import { Sound } from "../../Sound";
import { RubbleSprite } from "../../gui/RubbleSprite";
import type { Item } from "../../entities/Item";
import type { Level } from "../Level";
import { SolidBlock } from "./SolidBlock";

export class VanishBlock extends SolidBlock {
  gone: boolean = false;

  constructor() {
    super();
    this.tex = 1;
  }

  use(_level: Level, _item: Item): boolean {
    if (this.gone) return false;

    this.gone = true;
    this.blocksMotion = false;
    this.solidRender = false;
    Sound.crumble.play();

    for (let i = 0; i < 32; i++) {
      const sprite = new RubbleSprite();
      sprite.col = this.col;
      this.addSprite(sprite);
    }
    return true;
  }
}
