import { Box } from '@mui/material';
import Hud from '../../components/Hud';
import PhaserGame from '../../components/PhaserGame';

const GameScreen = () => {
  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      <PhaserGame />
      <Hud />
    </Box>
  );
};

export default GameScreen;
