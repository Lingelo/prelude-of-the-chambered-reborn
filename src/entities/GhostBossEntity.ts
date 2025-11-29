import { Sound } from "../Sound";
import { EnemyEntity } from "./EnemyEntity";
import { KeyEntity } from "./KeyEntity";
import { Bullet } from "./Bullet";

export class GhostBossEntity extends EnemyEntity {
  rotatePos: number = 0;
  shootDelay: number = 0;

  constructor(x: number, z: number) {
    super(x, z, 4 * 8 + 6, 0xffff00);
    this.health = 10;
    this.flying = true;
  }

  die(): void {
    Sound.bosskill.play();
    this.level!.addEntity(new KeyEntity(this.x, this.z));
  }

  tick(): void {
    this.animTime++;
    this.sprite!.tex = this.defaultTex + ((this.animTime / 10) % 2 << 0);

    const player = this.level!.player;
    if (player != null) {
      const xd = player.x - this.x;
      const zd = player.z - this.z;
      const dd = Math.sqrt(xd * xd + zd * zd);
      if (dd < 1.5) {
        if (player.hurtTime === 0) {
          player.hurt(this, 2);
        }
      }
      this.rotatePos += 0.1;
      const rot = Math.atan2(xd, zd) + Math.sin(this.rotatePos) * 0.5;
      this.xa += Math.sin(rot) * 0.004;
      this.za += Math.cos(rot) * 0.004;

      if (this.shootDelay > 0) this.shootDelay--;
      else if (dd < 6) {
        this.shootDelay = 20;
        this.level!.addEntity(
          new Bullet(this, this.x, this.z, Math.atan2(xd, zd), 0.2, 24, 0xffffff)
        );
      }
    }

    this.move();
    this.xa *= 0.8;
    this.za *= 0.8;
  }

  hurt(_xd: number, _zd: number): void {
    this.sprite!.col = 0xff0000;
    this.hurtTime = 15;
  }

  move(): void {
    this.x += this.xa;
    this.z += this.za;
  }
}
