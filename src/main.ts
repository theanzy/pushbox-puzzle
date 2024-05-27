import './style.css';

import { Scene, Game, WEBGL, GameObjects } from 'phaser';
import * as settings from './settings';

const canvas = document.getElementById('game') as HTMLCanvasElement;

class GameScene extends Scene {
  private textbox: GameObjects.Text | undefined;

  constructor() {
    super('scene-game');
  }

  create() {
    this.textbox = this.add.text(
      settings.GAME_WIDTH / 2,
      settings.GAME_HEIGHT / 2,
      'Welcome to Phaser x Vite!',
      {
        color: '#FFF',
        fontFamily: 'monospace',
        fontSize: '26px',
      }
    );

    this.textbox.setOrigin(0.5, 0.5);
  }

  update(time: number, delta: number) {
    if (!this.textbox) {
      return;
    }

    this.textbox.rotation += 0.0005 * delta;
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
