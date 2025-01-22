import { Box, Toolbar, Typography } from '@mui/material';

interface AcademicHistoryContainerProps {
  step: number;
  totalSteps: number;
  children: React.ReactNode;
}

export default function AcademicHistoryContainer({
  step,
  totalSteps,
  children,
}: AcademicHistoryContainerProps) {
  return (
    <Box
      height="300px"
      border="2px dashed"
      borderRadius="8px"
      borderColor="primary.main"
      position="relative"
    >
      <Toolbar variant="dense">
        <Typography variant="body2" color="primary">
          Passo {step} de {totalSteps}
        </Typography>
      </Toolbar>

      <Box
        height="100%"
        padding={3}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        {children}
      </Box>
    </Box>
  );
}
