import { useMemo } from 'react';
import { Typography } from '@mui/material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';

export default function AcademicHistoryOverview() {
  const { academicHistory } = useAcademicHistoryContext();

  const workloads = useMemo(() => {
    if (!academicHistory) {
      return null;
    }

    const {
      workloads: { completed, required },
    } = academicHistory;

    const total = ((completed.total / required.total) * 100).toFixed(2);

    const mandatory = (
      (completed.mandatory / required.mandatory) *
      100
    ).toFixed(2);

    const elective = ((completed.elective / required.elective) * 100).toFixed(
      2,
    );

    return {
      total,
      mandatory,
      elective,
    };
  }, [academicHistory]);

  if (!workloads) {
    return <></>;
  }

  return (
    <>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Visão geral
      </Typography>

      <Typography variant="body1">
        Total integralizado: <strong>{workloads.total}%</strong>
      </Typography>

      <Typography variant="body1">
        Obrigatórias integralizadas: <strong>{workloads.mandatory}%</strong>
      </Typography>

      <Typography variant="body1">
        Optativas integralizadas: <strong>{workloads.elective}%</strong>
      </Typography>
    </>
  );
}
