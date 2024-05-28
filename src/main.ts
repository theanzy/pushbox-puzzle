import './style.css';

import { Scene, Game, WEBGL, GameObjects } from 'phaser';
import * as settings from './settings';
import {
  LEVELS,
  DUDE_INDEX,
  WALL_INDEX,
  BOX_INDEXES,
  TARGET_INDEXES,
} from './assets/levels';

import tileSrc from './assets/sokoban_tilesheet.png';

const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {
  private player!: Phaser.GameObjects.Sprite;
  private walls!: Phaser.GameObjects.Sprite[];
  private boxes!: Phaser.GameObjects.Sprite[];
  private targets!: Phaser.GameObjects.Sprite[];
  private keys!: Map<number, Phaser.Input.Keyboard.Key>;
  private targetRecord!: Record<string, number>;
  private totalTargets!: Record<string, number>;

  constructor() {
    super('scene-game');
  }
  preload() {
    this.load.spritesheet('tiles', tileSrc, {
      frameWidth: settings.TILE_SIZE,
      startFrame: 0,
    });
    this.load.tilemapTiledJSON('map', LEVELS[0]);
  }

  create() {
    const map = this.make.tilemap({
      key: 'map',
      tileWidth: settings.TILE_SIZE,
      tileHeight: settings.TILE_SIZE,
    });
    const tileset = map.addTilesetImage('Level', 'tiles');
    if (!tileset) {
      throw new Error('fail to load tileset');
    }
    const layer = map.createLayer('Level', tileset, 0, 0);
    if (!layer) {
      throw new Error('fail to create layer');
    }
    this.walls = layer.createFromTiles(WALL_INDEX, 0, {
      key: 'tiles',
      frame: WALL_INDEX - 1,
      origin: 0,
    });

    this.boxes = Object.keys(BOX_INDEXES).flatMap((color) => {
      const res = this.createItemSprites(
        layer,
        color,
        BOX_INDEXES[color as keyof typeof BOX_INDEXES]
      );
      return res;
    });

    this.totalTargets = {};
    this.targets = Object.keys(TARGET_INDEXES).flatMap((color) => {
      const res = this.createItemSprites(
        layer,
        color,
        TARGET_INDEXES[color as keyof typeof TARGET_INDEXES]
      );
      this.totalTargets[color] = res.length;
      return res;
    });
    this.targetRecord = Object.keys(TARGET_INDEXES).reduce((res, color) => {
      res[color] = 0;
      return res;
    }, {} as Record<string, number>);

    const player = layer
      .createFromTiles(DUDE_INDEX, 0, {
        key: 'tiles',
        frame: DUDE_INDEX,
        origin: 0,
      })
      ?.pop();

    if (!player) {
      throw new Error('fail to load player');
    }
    this.player = player;

    this.setupkeys();
    this.setupPlayerAnims();
  }

  private setupPlayerAnims() {
    this.player.anims.create({
      key: 'left',
      frames: this.player.anims.generateFrameNumbers('tiles', {
        start: 81,
        end: 83,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'right',
      frames: this.player.anims.generateFrameNumbers('tiles', {
        start: 78,
        end: 80,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'up',
      frames: this.player.anims.generateFrameNumbers('tiles', {
        start: 55,
        end: 57,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.create({
      key: 'down',
      frames: this.player.anims.generateFrameNumbers('tiles', {
        start: 52,
        end: 54,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private createItemSprites(
    layer: Phaser.Tilemaps.TilemapLayer,
    color: string,
    idx: number
  ) {
    const boxes = layer.createFromTiles(idx, 0, {
      key: 'tiles',
      frame: idx - 1,
      origin: 0,
    });
    boxes.forEach((b) => b.setData('color', color));
    return boxes;
  }

  private setupkeys() {
    this.keys = new Map();
    this.addJustKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.addJustKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.addJustKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.addJustKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  private addJustKey(k: number) {
    if (!this.input.keyboard) {
      throw new Error('no keyboard connected');
    }
    this.keys.set(k, this.input.keyboard.addKey(k));
  }
  private isJustDown(k: number) {
    const key = this.keys.get(k);
    if (!key) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(key);
  }

  update(time: number, delta: number) {
    let anim = '';
    if (this.isJustDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
      anim = 'left';
    } else if (this.isJustDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
      anim = 'right';
    } else if (this.isJustDown(Phaser.Input.Keyboard.KeyCodes.UP)) {
      anim = 'up';
    } else if (this.isJustDown(Phaser.Input.Keyboard.KeyCodes.DOWN)) {
      anim = 'down';
    }
    if (anim && !this.tweens.isTweening(this.player)) {
      const dir = this.getDir(anim);
      const targetX = this.player.x + dir[0] * settings.TILE_SIZE;
      const targetY = this.player.y + dir[1] * settings.TILE_SIZE;

      const hitWall = this.isOccupied(this.walls, targetX, targetY);
      let toX = hitWall ? this.player.x : targetX;
      let toY = hitWall ? this.player.y : targetY;
      const duration = hitWall ? 200 : 500;

      const box = this.getSpriteAt(this.boxes, toX, toY);
      const boxToX = toX + dir[0] * settings.TILE_SIZE;
      const boxToY = toY + dir[1] * settings.TILE_SIZE;
      const boxCanMove =
        box &&
        !this.isOccupied(this.walls, boxToX, boxToY) &&
        !this.isOccupied(this.boxes, boxToX, boxToY);

      if (box && !boxCanMove) {
        toX = this.player.x;
        toY = this.player.y;
      }

      if (boxCanMove) {
        const currentTarget = this.getSpriteAt(this.targets, box.x, box.y);
        const wasOnTarget =
          !!currentTarget &&
          currentTarget.getData('color') === box.getData('color');
        this.tweens.add({
          targets: box,
          ease: 'linear',
          x: boxToX,
          y: boxToY,
          duration: duration,
          onComplete: () => {
            const target = this.getSpriteAt(this.targets, box.x, box.y);
            const color = box.getData('color');
            const onTarget = !!target && target.getData('color') === color;
            if (!wasOnTarget && onTarget) {
              this.targetRecord[color] += 1;
            } else if (wasOnTarget && !onTarget) {
              this.targetRecord[color] -= 1;
            }

            // calculate winning condition
            const won = Object.keys(this.targetRecord).every((color) => {
              return this.targetRecord[color] === this.totalTargets[color];
            });
            console.log({ won });
          },
        });
      }

      // TODO: increment steps if not hit wall
      this.tweens.add({
        targets: this.player,
        ease: 'linear',
        x: toX,
        y: toY,
        duration: duration,
        onStart: () => {
          this.player.anims.play(anim);
        },
        onComplete: () => {
          this.player.anims.pause(this.player.anims.currentAnim?.frames[0]);
        },
      });
    }
  }

  private getSpriteAt(
    sprites: Phaser.GameObjects.Sprite[],
    x: number,
    y: number
  ) {
    return sprites.find((w) => w.x === x && w.y === y);
  }

  private isOccupied(
    sprites: Phaser.GameObjects.Sprite[],
    x: number,
    y: number
  ) {
    return sprites.some((w) => w.x === x && w.y === y);
  }

  private getDir(anim: string) {
    if (anim === 'left') {
      return [-1, 0];
    } else if (anim === 'right') {
      return [1, 0];
    } else if (anim === 'up') {
      return [0, -1];
    } else if (anim === 'down') {
      return [0, 1];
    }
    return [0, 0];
  }
}

new Game({
  type: WEBGL,
  width: settings.GAME_WIDTH,
  height: settings.GAME_HEIGHT,
  canvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      // debug: true
    },
  },
  scene: [GameScene],
});
