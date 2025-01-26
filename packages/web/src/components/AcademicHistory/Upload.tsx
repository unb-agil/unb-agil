'use client';

import {
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Button, Card, Modal, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import useExtractAcademicHistory from '@/hooks/useExtractAcademicHistory';
import Link from 'next/link';

const ENABLED_CURRICULUM_SIGAA_IDS = ['6360/2', '6360/1', '6360/-2'];

export default function AcademicHistoryUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { extract, reset, loading, data, error } = useExtractAcademicHistory();
  const { setAcademicHistory } = useAcademicHistoryContext();
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!error) {
      return;
    }

    setShowErrorModal(true);
  }, [error]);

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!ENABLED_CURRICULUM_SIGAA_IDS.includes(data.curriculumSigaaId)) {
      setShowErrorModal(true);
      return;
    }

    setAcademicHistory(data);
  }, [data, setAcademicHistory]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClick: MouseEventHandler<HTMLInputElement> = () => {
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file?.type !== 'application/pdf') {
      return;
    }

    extract(file);
  };

  const handleCloseModal = () => {
    reset();
    setShowErrorModal(false);
  };

  return (
    <>
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
          onClick={handleClick}
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

        <Modal open={showErrorModal} onClose={handleCloseModal}>
          <Box
            sx={{ transform: 'translate(-50%, -50%)' }}
            width="300px"
            position="absolute"
            top="50%"
            left="50%"
          >
            <Card sx={{ padding: 3, paddingBottom: 2 }}>
              <Typography variant="body1" fontWeight={500} marginBottom={2}>
                Erro ao ler histórico
              </Typography>

              <Typography variant="body2">
                Ainda estamos em testes apenas com o curso de{' '}
                <strong>Engenharia de Software</strong>.
              </Typography>

              <Typography variant="body2" marginTop={2}>
                Entre na{' '}
                <Link href="/waitlist" passHref>
                  lista de espera
                </Link>{' '}
                para ser notificado quando seu curso estiver disponível.
              </Typography>

              <Box display="flex" justifyContent="flex-end" marginTop={2}>
                <Button onClick={handleCloseModal}>Fechar</Button>
              </Box>
            </Card>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
