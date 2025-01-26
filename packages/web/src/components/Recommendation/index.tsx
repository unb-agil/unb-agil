import { Box, Divider, Typography } from '@mui/material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import RecommendationCard from '@/components/Recommendation/Card';

export default function Recommendation() {
  const { recommendation } = useAcademicHistoryContext();

  if (!recommendation) {
    return <></>;
  }

  return (
    <Box display="flex" flexDirection="column" gap={5}>
      {recommendation.map((period, index) => (
        <Box key={index} display="flex" flexDirection="column" gap={2}>
          <Box key={index} display="flex" alignItems="center" gap={2}>
            <Typography variant="h5">Período {index + 1}</Typography>

            <Divider sx={{ flexGrow: 1 }} />

            <Typography variant="body1" color="textSecondary">
              {period.reduce(
                (acc, component) => acc + component.totalWorkload,
                0,
              )}
              h (
              {period.reduce(
                (acc, component) => acc + component.totalWorkload / 15,
                0,
              )}{' '}
              créditos)
            </Typography>
          </Box>

          {period.map((component) => (
            <RecommendationCard key={component.sigaaId} component={component} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
