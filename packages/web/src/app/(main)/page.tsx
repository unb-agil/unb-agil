'use client';

import Image from 'next/image';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import AcademicHistoryUpload from '@/components/AcademicHistory/Upload';
import Recommendation from '@/components/Recommendation';
import Hero from '@/components/Hero';
import RecommendationOptions from '@/components/AcademicHistory/Grid';

export default function Home() {
  const { academicHistory, recommendation } = useAcademicHistoryContext();

  if (recommendation) {
    return <Recommendation />;
  }

  return (
    <Box display="flex" flexDirection="column" gap={3} pt={3}>
      <Hero />

      {academicHistory ? (
        <RecommendationOptions />
      ) : (
        <>
          <AcademicHistoryUpload />

          <Typography variant="h5">Como obter o histórico acadêmico</Typography>

          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={700}>
                1. Acesse o SIGAA da UnB.
              </Typography>

              <Paper sx={{ mt: 2 }} elevation={5}>
                <Image
                  src="/sigaa/login.png"
                  alt="Tela de login do SIGAA"
                  layout="responsive"
                  width={250}
                  height={250}
                />
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={700}>
                2. Clique em <i>&quot;Emitir histórico&quot;.</i>
              </Typography>

              <Paper sx={{ mt: 2 }} elevation={5}>
                <Image
                  src="/sigaa/emitir.png"
                  alt="Tela de login do SIGAA"
                  layout="responsive"
                  width={250}
                  height={250}
                />
              </Paper>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={700}>
                3. Envie o PDF para o UnB Ágil.
              </Typography>

              <Paper sx={{ mt: 2 }} elevation={5}>
                <Image
                  src="/sigaa/login.png"
                  alt="Tela de login do SIGAA"
                  layout="responsive"
                  width={250}
                  height={250}
                />
              </Paper>
            </Grid2>
          </Grid2>
        </>
      )}
    </Box>
  );
}
