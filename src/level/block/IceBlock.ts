import { Art } from "../../Art";
import { Config } from "../../Config";
import type { Entity } from "../../entities/Entity";
import { Item } from "../../entities/Item";
import { Player } from "../../entities/Player";
import { Bullet } from "../../entities/Bullet";
import { EyeEntity } from "../../entities/EyeEntity";
import { EyeBossEntity } from "../../entities/EyeBossEntity";
import { Block } from "./Block";

export class IceBlock extends Block {
  constructor() {
    super();
    this.blocksMotion = false;
    this.floorTex = 16;
  }

  tick(): void {
    super.tick();
    this.floorCol = Art.getCol(0x8080ff);
  }

  getWalkSpeed(player: Player): number {
    if (player.getSelectedItem() === Item.skates) {
      return 0.05;
    }
    return 1.4;
  }

  getFriction(player: Player): number {
    if (player.getSelectedItem() === Item.skates) {
      return Config.FRICTION_ICE;
    }
    return 1.0;
  }

  blocks(entity: Entity): boolean {
    if (entity instanceof Player) return false;
    if (entity instanceof Bullet) return false;
    if (entity instanceof EyeEntity) return false;
    if (entity instanceof EyeBossEntity) return false;
    return this.blocksMotion;
  }
}
