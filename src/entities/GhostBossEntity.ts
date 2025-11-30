import { Config } from "../Config";
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
    this.sprite!.tex = this.defaultTex + ((this.animTime / 10) << 0) % 2;

    const player = this.level!.player;
    if (player != null) {
      let xd = player.x + Math.sin(this.rotatePos) * 2 - this.x;
      let zd = player.z + Math.cos(this.rotatePos) * 2 - this.z;
      let dd = xd * xd + zd * zd;

      if (dd < 1) {
        this.rotatePos += 0.04;
      } else {
        this.rotatePos = player.rot;
      }

      if (dd < 4 * 4) {
        dd = Math.sqrt(dd);
        xd /= dd;
        zd /= dd;

        this.xa += xd * 0.006;
        this.za += zd * 0.006;

        if (this.shootDelay > 0) this.shootDelay--;
        else if (Math.random() < Config.GHOST_BOSS_ATTACK_CHANCE) {
          this.shootDelay = 10;
          this.level!.addEntity(
            new Bullet(
              this,
              this.x,
              this.z,
              Math.atan2(player.x - this.x, player.z - this.z),
              0.2,
              1,
              this.defaultColor
            )
          );
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
