import { Art } from "../../Art";
import { Sound } from "../../Sound";
import { Sprite } from "../../gui/Sprite";
import type { Entity } from "../../entities/Entity";
import { Player } from "../../entities/Player";
import { Block } from "./Block";

export class LadderBlock extends Block {
  static readonly LADDER_COLOR = 0xdb8e53;

  wait: boolean = false;
  down: boolean;

  constructor(down: boolean) {
    super();
    this.down = down;
    if (down) {
      this.floorTex = 1;
      this.sprites.push(new Sprite(0, 0, 0, 8 + 3, Art.getCol(LadderBlock.LADDER_COLOR)));
    } else {
      this.ceilTex = 1;
      this.sprites.push(new Sprite(0, 0, 0, 8 + 4, Art.getCol(LadderBlock.LADDER_COLOR)));
    }
  }

  removeEntity(entity: Entity): void {
    super.removeEntity(entity);
    if (entity instanceof Player) {
      this.wait = false;
    }
  }

  addEntity(entity: Entity): void {
    super.addEntity(entity);
    if (entity instanceof Player && !this.wait) {
      Sound.ladder.play();
      this.level!.switchLevel(this.id);
    }
  }
}
