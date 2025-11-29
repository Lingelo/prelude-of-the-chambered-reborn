import type { Entity } from "../../entities/Entity";
import { Player } from "../../entities/Player";
import { Block } from "./Block";

export class WinBlock extends Block {
  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (entity instanceof Player) {
      (entity as Player).win();
    }
  }
}
