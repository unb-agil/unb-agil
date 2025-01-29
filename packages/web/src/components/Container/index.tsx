import { Box } from '@mui/material';
import Hero from '@/components/Hero';

function Container({ children }: { children: React.ReactNode }) {
  return (
    <Box display="flex" flexDirection="column" gap={3} pt={3} pb={5}>
      <Hero />

      {children}
    </Box>
  );
}

export default Container;
