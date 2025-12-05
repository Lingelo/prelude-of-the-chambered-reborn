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
  // AZERTY number row (unshifted)
  AZERTY_1: "&",
  AZERTY_2: "é",
  AZERTY_3: '"',
  AZERTY_4: "'",
  AZERTY_5: "(",
  AZERTY_6: "-",
  AZERTY_7: "è",
  AZERTY_8: "_",
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

    // Check for item slot selection FIRST to give it priority over movement
    const slotKeys = [
      [Keys.NUMPAD_1, Keys.AZERTY_1],  // Slot 0: "1" or "&"
      [Keys.NUMPAD_2, Keys.AZERTY_2],  // Slot 1: "2" or "é"
      [Keys.NUMPAD_3, Keys.AZERTY_3],  // Slot 2: "3" or '"'
      [Keys.NUMPAD_4, Keys.AZERTY_4],  // Slot 3: "4" or "'"
      [Keys.NUMPAD_5, Keys.AZERTY_5],  // Slot 4: "5" or "("
      [Keys.NUMPAD_6, Keys.AZERTY_6],  // Slot 5: "6" or "-"
      [Keys.NUMPAD_7, Keys.AZERTY_7],  // Slot 6: "7" or "è"
      [Keys.NUMPAD_8, Keys.AZERTY_8],  // Slot 7: "8" or "_"
    ];
    let slotSelected = false;
    for (let i = 0; i < 8; i++) {
      const keys = slotKeys[i]!;
      if (input.isKeyDown(keys[0]!) || input.isKeyDown(keys[1]!)) {
        input.clearKey(keys[0]!);
        input.clearKey(keys[1]!);
        this.player!.selectedSlot = i;
        this.player!.itemUseTime = 0;
        slotSelected = true;
        break;
      }
    }

    const strafe =
      input.isKeyDown(Keys.CTRL) ||
      input.isKeyDown(Keys.ALT) ||
      input.isKeyDown(Keys.META) ||
      input.isKeyDown(Keys.SHIFT);

    // Only use numpad keys for movement if no slot was selected this tick
    const lk = input.isKeyDown(Keys.LEFT) || (!slotSelected && input.isKeyDown(Keys.NUMPAD_4));
    const rk = input.isKeyDown(Keys.RIGHT) || (!slotSelected && input.isKeyDown(Keys.NUMPAD_6));

    const up = input.isKeyDown(Keys.W) || input.isKeyDown(Keys.UP) || (!slotSelected && input.isKeyDown(Keys.NUMPAD_8));
    const down = input.isKeyDown(Keys.S) || input.isKeyDown(Keys.DOWN) || (!slotSelected && input.isKeyDown(Keys.NUMPAD_2));

    const left = input.isKeyDown(Keys.A) || (strafe && lk);
    const right = input.isKeyDown(Keys.D) || (strafe && rk);

    const turnLeft = input.isKeyDown(Keys.Q) || (!strafe && lk);
    const turnRight = input.isKeyDown(Keys.E) || (!strafe && rk);

    const use = input.isKeyDown(Keys.SPACE);

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
