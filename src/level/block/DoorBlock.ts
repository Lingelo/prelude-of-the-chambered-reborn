import { Sound } from "../../Sound";
import type { Entity } from "../../entities/Entity";
import { Player } from "../../entities/Player";
import { Bullet } from "../../entities/Bullet";
import { OgreEntity } from "../../entities/OgreEntity";
import type { Level } from "../Level";
import type { Item } from "../../entities/Item";
import { SolidBlock } from "./SolidBlock";

export class DoorBlock extends SolidBlock {
  open: boolean = false;
  openness: number = 0;

  constructor() {
    super();
    this.tex = 4;
    this.solidRender = false;
  }

  use(_level: Level, _item: Item): boolean {
    if (this.openness >= 1) return false; // Let attack pass through open door
    this.open = !this.open;
    if (this.open) {
      Sound.click1.play();
    } else {
      Sound.click2.play();
    }
    return true;
  }

  tick(): void {
    super.tick();
    if (this.open) this.openness += 0.2;
    else this.openness -= 0.2;
    if (this.openness < 0) this.openness = 0;
    if (this.openness > 1) this.openness = 1;
  }

  blocks(entity: Entity): boolean {
    if (this.openness >= 1) {
      if (entity instanceof Player) return false;
      if (entity instanceof Bullet) return false;
      if (entity instanceof OgreEntity) return false;
    }
    return this.blocksMotion;
  }
}
