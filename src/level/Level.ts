import { Art } from "../Art";
import type { Game } from "../Game";
import type { Entity } from "../entities/Entity";
import { Item } from "../entities/Item";
import type { Player } from "../entities/Player";
import { BatEntity } from "../entities/BatEntity";
import { BatBossEntity } from "../entities/BatBossEntity";
import { OgreEntity } from "../entities/OgreEntity";
import { BossOgre } from "../entities/BossOgre";
import { EyeEntity } from "../entities/EyeEntity";
import { EyeBossEntity } from "../entities/EyeBossEntity";
import { GhostEntity } from "../entities/GhostEntity";
import { GhostBossEntity } from "../entities/GhostBossEntity";
import { BoulderEntity } from "../entities/BoulderEntity";
import { GotLootMenu } from "../menu/GotLootMenu";
import { createLevel } from "./LevelRegistry";
import { LevelColors } from "./LevelColors";
import { Block } from "./block/Block";
import { SolidBlock } from "./block/SolidBlock";
import { DoorBlock } from "./block/DoorBlock";
import { LockedDoorBlock } from "./block/LockedDoorBlock";
import { AltarBlock } from "./block/AltarBlock";
import { BarsBlock } from "./block/BarsBlock";
import { ChestBlock } from "./block/ChestBlock";
import { FinalUnlockBlock } from "./block/FinalUnlockBlock";
import { IceBlock } from "./block/IceBlock";
import { LadderBlock } from "./block/LadderBlock";
import { LootBlock } from "./block/LootBlock";
import { PitBlock } from "./block/PitBlock";
import { PressurePlateBlock } from "./block/PressurePlateBlock";
import { SpiritWallBlock } from "./block/SpiritWallBlock";
import { SwitchBlock } from "./block/SwitchBlock";
import { TorchBlock } from "./block/TorchBlock";
import { VanishBlock } from "./block/VanishBlock";
import { WaterBlock } from "./block/WaterBlock";
import { WinBlock } from "./block/WinBlock";

export class Level {
  static loaded: Record<string, Level> = {};
  static pixels: Record<string, number[]> = {};
  static dims: Record<string, { w: number; h: number }> = {};

  blocks: Block[] = [];
  width: number = 0;
  height: number = 0;

  xSpawn: number = 0;
  ySpawn: number = 0;

  wallCol: number = 0xb3cee2;
  floorCol: number = 0x9ca09b;
  ceilCol: number = 0x9ca09b;

  wallTex: number = 0;
  floorTex: number = 0;
  ceilTex: number = 0;

  entities: Entity[] = [];
  game: Game | null = null;
  name: string = "";

  player: Player | null = null;
  solidWall: SolidBlock | null = null;

  static clear(): void {
    Level.loaded = {};
  }

  static async loadLevelBitmap(name: string): Promise<string> {
    const response = await fetch(`res/level/${name}.png`);
    const blob = await response.blob();
    const img = await createImageBitmap(blob, { colorSpaceConversion: "none" });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const pixels: number[] = new Array(img.width * img.height);

    for (let i = 0; i < pixels.length; i++) {
      const r = imageData.data[i * 4]!;
      const g = imageData.data[i * 4 + 1]!;
      const b = imageData.data[i * 4 + 2]!;
      const a = imageData.data[i * 4 + 3]!;
      // Use >>> 0 to convert to unsigned 32-bit integer
      pixels[i] = ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
    }

    Level.pixels[name] = pixels;
    Level.dims[name] = { w: img.width, h: img.height };
    return name;
  }

  static loadLevel(game: Game, name: string): Level {
    if (name in Level.loaded) return Level.loaded[name]!;
    const level = Level.byName(name);
    const dims = Level.dims[name]!;
    level.init(game, name, dims.w, dims.h, Level.pixels[name]!);
    Level.loaded[name] = level;
    return level;
  }

  static byName(name: string): Level {
    return createLevel(name);
  }

  init(game: Game, _name: string, w: number, h: number, pixels: number[]): void {
    this.game = game;
    this.player = game.player;

    this.solidWall = new SolidBlock();
    this.solidWall.col = Art.getCol(this.wallCol);
    this.solidWall.tex = this.wallTex;
    this.width = w;
    this.height = h;
    this.blocks = new Array(w * h);
    this.entities = [];

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const col = pixels[x + y * w]! & 0xffffff;
        const id = 255 - ((pixels[x + y * w]! >>> 24) & 0xff);

        const block = this.getNewBlock(x, y, col);
        block.id = id;

        if (block.tex === -1) block.tex = this.wallTex;
        if (block.floorTex === -1) block.floorTex = this.floorTex;
        if (block.ceilTex === -1) block.ceilTex = this.ceilTex;
        if (block.col === -1) block.col = Art.getCol(this.wallCol);
        if (block.floorCol === -1) block.floorCol = Art.getCol(this.floorCol);
        if (block.ceilCol === -1) block.ceilCol = Art.getCol(this.ceilCol);

        block.level = this;
        block.x = x;
        block.y = y;
        this.blocks[x + y * w] = block;
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const col = pixels[x + y * w]! & 0xffffff;
        this.decorateBlock(x, y, this.blocks[x + y * w]!, col);
      }
    }
  }

  addEntity(e: Entity): void {
    this.entities.push(e);
    e.level = this;
    e.updatePos();
  }

  removeEntityImmediately(player: Player): void {
    const index = this.entities.indexOf(player);
    if (index >= 0) {
      this.entities.splice(index, 1);
    }
    this.getBlock(player.xTileO, player.zTileO).removeEntity(player);
  }

  decorateBlock(x: number, y: number, block: Block, col: number): void {
    block.decorate(this, x, y);
    if (col === LevelColors.SPAWN) {
      this.xSpawn = x;
      this.ySpawn = y;
    }
    if (col === LevelColors.BOULDER) this.addEntity(new BoulderEntity(x, y));
    if (col === LevelColors.BAT) this.addEntity(new BatEntity(x, y));
    if (col === LevelColors.BAT_BOSS) this.addEntity(new BatBossEntity(x, y));
    if (col === LevelColors.OGRE) this.addEntity(new OgreEntity(x, y));
    if (col === LevelColors.OGRE_BOSS) this.addEntity(new BossOgre(x, y));
    if (col === LevelColors.EYE) this.addEntity(new EyeEntity(x, y));
    if (col === LevelColors.EYE_BOSS) this.addEntity(new EyeBossEntity(x, y));
    if (col === LevelColors.GHOST) this.addEntity(new GhostEntity(x, y));
    if (col === LevelColors.GHOST_BOSS) this.addEntity(new GhostBossEntity(x, y));
    if (col === LevelColors.DARK_FLOOR || col === LevelColors.GHOST_BOSS) {
      block.floorTex = 7;
      block.ceilTex = 7;
    }

    if (col === LevelColors.DOOR) block.col = Art.getCol(0xa0a0a0);
    if (col === LevelColors.LOCKED_DOOR) block.col = Art.getCol(0xa0a0a0);
    if (col === LevelColors.WOOD_FLOOR) {
      block.floorCol = Art.getCol(0xb56600);
      block.floorTex = 3 * 8 + 1;
    }

    if (col === LevelColors.SOLID_GREEN) {
      block.col = Art.getCol(0x2aaf33);
      block.tex = 8;
    }
  }

  getNewBlock(_x: number, _y: number, col: number): Block {
    if (col === LevelColors.SOLID_GREEN) return new SolidBlock();
    if (col === LevelColors.PIT) return new PitBlock();
    if (col === LevelColors.SOLID) return new SolidBlock();
    if (col === LevelColors.VANISH) return new VanishBlock();
    if (col === LevelColors.CHEST) return new ChestBlock();
    if (col === LevelColors.WATER) return new WaterBlock();
    if (col === LevelColors.TORCH) return new TorchBlock();
    if (col === LevelColors.BARS) return new BarsBlock();
    if (col === LevelColors.LADDER_DOWN) return new LadderBlock(false);
    if (col === LevelColors.LADDER_UP) return new LadderBlock(true);
    if (col === LevelColors.LOOT) return new LootBlock();
    if (col === LevelColors.DOOR) return new DoorBlock();
    if (col === LevelColors.SWITCH) return new SwitchBlock();
    if (col === LevelColors.PRESSURE_PLATE) return new PressurePlateBlock();
    if (col === LevelColors.EYE_BOSS) return new IceBlock();
    if (col === LevelColors.ICE) return new IceBlock();
    if (col === LevelColors.LOCKED_DOOR) return new LockedDoorBlock();
    if (col === LevelColors.ALTAR) return new AltarBlock();
    if (col === LevelColors.SPIRIT_WALL) return new SpiritWallBlock();
    if (col === LevelColors.DARK_FLOOR) return new Block();
    if (col === LevelColors.FINAL_UNLOCK) return new FinalUnlockBlock();
    if (col === LevelColors.WIN) return new WinBlock();

    return new Block();
  }

  getBlock(x: number, y: number): Block {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return this.solidWall!;
    }
    return this.blocks[x + y * this.width]!;
  }

  containsBlockingEntity(x0: number, y0: number, x1: number, y1: number): boolean {
    const xc = Math.floor((x1 + x0) / 2);
    const zc = Math.floor((y1 + y0) / 2);
    const rr = 2;
    for (let z = zc - rr; z <= zc + rr; z++) {
      for (let x = xc - rr; x <= xc + rr; x++) {
        const es = this.getBlock(x, z).entities;
        for (let i = 0; i < es.length; i++) {
          const e = es[i]!;
          if (e.isInside(x0, y0, x1, y1)) return true;
        }
      }
    }
    return false;
  }

  containsBlockingNonFlyingEntity(x0: number, y0: number, x1: number, y1: number): boolean {
    const xc = Math.floor((x1 + x0) / 2);
    const zc = Math.floor((y1 + y0) / 2);
    const rr = 2;
    for (let z = zc - rr; z <= zc + rr; z++) {
      for (let x = xc - rr; x <= xc + rr; x++) {
        const es = this.getBlock(x, z).entities;
        for (let i = 0; i < es.length; i++) {
          const e = es[i]!;
          if (!e.flying && e.isInside(x0, y0, x1, y1)) return true;
        }
      }
    }
    return false;
  }

  tick(): void {
    for (const e of this.entities) {
      e.tick();
      e.updatePos();
    }
    this.entities = this.entities.filter((e) => !e.isRemoved());

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.blocks[x + y * this.width]!.tick();
      }
    }
  }

  trigger(id: number, pressed: boolean): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const b = this.blocks[x + y * this.width]!;
        if (b.id === id) {
          b.trigger(pressed);
        }
      }
    }
  }

  switchLevel(_id: number): void {}

  findSpawn(id: number): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const b = this.blocks[x + y * this.width]!;
        if (b.id === id && b instanceof LadderBlock) {
          this.xSpawn = x;
          this.ySpawn = y;
        }
      }
    }
  }

  getLoot(id: number): void {
    if (id === 20) this.game!.getLoot(Item.pistol);
    if (id === 21) this.game!.getLoot(Item.potion);
  }

  win(): void {
    this.game!.win(this.player!);
  }

  lose(): void {
    this.game!.lose(this.player!);
  }

  showLootScreen(item: Item): void {
    this.game!.setMenu(new GotLootMenu(item));
  }
}
