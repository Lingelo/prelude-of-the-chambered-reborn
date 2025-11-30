class SoundInstance {
  private audio: HTMLAudioElement;

  constructor(src: string) {
    this.audio = new Audio(src);
    this.audio.volume = 0.3;
  }

  onReady(callback: () => void): void {
    if (this.audio.readyState >= 3) {
      callback();
    } else {
      this.audio.addEventListener("canplaythrough", callback, { once: true });
      this.audio.addEventListener("error", callback, { once: true });
    }
  }

  play(): void {
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});
  }
}

export class Sound {
  static altar: SoundInstance;
  static bosskill: SoundInstance;
  static click1: SoundInstance;
  static click2: SoundInstance;
  static crumble: SoundInstance;
  static cut: SoundInstance;
  static death: SoundInstance;
  static hit: SoundInstance;
  static hurt2: SoundInstance;
  static hurt: SoundInstance;
  static key: SoundInstance;
  static kill: SoundInstance;
  static ladder: SoundInstance;
  static pickup: SoundInstance;
  static potion: SoundInstance;
  static roll: SoundInstance;
  static shoot: SoundInstance;
  static slide: SoundInstance;
  static splash: SoundInstance;
  static thud: SoundInstance;
  static treasure: SoundInstance;

  static async loadSound(name: string): Promise<string> {
    const src = `res/snd/${name}.wav`;
    const instance = new SoundInstance(src);
    (Sound as unknown as Record<string, SoundInstance>)[name] = instance;

    return new Promise((resolve) => {
      instance.onReady(() => resolve(name));
    });
  }
}
