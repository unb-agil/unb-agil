import { useEffect, useState } from 'react';
import { Box, Button, Slider, Typography } from '@mui/material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import useGetRecommendation from '@/hooks/useGetRecommendation';

export default function AcademicHistoryForm() {
  const { academicHistory, setRecommendation } = useAcademicHistoryContext();
  const [maxWorkloadByPeriod, setMaxWorkloadByPeriod] = useState(24);
  const { recommend, data } = useGetRecommendation();

  useEffect(() => {
    if (!data) {
      return;
    }

    setRecommendation(data);
  }, [data, setRecommendation]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setMaxWorkloadByPeriod(newValue as number);
  };

  const handleOnButtonClick = () => {
    if (!academicHistory) {
      return;
    }

    recommend(academicHistory, {
      maxWorkloadByPeriod: maxWorkloadByPeriod * 15,
    });
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Opções
      </Typography>

      <Box>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          Créditos por semestre
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Typography variant="body1">10</Typography>

          <Slider
            min={10}
            max={32}
            value={maxWorkloadByPeriod}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
          />

          <Typography variant="body1">32</Typography>
        </Box>
      </Box>

      <Box flexGrow={1} />

      <Box display="flex" flexDirection="row" justifyContent="end" gap={2}>
        <Button variant="outlined" color="primary">
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOnButtonClick}
        >
          Gerar recomendação
        </Button>
      </Box>
    </Box>
  );
}
