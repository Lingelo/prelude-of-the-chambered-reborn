export class InputHandler {
  keys: boolean[] = [];

  constructor() {
    document.addEventListener("keyup", (evt) => this.keyup(evt));
    document.addEventListener("keydown", (evt) => this.keydown(evt));
  }

  keyup(evt: KeyboardEvent): void {
    this.keys[evt.keyCode] = false;
    evt.preventDefault();
  }

  keydown(evt: KeyboardEvent): void {
    this.keys[evt.keyCode] = true;
    evt.preventDefault();
  }
}
