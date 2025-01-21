import { useEffect, useState } from 'react';
import { Button, Slider, Typography } from '@mui/material';
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
    <>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Opções de recomendação
      </Typography>

      <Slider
        min={10}
        max={32}
        value={maxWorkloadByPeriod}
        valueLabelDisplay="auto"
        onChange={handleSliderChange}
      />

      <Button variant="contained" color="primary" onClick={handleOnButtonClick}>
        Gerar recomendação
      </Button>
    </>
  );
}
