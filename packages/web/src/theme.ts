'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-montserrat)',
  },
  palette: {
    background: {
      default: '#EDE8f5',
    },
    primary: {
      main: '#6256CA',
    },
    secondary: {
      main: '#86D293',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default theme;
