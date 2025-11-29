import { Player } from "./entities/Player";
import { Item } from "./entities/Item";
import { Level } from "./level/Level";
import type { Menu } from "./menu/Menu";
import { TitleMenu } from "./menu/TitleMenu";
import { PauseMenu } from "./menu/PauseMenu";
import { WinMenu } from "./menu/WinMenu";
import { LoseMenu } from "./menu/LoseMenu";

const Keys = {
  W: 87,
  S: 83,
  A: 65,
  D: 68,
  Q: 81,
  E: 69,
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32,
  ESCAPE: 27,
  CTRL: 17,
  ALT: 18,
  SHIFT: 16,
  META: 91,
  NUMPAD_8: 104,
  NUMPAD_2: 98,
  NUMPAD_4: 100,
  NUMPAD_6: 102,
  ONE: 49,
};

export class Game {
  time: number = 0;
  level: Level | null = null;
  player: Player | null = null;
  pauseTime: number = 0;
  menu: Menu | null = null;

  constructor() {
    this.setMenu(new TitleMenu());
  }

  newGame(): void {
    Level.clear();
    this.level = Level.loadLevel(this, "start");
    this.player = new Player();
    this.player.level = this.level;
    this.level.player = this.player;
    this.player.x = this.level.xSpawn;
    this.player.z = this.level.ySpawn;
    this.level.addEntity(this.player);
    this.player.rot = Math.PI + 0.4;
  }

  switchLevel(name: string, id: number): void {
    this.pauseTime = 30;
    this.level!.removeEntityImmediately(this.player!);
    this.level = Level.loadLevel(this, name);
    this.level.findSpawn(id);
    console.log(`switchLevel to ${name}: spawn found at (${this.level.xSpawn}, ${this.level.ySpawn})`);
    this.player!.x = this.level.xSpawn;
    this.player!.z = this.level.ySpawn;
    this.level.getBlock(this.level.xSpawn, this.level.ySpawn).wait = true;
    this.player!.x += Math.sin(this.player!.rot) * 0.2;
    this.player!.z += Math.cos(this.player!.rot) * 0.2;
    console.log(`Player final position: (${this.player!.x}, ${this.player!.z})`);
    this.level.addEntity(this.player!);
  }

  tick(keys: boolean[]): void {
    if (this.pauseTime > 0) {
      this.pauseTime--;
      return;
    }

    this.time++;

    const strafe = keys[Keys.CTRL] || keys[Keys.ALT] || keys[Keys.META] || keys[Keys.SHIFT];

    const lk = keys[Keys.LEFT] || keys[Keys.NUMPAD_4];
    const rk = keys[Keys.RIGHT] || keys[Keys.NUMPAD_6];

    const up = keys[Keys.W] || keys[Keys.UP] || keys[Keys.NUMPAD_8];
    const down = keys[Keys.S] || keys[Keys.DOWN] || keys[Keys.NUMPAD_2];

    const left = keys[Keys.A] || (strafe && lk);
    const right = keys[Keys.D] || (strafe && rk);

    const turnLeft = keys[Keys.Q] || (!strafe && lk);
    const turnRight = keys[Keys.E] || (!strafe && rk);

    const use = keys[Keys.SPACE];

    for (let i = 0; i < 8; i++) {
      if (keys[Keys.ONE + i]) {
        keys[Keys.ONE + i] = false;
        this.player!.selectedSlot = i;
        this.player!.itemUseTime = 0;
      }
    }

    if (keys[Keys.ESCAPE]) {
      keys[Keys.ESCAPE] = false;
      if (this.menu == null) {
        this.setMenu(new PauseMenu());
      }
    }

    if (use) {
      keys[Keys.SPACE] = false;
    }

    if (this.menu != null) {
      keys[Keys.W] = keys[Keys.UP] = keys[Keys.NUMPAD_8] = false;
      keys[Keys.S] = keys[Keys.DOWN] = keys[Keys.NUMPAD_2] = false;
      keys[Keys.A] = false;
      keys[Keys.D] = false;

      this.menu.tick(this, up ?? false, down ?? false, left ?? false, right ?? false, use ?? false);
    } else {
      this.player!.tick(up ?? false, down ?? false, left ?? false, right ?? false, turnLeft ?? false, turnRight ?? false);
      if (use) {
        this.player!.activate();
      }

      this.level!.tick();
    }
  }

  getLoot(item: Item): void {
    this.player!.addLoot(item);
  }

  win(player: Player): void {
    this.setMenu(new WinMenu(player));
  }

  setMenu(menu: Menu | null): void {
    this.menu = menu;
  }

  lose(player: Player): void {
    this.setMenu(new LoseMenu(player));
  }
}
