import Hud from '../../components/Hud';
import PhaserGame from '../../components/PhaserGame';
import styles from './styles.module.css';

const GameScreen = () => {
  return (
    <div className={styles.root}>
      <PhaserGame />
      <Hud />
    </div>
  );
};

export default GameScreen;
