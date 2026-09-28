import { observer } from 'mobx-react-lite';
import { Box, Button, Typography } from '@mui/material';
import gameStore from '../../store/gameStore';

/**
 * Overlay above the canvas. The container ignores the pointer so clicks reach the game;
 * interactive children opt back in with `pointerEvents: 'auto'`.
 */
const Hud = observer(function Hud() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        pointerEvents: 'none',
      }}
    >
      <Typography variant="h5">Score: {gameStore.score}</Typography>
      <Button variant="contained" onClick={gameStore.togglePause} sx={{ pointerEvents: 'auto' }}>
        {gameStore.isPaused ? 'Resume' : 'Pause'}
      </Button>
    </Box>
  );
});

export default Hud;
