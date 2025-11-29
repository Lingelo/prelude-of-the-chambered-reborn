import { Art } from "../Art";
import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import type { Player } from "../entities/Player";
import { Menu } from "./Menu";
import { TitleMenu } from "./TitleMenu";

export class LoseMenu extends Menu {
  tickDelay: number = 30;
  player: Player;

  constructor(player: Player) {
    super();
    this.player = player;
  }

  render(target: Bitmap): void {
    target.fill(0, 0, target.width, target.height, 0);
    target.drawPart(Art.logo!, 0, 8, 0, 0, 160, 36, Art.getCol(0xffffff));

    target.drawString("You died!", (target.width - 9 * 6) / 2, 50, Art.getCol(0xff0000));

    const trinkets = "" + this.player.loot + " Trinkets found";
    target.drawString(trinkets, (target.width - trinkets.length * 6) / 2, 70, Art.getCol(0xa0a0a0));

    const seconds = (this.player.time / 60) << 0;
    const minutes = (seconds / 60) << 0;
    const secs = seconds % 60;
    const time = "Time: " + minutes + ":" + (secs < 10 ? "0" : "") + secs;
    target.drawString(time, (target.width - time.length * 6) / 2, 80, Art.getCol(0xa0a0a0));
  }

  tick(game: Game, up: boolean, down: boolean, _left: boolean, _right: boolean, use: boolean): void {
    if (this.tickDelay > 0) {
      this.tickDelay--;
      return;
    }
    if (up || down || use) {
      game.setMenu(new TitleMenu());
    }
  }
}
