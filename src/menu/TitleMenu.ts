import { Art } from "../Art";
import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";
import { Sound } from "../Sound";
import { Menu } from "./Menu";
import { InstructionsMenu } from "./InstructionsMenu";
import { AboutMenu } from "./AboutMenu";

export class TitleMenu extends Menu {
  options: string[] = ["New game", "Instructions", "About"];
  selected: number = 0;
  firstTick: boolean = true;

  render(target: Bitmap): void {
    target.fill(0, 0, 160, 120, 0);
    target.drawPart(Art.logo!, 0, 8, 0, 0, 160, 36, Art.getCol(0xffffff));

    for (let i = 0; i < this.options.length; i++) {
      let msg = this.options[i]!;
      let col = Art.getCol(0x909090);
      if (this.selected === i) {
        msg = "-> " + msg;
        col = Art.getCol(0xffff80);
      }
      target.drawString(msg, 40, 60 + i * 10, col);
    }
    target.drawString("Copyright (C) 2011 Mojang", 1 + 4, 120 - 9, Art.getCol(0x303030));
  }

  tick(game: Game, up: boolean, down: boolean, _left: boolean, _right: boolean, use: boolean): void {
    if (this.firstTick) {
      this.firstTick = false;
      Sound.altar.play();
      return;
    }

    if (up || down) Sound.click2.play();
    if (up) this.selected--;
    if (down) this.selected++;
    if (this.selected < 0) this.selected = 0;
    if (this.selected >= this.options.length) this.selected = this.options.length - 1;

    if (use) {
      Sound.click1.play();
      if (this.selected === 0) {
        game.setMenu(null);
        game.newGame();
      }
      if (this.selected === 1) {
        game.setMenu(new InstructionsMenu());
      }
      if (this.selected === 2) {
        game.setMenu(new AboutMenu());
      }
    }
  }
}
