import { Sound } from "../../Sound";
import type { Entity } from "../../entities/Entity";
import { Block } from "./Block";

export class PressurePlateBlock extends Block {
  pressed: boolean = false;

  constructor() {
    super();
    this.floorTex = 2;
  }

  tick(): void {
    super.tick();
    const r = 0.2;
    const steppedOn = this.level!.containsBlockingNonFlyingEntity(
      this.x - r,
      this.y - r,
      this.x + r,
      this.y + r
    );

    if (steppedOn !== this.pressed) {
      this.pressed = steppedOn;
      if (this.pressed) {
        this.floorTex = 3;
        Sound.click1.play();
      } else {
        this.floorTex = 2;
        Sound.click2.play();
      }
      this.level!.trigger(this.id, this.pressed);
    }
  }

  getFloorHeight(_e: Entity): number {
    return this.pressed ? -0.02 : 0.02;
  }
}
