import type { Level } from "./Level";

type LevelConstructor = new () => Level;

const levelRegistry: Record<string, LevelConstructor> = {};

export function registerLevel(name: string, constructor: LevelConstructor): void {
  levelRegistry[name] = constructor;
}

export function createLevel(name: string): Level {
  const LevelClass = levelRegistry[name];
  if (!LevelClass) throw new Error(`Unknown level: ${name}`);
  return new LevelClass();
}
