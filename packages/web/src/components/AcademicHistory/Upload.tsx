'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import useExtractAcademicHistory from '@/hooks/useExtractAcademicHistory';
import AcademicHistoryContainer from '@/components/AcademicHistory/Container';

export default function AcademicHistoryUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { extract, loading, data } = useExtractAcademicHistory();
  const { setAcademicHistory } = useAcademicHistoryContext();

  useEffect(() => {
    if (!data) {
      return;
    }

    setAcademicHistory(data);
  }, [data, setAcademicHistory]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file?.type !== 'application/pdf') {
      return;
    }

    extract(file);
  };

  return (
    <AcademicHistoryContainer>
      <input
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        disabled={loading}
        loading={loading}
        startIcon={<UploadFileIcon />}
      >
        Selecionar histórico
      </Button>
    </AcademicHistoryContainer>
  );
}
