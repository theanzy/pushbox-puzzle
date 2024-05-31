import { Scene } from 'phaser';
import { GAME_WIDTH, TILE_SIZE } from './settings';
import { LEVELS } from './assets/levels';

export class Levels extends Scene {
  constructor() {
    super('scene-levels');
  }

  preload() {}

  create() {
    this.add
      .text(GAME_WIDTH / 2, TILE_SIZE, 'Choose a level', {
        color: 'hsl(17,100%,64%)',
        font: 'bold 40px Play',
      })
      .setOrigin(0.5);

    const sfx = this.sound.add('button-click');
    const spacing = TILE_SIZE;
    Object.keys(LEVELS).forEach((_, i) => {
      const ix = i % 4;
      const iy = Math.floor(i / 4);

      const btn = this.add
        .text(
          2 * TILE_SIZE + TILE_SIZE * ix + ix * spacing,
          3 * TILE_SIZE + iy * 1.5 * TILE_SIZE,
          `${i + 1}`,
          {
            fontFamily: 'Play',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: TILE_SIZE,
            backgroundColor: 'hsl(24,86%,57%)',
          }
        )
        .setPadding(TILE_SIZE / 4)
        .setOrigin(0.5);

      btn.setInteractive();
      btn.on('pointerover', () => {
        btn.setBackgroundColor('hsla(24, 86%, 57%,0.7)');
      });
      btn.on('pointerout', () => {
        btn.setBackgroundColor('hsl(24,86%,57%)');
      });
      btn.on('pointerdown', () => {
        sfx.play();
        this.game.scene.start('scene-game', { level: i + 1 });
        this.game.scene.stop('scene-levels');
      });
    });
  }
}
