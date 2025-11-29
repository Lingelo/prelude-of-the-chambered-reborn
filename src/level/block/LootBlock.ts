import { Art } from "../../Art";
import { Sound } from "../../Sound";
import { Sprite } from "../../gui/Sprite";
import type { Entity } from "../../entities/Entity";
import { Player } from "../../entities/Player";
import { Block } from "./Block";

export class LootBlock extends Block {
  taken: boolean = false;
  lootSprite: Sprite;

  constructor() {
    super();
    this.blocksMotion = true;
    this.lootSprite = new Sprite(0, 0, 0, 16 + 2, Art.getCol(0xffff80));
    this.sprites.push(this.lootSprite);
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (!this.taken && entity instanceof Player) {
      this.taken = true;
      this.lootSprite.removed = true;
      Sound.pickup.play();
      (entity as Player).loot++;
      this.level!.getLoot(this.id);
    }
  }

  blocks(entity: Entity): boolean {
    if (entity instanceof Player) return false;
    return this.blocksMotion;
  }
}
