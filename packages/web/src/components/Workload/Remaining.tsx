import { Box, Typography, TypographyProps } from '@mui/material';
import { BlockOutlined, CheckCircleOutline } from '@mui/icons-material';

interface RemainingWorkloadProps {
  remaining: number;
  required: number;
  typography?: TypographyProps;
}

function RemainingWorkload({
  remaining,
  required,
  typography,
}: RemainingWorkloadProps) {
  if (!required) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <BlockOutlined color="disabled" />

        <Typography variant="caption" color="textSecondary" {...typography}>
          Não exigido
        </Typography>
      </Box>
    );
  }

  if (remaining <= 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <CheckCircleOutline color="secondary" />

        <Typography variant="caption" color="textSecondary" {...typography}>
          Concluído
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="body2" {...typography}>
        {remaining}h
      </Typography>

      <Typography variant="caption" color="textSecondary" {...typography}>
        ({remaining / 15} créditos)
      </Typography>
    </Box>
  );
}

export default RemainingWorkload;
