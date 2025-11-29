import { Art } from "../Art";
import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import type { Player } from "../entities/Player";
import { Menu } from "./Menu";
import { TitleMenu } from "./TitleMenu";

export class WinMenu extends Menu {
  tickDelay: number = 30;
  player: Player;

  constructor(player: Player) {
    super();
    this.player = player;
  }

  render(target: Bitmap): void {
    target.draw(Art.logo!, (target.width - Art.logo!.width) / 2, 10);

    target.drawString("You escaped!", (target.width - 12 * 6) / 2, 50, 0x00ff00);

    const trinkets = "" + this.player.loot + " Trinkets found";
    target.drawString(trinkets, (target.width - trinkets.length * 6) / 2, 70, 0xa0a0a0);

    const seconds = (this.player.time / 60) << 0;
    const minutes = (seconds / 60) << 0;
    const secs = seconds % 60;
    const time = "Time: " + minutes + ":" + (secs < 10 ? "0" : "") + secs;
    target.drawString(time, (target.width - time.length * 6) / 2, 80, 0xa0a0a0);
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
