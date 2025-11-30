export class InputHandler {
  keys: Map<string, boolean> = new Map();

  constructor() {
    document.addEventListener("keyup", (evt) => this.keyup(evt));
    document.addEventListener("keydown", (evt) => this.keydown(evt));
  }

  keyup(evt: KeyboardEvent): void {
    this.keys.set(evt.key.toLowerCase(), false);
    evt.preventDefault();
  }

  keydown(evt: KeyboardEvent): void {
    this.keys.set(evt.key.toLowerCase(), true);
    evt.preventDefault();
  }

  isKeyDown(key: string): boolean {
    return this.keys.get(key.toLowerCase()) ?? false;
  }

  clearKey(key: string): void {
    this.keys.set(key.toLowerCase(), false);
  }
}
