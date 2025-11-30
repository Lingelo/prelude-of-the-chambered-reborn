import { Player } from "./entities/Player";
import { Item } from "./entities/Item";
import type { InputHandler } from "./InputHandler";
import { Level } from "./level/Level";
import type { Menu } from "./menu/Menu";
import { TitleMenu } from "./menu/TitleMenu";
import { PauseMenu } from "./menu/PauseMenu";
import { WinMenu } from "./menu/WinMenu";
import { LoseMenu } from "./menu/LoseMenu";

const Keys = {
  W: "w",
  S: "s",
  A: "a",
  D: "d",
  Q: "q",
  E: "e",
  UP: "arrowup",
  DOWN: "arrowdown",
  LEFT: "arrowleft",
  RIGHT: "arrowright",
  SPACE: " ",
  ESCAPE: "escape",
  CTRL: "control",
  ALT: "alt",
  SHIFT: "shift",
  META: "meta",
  NUMPAD_1: "1",
  NUMPAD_2: "2",
  NUMPAD_3: "3",
  NUMPAD_4: "4",
  NUMPAD_5: "5",
  NUMPAD_6: "6",
  NUMPAD_7: "7",
  NUMPAD_8: "8",
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
    this.player!.x = this.level.xSpawn;
    this.player!.z = this.level.ySpawn;
    this.level.getBlock(this.level.xSpawn, this.level.ySpawn).wait = true;
    this.player!.x += Math.sin(this.player!.rot) * 0.2;
    this.player!.z += Math.cos(this.player!.rot) * 0.2;
    this.level.addEntity(this.player!);
  }

  tick(input: InputHandler): void {
    if (this.pauseTime > 0) {
      this.pauseTime--;
      return;
    }

    this.time++;

    const strafe =
      input.isKeyDown(Keys.CTRL) ||
      input.isKeyDown(Keys.ALT) ||
      input.isKeyDown(Keys.META) ||
      input.isKeyDown(Keys.SHIFT);

    const lk = input.isKeyDown(Keys.LEFT) || input.isKeyDown(Keys.NUMPAD_4);
    const rk = input.isKeyDown(Keys.RIGHT) || input.isKeyDown(Keys.NUMPAD_6);

    const up = input.isKeyDown(Keys.W) || input.isKeyDown(Keys.UP) || input.isKeyDown(Keys.NUMPAD_8);
    const down = input.isKeyDown(Keys.S) || input.isKeyDown(Keys.DOWN) || input.isKeyDown(Keys.NUMPAD_2);

    const left = input.isKeyDown(Keys.A) || (strafe && lk);
    const right = input.isKeyDown(Keys.D) || (strafe && rk);

    const turnLeft = input.isKeyDown(Keys.Q) || (!strafe && lk);
    const turnRight = input.isKeyDown(Keys.E) || (!strafe && rk);

    const use = input.isKeyDown(Keys.SPACE);

    const slotKeys = [
      Keys.NUMPAD_1,
      Keys.NUMPAD_2,
      Keys.NUMPAD_3,
      Keys.NUMPAD_4,
      Keys.NUMPAD_5,
      Keys.NUMPAD_6,
      Keys.NUMPAD_7,
      Keys.NUMPAD_8,
    ];
    for (let i = 0; i < 8; i++) {
      if (input.isKeyDown(slotKeys[i]!)) {
        input.clearKey(slotKeys[i]!);
        this.player!.selectedSlot = i;
        this.player!.itemUseTime = 0;
      }
    }

    if (input.isKeyDown(Keys.ESCAPE)) {
      input.clearKey(Keys.ESCAPE);
      if (this.menu == null) {
        this.setMenu(new PauseMenu());
      }
    }

    if (use) {
      input.clearKey(Keys.SPACE);
    }

    if (this.menu != null) {
      input.clearKey(Keys.W);
      input.clearKey(Keys.UP);
      input.clearKey(Keys.NUMPAD_8);
      input.clearKey(Keys.S);
      input.clearKey(Keys.DOWN);
      input.clearKey(Keys.NUMPAD_2);
      input.clearKey(Keys.A);
      input.clearKey(Keys.D);

      this.menu.tick(this, up, down, left, right, use);
    } else {
      this.player!.tick(up, down, left, right, turnLeft, turnRight);
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
