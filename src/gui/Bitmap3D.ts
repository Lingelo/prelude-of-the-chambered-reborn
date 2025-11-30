import { Art } from "../Art";
import type { Game } from "../Game";
import type { Level } from "../level/Level";
import { DoorBlock } from "../level/block/DoorBlock";
import { Bitmap } from "./Bitmap";

export class Bitmap3D extends Bitmap {
  zBuffer: number[];
  zBufferWall: number[];
  xCam: number = 0;
  yCam: number = 0;
  zCam: number = 0;
  rCos: number = 0;
  rSin: number = 0;
  fov: number = 0;
  xCenter: number = 0;
  yCenter: number = 0;
  rot: number = 0;

  constructor(width: number, height: number) {
    super(width, height);
    this.zBuffer = new Array(width * height);
    this.zBufferWall = new Array(width);
  }

  render(game: Game): void {
    for (let x = 0; x < this.width; x++) {
      this.zBufferWall[x] = 0;
    }
    for (let i = 0; i < this.width * this.height; i++) {
      this.zBuffer[i] = 10000;
    }

    const player = game.player!;
    this.rot = player.rot;
    this.xCam = player.x - Math.sin(this.rot) * 0.3;
    this.yCam = player.z - Math.cos(this.rot) * 0.3;
    this.zCam = -0.2 + Math.sin(player.bobPhase * 0.4) * 0.01 * player.bob - player.y;

    this.xCenter = this.width / 2.0;
    this.yCenter = this.height / 3.0;

    this.rCos = Math.cos(this.rot);
    this.rSin = Math.sin(this.rot);

    this.fov = this.height;

    const level = game.level!;
    const i_r = 6;

    const i_xCenter = Math.floor(this.xCam);
    const i_zCenter = Math.floor(this.yCam);

    for (let zb = i_zCenter - i_r; zb <= i_zCenter + i_r; zb++) {
      for (let xb = i_xCenter - i_r; xb <= i_xCenter + i_r; xb++) {
        const c = level.getBlock(xb, zb);
        const e = level.getBlock(xb + 1, zb);
        const s = level.getBlock(xb, zb + 1);

        if (c instanceof DoorBlock) {
          const rr = 1 / 8.0;
          const openness = 1 - c.openness * (7 / 8);
          if (e.solidRender) {
            this.renderWall(
              xb + openness,
              zb + 0.5 - rr,
              xb,
              zb + 0.5 - rr,
              c.tex,
              (c.col & 0xfefefe) >> 1,
              0,
              openness
            );
            this.renderWall(
              xb,
              zb + 0.5 + rr,
              xb + openness,
              zb + 0.5 + rr,
              c.tex,
              (c.col & 0xfefefe) >> 1,
              openness,
              0
            );
            this.renderWall(
              xb + openness,
              zb + 0.5 + rr,
              xb + openness,
              zb + 0.5 - rr,
              c.tex,
              c.col,
              0.5 - rr,
              0.5 + rr
            );
          } else {
            this.renderWall(
              xb + 0.5 - rr,
              zb,
              xb + 0.5 - rr,
              zb + openness,
              c.tex,
              c.col,
              openness,
              0
            );
            this.renderWall(
              xb + 0.5 + rr,
              zb + openness,
              xb + 0.5 + rr,
              zb,
              c.tex,
              c.col,
              0,
              openness
            );
            this.renderWall(
              xb + 0.5 - rr,
              zb + openness,
              xb + 0.5 + rr,
              zb + openness,
              c.tex,
              (c.col & 0xfefefe) >> 1,
              0.5 - rr,
              0.5 + rr
            );
          }
        }

        if (c.solidRender) {
          if (!e.solidRender) {
            this.renderWall(xb + 1, zb + 1, xb + 1, zb, c.tex, c.col);
          }
          if (!s.solidRender) {
            this.renderWall(xb, zb + 1, xb + 1, zb + 1, c.tex, (c.col & 0xfefefe) >> 1);
          }
        } else {
          if (e.solidRender) {
            this.renderWall(xb + 1, zb, xb + 1, zb + 1, e.tex, e.col);
          }
          if (s.solidRender) {
            this.renderWall(xb + 1, zb + 1, xb, zb + 1, s.tex, (s.col & 0xfefefe) >> 1);
          }
        }
      }
    }

    for (let zb = i_zCenter - i_r; zb <= i_zCenter + i_r; zb++) {
      for (let xb = i_xCenter - i_r; xb <= i_xCenter + i_r; xb++) {
        const c = level.getBlock(xb, zb);

        for (let j = 0; j < c.entities.length; j++) {
          const entity = c.entities[j]!;
          for (let i = 0; i < entity.sprites.length; i++) {
            const sprite = entity.sprites[i]!;
            this.renderSprite(
              entity.x + sprite.x,
              0 - sprite.y,
              entity.z + sprite.z,
              sprite.tex,
              sprite.col
            );
          }
        }

        for (let i = 0; i < c.sprites.length; i++) {
          const sprite = c.sprites[i]!;
          this.renderSprite(xb + sprite.x, 0 - sprite.y, zb + sprite.z, sprite.tex, sprite.col);
        }
      }
    }

    this.renderFloor(level);
  }

  renderFloor(level: Level): void {
    const fpixels = Art.floors!.pixels;
    const height = this.height;
    const width = this.width;
    const xCenter = this.xCenter;
    const yCenter = this.yCenter;
    const fov = this.fov;
    const xCam = this.xCam;
    const yCam = this.yCam;
    const zCam = this.zCam;
    const rCos = this.rCos;
    const rSin = this.rSin;
    const zBuffer = this.zBuffer;
    const pixels = this.pixels;

    const xbase = (xCam + 0.5) * 8;
    const ybase = (yCam + 0.5) * 8;

    for (let y = 0; y < height; y++) {
      const yd = (y + 0.5 - yCenter) / fov;

      let floor = true;
      let zd = (4 - zCam * 8) / yd;
      if (yd < 0) {
        floor = false;
        zd = (4 + zCam * 8) / -yd;
      }

      const zSin = zd * rSin;
      const zCos = zd * rCos;

      for (let x = 0; x < width; x++) {
        if (zBuffer[x + y * width]! <= zd) continue;

        let xd = (xCenter - x) / fov;
        xd *= zd;

        const xx = xd * rCos + zSin + xbase;
        const yy = zCos - xd * rSin + ybase;

        const i_xPix = (xx * 2) << 0;
        const i_yPix = (yy * 2) << 0;
        const xTile = i_xPix >> 4;
        const yTile = i_yPix >> 4;

        const block = level.getBlock(xTile, yTile);
        let col = block.floorCol;
        let tex = block.floorTex;
        if (!floor) {
          col = block.ceilCol;
          tex = block.ceilTex;
        }

        if (tex < 0) {
          zBuffer[x + y * width] = -1;
        } else {
          zBuffer[x + y * width] = zd;
          const offset =
            ((i_xPix & 15) + (tex % 8) * 16) + ((i_yPix & 15) + ((tex / 8) << 0) * 16) * 128;
          pixels[x + y * width] = fpixels[offset]! * col;
        }
      }
    }
  }

  renderSprite(x: number, y: number, z: number, tex: number, color: number): void {
    const height = this.height;
    const width = this.width;
    const xCenter = this.xCenter;
    const yCenter = this.yCenter;
    const fov = this.fov;
    const xCam = this.xCam;
    const yCam = this.yCam;
    const zCam = this.zCam;
    const rCos = this.rCos;
    const rSin = this.rSin;
    const zBuffer = this.zBuffer;
    const pixels = this.pixels;

    const fpixels = Art.sprites!.pixels;

    const xc = (x - xCam) * 2 - rSin * 0.2;
    const yc = (y - zCam) * 2;
    const zc = (z - yCam) * 2 - rCos * 0.2;

    const xx = xc * rCos - zc * rSin;
    const yy = yc;
    const zz = zc * rCos + xc * rSin;

    if (zz < 0.1) return;

    const xPixel = xCenter - (xx / zz) * fov;
    const yPixel = (yy / zz) * fov + yCenter;

    const zh = height / zz;
    const xPixel0 = xPixel - zh;
    const xPixel1 = xPixel + zh;

    const yPixel0 = yPixel - zh;
    const yPixel1 = yPixel + zh;

    let i_xp0 = Math.ceil(xPixel0);
    let i_xp1 = Math.ceil(xPixel1);
    let i_yp0 = Math.ceil(yPixel0);
    let i_yp1 = Math.ceil(yPixel1);

    if (i_xp0 < 0) i_xp0 = 0;
    if (i_xp1 > width) i_xp1 = width;
    if (i_yp0 < 0) i_yp0 = 0;
    if (i_yp1 > height) i_yp1 = height;
    const zzScaled = zz * 4;

    const xtex = (tex % 8) * 16;
    const ytex = ((tex / 8) << 0) * 16;

    for (let yp = i_yp0; yp < i_yp1; yp++) {
      const ypr = (yp - yPixel0) / (yPixel1 - yPixel0);
      const i_yt = (ypr * 16) << 0;
      for (let xp = i_xp0; xp < i_xp1; xp++) {
        const xpr = (xp - xPixel0) / (xPixel1 - xPixel0);
        const i_xt = (xpr * 16) << 0;
        if (zBuffer[xp + yp * width]! > zzScaled) {
          const offset = i_xt + xtex + (i_yt + ytex) * 128;
          const col = fpixels[offset]!;
          if (col >= 0) {
            pixels[xp + yp * width] = col * color;
            zBuffer[xp + yp * width] = zzScaled;
          }
        }
      }
    }
  }

  renderWall(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    tex: number,
    color: number,
    xt0: number = 0,
    xt1: number = 1
  ): void {
    const xc0 = (x0 - 0.5 - this.xCam) * 2;
    const yc0 = (y0 - 0.5 - this.yCam) * 2;

    const xx0 = xc0 * this.rCos - yc0 * this.rSin;
    const u0 = (-0.5 - this.zCam) * 2;
    const l0 = (0.5 - this.zCam) * 2;
    let zz0 = yc0 * this.rCos + xc0 * this.rSin;

    const xc1 = (x1 - 0.5 - this.xCam) * 2;
    const yc1 = (y1 - 0.5 - this.yCam) * 2;

    let xx1 = xc1 * this.rCos - yc1 * this.rSin;
    const u1 = (-0.5 - this.zCam) * 2;
    const l1 = (0.5 - this.zCam) * 2;
    let zz1 = yc1 * this.rCos + xc1 * this.rSin;

    xt0 *= 16;
    xt1 *= 16;

    const zClip = 0.2;

    if (zz0 < zClip && zz1 < zClip) return;

    if (zz0 < zClip) {
      const p = (zClip - zz0) / (zz1 - zz0);
      zz0 = zz0 + (zz1 - zz0) * p;
      xt0 = xt0 + (xt1 - xt0) * p;
    }

    if (zz1 < zClip) {
      const p = (zClip - zz0) / (zz1 - zz0);
      zz1 = zz0 + (zz1 - zz0) * p;
      xx1 = xx0 + (xx1 - xx0) * p;
      xt1 = xt0 + (xt1 - xt0) * p;
    }

    const xPixel0 = this.xCenter - (xx0 / zz0) * this.fov;
    const xPixel1 = this.xCenter - (xx1 / zz1) * this.fov;

    if (xPixel0 >= xPixel1) return;
    let i_xp0 = Math.ceil(xPixel0);
    let i_xp1 = Math.ceil(xPixel1);
    if (i_xp0 < 0) i_xp0 = 0;
    if (i_xp1 > this.width) i_xp1 = this.width;

    const yPixel00 = (u0 / zz0) * this.fov + this.yCenter;
    const yPixel01 = (l0 / zz0) * this.fov + this.yCenter;
    const yPixel10 = (u1 / zz1) * this.fov + this.yCenter;
    const yPixel11 = (l1 / zz1) * this.fov + this.yCenter;

    const iz0 = 1 / zz0;
    const iz1 = 1 / zz1;

    const iza = iz1 - iz0;

    const ixt0 = xt0 * iz0;
    const ixta = xt1 * iz1 - ixt0;
    const iw = 1 / (xPixel1 - xPixel0);

    const xtex = (tex % 8) * 16;
    const ytex = ((tex / 8) << 0) * 16;

    for (let x = i_xp0; x < i_xp1; x++) {
      const pr = (x - xPixel0) * iw;
      const iz = iz0 + iza * pr;

      if (this.zBufferWall[x]! > iz) continue;
      this.zBufferWall[x] = iz;
      const i_xTex = ((ixt0 + ixta * pr) / iz) << 0;

      const yPixelTop = yPixel00 + (yPixel10 - yPixel00) * pr - 0.5;
      const yPixelBottom = yPixel01 + (yPixel11 - yPixel01) * pr;

      if (yPixelBottom <= yPixelTop) continue;

      let i_yp0 = Math.ceil(yPixelTop);
      let i_yp1 = Math.ceil(yPixelBottom);
      if (i_yp0 < 0) i_yp0 = 0;
      if (i_yp1 > this.height) i_yp1 = this.height;

      const ih = 1 / (yPixelBottom - yPixelTop);
      for (let y = i_yp0; y < i_yp1; y++) {
        const pry = (y - yPixelTop) * ih;
        const i_yTex = ((16 * pry) << 0);
        const offset = i_xTex + xtex + (i_yTex + ytex) * 128;
        this.pixels[x + y * this.width] = Art.walls!.pixels[offset]! * color;
        this.zBuffer[x + y * this.width] = (1 / iz) * 4;
      }
    }
  }

  postProcess(_level: Level): void {
    for (let i = 0; i < this.width * this.height; i++) {
      const zl = this.zBuffer[i]!;
      if (zl < 0) {
        const xx = ((i % this.width) - (this.rot * 512) / (Math.PI * 2)) & 511;
        const yy = (i / this.width) << 0;
        this.pixels[i] = Art.sky!.pixels[xx + yy * 512]! * 0x444455;
      } else {
        const xp = i % this.width;
        const yp = ((i / this.width) << 0) * 14;

        const xx = (i % this.width - this.width / 2.0) / this.width;
        const col = this.pixels[i]!;
        let brightness = (300 - zl * 6 * (xx * xx * 2 + 1)) << 0;
        brightness = (((brightness + ((xp + yp) & 3) * 4) >> 4) << 4);
        if (brightness < 0) brightness = 0;
        if (brightness > 255) brightness = 255;

        let r = (col >> 16) & 0xff;
        let g = (col >> 8) & 0xff;
        let b = col & 0xff;

        r = (r * brightness) / 255;
        g = (g * brightness) / 255;
        b = (b * brightness) / 255;

        this.pixels[i] = (r << 16) | (g << 8) | b;
      }
    }
  }
}
