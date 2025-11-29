import { Art } from "../Art";
import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import type { Item } from "../entities/Item";
import { Menu } from "./Menu";

export class GotLootMenu extends Menu {
  tickDelay: number = 30;
  item: Item;

  constructor(item: Item) {
    super();
    this.item = item;
  }

  render(target: Bitmap): void {
    target.drawString("You found a", (target.width - 11 * 6) / 2, 20, 0xffffff);
    target.drawString(this.item.name, (target.width - this.item.name.length * 6) / 2, 32, 0xffff80);

    target.scaleDraw(
      Art.items!,
      3,
      (target.width - 48) / 2,
      45,
      this.item.icon * 16,
      0,
      16,
      16,
      Art.getCol(this.item.color)
    );

    target.drawString(
      this.item.description,
      (target.width - this.item.description.length * 6) / 2,
      95,
      0xa0a0a0
    );
  }

  tick(
    game: Game,
    _up: boolean,
    _down: boolean,
    _left: boolean,
    _right: boolean,
    use: boolean
  ): void {
    if (this.tickDelay > 0) {
      this.tickDelay--;
      return;
    }
    if (use) {
      game.setMenu(null);
    }
  }
}
