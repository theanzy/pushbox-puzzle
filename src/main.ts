import './style.css';

import { Scene, Game, WEBGL, GameObjects } from 'phaser';
import * as settings from './settings';
import { LEVELS, DUDE_INDEX } from './assets/levels';

import tileSrc from './assets/sokoban_tilesheet.png';

const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {
  private player!: Phaser.GameObjects.Sprite;

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
    const player = layer
      .createFromTiles(53, 0, {
        key: 'tiles',
        frame: 53,
        origin: 0,
      })
      ?.pop();

    if (!player) {
      throw new Error('fail to load player');
    }
    this.player = player;
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

  update(time: number, delta: number) {
    if (!this.player.anims.isPlaying) {
      this.player.anims.play('down');
    }
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
