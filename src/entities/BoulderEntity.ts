import { Art } from "../Art";
import { Config } from "../Config";
import { Sound } from "../Sound";
import { Sprite } from "../gui/Sprite";
import { Entity } from "./Entity";
import { Item } from "./Item";

export class BoulderEntity extends Entity {
  static readonly COLOR = Art.getCol(0xafa293);

  sprite: Sprite;
  rollDist: number = 0;

  constructor(x: number, z: number) {
    super();
    this.x = x;
    this.z = z;
    this.sprite = new Sprite(0, 0, 0, 16, BoulderEntity.COLOR);
    this.sprites.push(this.sprite);
  }

  tick(): void {
    this.rollDist += Math.sqrt(this.xa * this.xa + this.za * this.za);
    this.sprite.tex = 8 + (((this.rollDist * 4) << 0) & 1);
    const xao = this.xa;
    const zao = this.za;
    this.move();
    if (this.xa === 0 && xao !== 0) this.xa = -xao * 0.3;
    if (this.za === 0 && zao !== 0) this.za = -zao * 0.3;
    this.xa *= Config.FRICTION_BOULDER;
    this.za *= Config.FRICTION_BOULDER;
    if (this.xa * this.xa + this.za * this.za < 0.0001) {
      this.xa = this.za = 0;
    }
  }

  use(source: Entity, item: Item): boolean {
    if (item !== Item.powerGlove) return false;

    Sound.roll.play();
    this.xa += Math.sin(source.rot) * Config.BOULDER_PUSH_FORCE;
    this.za += Math.cos(source.rot) * Config.BOULDER_PUSH_FORCE;
    return true;
  }
}
