import type { Sprite } from "../gui/Sprite";
import type { Level } from "../level/Level";
import type { Item } from "./Item";

export class Entity {
  sprites: Sprite[] = [];

  x: number = 0;
  z: number = 0;
  rot: number = 0;
  xa: number = 0;
  za: number = 0;
  rota: number = 0;
  r: number = 0.4;

  level: Level | null = null;
  xTileO: number = -1;
  zTileO: number = -1;
  flying: boolean = false;

  removed: boolean = false;

  constructor(_x?: number, _z?: number, _defaultTex?: number, _defaultColor?: number) {
    this.sprites = [];
  }

  updatePos(): void {
    const xTile = (this.x + 0.5) << 0;
    const zTile = (this.z + 0.5) << 0;
    if (xTile !== this.xTileO || zTile !== this.zTileO) {
      this.level!.getBlock(this.xTileO, this.zTileO).removeEntity(this);

      this.xTileO = xTile;
      this.zTileO = zTile;

      if (!this.removed) this.level!.getBlock(this.xTileO, this.zTileO).addEntity(this);
    }
  }

  isRemoved(): boolean {
    return this.removed;
  }

  remove(): void {
    this.level!.getBlock(this.xTileO, this.zTileO).removeEntity(this);
    this.removed = true;
  }

  move(): void {
    const xSteps = (Math.abs(this.xa * 100) + 1) << 0;
    for (let i = xSteps; i > 0; i--) {
      const xxa = this.xa;
      if (this.isFree(this.x + (xxa * i) / xSteps, this.z)) {
        this.x += (xxa * i) / xSteps;
        break;
      } else {
        this.xa = 0;
      }
    }

    const zSteps = (Math.abs(this.za * 100) + 1) << 0;
    for (let i = zSteps; i > 0; i--) {
      const zza = this.za;
      if (this.isFree(this.x, this.z + (zza * i) / zSteps)) {
        this.z += (zza * i) / zSteps;
        break;
      } else {
        this.za = 0;
      }
    }
  }

  isFree(xx: number, yy: number): boolean {
    const x0 = Math.floor(xx + 0.5 - this.r);
    const x1 = Math.floor(xx + 0.5 + this.r);
    const y0 = Math.floor(yy + 0.5 - this.r);
    const y1 = Math.floor(yy + 0.5 + this.r);

    if (this.level!.getBlock(x0, y0).blocks(this)) return false;
    if (this.level!.getBlock(x1, y0).blocks(this)) return false;
    if (this.level!.getBlock(x0, y1).blocks(this)) return false;
    if (this.level!.getBlock(x1, y1).blocks(this)) return false;

    const xc = Math.floor(xx + 0.5);
    const zc = Math.floor(yy + 0.5);
    const rr = 2;
    for (let z = zc - rr; z <= zc + rr; z++) {
      for (let x = xc - rr; x <= xc + rr; x++) {
        const es = this.level!.getBlock(x, z).entities;
        for (let i = 0; i < es.length; i++) {
          const e = es[i]!;
          if (e === this) continue;

          if (e.blocks(this, xx, yy, this.r)) {
            e.collide(this);
            this.collide(e);
            return false;
          }
        }
      }
    }
    return true;
  }

  collide(_entity: Entity): void {}

  blocks(entity: Entity, x2: number, z2: number, r2: number): boolean {
    if ((entity as { owner?: Entity }).owner === this) return false;
    if (this.x + this.r <= x2 - r2) return false;
    if (this.x - this.r >= x2 + r2) return false;

    if (this.z + this.r <= z2 - r2) return false;
    if (this.z - this.r >= z2 + r2) return false;

    return true;
  }

  contains(x2: number, z2: number): boolean {
    if (this.x + this.r <= x2) return false;
    if (this.x - this.r >= x2) return false;

    if (this.z + this.r <= z2) return false;
    if (this.z - this.r >= z2) return false;

    return true;
  }

  isInside(x0: number, z0: number, x1: number, z1: number): boolean {
    if (this.x + this.r <= x0) return false;
    if (this.x - this.r >= x1) return false;

    if (this.z + this.r <= z0) return false;
    if (this.z - this.r >= z1) return false;

    return true;
  }

  use(_source: Entity, _item: Item): boolean {
    return false;
  }

  tick(..._args: unknown[]): void {}
}
