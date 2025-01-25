'use client';

import { Box, Container } from '@mui/material';
import { AcademicHistoryProvider } from '@/context/AcademicHistoryContext';
import AppBar from '@/components/AppBar';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar />

      <Container sx={{ height: '100%' }} maxWidth="md">
        <AcademicHistoryProvider>{children}</AcademicHistoryProvider>
      </Container>
    </Box>
  );
}
