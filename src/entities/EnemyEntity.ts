import { Art } from "../Art";
import { Config } from "../Config";
import { Sound } from "../Sound";
import { Sprite } from "../gui/Sprite";
import { PoofSprite } from "../gui/PoofSprite";
import { Entity } from "./Entity";
import { Item } from "./Item";
import { Player } from "./Player";
import { Bullet } from "./Bullet";

export class EnemyEntity extends Entity {
  sprite: Sprite | null = null;
  defaultTex: number = 0;
  defaultColor: number = 0;
  hurtTime: number = 0;
  animTime: number = 0;
  health: number = 3;
  spinSpeed: number = Config.ENEMY_SPIN_SPEED;
  runSpeed: number = 1;
  private haveNextGaussian: boolean = false;
  private nextNextGaussian: number = 0;

  constructor(x: number, z: number, defaultTex: number, defaultColor: number) {
    super();
    this.x = x;
    this.z = z;
    this.defaultTex = defaultTex;
    this.defaultColor = defaultColor;
    this.sprite = new Sprite(0, 0, 0, defaultTex, defaultColor);
    this.sprites.push(this.sprite);
    this.r = 0.3;
  }

  nextGaussian(): number {
    if (this.haveNextGaussian) {
      this.haveNextGaussian = false;
      return this.nextNextGaussian;
    } else {
      let v1: number, v2: number, s: number;
      do {
        v1 = 2 * Math.random() - 1;
        v2 = 2 * Math.random() - 1;
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      const multiplier = Math.sqrt((-2 * Math.log(s)) / s);
      this.nextNextGaussian = v2 * multiplier;
      this.haveNextGaussian = true;
      return v1 * multiplier;
    }
  }

  tick(): void {
    if (this.hurtTime > 0) {
      this.hurtTime--;
      if (this.hurtTime === 0) {
        this.sprite!.col = this.defaultColor;
      }
    }
    this.animTime++;
    this.sprite!.tex = this.defaultTex + ((this.animTime / 10) << 0) % 2;

    this.move();

    if (this.xa === 0 || this.za === 0) {
      this.rota += this.nextGaussian() * Math.random() * 0.3;
    }

    this.rota += this.nextGaussian() * Math.random() * this.spinSpeed;
    this.rot += this.rota;
    this.rota *= 0.8;
    this.xa *= 0.8;
    this.za *= 0.8;
    this.xa += Math.sin(this.rot) * 0.004 * this.runSpeed;
    this.za += Math.cos(this.rot) * 0.004 * this.runSpeed;
  }

  use(source: Entity, item: Item): boolean {
    if (this.hurtTime > 0) return false;
    if (item !== Item.powerGlove) return false;

    this.hurt(Math.sin(source.rot), Math.cos(source.rot));
    return true;
  }

  hurt(xd: number, zd: number): void {
    this.sprite!.col = Art.getCol(0xff0000);
    this.hurtTime = 15;

    const dd = Math.sqrt(xd * xd + zd * zd);
    if (dd > 0.001) {
      this.xa += (xd / dd) * Config.KNOCKBACK_ENEMY;
      this.za += (zd / dd) * Config.KNOCKBACK_ENEMY;
    }

    Sound.hurt2.play();
    this.health--;
    if (this.health <= 0) {
      const xt = (this.x + 0.5) << 0;
      const zt = (this.z + 0.5) << 0;
      this.level!.getBlock(xt, zt).addSprite(new PoofSprite(this.x - xt, 0, this.z - zt));
      this.die();
      this.remove();
      Sound.kill.play();
    }
  }

  die(): void {}

  collide(entity: Entity): void {
    if (entity instanceof Bullet) {
      const bullet = entity as Bullet;
      if (bullet.owner instanceof Player) {
        if (this.hurtTime > 0) return;
        entity.remove();
        this.hurt(bullet.xa, bullet.za);
      }
    }
    if (entity instanceof Player) {
      (entity as Player).hurt(this, 1);
    }
  }
}
