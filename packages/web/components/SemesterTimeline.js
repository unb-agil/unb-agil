import React from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';

const periods = [
  {
    id: '2024/2',
    subjects: [
      { sigaaId: 'FGA0001', title: 'Física 1', prerequisites: [] },
      { sigaaId: 'FGA0002', title: 'Cálculo 1', prerequisites: [] },
      { sigaaId: 'FGA0003', title: 'Introdução a Engenharia', prerequisites: [] },
    ],
  },
  {
    id: '2025/1',
    subjects: [
      { sigaaId: 'FGA0004', title: 'Cálculo 2', prerequisites: ['FGA0002'] },
      { sigaaId: 'FGA0005', title: 'Física Experimental', prerequisites: ['FGA0001'] },
    ],
  },
  {
    id: '2025/2',
    subjects: [
      { sigaaId: 'FGA0003', title: 'Métodos Numéricos', prerequisites: ['FGA0004', 'FGA0003'] },
      { sigaaId: 'FGA0003', title: 'Física 2', prerequisites: ['FGA0001', 'FGA0005'] },
    ],
  },
];

const SemesterTimeline = () => {
  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      {periods.map((period) => (
        <Grid container spacing={2} key={period.id} sx={{ marginBottom: '40px' }}>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6" align="center">{period.id}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={10}>
            <Grid container spacing={2}>
              {period.subjects.map((subject, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Paper sx={{ padding: '16px', border: '1px solid #00B4B4' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#00B4B4' }}>
                      {subject.sigaaId}
                    </Typography>
                    <Typography variant="h6">{subject.title}</Typography>
                    <Divider sx={{ margin: '8px 0' }} />
                    <Typography variant="body2" sx={{ color: '#00B4B4' }}>
                      Pré-requisitos
                    </Typography>
                    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {subject.prerequisites.map((prerequisite, idx) => (
                        <Paper
                          key={idx}
                          sx={{ padding: '2px 8px', backgroundColor: '#E0F7FA', color: '#00B4B4', borderRadius: '16px' }}
                          elevation={0}
                        >
                          {prerequisite}
                        </Paper>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default SemesterTimeline;
