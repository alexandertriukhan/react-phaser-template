import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          userSelect: 'none',
        },
        body: {
          overflow: 'hidden',
        },
      },
    },
  },
});
