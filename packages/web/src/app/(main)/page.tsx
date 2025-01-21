'use client';

import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import AcademicHistoryGrid from '@/components/AcademicHistory/Grid';
import AcademicHistoryUpload from '@/components/AcademicHistory/Upload';
import Recommendation from '@/components/Recommendation';

export default function Home() {
  const { academicHistory, recommendation } = useAcademicHistoryContext();

  if (recommendation) {
    return <Recommendation />;
  }

  if (academicHistory) {
    return <AcademicHistoryGrid />;
  }

  return <AcademicHistoryUpload />;
}
