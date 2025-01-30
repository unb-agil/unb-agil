import { Box, Button, Grid2 } from '@mui/material';
import { ArrowBackOutlined } from '@mui/icons-material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import WorkloadTable from '@/components/Workload/Table';
import AcademicHistoryForm from '@/components/AcademicHistory/Form';

export default function RecommendationOptions() {
  const { setAcademicHistory } = useAcademicHistoryContext();

  const handleOnBackClick = () => {
    setAcademicHistory(null);
  };

  return (
    <Box>
      <Box mb={3}>
        <Button
          variant="text"
          color="primary"
          startIcon={<ArrowBackOutlined />}
          onClick={handleOnBackClick}
        >
          Escolher outro histórico
        </Button>
      </Box>

      <Grid2 container height="100%" width="100%" spacing={3}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <WorkloadTable />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 6 }}>
          <AcademicHistoryForm />
        </Grid2>
      </Grid2>
    </Box>
  );
}
