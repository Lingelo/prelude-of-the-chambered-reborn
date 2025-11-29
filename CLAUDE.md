# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript/Vite port of "Prelude of the Chambered", a retro first-person dungeon crawler originally created by Notch (Markus Persson) in Java for Ludum Dare 2011.

## Commands

```bash
npm run dev        # Start development server (Vite)
npm run build      # TypeScript check + production build
npm run typecheck  # TypeScript check only
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
npm run format     # Prettier formatting
```

## Architecture

### Rendering Pipeline
- **Bitmap** (`src/gui/Bitmap.ts`): Base 2D pixel buffer with drawing primitives
- **Bitmap3D** (`src/gui/Bitmap3D.ts`): Raycasting renderer (Wolfenstein 3D style) that renders the 3D view
- **Screen** (`src/gui/Screen.ts`): Composites 3D viewport + UI panel + menus + damage effects
- **Sprite** (`src/gui/Sprite.ts`): Billboarded sprites in 3D space

### Game Loop
- **EscapeComponent** (`src/EscapeComponent.ts`): Entry point, asset loading, main loop (60 FPS target)
- **Game** (`src/Game.ts`): Game state, level switching, menu management

### Level System
- **Level** (`src/level/Level.ts`): Base level class, loads from PNG images where pixel colors define block types and alpha channel stores IDs
- **LevelRegistry** (`src/level/LevelRegistry.ts`): Registry pattern to avoid circular imports between Level subclasses
- Specific levels: `StartLevel`, `DungeonLevel`, `OverworldLevel`, `CryptLevel`, `TempleLevel`, `IceLevel`

### Block Types (`src/level/block/`)
Blocks are the world tiles. Each pixel color in level PNG maps to a block type:
- `0xffffff` → SolidBlock (walls)
- `0xff66ff` / `0x9e009e` → LadderBlock (level transitions)
- `0x00ffff` → VanishBlock (destructible walls)
- `0xffff64` → ChestBlock (loot containers)
- And many more defined in `Level.getNewBlock()`

### Entity System (`src/entities/`)
- **Entity**: Base class with position, collision, sprites
- **Player**: Player controller with items, health, combat
- **EnemyEntity**: Base enemy with AI, extends to BatEntity, OgreEntity, etc.
- **BoulderEntity**: Pushable physics objects
- **Bullet**: Projectiles from pistol

### Menu System (`src/menu/`)
Menus overlay the game and handle their own input/rendering.

## Key Patterns

### Color Conversion
Always use `Art.getCol(0xRRGGBB)` when setting sprite/block colors - it converts 24-bit RGB to the internal 2-bit grayscale palette format.

### Sprite Textures
Sprites use an 8x8 grid in `sprites.png`. Index = `row * 8 + column`. Common indices:
- 0: Torch flame
- 1-2: Boulder animation
- 8: Bars
- 11-12: Ladders
- 16-17: Chest closed/open
- 24+: Enemy sprites

### Level Transitions
`switchLevel(levelName, spawnId)` - the spawnId must match a LadderBlock's ID in the target level.

## Assets

- `public/res/tex/` - Sprite sheets and textures (8x8 tiles)
- `public/res/level/` - Level PNGs (color = block type, alpha = ID)
- `public/res/snd/` - Sound effects (.wav)

## Debugging Reference

When debugging, compare behavior with the original Java source code:

- **Original Java code (Notch)**: https://github.com/skeeto/Prelude-of-the-Chambered

Use `WebFetch` to view specific files when needed. Key files to reference:
- Entity behavior: `src/com/mojang/escape/entities/`
- Block types: `src/com/mojang/escape/level/block/`
- Level triggers: `src/com/mojang/escape/level/*Level.java`
- Rendering: `src/com/mojang/escape/gui/`
