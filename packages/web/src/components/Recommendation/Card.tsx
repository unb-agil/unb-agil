import { Box, Typography } from '@mui/material';
import capitalize from 'capitalize-pt-br';
import { Component } from '@/models/entities';

interface RecommendationCardProps {
  component: Component;
  currentPeriod?: boolean;
}

export default function RecommendationCard({
  component,
  currentPeriod,
}: RecommendationCardProps) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={1}
      bgcolor={currentPeriod ? 'transparent' : 'white'}
      border={currentPeriod ? 1 : 0}
      borderColor="primary.light"
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="caption" color="textSecondary">
          {component.sigaaId}
        </Typography>

        <Box flexGrow={1} />

        <Typography variant="caption" color="textSecondary" noWrap>
          {component.totalWorkload}h ({component.totalWorkload / 15} créditos)
        </Typography>
      </Box>

      <Typography sx={{ flexGrow: 1 }} variant="body1" fontWeight={500}>
        {capitalize(component.title, ['para', 'à'])}
      </Typography>
    </Box>
  );
}
