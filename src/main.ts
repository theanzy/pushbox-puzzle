import { Game, WEBGL } from 'phaser';
import * as settings from './settings';
import { GameScene } from './game';
import { LevelEnd } from './level-end';
import { Preloader } from './preloader';
import { Levels } from './levels';

const canvas = document.getElementById('game') as HTMLCanvasElement;
new Game({
  type: WEBGL,
  width: settings.GAME_WIDTH,
  height: settings.GAME_HEIGHT,
  canvas,
  scene: [Preloader, Levels, LevelEnd, GameScene],
});
