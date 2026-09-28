import { observer } from 'mobx-react-lite';
import gameStore from '../../store/gameStore';
import styles from './styles.module.css';

/** Overlay above the canvas. Re-renders only when the store values it reads change. */
const Hud = observer(function Hud() {
  return (
    <div className={styles.hud}>
      <div className={styles.score}>Score: {gameStore.score}</div>
      <button type="button" className={styles.button} onClick={gameStore.togglePause}>
        {gameStore.isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
});

export default Hud;
