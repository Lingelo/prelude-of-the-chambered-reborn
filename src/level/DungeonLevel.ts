import type { Game } from "../Game";
import { Item } from "../entities/Item";
import { Level } from "./Level";
import { registerLevel } from "./LevelRegistry";

export class DungeonLevel extends Level {
  name = "The Dungeons";
  wallCol = 0xc64954;
  floorCol = 0x8e4a51;
  ceilCol = 0x8e4a51;

  init(game: Game, name: string, w: number, h: number, pixels: number[]): void {
    super.init(game, name, w, h, pixels);
    this.trigger(6, true);
    this.trigger(7, true);
  }

  switchLevel(id: number): void {
    if (id === 1) this.game!.switchLevel("start", 2);
  }

  getLoot(id: number): void {
    super.getLoot(id);
    if (id === 1) this.game!.getLoot(Item.powerGlove);
  }

  trigger(id: number, pressed: boolean): void {
    super.trigger(id, pressed);
    if (id === 5) super.trigger(6, !pressed);
    if (id === 4) super.trigger(7, !pressed);
  }
}

registerLevel("dungeon", DungeonLevel);
