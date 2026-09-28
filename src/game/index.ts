import { AUTO, Game, Scale } from 'phaser';
import MainScene from './scenes/MainScene';

/** Creates the game inside `parent`; the canvas follows the parent's size. */
export function startGame(parent: HTMLElement) {
  return new Game({
    type: AUTO,
    parent,
    backgroundColor: '#1b1b2f',
    scale: { mode: Scale.RESIZE },
    scene: [MainScene],
  });
}
