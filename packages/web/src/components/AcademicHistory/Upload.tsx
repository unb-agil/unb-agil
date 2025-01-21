'use client';

import { ChangeEvent, useEffect, useRef } from 'react';
import { Box, Button } from '@mui/material';
import useExtractAcademicHistory from '@/hooks/useExtractAcademicHistory';

export default function AcademicHistoryUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { extract, loading, data } = useExtractAcademicHistory();

  useEffect(() => {
    if (!data) {
      return;
    }

    console.log(data);
  }, [data]);

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
      borderRadius="8px"
      borderColor="primary.main"
      display="flex"
      flexDirection="column"
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
        onClick={handleButtonClick}
        disabled={loading}
        loading={loading}
      >
        Selecionar histórico
      </Button>
    </Box>
  );
}
