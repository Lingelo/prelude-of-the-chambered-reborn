import { Item } from "../entities/Item";
import { Level } from "./Level";
import { registerLevel } from "./LevelRegistry";

export class TempleLevel extends Level {
  triggerMask: number = 0;
  name = "The Temple";
  floorCol = 0x8a6496;
  ceilCol = 0x8a6496;
  wallCol = 0xcfaddb;

  switchLevel(id: number): void {
    if (id === 1) this.game!.switchLevel("overworld", 3);
  }

  getLoot(id: number): void {
    super.getLoot(id);
    if (id === 1) this.game!.getLoot(Item.skates);
  }

  trigger(id: number, pressed: boolean): void {
    if (id >= 1 && id <= 3) {
      if (pressed) this.triggerMask |= 1 << id;
      else this.triggerMask &= ~(1 << id);

      if (this.triggerMask === 14) {
        super.trigger(1, true);
      }
    } else {
      super.trigger(id, pressed);
    }
  }
}

registerLevel("temple", TempleLevel);
