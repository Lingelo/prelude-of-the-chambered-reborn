import { Art } from "../Art";
import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import { Sound } from "../Sound";
import { Menu } from "./Menu";
import { TitleMenu } from "./TitleMenu";

export class PauseMenu extends Menu {
  options: string[] = ["Abort game", "Continue"];
  selected: number = 1;

  render(target: Bitmap): void {
    target.drawPart(Art.logo!, 0, 8, 0, 0, 160, 36, Art.getCol(0xffffff));

    for (let i = 0; i < this.options.length; i++) {
      const msg = this.options[i]!;
      const col = i === this.selected ? Art.getCol(0xffff80) : Art.getCol(0xa0a0a0);
      const xPos = (target.width - msg.length * 6) / 2;
      target.drawString(msg, xPos, 60 + i * 10, col);
    }
  }

  tick(game: Game, up: boolean, down: boolean, _left: boolean, _right: boolean, use: boolean): void {
    if (up) {
      Sound.click2.play();
      this.selected--;
      if (this.selected < 0) this.selected = 0;
    }
    if (down) {
      Sound.click2.play();
      this.selected++;
      if (this.selected >= this.options.length) this.selected = this.options.length - 1;
    }
    if (use) {
      Sound.click1.play();
      if (this.selected === 0) {
        game.setMenu(new TitleMenu());
      }
      if (this.selected === 1) {
        game.setMenu(null);
      }
    }
  }
}
