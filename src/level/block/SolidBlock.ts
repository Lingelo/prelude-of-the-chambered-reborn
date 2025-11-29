import { Block } from "./Block";

export class SolidBlock extends Block {
  constructor() {
    super();
    this.solidRender = true;
    this.blocksMotion = true;
  }
}
