import { Sound } from "../../Sound";
import type { Entity } from "../../entities/Entity";
import { BoulderEntity } from "../../entities/BoulderEntity";
import { Sprite } from "../../gui/Sprite";
import { Block } from "./Block";

export class PitBlock extends Block {
  filled: boolean = false;

  constructor() {
    super();
    this.floorTex = 1;
    this.blocksMotion = true;
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (!this.filled && entity instanceof BoulderEntity) {
      entity.remove();
      this.filled = true;
      this.blocksMotion = false;
      this.addSprite(new Sprite(0, 0, 0, 8 + 2, BoulderEntity.COLOR));
      Sound.thud.play();
    }
  }

  blocks(entity: Entity): boolean {
    if (entity instanceof BoulderEntity) return false;
    return this.blocksMotion;
  }
}
