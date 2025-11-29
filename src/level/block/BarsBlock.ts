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
    this.barsSprite = new Sprite(0, 0, 0, 0, 0x202020);
    this.sprites.push(this.barsSprite);
  }

  use(_level: Level, item: Item): boolean {
    if (this.open) return false;

    if (item === Item.cutters) {
      Sound.cut.play();
      this.barsSprite.tex = 1;
      this.open = true;
    }

    return true;
  }

  blocks(entity: Entity): boolean {
    if (this.open) {
      if (entity instanceof Player) return false;
      if (entity instanceof Bullet) return false;
    }
    return this.blocksMotion;
  }
}
