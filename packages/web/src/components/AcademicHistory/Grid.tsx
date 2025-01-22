import { Grid2 } from '@mui/material';
import AcademicHistoryContainer from '@/components/AcademicHistory/Container';
import AcademicHistoryOverview from '@/components/AcademicHistory/Overview';
import AcademicHistoryForm from '@/components/AcademicHistory/Form';

export default function AcademicHistoryGrid() {
  return (
    <AcademicHistoryContainer step={2} totalSteps={2}>
      <Grid2 pt={3} container height="100%" width="100%" spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <AcademicHistoryOverview />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <AcademicHistoryForm />
        </Grid2>
      </Grid2>
    </AcademicHistoryContainer>
  );
}
