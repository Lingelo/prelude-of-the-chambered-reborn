/**
 * Color constants used in level PNG files to define block types and entities.
 * Each pixel color in a level image maps to a specific block or entity type.
 */
export const LevelColors = {
  // Blocks
  SOLID: 0xffffff,
  SOLID_GREEN: 0x93ff9b,
  PIT: 0x009300,
  VANISH: 0x00ffff,
  CHEST: 0xffff64,
  WATER: 0x0000ff,
  TORCH: 0xff3a02,
  BARS: 0x4c4c4c,
  LADDER_DOWN: 0xff66ff,
  LADDER_UP: 0x9e009e,
  LOOT: 0xc1c14d,
  DOOR: 0xc6c6c6,
  SWITCH: 0x00ffa7,
  PRESSURE_PLATE: 0x009380,
  ICE: 0x3f3f60,
  LOCKED_DOOR: 0xc6c697,
  ALTAR: 0xffba02,
  SPIRIT_WALL: 0x749327,
  FINAL_UNLOCK: 0x00c2a7,
  WIN: 0x000056,
  DARK_FLOOR: 0x1a2108,

  // Spawn point
  SPAWN: 0xffff00,

  // Decorations
  BOULDER: 0xaa5500,
  WOOD_FLOOR: 0x653a00,

  // Enemies
  BAT: 0xff0000,
  BAT_BOSS: 0xff0001,
  OGRE: 0xff0002,
  OGRE_BOSS: 0xff0003,
  EYE: 0xff0004,
  EYE_BOSS: 0xff0005,
  GHOST: 0xff0006,
  GHOST_BOSS: 0xff0007,
} as const;
