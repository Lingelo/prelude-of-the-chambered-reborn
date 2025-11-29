import { Sound } from "../Sound";
import { EnemyEntity } from "./EnemyEntity";
import { KeyEntity } from "./KeyEntity";
import { Bullet } from "./Bullet";

export class BossOgre extends EnemyEntity {
  shootDelay: number = 0;
  shootPhase: number = 0;

  constructor(x: number, z: number) {
    super(x, z, 4 * 8 + 2, 0xffff00);
    this.health = 10;
    this.r = 0.4;
    this.spinSpeed = 0.05;
  }

  die(): void {
    Sound.bosskill.play();
    this.level!.addEntity(new KeyEntity(this.x, this.z));
  }

  tick(): void {
    super.tick();
    if (this.shootDelay > 0) this.shootDelay--;
    else if (Math.random() < 0.02) {
      this.shootDelay = 5;
      this.shootPhase++;
      for (let i = 0; i < 4; i++) {
        const rot = Math.PI / 2 * i + this.shootPhase * 0.25;
        this.level!.addEntity(new Bullet(this, this.x, this.z, rot, 0.4, 24, 0x228822));
      }
    }
  }
}
