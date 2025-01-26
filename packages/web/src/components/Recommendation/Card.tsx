import { Box, Typography } from '@mui/material';
import capitalize from 'capitalize-pt-br';
import { Component } from '@/models/entities';

interface RecommendationCardProps {
  component: Component;
}

export default function RecommendationCard({
  component,
}: RecommendationCardProps) {
  return (
    <Box px={2} py={1} borderRadius={1} bgcolor="white">
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="caption" color="textSecondary">
          {component.sigaaId} — {component.totalWorkload}h (
          {component.totalWorkload / 15} créditos)
        </Typography>
      </Box>

      <Typography sx={{ flexGrow: 1 }} variant="h6" fontWeight={500}>
        {capitalize(component.title, ['para', 'à'])}
      </Typography>
    </Box>
  );
}
