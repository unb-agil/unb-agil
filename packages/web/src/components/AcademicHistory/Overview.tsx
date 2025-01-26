import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';

function getPercentageLabel(value: number, total: number) {
  if (total === 0) {
    return null;
  }

  return Math.round((value / total) * 100);
}

export default function AcademicHistoryOverview() {
  const { academicHistory } = useAcademicHistoryContext();

  const percentage = useMemo(() => {
    if (!academicHistory) {
      return null;
    }

    const {
      workloads: { required, completed },
    } = academicHistory;

    const totalRequired = required.mandatory + required.elective;
    const cappedCompletedElective = Math.min(
      required.elective,
      completed.elective,
    );
    const cappedCompletedMandatory = Math.min(
      required.mandatory,
      completed.mandatory,
    );
    const totalCompleted = cappedCompletedElective + cappedCompletedMandatory;

    const percentage = {
      total: getPercentageLabel(totalCompleted, totalRequired),
      mandatory: getPercentageLabel(completed.mandatory, required.mandatory),
      elective: getPercentageLabel(completed.elective, required.elective),
      complementary: getPercentageLabel(
        completed.complementary,
        required.complementary,
      ),
    };

    return percentage;
  }, [academicHistory]);

  if (!academicHistory) {
    return null;
  }

  return (
    <Box height="100%" display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">Resumo do histórico</Typography>

      <Box mt={2}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={700}>
            O que você já fez
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body2">
            Total: <strong>{percentage?.total}%</strong>
          </Typography>

          <Typography variant="body2">
            Obrigatórias: <strong>{percentage?.mandatory}%</strong>
          </Typography>
          <Typography variant="body2">
            Optativas: <strong>{percentage?.elective}%</strong>{' '}
            {percentage?.elective &&
              percentage?.elective > 100 &&
              '(fez mais do que o exigido)'}
          </Typography>

          {percentage?.complementary && (
            <Typography variant="body2">
              Complementares: <strong>{percentage?.complementary}%</strong>
            </Typography>
          )}
        </Box>
      </Box>

      <Box mt={2}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={700}>
            O que falta fazer
          </Typography>
        </Box>

        <Box mt={1}>
          <Typography variant="body2">
            Total:{' '}
            <strong>
              {academicHistory.workloads.remaining.total}h (
              {academicHistory.workloads.remaining.total / 15} créditos)
            </strong>
          </Typography>

          <Typography variant="body2">
            Obrigatórias:{' '}
            <strong>
              {academicHistory.workloads.remaining.mandatory}h (
              {academicHistory.workloads.remaining.mandatory / 15} créditos)
            </strong>
          </Typography>

          <Typography variant="body2">
            Optativas:{' '}
            <strong>
              {academicHistory.workloads.remaining.elective}h (
              {academicHistory.workloads.remaining.elective / 15} créditos)
            </strong>
          </Typography>

          {academicHistory.workloads.remaining.complementary !== 0 && (
            <Typography variant="body2">
              Complementares:{' '}
              <strong>
                {academicHistory.workloads.remaining.complementary}h (
                {academicHistory.workloads.remaining.complementary / 15}
                créditos)
              </strong>
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
