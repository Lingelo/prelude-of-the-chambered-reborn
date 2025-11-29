import { Sound } from "../Sound";
import { EnemyEntity } from "./EnemyEntity";
import { KeyEntity } from "./KeyEntity";

export class EyeBossEntity extends EnemyEntity {
  constructor(x: number, z: number) {
    super(x, z, 4 * 8 + 4, 0xffff00);
    this.health = 10;
    this.runSpeed = 4;
    this.flying = true;
  }

  die(): void {
    Sound.bosskill.play();
    this.level!.addEntity(new KeyEntity(this.x, this.z));
  }
}
