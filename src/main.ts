import { EscapeComponent } from "./EscapeComponent";

// Import all levels to trigger their registration
import "./level/StartLevel";
import "./level/OverworldLevel";
import "./level/DungeonLevel";
import "./level/CryptLevel";
import "./level/TempleLevel";
import "./level/IceLevel";

declare global {
  interface Window {
    __game: EscapeComponent | null;
  }
}

window.__game = null;

function init(): void {
  const canvas = document.getElementById("gamescreen") as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas element not found!");
    return;
  }

  const game = new EscapeComponent(canvas);
  window.__game = game;
  game.start();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
