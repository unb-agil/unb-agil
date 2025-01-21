import { Slider, Typography } from '@mui/material';

export default function AcademicHistoryForm() {
  return (
    <>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Opções de recomendação
      </Typography>

      <Slider min={10} max={32} defaultValue={24} valueLabelDisplay="auto" />
    </>
  );
}
