import { Art } from "../../Art";
import { Sound } from "../../Sound";
import { Sprite } from "../../gui/Sprite";
import type { Entity } from "../../entities/Entity";
import { Item } from "../../entities/Item";
import { Player } from "../../entities/Player";
import { Bullet } from "../../entities/Bullet";
import type { Level } from "../Level";
import { Block } from "./Block";

export class BarsBlock extends Block {
  barsSprite: Sprite;
  open: boolean = false;

  constructor() {
    super();
    this.blocksMotion = true;
    this.barsSprite = new Sprite(0, 0, 0, 8, Art.getCol(0x202020));
    this.sprites.push(this.barsSprite);
  }

  use(_level: Level, item: Item): boolean {
    if (item === Item.cutters) {
      this.open = true;
      this.barsSprite.removed = true;
      Sound.cut.play();
      return true;
    }
    return false;
  }

  blocks(entity: Entity): boolean {
    if (this.open) {
      if (entity instanceof Player) return false;
      if (entity instanceof Bullet) return false;
    }
    return this.blocksMotion;
  }
}
