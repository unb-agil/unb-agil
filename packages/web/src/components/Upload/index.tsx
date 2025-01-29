import Link from 'next/link';
import Image from 'next/image';
import { Alert, Box, Grid2, Paper, Typography } from '@mui/material';
import AcademicHistoryUpload from '@/components/AcademicHistory/Upload';

export default function UploadContainer() {
  return (
    <>
      <Alert severity="info" variant="outlined">
        <Typography variant="body2">
          Ainda estamos em testes apenas com o curso de{' '}
          <strong>Engenharia de Software</strong>.{' '}
          <Link href="https://forms.gle/F732P3vu6ot9cJVg6" target="_blank">
            Entre na lista de espera
          </Link>
          .
        </Typography>
      </Alert>

      <AcademicHistoryUpload />

      <Typography variant="h5">Como obter o histórico acadêmico</Typography>

      <Grid2 container spacing={4}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Typography variant="body2">
            1.{` `}
            <Box component="span" fontWeight={700}>
              Acesse o <Link href="https://autenticacao.unb.br">SIGAA</Link>.
            </Box>
          </Typography>

          <Paper sx={{ borderRadius: 2 }}>
            <Box
              mt={2}
              width="100%"
              paddingBottom="141.53%"
              position="relative"
              borderRadius="8px"
              overflow="hidden"
            >
              <Image src="/guide/login.png" alt="Tela de login do SIGAA" fill />
            </Box>
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 4 }}>
          <Typography variant="body2">
            2.{' '}
            <Box component="span" fontWeight={700}>
              Clique em &quot;emitir histórico&quot;.
            </Box>
          </Typography>

          <Paper sx={{ borderRadius: 2 }}>
            <Box
              mt={2}
              width="100%"
              paddingBottom="141.53%"
              position="relative"
              borderRadius="8px"
              overflow="hidden"
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
          <Typography variant="body2">
            3.{' '}
            <Box component="span" fontWeight={700}>
              Envie o PDF para o UnB Ágil.
            </Box>
          </Typography>

          <Paper sx={{ borderRadius: 2 }}>
            <Box
              mt={2}
              width="100%"
              paddingBottom="141.53%"
              position="relative"
              borderRadius="8px"
              overflow="hidden"
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
    </>
  );
}
