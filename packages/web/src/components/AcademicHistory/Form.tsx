import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Slider,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import capitalize from 'capitalize-pt-br';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import useGetRecommendation from '@/hooks/useGetRecommendation';
import useGetComponents from '@/hooks/useGetComponents';
import useGetCurriculum from '@/hooks/useGetCurriculum';
import { Info } from '@mui/icons-material';

export default function AcademicHistoryForm() {
  const { academicHistory, setRecommendation, setAcademicHistory } =
    useAcademicHistoryContext();
  const [maxWorkloadByPeriod, setMaxWorkloadByPeriod] = useState(360);
  const { recommend, data: recommendationData } = useGetRecommendation();
  const { search, data: components } = useGetComponents();
  const { curriculum } = useGetCurriculum(academicHistory?.curriculumSigaaId);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!recommendationData) {
      return;
    }

    setRecommendation(recommendationData);
  }, [recommendationData, setRecommendation]);

  useEffect(() => {
    if (!academicHistory?.curriculumSigaaId) {
      return;
    }

    search({
      curriculumSigaaId: academicHistory.curriculumSigaaId,
      type: 'ELECTIVE',
      query,
    });
  }, [academicHistory?.curriculumSigaaId, query, search]);

  useEffect(() => {
    if (!components) {
      return;
    }

    console.log(components);
  }, [components]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setMaxWorkloadByPeriod(newValue as number);
  };

  const handleCancelClick = () => {
    setAcademicHistory(null);
  };

  const handleOnButtonClick = () => {
    if (!academicHistory) {
      return;
    }

    recommend(academicHistory, { maxWorkloadByPeriod });
  };

  const handleQueryChange = (
    _event: SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setQuery(value);
  };

  if (!academicHistory) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Typography variant="h5">Opções de recomendação</Typography>

      <Box mt={2}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={700}>
            Carga horária máxima por período
          </Typography>

          <Tooltip title="Um crédito equivale a 15 horas.">
            <Info color="primary" fontSize="small" />
          </Tooltip>
        </Box>

        <Box
          mt={1}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
          >
            <Typography variant="body1" noWrap>
              {curriculum?.minPeriodWorkload}h
            </Typography>
          </Box>

          <Slider
            sx={{
              '.MuiSlider-valueLabel': {
                top: '55px',
              },

              '.MuiSlider-valueLabel::before': {
                bottom: '50%',
                top: -8,
              },
            }}
            min={curriculum?.minPeriodWorkload}
            max={curriculum?.maxPeriodWorkload}
            value={maxWorkloadByPeriod}
            step={15}
            valueLabelFormat={(value) => `${value}h (${value / 15} créditos)`}
            valueLabelDisplay="on"
            onChange={handleSliderChange}
          />

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="end"
          >
            <Typography variant="body1" noWrap>
              {curriculum?.maxPeriodWorkload}h
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box mt={2}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="body2" fontWeight={700}>
            Componentes optativos
          </Typography>

          <Tooltip title="Todos os requisitos para cada componente serão incluídos automaticamente.">
            <Info color="primary" fontSize="small" />
          </Tooltip>
        </Box>

        <Autocomplete
          sx={{
            mt: 1,
            '.MuiAutocomplete-inputRoot': {
              flexWrap: 'nowrap !important',
              overflow: 'hidden',
            },
          }}
          fullWidth
          multiple
          limitTags={2}
          options={components || []}
          disableCloseOnSelect
          noOptionsText="Nenhum componente encontrado"
          isOptionEqualToValue={(option, value) =>
            option.sigaaId === value.sigaaId
          }
          getOptionLabel={(component) => component.sigaaId}
          filterOptions={(x) => x}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                size="small"
                sx={{ backgroundColor: '#fff' }}
              />
            );
          }}
          renderOption={({ key, ...optionProps }, component, { selected }) => (
            <li key={key} {...optionProps}>
              <FormControlLabel
                value="end"
                control={<Checkbox size="small" checked={selected} />}
                label={
                  <>
                    <Typography variant="caption" color="textSecondary">
                      {component.sigaaId} — {component.totalWorkload}h
                    </Typography>

                    <Typography variant="body2">
                      {capitalize(component.title, ['para'])}
                    </Typography>
                  </>
                }
                labelPlacement="end"
              />
            </li>
          )}
          onInputChange={handleQueryChange}
        />
      </Box>

      <Box flexGrow={1} />

      <Box display="flex" flexDirection="row" justifyContent="end" gap={2}>
        <Button variant="outlined" color="primary" onClick={handleCancelClick}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOnButtonClick}
        >
          Gerar recomendação
        </Button>
      </Box>
    </Box>
  );
}
