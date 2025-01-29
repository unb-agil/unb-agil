import {
  Box,
  CircularProgress,
  Typography,
  TypographyProps,
} from '@mui/material';

interface WorkloadProgressProps {
  completed: number;
  required: number;
  typography?: TypographyProps;
}

function CompletedWorkload({
  completed,
  required,
  typography,
}: WorkloadProgressProps) {
  if (!required) {
    return <Typography variant="body2">{completed}h</Typography>;
  }

  const percentage = Math.round((completed / required) * 100);
  const cappedPercentage = Math.min(100, percentage);
  const color = percentage >= 100 ? 'secondary' : 'primary';

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress
        variant="determinate"
        value={cappedPercentage}
        color={color}
        size={45}
      />

      <Box
        sx={{ inset: 0 }}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="body2" {...typography}>
          {percentage}%
        </Typography>
      </Box>
    </Box>
  );
}

export default CompletedWorkload;
