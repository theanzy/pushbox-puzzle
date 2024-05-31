import { Scene } from 'phaser';
import tileSrc from './assets/sokoban_tilesheet.png';
import footStepSrc from './assets/sounds/footstep_grass_000.ogg';
import moveSoundSrc from './assets/sounds/impactPlank_medium_003.ogg';
import hitTargetSoundSrc from './assets/sounds/select_007.ogg';
import wontMoveSrc from './assets/sounds/error_005.ogg';
import buttonClickSoundSrc from './assets/sounds/switch_002.ogg';
import menuSrc from './assets/menu.png';

import * as settings from './settings';
import { LEVELS } from './assets/levels';

export class Preloader extends Scene {
  constructor() {
    super('scene-preloader');
  }
  preload() {
    this.load.spritesheet('tiles', tileSrc, {
      frameWidth: settings.TILE_SIZE,
      startFrame: 0,
    });
    this.load.image('menu-icon', menuSrc);
    this.load.audio('footstep', footStepSrc);
    this.load.audio('move-box', moveSoundSrc);
    this.load.audio('hit-target', hitTargetSoundSrc);
    this.load.audio('wont-move', wontMoveSrc);
    this.load.audio('button-click', buttonClickSoundSrc);

    for (let i = 0; i < Object.keys(LEVELS).length; i++) {
      const key = `map-${i + 1}`;
      this.load.tilemapTiledJSON(key, LEVELS[i]);
    }
  }

  create() {
    this.scene.start('scene-levels');
    // this.scene.start('scene-game', { level: 1 });
    // this.scene.start('scene-level-end', { currentLevel: 1, moves: 10 });
    this.scene.stop('scene-preloader');
  }
}
