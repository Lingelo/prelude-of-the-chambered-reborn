import { Level } from "./Level";
import { registerLevel } from "./LevelRegistry";

export class StartLevel extends Level {
  name = "The Prison";

  switchLevel(id: number): void {
    if (id === 1) this.game!.switchLevel("overworld", 1);
    if (id === 2) this.game!.switchLevel("dungeon", 1);
  }
}

registerLevel("start", StartLevel);
