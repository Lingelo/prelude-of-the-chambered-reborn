import { Art } from "../../Art";
import { Sound } from "../../Sound";
import { Sprite } from "../../gui/Sprite";
import type { Entity } from "../../entities/Entity";
import { GhostEntity } from "../../entities/GhostEntity";
import { GhostBossEntity } from "../../entities/GhostBossEntity";
import { KeyEntity } from "../../entities/KeyEntity";
import { Block } from "./Block";

export class AltarBlock extends Block {
  filled: boolean = false;
  altarSprite: Sprite;

  constructor() {
    super();
    this.altarSprite = new Sprite(0.5, 0, 0.5, 16 + 4, Art.getCol(0xe2ffe4));
    this.sprites.push(this.altarSprite);
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (!this.filled && (entity instanceof GhostEntity || entity instanceof GhostBossEntity)) {
      Sound.altar.play();
      entity.remove();
      this.altarSprite.col = Art.getCol(0x00ff00);
      this.filled = true;
      if (entity instanceof GhostBossEntity) {
        Sound.bosskill.play();
        this.level!.addEntity(new KeyEntity(this.x, this.y));
      }
    }
  }

  blocks(_entity: Entity): boolean {
    return this.blocksMotion;
  }
}
