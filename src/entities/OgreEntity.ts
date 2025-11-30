import { Config } from "../Config";
import { EnemyEntity } from "./EnemyEntity";
import { Bullet } from "./Bullet";

export class OgreEntity extends EnemyEntity {
  shootDelay: number = 0;

  constructor(x: number, z: number) {
    super(x, z, 4 * 8 + 2, 0x82a821);
    this.health = 6;
    this.r = 0.4;
    this.spinSpeed = 0.05;
  }

  hurt(xd: number, zd: number): void {
    super.hurt(xd, zd);
    this.shootDelay = 50;
  }

  tick(): void {
    super.tick();
    if (this.shootDelay > 0) this.shootDelay--;
    else if (Math.random() < Config.OGRE_SHOOT_CHANCE) {
      this.shootDelay = 5;
      const player = this.level!.player;
      if (player != null) {
        const xd = player.x - this.x;
        const zd = player.z - this.z;
        const dd = Math.sqrt(xd * xd + zd * zd);
        if (dd < 6) {
          this.level!.addEntity(
            new Bullet(this, this.x, this.z, Math.atan2(xd, zd), 0.3, 1, this.defaultColor)
          );
        }
      }
    }
  }
}
