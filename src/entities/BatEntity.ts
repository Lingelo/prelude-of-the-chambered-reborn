import { Art } from "../Art";
import { EnemyEntity } from "./EnemyEntity";

export class BatEntity extends EnemyEntity {
  constructor(x: number, z: number) {
    super(x, z, 4 * 8, Art.getCol(0x82666e));
    this.health = 2;
    this.flying = true;
  }
}
