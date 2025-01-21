'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-poppins)',
  },
  palette: {
    primary: {
      main: '#547B73',
    },
    secondary: {
      main: '#454545',
    },
  },
});

export default theme;
