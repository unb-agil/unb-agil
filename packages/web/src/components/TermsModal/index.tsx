import { useState } from 'react';
import {
  Box,
  Card,
  Modal,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';

interface TermsModalProps {
  open: boolean;
  onCancel: () => void;
  onAccept: () => void;
}

function TermsModal({ open, onAccept, onCancel }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <Modal open={open}>
      <Box
        sx={{ transform: 'translate(-50%, -50%)' }}
        width="700px"
        maxWidth="90vw"
        maxHeight="90vh"
        position="absolute"
        overflow="auto"
        top="50%"
        left="50%"
      >
        <Card sx={{ padding: 3, paddingBottom: 2 }}>
          <Typography variant="h6" marginBottom={2}>
            Termo de Consentimento Livre e Esclarecido
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            A atual etapa de desenvolvimento deste software capta apenas
            históricos acadêmicos, emitidos pelo SIGAA, de alunos de Engenharia
            de Software da graduação na Universidade de Brasília.
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            Sua participação pode contribuir para diminuir a evasão de alunos do
            curso, a superlotação de disciplinas e até te ajudar a formar mais
            rápido!
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            A aplicabilidade do “UnB Ágil” é mostrar um caminho otimizado de
            sugestão de disciplinas a cursar até o final do curso, considerando
            as disciplinas obrigatórias e as optativas que você tenha interesse,
            conjuntamente com os respectivos pré-requisitos de cada uma.
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            Sua participação na pesquisa é totalmente voluntária, ou seja, não é
            obrigatória. Caso o(a) Sr.(a) decida não participar, ou ainda,
            desistir de participar e retirar seu consentimento durante a
            pesquisa, não haverá nenhum prejuízo ao seu vínculo institucional ou
            avaliação curricular na Universidade de Brasília.
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            Solicitamos também sua autorização para apresentar os dados
            coletados deste estudo em nosso TCC; podendo chegar a apresentá-los
            em eventos de fins acadêmicos e publicar em revista científica
            nacional e/ou internacional.
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            Por ocasião da publicação dos resultados,{' '}
            <strong>
              seu nome e dados particulares serão mantidos em sigilo absoluto
            </strong>
            , bem como em todas as fases da pesquisa.
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            Ademais, o software “UnB Ágil” ainda está em teste e não garante que
            todas as informações serão totalmente precisas.
          </Typography>

          <Typography variant="body2" marginBottom={2}>
            Somos Irwin Schmitt e João Paulo Coelho, orientados pelo Prof. Dr.
            Ricardo Matos Chaim, formandos em Engenharia de Software na FCTE,
            você está colaborando com o nosso TCC! Vamos nessa!
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                Li e entendi todos os termos utilizados, estou consciente do
                objetivo da pesquisa e aceito prosseguir com a colaboração neste
                trabalho acadêmico.
              </Typography>
            }
          />
          <Box display="flex" justifyContent="flex-end" marginTop={2} gap={2}>
            <Button onClick={onCancel}>Cancelar</Button>

            <Button variant="contained" disabled={!accepted} onClick={onAccept}>
              Selecionar histórico
            </Button>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}

export default TermsModal;
