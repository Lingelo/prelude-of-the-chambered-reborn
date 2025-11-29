import { Item } from "../entities/Item";
import { Level } from "./Level";
import { registerLevel } from "./LevelRegistry";

export class OverworldLevel extends Level {
  name = "The Island";
  ceilTex = -1;
  floorCol = 0x508253;
  floorTex = 8 * 3;
  wallCol = 0xa0a0a0;

  switchLevel(id: number): void {
    if (id === 1) this.game!.switchLevel("start", 1);
    if (id === 2) this.game!.switchLevel("crypt", 1);
    if (id === 3) this.game!.switchLevel("temple", 1);
    if (id === 5) this.game!.switchLevel("ice", 1);
  }

  getLoot(id: number): void {
    super.getLoot(id);
    if (id === 1) this.game!.getLoot(Item.cutters);
  }
}

registerLevel("overworld", OverworldLevel);
