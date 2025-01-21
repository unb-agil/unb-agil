import { Grid2 } from '@mui/material';
import AcademicHistoryContainer from '@/components/AcademicHistory/Container';
import AcademicHistoryOverview from '@/components/AcademicHistory/Overview';
import AcademicHistoryForm from '@/components/AcademicHistory/Form';

export default function AcademicHistoryGrid() {
  return (
    <AcademicHistoryContainer>
      <Grid2 container width="100%">
        <Grid2 size={{ xs: 12, sm: 6 }}>
          <AcademicHistoryOverview />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6 }}>
          <AcademicHistoryForm />
        </Grid2>
      </Grid2>
    </AcademicHistoryContainer>
  );
}
