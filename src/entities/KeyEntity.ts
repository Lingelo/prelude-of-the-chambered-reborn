import { Art } from "../Art";
import { Sound } from "../Sound";
import { Sprite } from "../gui/Sprite";
import { Entity } from "./Entity";
import { Player } from "./Player";

export class KeyEntity extends Entity {
  static readonly COLOR = Art.getCol(0x00ffff);

  sprite: Sprite;
  y: number = 0;
  ya: number = 0;

  constructor(x: number, z: number) {
    super();
    this.x = x;
    this.z = z;
    this.sprite = new Sprite(0, 0, 0, 16 + 3, KeyEntity.COLOR);
    this.sprites.push(this.sprite);
    this.ya = 0.025;
  }

  tick(): void {
    this.move();
    this.ya -= 0.005;
    this.y += this.ya;
    if (this.y < 0) {
      this.y = 0;
      this.ya *= -0.5;
    }
    this.sprite.y = 0.5 - this.y;
  }

  collide(entity: Entity): void {
    if (entity instanceof Player) {
      (entity as Player).keys++;
      Sound.key.play();
      this.remove();
    }
  }
}
