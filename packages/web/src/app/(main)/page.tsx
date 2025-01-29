'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Box, Grid2, Paper, Typography } from '@mui/material';

import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import AcademicHistoryUpload from '@/components/AcademicHistory/Upload';
import Container from '@/components/Container';

const Recommendation = dynamic(() => import('@/components/Recommendation'));
const RecommendationOptions = dynamic(
  () => import('@/components/AcademicHistory/Grid'),
);

export default function Home() {
  const { academicHistory, recommendation } = useAcademicHistoryContext();

  useEffect(() => {
    if (recommendation) {
      window.scrollTo(0, 0);
    }
  }, [recommendation]);

  if (recommendation) {
    return <Recommendation />;
  }

  if (academicHistory) {
    return <RecommendationOptions />;
  }

  return (
    <Container>
      <AcademicHistoryUpload />

      <Typography variant="h5">Como obter o histórico acadêmico</Typography>

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" fontWeight={700}>
            Acesse o <Link href="https://autenticacao.unb.br">SIGAA</Link>
          </Typography>

          <Paper elevation={5}>
            <Box
              mt={2}
              width="100%"
              paddingBottom="141.53%"
              position="relative"
            >
              <Image src="/guide/login.png" alt="Tela de login do SIGAA" fill />
            </Box>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" fontWeight={700}>
            Clique em &quot;emitir histórico&quot;
          </Typography>

          <Paper elevation={5}>
            <Box
              mt={2}
              width="100%"
              paddingBottom="141.53%"
              position="relative"
            >
              <Image
                src="/guide/emitir.png"
                alt="Tela de login do SIGAA"
                fill
              />
            </Box>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" fontWeight={700}>
            Envie o PDF para o UnB Ágil
          </Typography>

          <Paper elevation={5}>
            <Box
              mt={2}
              width="100%"
              paddingBottom="141.53%"
              position="relative"
            >
              <Image
                src="/guide/historico.png"
                alt="Tela de login do SIGAA"
                fill
              />
            </Box>
          </Paper>
        </Grid2>
      </Grid2>
    </Container>
  );
}
