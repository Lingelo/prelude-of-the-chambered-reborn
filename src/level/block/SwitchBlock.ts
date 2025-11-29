import { Sound } from "../../Sound";
import type { Item } from "../../entities/Item";
import type { Level } from "../Level";
import { SolidBlock } from "./SolidBlock";

export class SwitchBlock extends SolidBlock {
  pressed: boolean = false;

  constructor() {
    super();
    this.tex = 2;
  }

  use(level: Level, _item: Item): boolean {
    this.pressed = !this.pressed;
    this.tex = this.pressed ? 3 : 2;
    level.trigger(this.id, this.pressed);
    if (this.pressed) Sound.click1.play();
    else Sound.click2.play();
    return true;
  }
}
