import { Scene } from 'phaser';
import { GAME_WIDTH, TILE_SIZE } from './settings';

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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.scene.start('scene-game', { level: currentLevel + 1 });
      }
    });
  }
}
