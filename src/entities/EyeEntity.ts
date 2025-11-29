import { EnemyEntity } from "./EnemyEntity";

export class EyeEntity extends EnemyEntity {
  constructor(x: number, z: number) {
    super(x, z, 4 * 8 + 4, 0x84ecff);
    this.health = 4;
    this.runSpeed = 2;
    this.spinSpeed = 0.1;
    this.flying = true;
  }
}
