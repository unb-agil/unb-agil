import MuiAppBar from '@mui/material/AppBar';
import { Container, Toolbar, Typography } from '@mui/material';

export default function AppBar() {
  return (
    <MuiAppBar position="static" color="transparent" variant="outlined">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography variant="h4">UnB Ágil</Typography>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
