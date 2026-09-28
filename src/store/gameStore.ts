import { makeAutoObservable } from 'mobx';

/**
 * State shared between React UI and Phaser scenes.
 * Keep it to what the UI needs to show or control: per-frame values (positions, velocities)
 * belong to game objects, otherwise every frame turns into a React re-render.
 */
class GameStore {
  score = 0;
  isPaused = false;

  constructor() {
    // autoBind lets actions be passed around as callbacks (onClick, Phaser event handlers).
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addScore(points: number) {
    this.score += points;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}

const gameStore = new GameStore();
export default gameStore;
