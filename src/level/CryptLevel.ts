import { Item } from "../entities/Item";
import { Level } from "./Level";
import { registerLevel } from "./LevelRegistry";

export class CryptLevel extends Level {
  name = "The Crypt";
  floorCol = 0x404040;
  ceilCol = 0x404040;
  wallCol = 0x404040;

  switchLevel(id: number): void {
    if (id === 1) this.game!.switchLevel("overworld", 2);
  }

  getLoot(id: number): void {
    super.getLoot(id);
    if (id === 1) this.game!.getLoot(Item.flippers);
  }
}

registerLevel("crypt", CryptLevel);
