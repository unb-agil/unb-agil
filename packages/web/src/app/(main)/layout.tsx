'use client';

import { Container } from '@mui/material';
import { AcademicHistoryProvider } from '@/context/AcademicHistoryContext';
import AppBar from '@/components/AppBar';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <AppBar />

      <Container maxWidth="lg">
        <AcademicHistoryProvider>{children}</AcademicHistoryProvider>
      </Container>
    </>
  );
}
