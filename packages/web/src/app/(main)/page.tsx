'use client';

import { Box } from '@mui/material';
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

      {academicHistory ? <RecommendationOptions /> : <AcademicHistoryUpload />}
    </Box>
  );
}
