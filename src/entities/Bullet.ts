import { Art } from "../Art";
import { Sprite } from "../gui/Sprite";
import { Entity } from "./Entity";

export class Bullet extends Entity {
  owner: Entity;

  constructor(
    owner: Entity,
    x: number,
    z: number,
    rot: number,
    pow: number,
    sprite: number,
    col: number
  ) {
    super();
    this.r = 0.01;
    this.owner = owner;
    this.xa = Math.sin(rot) * 0.2 * pow;
    this.za = Math.cos(rot) * 0.2 * pow;
    this.x = x - this.za / 2;
    this.z = z + this.xa / 2;
    this.sprites.push(new Sprite(0, 0, 0, 8 * 3 + sprite, Art.getCol(col)));
    this.flying = true;
  }

  tick(): void {
    const xao = this.xa;
    const zao = this.za;
    this.move();
    if ((this.xa === 0 && this.za === 0) || this.xa !== xao || this.za !== zao) {
      this.remove();
    }
  }

  blocks(entity: Entity, x2: number, z2: number, r2: number): boolean {
    if (entity instanceof Bullet) return false;
    if (entity === this.owner) return false;
    return super.blocks(entity, x2, z2, r2);
  }

  collide(_entity: Entity): void {}
}
