import './style.css';

import { Scene, Game, WEBGL, GameObjects } from 'phaser';
import * as settings from './settings';
import { LEVELS, DUDE_INDEX } from './assets/levels';

import tileSrc from './assets/sokoban_tilesheet.png';

const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {
  private player!: Phaser.GameObjects.Sprite;
  private keys!: Map<number, Phaser.Input.Keyboard.Key>;

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
    this.setupkeys();
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
      this.tweens.add({
        targets: this.player,
        ease: 'linear',
        x: targetX,
        y: targetY,
        duration: 500,
        onStart: () => {
          this.player.anims.play(anim);
        },
        onComplete: () => {
          this.player.anims.pause(this.player.anims.currentAnim?.frames[0]);
        },
      });
    }
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
