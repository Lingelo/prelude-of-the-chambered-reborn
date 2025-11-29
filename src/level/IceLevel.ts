import { Item } from "../entities/Item";
import { Level } from "./Level";
import { registerLevel } from "./LevelRegistry";

export class IceLevel extends Level {
  name = "The Frost Cave";
  ceilCol = 0xb8dbe0;
  floorCol = 0xb8dbe0;
  wallCol = 0x6be8ff;

  switchLevel(id: number): void {
    if (id === 1) this.game!.switchLevel("overworld", 5);
  }

  getLoot(id: number): void {
    super.getLoot(id);
    if (id === 1) this.game!.getLoot(Item.skates);
  }
}

registerLevel("ice", IceLevel);
