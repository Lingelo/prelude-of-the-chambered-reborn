import { Art } from "../../Art";
import type { Entity } from "../../entities/Entity";
import { Item } from "../../entities/Item";
import { Player } from "../../entities/Player";
import { Bullet } from "../../entities/Bullet";
import { Block } from "./Block";

export class WaterBlock extends Block {
  steps: number = 0;

  constructor() {
    super();
    this.blocksMotion = true;
  }

  tick(): void {
    super.tick();
    this.steps++;
    this.floorTex = ((this.steps / 8) & 1) + 8;
    this.floorCol = Art.getCol(0x0000ff);
  }

  blocks(entity: Entity): boolean {
    if (entity instanceof Player) {
      if ((entity as Player).getSelectedItem() === Item.flippers) return false;
    }
    if (entity instanceof Bullet) return false;
    return this.blocksMotion;
  }

  getFloorHeight(_e: Entity): number {
    return -0.5;
  }

  getWalkSpeed(_player: Player): number {
    return 0.4;
  }
}
