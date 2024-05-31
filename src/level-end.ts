import { Scene } from 'phaser';
import { GAME_WIDTH, TILE_SIZE } from './settings';
import { LEVELS } from './assets/levels';

export class LevelEnd extends Scene {
  constructor() {
    super('scene-level-end');
  }

  preload() {}

  create({
    moves = 0,
    currentLevel = 0,
  }: {
    currentLevel: number;
    moves: number;
  }) {
    this.add
      .text(GAME_WIDTH / 2, 3 * TILE_SIZE, 'Level won', {
        color: 'hsl(17,100%,64%)',
        font: 'bold 40px Play',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 4 * TILE_SIZE, `${moves} moves`, {
        font: 'bold 30px Play',
      })
      .setOrigin(0.5);

    const sfx = this.sound.add('button-click');
    const restartBtn = this.add
      .text(GAME_WIDTH / 2, 5 * TILE_SIZE + TILE_SIZE / 4, 'Restart level', {
        fontFamily: 'Play',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        fixedWidth: TILE_SIZE * 4,
        backgroundColor: 'hsl(24,86%,57%)',
      })
      .setPadding(TILE_SIZE / 4)
      .setOrigin(0.5);
    restartBtn.setInteractive();
    restartBtn.on('pointerover', () => {
      restartBtn.setBackgroundColor('hsla(24, 86%, 57%,0.7)');
    });
    restartBtn.on('pointerout', () => {
      restartBtn.setBackgroundColor('hsl(24,86%,57%)');
    });
    restartBtn.on('pointerdown', () => {
      sfx.play();
      this.game.scene.start('scene-game', { level: currentLevel });
      this.game.scene.stop('scene-level-end');
    });

    let yPos = 6;
    if (currentLevel < Object.keys(LEVELS).length) {
      yPos = 7;
      const nextLevelBtn = this.add
        .text(GAME_WIDTH / 2, 6 * TILE_SIZE + TILE_SIZE / 4, 'Next level', {
          fontFamily: 'Play',
          fontSize: '24px',
          color: '#ffffff',
          align: 'center',
          fixedWidth: TILE_SIZE * 4,
          backgroundColor: 'hsl(24,6%,27%)',
        })
        .setPadding(TILE_SIZE / 4)
        .setOrigin(0.5);
      nextLevelBtn.setInteractive();
      nextLevelBtn.on('pointerover', () => {
        nextLevelBtn.setBackgroundColor('hsla(24, 6%, 27%,0.7)');
      });
      nextLevelBtn.on('pointerout', () => {
        nextLevelBtn.setBackgroundColor('hsl(24,6%,27%)');
      });
      nextLevelBtn.on('pointerdown', () => {
        sfx.play();
        this.game.scene.start('scene-game', { level: currentLevel + 1 });
        this.game.scene.stop('scene-level-end');
      });
    }
    const levelsBtn = this.add
      .text(
        GAME_WIDTH / 2,
        yPos * TILE_SIZE + TILE_SIZE / 4,
        'Back to Levels',
        {
          fontFamily: 'Play',
          fontSize: '24px',
          color: '#ffffff',
          align: 'center',
          fixedWidth: TILE_SIZE * 4,
          backgroundColor: 'hsl(24,6%,27%)',
        }
      )
      .setPadding(TILE_SIZE / 4)
      .setOrigin(0.5);
    levelsBtn.setInteractive();
    levelsBtn.on('pointerover', () => {
      levelsBtn.setBackgroundColor('hsla(24, 6%, 27%,0.7)');
    });
    levelsBtn.on('pointerout', () => {
      levelsBtn.setBackgroundColor('hsl(24,6%,27%)');
    });
    levelsBtn.on('pointerdown', () => {
      sfx.play();
      this.game.scene.start('scene-levels');
      this.game.scene.stop('scene-level-end');
    });
  }
}
