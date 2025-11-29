class SoundInstance {
  private audio: HTMLAudioElement;

  constructor(src: string) {
    this.audio = new Audio(src);
    this.audio.volume = 0.3;
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
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener(
        "canplaythrough",
        () => {
          resolve(name);
        },
        { once: true }
      );
      audio.addEventListener(
        "error",
        () => {
          resolve(name);
        },
        { once: true }
      );
      audio.src = `res/snd/${name}.wav`;

      (Sound as unknown as Record<string, SoundInstance>)[name] = new SoundInstance(
        `res/snd/${name}.wav`
      );
    });
  }
}
