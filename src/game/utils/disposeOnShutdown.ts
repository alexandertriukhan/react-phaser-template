import { Scenes, type Scene } from 'phaser';

/**
 * Runs `dispose` when the scene shuts down (stop/restart) or is destroyed with the game.
 * Use it for everything that outlives a scene on its own: MobX reactions,
 * listeners on game-wide emitters (`this.scale`, `this.game.events`), timers, etc.
 */
export function disposeOnShutdown(scene: Scene, dispose: () => void) {
  const cleanup = () => {
    scene.events.off(Scenes.Events.SHUTDOWN, cleanup);
    scene.events.off(Scenes.Events.DESTROY, cleanup);
    dispose();
  };
  scene.events.once(Scenes.Events.SHUTDOWN, cleanup);
  scene.events.once(Scenes.Events.DESTROY, cleanup);
}
