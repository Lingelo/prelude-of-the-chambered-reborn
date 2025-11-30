import type { Sprite } from "../../gui/Sprite";
import type { Entity } from "../../entities/Entity";
import type { Item } from "../../entities/Item";
import type { Level } from "../Level";
import type { Player } from "../../entities/Player";

export class Block {
  blocksMotion: boolean = false;
  solidRender: boolean = false;

  messages: string[] = [];
  sprites: Sprite[] = [];
  entities: Entity[] = [];

  tex: number = -1;
  col: number = -1;

  floorCol: number = -1;
  ceilCol: number = -1;

  floorTex: number = -1;
  ceilTex: number = -1;

  level: Level | null = null;
  x: number = 0;
  y: number = 0;

  id: number = 0;
  wait: boolean = false;

  constructor() {
    this.messages = [];
    this.sprites = [];
    this.entities = [];
  }

  addSprite(sprite: Sprite): void {
    this.sprites.push(sprite);
  }

  use(_level: Level, _item: Item): boolean {
    return false;
  }

  tick(): void {
    // Tick all sprites and remove those marked as removed (in-place for performance)
    let writeIndex = 0;
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i]!;
      sprite.tick();
      if (!sprite.removed) {
        this.sprites[writeIndex++] = sprite;
      }
    }
    this.sprites.length = writeIndex;
  }

  removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index >= 0) {
      this.entities.splice(index, 1);
    }
  }

  addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  blocks(_entity: Entity): boolean {
    return this.blocksMotion;
  }

  decorate(_level: Level, _x: number, _y: number): void {}

  getFloorHeight(_e: Entity): number {
    return 0;
  }

  getWalkSpeed(_player: Player): number {
    return 1;
  }

  getFriction(_player: Player): number {
    return 0.6;
  }

  trigger(_pressed: boolean): void {}
}
