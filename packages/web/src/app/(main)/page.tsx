'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import Container from '@/components/Container';
import UploadContainer from '@/components/Upload';

const Recommendation = dynamic(() => import('@/components/Recommendation'));
const Options = dynamic(() => import('@/components/AcademicHistory/Grid'));

export default function Home() {
  const { academicHistory, recommendation } = useAcademicHistoryContext();

  useEffect(() => {
    if (recommendation) {
      window.scrollTo(0, 0);
    }
  }, [recommendation]);

  return (
    <Container>
      {recommendation ? (
        <Recommendation />
      ) : academicHistory ? (
        <Options />
      ) : (
        <UploadContainer />
      )}
    </Container>
  );
}
