import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import { Menu } from "./Menu";
import { TitleMenu } from "./TitleMenu";

export class InstructionsMenu extends Menu {
  tickDelay: number = 30;

  render(target: Bitmap): void {
    target.drawString("Instructions", (target.width - 11 * 6) / 2, 10, 0xffffff);

    const lines = [
      "Use W,A,S,D to move",
      "Q and E to turn",
      "or use arrow keys",
      "",
      "Space to interact",
      "1-8 select items",
    ];

    for (let i = 0; i < lines.length; i++) {
      target.drawString(lines[i]!, (target.width - lines[i]!.length * 6) / 2, 30 + i * 10, 0xa0a0a0);
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
