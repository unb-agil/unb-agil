'use client';

import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import AcademicHistoryGrid from '@/components/AcademicHistory/Grid';
import AcademicHistoryUpload from '@/components/AcademicHistory/Upload';

export default function Home() {
  const { academicHistory } = useAcademicHistoryContext();

  if (academicHistory) {
    return <AcademicHistoryGrid />;
  }

  return <AcademicHistoryUpload />;
}
