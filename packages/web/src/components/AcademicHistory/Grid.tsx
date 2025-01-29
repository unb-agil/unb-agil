import { Grid2 } from '@mui/material';
import WorkloadTable from '@/components/Workload/Table';
import AcademicHistoryForm from '@/components/AcademicHistory/Form';

export default function RecommendationOptions() {
  return (
    <>
      <Grid2 container height="100%" width="100%" spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <WorkloadTable />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <AcademicHistoryForm />
        </Grid2>
      </Grid2>
    </>
  );
}
