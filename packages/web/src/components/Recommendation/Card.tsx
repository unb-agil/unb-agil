import { Box, Chip, Typography } from '@mui/material';
import capitalize from 'capitalize-pt-br';
import { Component } from '@/models/entities';

interface RecommendationCardProps {
  component: Component;
}

export default function RecommendationCard({
  component,
}: RecommendationCardProps) {
  return (
    <Box
      p={1}
      borderRadius={1}
      bgcolor="white"
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Chip
        label={component.sigaaId}
        variant="outlined"
        size="small"
        color="primary"
      />

      <Typography sx={{ flexGrow: 1 }} variant="body1" fontWeight={500}>
        {capitalize(component.title, ['para'])}
      </Typography>

      <Box>
        <Typography variant="body1" color="textSecondary" noWrap>
          {component.totalWorkload}h ({component.totalWorkload / 15} créditos)
        </Typography>
      </Box>
    </Box>
  );
}
