import { Box } from '@mui/material';

interface AcademicHistoryContainerProps {
  children: React.ReactNode;
}

export default function AcademicHistoryContainer({
  children,
}: AcademicHistoryContainerProps) {
  return (
    <Box
      height="400px"
      border="2px dashed"
      borderRadius="8px"
      borderColor="primary.main"
      padding={3}
    >
      {children}
    </Box>
  );
}
