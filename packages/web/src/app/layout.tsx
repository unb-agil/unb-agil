import type { Metadata } from 'next';
import { Barlow_Condensed, Montserrat } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow-condensed',
});

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'UnB Ágil',
  description:
    'Otimize o fluxo até a sua formatura. O UnB Ágil calcula e recomenda disciplinas para você priorizar em cada semestre.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${barlowCondensed.variable} ${montserrat.variable}`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
