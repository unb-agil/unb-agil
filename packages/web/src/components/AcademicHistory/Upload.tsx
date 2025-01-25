'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import useExtractAcademicHistory from '@/hooks/useExtractAcademicHistory';

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
    <Box
      height="300px"
      border="2px dashed"
      borderColor="primary.main"
      borderRadius="8px"
      padding={3}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
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
    </Box>
  );
}
