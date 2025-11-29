import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import { Menu } from "./Menu";
import { TitleMenu } from "./TitleMenu";

export class AboutMenu extends Menu {
  tickDelay: number = 30;

  render(target: Bitmap): void {
    target.drawString("About", (target.width - 5 * 6) / 2, 10, 0xffffff);

    const lines = [
      "Prelude of the",
      "Chambered: Reborn",
      "",
      "Original Java game",
      "by Notch (LD48 2011)",
      "",
      "Modernized to",
      "TypeScript + Vite",
      "by Angelo Lima 2025",
    ];

    for (let i = 0; i < lines.length; i++) {
      target.drawString(lines[i]!, (target.width - lines[i]!.length * 6) / 2, 25 + i * 10, 0xa0a0a0);
    }
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
