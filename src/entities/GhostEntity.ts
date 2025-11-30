import { Config } from "../Config";
import { EnemyEntity } from "./EnemyEntity";

export class GhostEntity extends EnemyEntity {
  rotatePos: number = 0;

  constructor(x: number, z: number) {
    super(x, z, 4 * 8 + 6, 0xffffff);
    this.health = 4;
    this.flying = true;
  }

  tick(): void {
    this.animTime++;
    this.sprite!.tex = this.defaultTex + ((this.animTime / 10) << 0) % 2;

    const player = this.level!.player;
    if (player != null) {
      let xd = player.x + Math.sin(this.rotatePos) - this.x;
      let zd = player.z + Math.cos(this.rotatePos) - this.z;
      let dd = xd * xd + zd * zd;

      if (dd < 4 * 4) {
        if (dd < 1) {
          this.rotatePos += 0.04;
        } else {
          this.rotatePos = player.rot;
          this.xa += (Math.random() - 0.5) * Config.GHOST_RANDOM_MOVE;
          this.za += (Math.random() - 0.5) * Config.GHOST_RANDOM_MOVE;
        }

        dd = Math.sqrt(dd);
        if (dd > 0.001) {
          xd /= dd;
          zd /= dd;

          this.xa += xd * 0.004;
          this.za += zd * 0.004;
        }
      }
    }

    this.move();
    this.xa *= Config.FRICTION_DEFAULT;
    this.za *= Config.FRICTION_DEFAULT;
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
