'use client';

import { useMemo } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
} from '@mui/material';

import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import WorkloadProgress from '@/components/Workload/Completed';
import RemainingWorkload from '@/components/Workload/Remaining';

export default function WorkloadTable() {
  const { academicHistory } = useAcademicHistoryContext();

  const total = useMemo(() => {
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

    return {
      required: totalRequired,
      completed: totalCompleted,
    };
  }, [academicHistory]);

  return (
    <Box px={2} pt={2} borderRadius={1} bgcolor="white">
      <Typography variant="h6" gutterBottom>
        Visão geral
      </Typography>

      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell height={61}>
              <Typography variant="body2" fontWeight={700}>
                Componentes
              </Typography>
            </TableCell>

            <TableCell align="center" height={61}>
              <Typography variant="body2" fontWeight={700}>
                Já fez
              </Typography>
            </TableCell>

            <TableCell align="center">
              <Typography variant="body2" fontWeight={700}>
                Falta fazer
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow>
            <TableCell height={61}>
              <Typography variant="body1">Obrigatórios</Typography>
            </TableCell>

            <TableCell align="center">
              <WorkloadProgress
                required={academicHistory.workloads.required.mandatory}
                completed={academicHistory.workloads.completed.mandatory}
              />
            </TableCell>

            <TableCell align="center">
              <RemainingWorkload
                remaining={academicHistory.workloads.remaining.mandatory}
                required={academicHistory.workloads.required.mandatory}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell height={61}>
              <Typography variant="body1">Optativos</Typography>
            </TableCell>

            <TableCell align="center">
              <WorkloadProgress
                required={academicHistory.workloads.required.elective}
                completed={academicHistory.workloads.completed.elective}
              />
            </TableCell>

            <TableCell align="center">
              <RemainingWorkload
                remaining={academicHistory.workloads.remaining.elective}
                required={academicHistory.workloads.required.elective}
              />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell height={61}>
              <Typography variant="body1">Complementares</Typography>
            </TableCell>

            <TableCell align="center">
              <WorkloadProgress
                required={academicHistory.workloads.required.complementary}
                completed={academicHistory.workloads.completed.complementary}
              />
            </TableCell>

            <TableCell align="center">
              <RemainingWorkload
                remaining={academicHistory.workloads.remaining.complementary}
                required={academicHistory.workloads.required.complementary}
              />
            </TableCell>
          </TableRow>

          <TableRow
            sx={{
              '&:last-child td, &:last-child th': {
                border: 0,
              },
            }}
          >
            <TableCell height={61}>
              <Typography variant="body1" fontWeight={500}>
                Total
              </Typography>
            </TableCell>

            <TableCell align="center">
              <WorkloadProgress
                required={total.required}
                completed={total.completed}
                typography={{ fontWeight: 500 }}
              />
            </TableCell>

            <TableCell align="center">
              <RemainingWorkload
                remaining={academicHistory.workloads.remaining.total}
                required={total.required}
                typography={{ fontWeight: 500 }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
