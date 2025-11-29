import { Sound } from "../../Sound";
import type { Item } from "../../entities/Item";
import type { Level } from "../Level";
import { SolidBlock } from "./SolidBlock";

export class FinalUnlockBlock extends SolidBlock {
  pressed: boolean = false;

  constructor() {
    super();
    this.tex = 8 + 3;
  }

  use(level: Level, _item: Item): boolean {
    if (level.player!.keys >= 4) {
      Sound.click1.play();
      level.trigger(this.id, !this.pressed);
      this.pressed = !this.pressed;
      return true;
    }
    return false;
  }
}
