import type { Bitmap } from "../gui/Bitmap";
import type { Game } from "../Game";

export class Menu {
  render(_target: Bitmap): void {}

  tick(
    _game: Game,
    _up: boolean,
    _down: boolean,
    _left: boolean,
    _right: boolean,
    _use: boolean
  ): void {}
}
