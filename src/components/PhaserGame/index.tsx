import { useEffect, useRef } from 'react';
import type { Game } from 'phaser';
import { startGame } from '../../game';
import styles from './styles.module.css';

/** Owns the Phaser.Game instance: one game per mount, destroyed on unmount. */
const PhaserGame = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Deferred by one task, so StrictMode's dev-only mount -> unmount -> mount cancels the first
    // attempt instead of booting a second game (extra WebGL and AudioContext, Phaser audio errors).
    let game: Game | undefined;
    const timer = setTimeout(() => {
      game = startGame(container);
    });
    return () => {
      clearTimeout(timer);
      game?.destroy(true);
    };
    // Intentional dep: startGame gets a new identity when any game module is hot-updated, so editing
    // a scene restarts the game. With [], Fast Refresh under StrictMode keeps the stale game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame]);

  return <div ref={containerRef} className={styles.container} />;
};

export default PhaserGame;
