'use client';

import { useEffect } from 'react';

import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import Container from '@/components/Container';
import UploadContainer from '@/components/Upload';
import Recommendation from '@/components/Recommendation';
import RecommendationOptions from '@/components/AcademicHistory/Grid';

export default function Home() {
  const { academicHistory, recommendation } = useAcademicHistoryContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [academicHistory, recommendation]);

  return (
    <Container>
      {recommendation ? (
        <Recommendation />
      ) : academicHistory ? (
        <RecommendationOptions />
      ) : (
        <UploadContainer />
      )}
    </Container>
  );
}
