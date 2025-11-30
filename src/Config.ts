/**
 * Game configuration constants.
 * Centralizes magic numbers for easier tuning and maintenance.
 */
export const Config = {
  // Game loop
  TARGET_FPS: 60,

  // Rendering
  RENDER_DISTANCE: 6,
  MIN_SPRITE_DISTANCE: 0.1,
  Z_BUFFER_MAX: 10000,

  // Camera
  CAMERA_OFFSET: 0.3,
  CAMERA_HEIGHT: -0.2,
  BOB_INTENSITY: 0.01,
  BOB_SPEED: 0.4,

  // Physics - Friction
  FRICTION_DEFAULT: 0.9,
  FRICTION_ICE: 0.98,
  FRICTION_BOULDER: 0.98,

  // Physics - Movement
  PLAYER_MOVE_SPEED: 0.1,
  KNOCKBACK_PLAYER: 0.1,
  KNOCKBACK_ENEMY: 0.2,
  BOULDER_PUSH_FORCE: 0.1,

  // AI
  ENEMY_SPIN_SPEED: 0.1,
  OGRE_SHOOT_CHANCE: 0.02,
  GHOST_RANDOM_MOVE: 0.02,
  GHOST_BOSS_ATTACK_CHANCE: 0.1,

  // Entities
  KEY_BOUNCE_SPEED: 0.025,
  RUBBLE_GRAVITY: 0.1,

  // Blocks
  PRESSURE_PLATE_OFFSET: 0.02,
} as const;
