import { Art } from "./Art";
import { Config } from "./Config";
import { Sound } from "./Sound";
import { Game } from "./Game";
import { Screen } from "./gui/Screen";
import { InputHandler } from "./InputHandler";
import { Level } from "./level/Level";

export class EscapeComponent {
  readonly WIDTH = 160;
  readonly HEIGHT = 120;
  readonly SCALE = 6;

  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  game: Game | null = null;
  screen: Screen | null = null;
  input: InputHandler | null = null;
  running: boolean = false;
  lastTime: number = 0;
  frames: number = 0;
  inFlight: boolean = false;
  loopHandle: number = 0;

  tmpcanvas: HTMLCanvasElement;
  tmpctx: CanvasRenderingContext2D;
  tmpimg: ImageData;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d")!;
    this.canvas = canvas;
    canvas.width = this.WIDTH * this.SCALE;
    canvas.height = this.HEIGHT * this.SCALE;

    this.tmpcanvas = document.createElement("canvas");
    this.tmpcanvas.width = this.WIDTH;
    this.tmpcanvas.height = this.HEIGHT;
    this.tmpctx = this.tmpcanvas.getContext("2d")!;
    this.tmpimg = this.tmpctx.createImageData(this.WIDTH, this.HEIGHT);

    (this.context as CanvasRenderingContext2D & { mozImageSmoothingEnabled?: boolean }).mozImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;
  }

  async loadResources(): Promise<void> {
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.innerHTML = "Loading resources ...";

    const levelPromises = ["start", "crypt", "ice", "temple", "overworld", "dungeon"].map((name) =>
      Level.loadLevelBitmap(name)
    );

    const texturePromises = ["walls", "floors", "sprites", "font", "panel", "items", "sky"].map(
      (name) => Art.loadBitmap(name, `res/tex/${name}.png`)
    );

    const logoPromise = Art.loadBitmap("logo", "res/gui/logo.png");

    const soundPromises = [
      "altar",
      "bosskill",
      "click1",
      "click2",
      "crumble",
      "cut",
      "death",
      "hit",
      "hurt2",
      "hurt",
      "key",
      "kill",
      "ladder",
      "pickup",
      "potion",
      "roll",
      "shoot",
      "slide",
      "splash",
      "thud",
      "treasure",
    ].map((name) => Sound.loadSound(name));

    await Promise.all([...levelPromises, ...texturePromises, logoPromise, ...soundPromises]);

    if (statusEl) statusEl.innerHTML = "Done.";
  }

  async start(): Promise<void> {
    await this.loadResources();

    this.game = new Game();
    this.screen = new Screen(this.WIDTH, this.HEIGHT);
    this.input = new InputHandler();

    this.running = true;
    this.lastTime = Date.now();
    this.loopHandle = window.setInterval(() => this.run(), 1000 / Config.TARGET_FPS);
  }

  stop(): void {
    clearInterval(this.loopHandle);
    this.running = false;
  }

  run(): void {
    if (this.inFlight) return;
    this.inFlight = true;
    this.tick();
    this.render();

    const passedTime = (Date.now() - this.lastTime) / 1000;
    if (passedTime >= 2) {
      const fps = (this.frames / passedTime) << 0;
      const statusEl = document.getElementById("status");
      if (statusEl) statusEl.innerHTML = `${fps} FPS`;
      this.frames = 0;
      this.lastTime = Date.now();
    }
    this.frames++;
    this.inFlight = false;
  }

  tick(): void {
    this.game!.tick(this.input!);
  }

  render(): void {
    this.screen!.render(this.game!);
    const spixels = this.screen!.pixels;

    for (let i = 0; i < spixels.length; i++) {
      const pix = spixels[i]!;
      const off = i * 4;
      this.tmpimg.data[off] = (pix >> 16) & 0xff;
      this.tmpimg.data[off + 1] = (pix >> 8) & 0xff;
      this.tmpimg.data[off + 2] = pix & 0xff;
      this.tmpimg.data[off + 3] = 255;
    }

    this.tmpctx.putImageData(this.tmpimg, 0, 0);
    this.context.drawImage(
      this.tmpcanvas,
      0,
      0,
      this.WIDTH,
      this.HEIGHT,
      0,
      0,
      this.WIDTH * this.SCALE,
      this.HEIGHT * this.SCALE
    );
  }
}
