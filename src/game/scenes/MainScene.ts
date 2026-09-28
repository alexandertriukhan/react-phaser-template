import { reaction } from 'mobx';
import { Display, Scene, type GameObjects, type Input } from 'phaser';
import gameStore from '../../store/gameStore';
import { disposeOnShutdown } from '../utils/disposeOnShutdown';

export default class MainScene extends Scene {
  private hint!: GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  create() {
    this.hint = this.add
      .text(0, 0, 'Click anywhere', { fontFamily: 'sans-serif', fontSize: '32px' })
      .setOrigin(0.5);
    this.layout();

    // The scale manager belongs to the game, so its listeners must be removed by hand.
    this.scale.on('resize', this.layout, this);
    disposeOnShutdown(this, () => this.scale.off('resize', this.layout, this));

    // Phaser -> React: write to the store, the HUD re-renders on its own.
    this.input.on('pointerdown', (pointer: Input.Pointer) => {
      this.spawnBurst(pointer.worldX, pointer.worldY);
      gameStore.addScore(1);
    });

    // React -> Phaser: react to store changes made by the UI.
    disposeOnShutdown(
      this,
      reaction(
        () => gameStore.isPaused,
        isPaused => (isPaused ? this.scene.pause() : this.scene.resume()),
        { fireImmediately: true },
      ),
    );
  }

  private layout() {
    const { width, height } = this.scale;
    this.hint.setPosition(width / 2, height / 2);
  }

  private spawnBurst(x: number, y: number) {
    const circle = this.add.circle(x, y, 24, Display.Color.RandomRGB().color);
    this.tweens.add({
      targets: circle,
      scale: 3,
      alpha: 0,
      duration: 500,
      ease: 'Cubic.easeOut',
      onComplete: () => circle.destroy(),
    });
  }
}
