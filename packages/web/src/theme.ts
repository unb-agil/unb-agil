'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: 'var(--font-montserrat)',
    h1: {
      fontFamily: 'var(--font-barlow-condensed)',
    },
    h2: {
      fontFamily: 'var(--font-barlow-condensed)',
    },
    h3: {
      fontFamily: 'var(--font-barlow-condensed)',
    },
    h4: {
      fontFamily: 'var(--font-barlow-condensed)',
    },
    h5: {
      fontFamily: 'var(--font-barlow-condensed)',
    },
    h6: {
      fontFamily: 'var(--font-barlow-condensed)',
    },
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
