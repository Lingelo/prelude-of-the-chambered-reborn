import type { Item } from "../../entities/Item";
import type { Level } from "../Level";
import { DoorBlock } from "./DoorBlock";

export class LockedDoorBlock extends DoorBlock {
  constructor() {
    super();
    this.tex = 5;
  }

  use(_level: Level, _item: Item): boolean {
    return false;
  }

  trigger(pressed: boolean): void {
    this.open = pressed;
  }
}
