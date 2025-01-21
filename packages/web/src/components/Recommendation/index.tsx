import { Box, Typography } from '@mui/material';
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
        <Box key={index}>
          <Typography
            variant="h5"
            gutterBottom
            color="primary"
            fontWeight={700}
          >
            Período {index + 1}
          </Typography>

          <Box display="flex" gap={3}>
            {period.map((component) => (
              <RecommendationCard
                key={component.sigaaId}
                component={component}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
