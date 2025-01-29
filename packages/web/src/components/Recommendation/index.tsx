import { Box, Button, Typography } from '@mui/material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import RecommendationCard from '@/components/Recommendation/Card';

export default function Recommendation() {
  const { recommendation } = useAcademicHistoryContext();

  if (!recommendation) {
    return <></>;
  }

  return (
    <Box display="flex" flexDirection="column" pt={3} pb={5}>
      {recommendation.map((period, index) => (
        <Box key={index}>
          <Box
            mt={index === 0 ? 0 : 2}
            mb={2}
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <Typography variant="body1" fontWeight={700}>
              {index === 0
                ? 'Período atual'
                : `Próximo período nº
              ${index}`}
            </Typography>

            <Box flexGrow={1} />

            <Typography variant="body2" color="textSecondary">
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

          <Box display="flex" flexDirection="column" gap={1}>
            {period.map((component) => (
              <RecommendationCard
                key={component.sigaaId}
                component={component}
                currentPeriod={index === 0}
              />
            ))}
          </Box>
        </Box>
      ))}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log('Implementar');
          }}
        >
          Alterar opções
        </Button>
      </Box>
    </Box>
  );
}
