# Prelude of the Chambered: Reborn

A modern TypeScript/Vite port of **"Prelude of the Chambered"**, a retro first-person dungeon crawler originally created by Markus "Notch" Persson (creator of Minecraft) for Ludum Dare 21 in 2011.

![Status](https://img.shields.io/badge/Status-Playable-brightgreen)
[![Deploy](https://github.com/Lingelo/prelude-of-the-chambered-reborn/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lingelo/prelude-of-the-chambered-reborn/actions/workflows/deploy.yml)

**[Play Now](https://lingelo.github.io/prelude-of-the-chambered-reborn/)**

## About the Game

Prelude of the Chambered is a first-person dungeon crawler with Wolfenstein 3D-style raycasting graphics. You wake up in a prison and must escape by exploring dungeons, solving puzzles, defeating enemies, and collecting items.

### Features

- 🎮 Classic raycasting 3D engine
- 🗝️ Multiple levels to explore (Prison, Dungeons, Overworld, Crypt, Temple, Ice Cave)
- ⚔️ Combat with various enemies (Bats, Ogres, Eyes, Ghosts + Boss variants)
- 🧩 Puzzle mechanics (pressure plates, switches, locked doors)
- 🎒 Collectible items (Power Glove, Pistol, Flippers, Cutters, Skates, Potions)
- 🏆 Win condition: Collect 4 keys and escape!

## Getting Started

### Prerequisites

- Node.js >= 18.0.0

### Installation

```bash
git clone https://github.com/Lingelo/prelude-of-the-chambered-reborn.git
cd prelude-of-the-chambered-reborn
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Controls

| Key | Action |
|-----|--------|
| `W` `A` `S` `D` | Move |
| `Q` `E` or `←` `→` | Turn |
| `Space` | Use item / Interact |
| `1` - `8` | Select item slot |
| `Esc` | Pause menu |

*Hold `Shift`/`Ctrl`/`Alt` + arrow keys for strafing*

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas** - Software rendering (no WebGL)

## Project Structure

```
src/
├── main.ts              # Entry point
├── EscapeComponent.ts   # Game loop & asset loading
├── Game.ts              # Game state management
├── Art.ts               # Texture/sprite loading
├── Sound.ts             # Audio management
├── gui/                 # Rendering system
│   ├── Bitmap.ts        # 2D pixel buffer
│   ├── Bitmap3D.ts      # Raycasting renderer
│   ├── Screen.ts        # Screen compositor
│   └── Sprite.ts        # Billboard sprites
├── entities/            # Game entities
│   ├── Player.ts
│   ├── EnemyEntity.ts
│   └── ...
├── level/               # Level system
│   ├── Level.ts         # Base level class
│   ├── block/           # Block types
│   └── *Level.ts        # Specific levels
└── menu/                # Menu screens
```

## Original Game

Based on the original Java game by Notch (Markus Persson) - Mojang AB (2011)
https://github.com/skeeto/Prelude-of-the-Chambered

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |

## License

- Original game idea, code, and assets © 2011 Mojang AB
- TypeScript/Vite modernization by Angelo Lima (2025)
