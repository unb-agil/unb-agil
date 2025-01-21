'use client';

import { Container } from '@mui/material';
import { AcademicHistoryProvider } from '@/context/AcademicHistoryContext';

type MainLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Container maxWidth="lg">
      <AcademicHistoryProvider>{children}</AcademicHistoryProvider>
    </Container>
  );
}
