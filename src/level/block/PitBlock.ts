import { Art } from "../../Art";
import { Sound } from "../../Sound";
import type { Entity } from "../../entities/Entity";
import { BoulderEntity } from "../../entities/BoulderEntity";
import { Block } from "./Block";

export class PitBlock extends Block {
  filled: boolean = false;

  constructor() {
    super();
    this.floorTex = 1;
    this.blocksMotion = true;
    this.floorCol = Art.getCol(0x804040);
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (!this.filled && entity instanceof BoulderEntity) {
      Sound.thud.play();
      this.filled = true;
      this.blocksMotion = false;
      this.floorTex = 0;
      this.floorCol = Art.getCol(0x8a6496);
      entity.remove();
    }
  }

  blocks(entity: Entity): boolean {
    if (entity instanceof BoulderEntity) return false;
    return this.blocksMotion;
  }
}
