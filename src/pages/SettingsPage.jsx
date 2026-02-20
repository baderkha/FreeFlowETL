import { Button, Fade, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';

const breathe = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

function SettingsPage() {
  return (
    <Fade in timeout={380}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ animation: `${breathe} 4.2s ease-in-out infinite` }}>
          <SettingsSuggestRoundedIcon color="primary" />
          <Typography variant="h4">Settings</Typography>
        </Stack>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <TextField label="Workspace Name" defaultValue="FreeFlow" fullWidth />
            <TextField label="Default Schema" defaultValue="public" fullWidth />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Switch defaultChecked />
              <Typography>Enable connection validation on save</Typography>
            </Stack>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              sx={{ transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-1px)' } }}
            >
              Save Settings
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Fade>
  );
}

export default SettingsPage;
