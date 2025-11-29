import { Art } from "../Art";
import type { Game } from "../Game";
import { Item } from "../entities/Item";
import { Bitmap } from "./Bitmap";
import { Bitmap3D } from "./Bitmap3D";

export class Screen extends Bitmap {
  readonly PANEL_HEIGHT = 29;
  viewport: Bitmap3D;

  constructor(width: number, height: number) {
    super(width, height);
    this.viewport = new Bitmap3D(width, height - this.PANEL_HEIGHT);
  }

  render(game: Game): void {
    if (game.level == null) {
      this.fill(0, 0, this.width, this.height, 0);
    } else {
      const player = game.player!;
      const itemUsed = player.itemUseTime > 0;
      const item = player.items[player.selectedSlot]!;

      if (game.pauseTime > 0) {
        this.fill(0, 0, this.width, this.height, 0);
        const messages = ["Entering " + game.level.name];
        for (let y = 0; y < messages.length; y++) {
          this.drawString(
            messages[y]!,
            (this.width - messages[y]!.length * 6) / 2,
            (this.viewport.height - messages.length * 8) / 2 + y * 8 + 1,
            0x111111
          );
          this.drawString(
            messages[y]!,
            (this.width - messages[y]!.length * 6) / 2,
            (this.viewport.height - messages.length * 8) / 2 + y * 8,
            0x555544
          );
        }
      } else {
        this.viewport.render(game);
        this.viewport.postProcess(game.level);

        const block = game.level.getBlock((player.x + 0.5) << 0, (player.z + 0.5) << 0);
        if (block.messages != null && block.messages.length > 0) {
          for (let y = 0; y < block.messages.length; y++) {
            this.viewport.drawString(
              block.messages[y]!,
              (this.width - block.messages[y]!.length * 6) / 2,
              (this.viewport.height - block.messages.length * 8) / 2 + y * 8 + 1,
              0x111111
            );
            this.viewport.drawString(
              block.messages[y]!,
              (this.width - block.messages[y]!.length * 6) / 2,
              (this.viewport.height - block.messages.length * 8) / 2 + y * 8,
              0x555544
            );
          }
        }

        this.draw(this.viewport, 0, 0);
        let xx = (player.turnBob * 32) << 0;
        let yy =
          ((Math.sin(player.bobPhase * 0.4) * 1 * player.bob + player.bob * 2) << 0);

        if (itemUsed) xx = yy = 0;
        xx += (this.width / 2) << 0;
        yy += this.height - this.PANEL_HEIGHT - 15 * 3;
        if (item !== Item.none) {
          this.scaleDraw(
            Art.items!,
            3,
            xx,
            yy,
            16 * item.icon + 1,
            16 + 1 + (itemUsed ? 16 : 0),
            15,
            15,
            Art.getCol(item.color)
          );
        }

        if (player.hurtTime > 0 || player.dead) {
          let offs = 1.5 - player.hurtTime / 30.0;
          if (player.dead) offs = 0.5;
          for (let i = 0; i < this.pixels.length; i++) {
            const xp = ((i % this.width) - this.viewport.width / 2.0) / this.width * 2;
            const yp = ((i / this.width) - this.viewport.height / 2.0) / this.viewport.height * 2;

            if (Math.random() + offs < Math.sqrt(xp * xp + yp * yp)) {
              this.pixels[i] = (Math.floor(Math.random() * 5) / 4 << 0) * 0x550000;
            }
          }
        }
      }

      this.drawPart(
        Art.panel!,
        0,
        this.height - this.PANEL_HEIGHT,
        0,
        0,
        this.width,
        this.PANEL_HEIGHT,
        Art.getCol(0x707070)
      );

      this.drawString("♦", 3, this.height - 26 + 0, 0x00ffff);
      this.drawString("" + player.keys + "/4", 10, this.height - 26 + 0, 0xffffff);
      this.drawString("↑", 3, this.height - 26 + 8, 0xffff00);
      this.drawString("" + player.loot, 10, this.height - 26 + 8, 0xffffff);
      this.drawString("♥", 3, this.height - 26 + 16, 0xff0000);
      this.drawString("" + player.health, 10, this.height - 26 + 16, 0xffffff);

      for (let i = 0; i < 8; i++) {
        const slotItem = player.items[i]!;
        if (slotItem !== Item.none) {
          this.drawPart(
            Art.items!,
            30 + i * 16,
            this.height - this.PANEL_HEIGHT + 2,
            slotItem.icon * 16,
            0,
            16,
            16,
            Art.getCol(slotItem.color)
          );
          if (slotItem === Item.pistol) {
            const str = "" + player.ammo;
            this.drawString(
              str,
              30 + i * 16 + 17 - str.length * 6,
              this.height - this.PANEL_HEIGHT + 1 + 10,
              0x555555
            );
          }
          if (slotItem === Item.potion) {
            const str = "" + player.potions;
            this.drawString(
              str,
              30 + i * 16 + 17 - str.length * 6,
              this.height - this.PANEL_HEIGHT + 1 + 10,
              0x555555
            );
          }
        }
      }

      this.drawPart(
        Art.items!,
        30 + player.selectedSlot * 16,
        this.height - this.PANEL_HEIGHT + 2,
        0,
        48,
        17,
        17,
        Art.getCol(0xffffff)
      );

      this.drawString(
        item.name,
        26 + (8 * 16 - item.name.length * 4) / 2,
        this.height - 9,
        0xffffff
      );
    }

    if (game.menu != null) {
      for (let i = 0; i < this.pixels.length; i++) {
        this.pixels[i] = (this.pixels[i]! & 0xfcfcfc) >> 2;
      }
      game.menu.render(this);
    }
  }
}
