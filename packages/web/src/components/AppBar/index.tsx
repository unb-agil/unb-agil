import MuiAppBar from '@mui/material/AppBar';
import { Container, Toolbar, Typography } from '@mui/material';

export default function AppBar() {
  return (
    <MuiAppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography variant="h6">Fluxo Ágil</Typography>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
