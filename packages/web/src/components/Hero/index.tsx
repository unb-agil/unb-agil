import Image from 'next/image';
import { Box, Card, CardContent, Typography } from '@mui/material';

export default function Hero() {
  return (
    <>
      <Card elevation={0}>
        <CardContent sx={{ padding: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={3}
          >
            <Box>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Otimize o fluxo até a sua formatura.
              </Typography>

              <Typography variant="body2">
                O UnB Ágil calcula quais disciplinas você deve priorizar em cada
                semestre.
              </Typography>
            </Box>

            <Image src="flowchart.svg" alt="Flowchart" width={68} height={68} />
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
