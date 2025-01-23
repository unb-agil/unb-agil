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
  Alert,
} from '@mui/material';
import capitalize from 'capitalize-pt-br';
import { useAcademicHistoryContext } from '@/context/AcademicHistoryContext';
import useGetRecommendation from '@/hooks/useGetRecommendation';
import useGetComponents from '@/hooks/useGetComponents';

export default function AcademicHistoryForm() {
  const { academicHistory, setRecommendation } = useAcademicHistoryContext();
  const [maxWorkloadByPeriod, setMaxWorkloadByPeriod] = useState(24);
  const { recommend, data: recommendationData } = useGetRecommendation();
  const { search, data: components } = useGetComponents();
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

  const handleOnButtonClick = () => {
    if (!academicHistory) {
      return;
    }

    recommend(academicHistory, {
      maxWorkloadByPeriod: maxWorkloadByPeriod * 15,
    });
  };

  const handleQueryChange = (
    _event: SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setQuery(value);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%" gap={2}>
      <Typography variant="h5" fontWeight={700}>
        Opções de recomendação
      </Typography>

      <Alert severity="info" variant="outlined">
        <Typography variant="body2">
          Defina as opções da sua recomendação personalizada de disciplinas.
        </Typography>
      </Alert>

      <Box>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          Créditos por semestre
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Typography variant="body1">10</Typography>

          <Slider
            min={10}
            max={32}
            value={maxWorkloadByPeriod}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
          />

          <Typography variant="body1">32</Typography>
        </Box>
      </Box>

      <Box>
        <Typography variant="body2" fontWeight={700} gutterBottom>
          Componentes optativos
        </Typography>

        <Autocomplete
          sx={{
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
            return <TextField {...params} size="small" />;
          }}
          renderOption={({ key, ...optionProps }, component, { selected }) => (
            <li key={key} {...optionProps}>
              <FormControlLabel
                value="end"
                control={<Checkbox size="small" checked={selected} />}
                label={
                  <>
                    <Typography variant="caption" color="textSecondary">
                      {component.sigaaId}
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
        <Button variant="outlined" color="primary">
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
