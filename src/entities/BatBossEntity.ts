import { Art } from "../Art";
import { Sound } from "../Sound";
import { EnemyEntity } from "./EnemyEntity";
import { BatEntity } from "./BatEntity";
import { KeyEntity } from "./KeyEntity";

export class BatBossEntity extends EnemyEntity {
  constructor(x: number, z: number) {
    super(x, z, 4 * 8, Art.getCol(0xffff00));
    this.health = 5;
    this.flying = true;
  }

  die(): void {
    Sound.bosskill.play();
    this.level!.addEntity(new KeyEntity(this.x, this.z));
  }

  tick(): void {
    super.tick();
    if (Math.random() * 20 < 1) {
      const xx = this.x + (Math.random() - 0.5) * 2;
      const zz = this.z + (Math.random() - 0.5) * 2;
      const batEntity = new BatEntity(xx, zz);
      batEntity.level = this.level;

      if (batEntity.isFree(xx, zz)) {
        this.level!.addEntity(batEntity);
      }
    }
  }
}
