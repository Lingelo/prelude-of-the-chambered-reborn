import { Art } from "../../Art";
import { Sound } from "../../Sound";
import { Sprite } from "../../gui/Sprite";
import { RubbleSprite } from "../../gui/RubbleSprite";
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
    this.blocksMotion = true;
    this.altarSprite = new Sprite(0, 0, 0, 16 + 4, Art.getCol(0xe2ffe4));
    this.sprites.push(this.altarSprite);
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (!this.filled && (entity instanceof GhostEntity || entity instanceof GhostBossEntity)) {
      entity.remove();
      this.filled = true;
      this.blocksMotion = false;
      this.altarSprite.removed = true;

      for (let i = 0; i < 8; i++) {
        const rubble = new RubbleSprite();
        rubble.col = this.altarSprite.col;
        this.addSprite(rubble);
      }

      if (entity instanceof GhostBossEntity) {
        this.level!.addEntity(new KeyEntity(this.x, this.y));
        Sound.bosskill.play();
      } else {
        Sound.altar.play();
      }
    }
  }

  blocks(_entity: Entity): boolean {
    return this.blocksMotion;
  }
}
