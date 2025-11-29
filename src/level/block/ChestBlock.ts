import { Art } from "../../Art";
import { Sound } from "../../Sound";
import { Sprite } from "../../gui/Sprite";
import type { Item } from "../../entities/Item";
import type { Level } from "../Level";
import { Block } from "./Block";

export class ChestBlock extends Block {
  open: boolean = false;
  chestSprite: Sprite;

  constructor() {
    super();
    this.tex = 1;
    this.blocksMotion = true;
    this.chestSprite = new Sprite(0, 0, 0, 8 * 2 + 0, Art.getCol(0xffff00));
    this.sprites.push(this.chestSprite);
  }

  use(level: Level, _item: Item): boolean {
    if (this.open) return false;

    this.open = true;
    this.chestSprite.tex++;
    Sound.treasure.play();
    level.player!.loot++;
    level.getLoot(this.id);
    return true;
  }
}
