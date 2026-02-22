import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Fade,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery
} from '@mui/material';
import { alpha, keyframes, useTheme } from '@mui/material/styles';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';

const breathe = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const providerConfig = {
  slack: {
    label: 'Slack',
    subtitle: 'Team channel alerts',
    iconType: 'mui',
    icon: ForumRoundedIcon,
    placeholder: 'https://hooks.slack.com/services/...'
  },
  discord: {
    label: 'Discord',
    subtitle: 'Discord webhook endpoint',
    iconType: 'simple',
    slug: 'discord',
    placeholder: 'https://discord.com/api/webhooks/...'
  },
  teams: {
    label: 'Teams',
    subtitle: 'Microsoft Teams connector',
    iconType: 'mui',
    icon: GroupsRoundedIcon,
    placeholder: 'https://outlook.office.com/webhook/...'
  },
  custom: {
    label: 'Custom',
    subtitle: 'Generic HTTP webhook',
    iconType: 'simple',
    slug: 'webhook',
    placeholder: 'https://your-endpoint.com/hooks/events'
  }
};

const providerIconUrl = (slug) => {
  if (slug === 'webhook') {
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ffe9a6" d="M4 12a4 4 0 0 1 4-4h3v2H8a2 2 0 0 0 0 4h3v2H8a4 4 0 0 1-4-4Zm7-1h2v2h-2v-2Zm5-3h-3v2h3a2 2 0 1 1 0 4h-3v2h3a4 4 0 1 0 0-8Z"/></svg>';
  }
  return `https://cdn.simpleicons.org/${slug}/ffe9a6`;
};

const PROFILE_IMAGE_KEY = 'ff_profile_image';
const PROFILE_NAME_KEY = 'ff_profile_name';
const PROFILE_ROLE_KEY = 'ff_profile_role';
const PROFILE_UPDATE_EVENT = 'ff:profile-updated';

const getInitials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'FF';

const createDefaultProfileImage = (name) => {
  const initials = getInitials(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffd447"/><stop offset="100%" stop-color="#ff7a45"/></linearGradient></defs><rect width="160" height="160" rx="80" fill="#100c22"/><circle cx="80" cy="80" r="74" fill="url(#g)" opacity="0.94"/><text x="80" y="96" text-anchor="middle" font-family="system-ui,Segoe UI,Arial,sans-serif" font-size="56" font-weight="700" fill="#1c122f">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

function SettingsPage() {
  const [section, setSection] = useState('workspace');
  const [provider, setProvider] = useState('slack');
  const [profileName, setProfileName] = useState(() => localStorage.getItem(PROFILE_NAME_KEY) || 'Abe Operator');
  const [profileRole, setProfileRole] = useState(() => localStorage.getItem(PROFILE_ROLE_KEY) || 'Data Platform Admin');
  const [profileImage, setProfileImage] = useState(() => {
    const savedImage = localStorage.getItem(PROFILE_IMAGE_KEY);
    if (savedImage) {
      return savedImage;
    }
    const generated = createDefaultProfileImage(localStorage.getItem(PROFILE_NAME_KEY) || 'Abe Operator');
    localStorage.setItem(PROFILE_IMAGE_KEY, generated);
    return generated;
  });
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const selectedProvider = useMemo(() => providerConfig[provider], [provider]);

  const emitProfileUpdated = () => window.dispatchEvent(new Event(PROFILE_UPDATE_EVENT));

  const handleProfileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        return;
      }
      setProfileImage(result);
      localStorage.setItem(PROFILE_IMAGE_KEY, result);
      emitProfileUpdated();
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleProfileSave = () => {
    const cleanName = profileName.trim() || 'Abe Operator';
    localStorage.setItem(PROFILE_NAME_KEY, cleanName);
    localStorage.setItem(PROFILE_ROLE_KEY, profileRole.trim() || 'Data Platform Admin');
    if (!profileImage) {
      const generated = createDefaultProfileImage(cleanName);
      setProfileImage(generated);
      localStorage.setItem(PROFILE_IMAGE_KEY, generated);
    }
    emitProfileUpdated();
  };

  return (
    <Fade in timeout={360}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ animation: `${breathe} 4s ease-in-out infinite` }}>
          <SettingsSuggestRoundedIcon color="primary" />
          <Typography variant="h4">Settings</Typography>
        </Stack>

        <Box
          sx={{
            border: `1px solid ${alpha('#ffd447', 0.2)}`,
            borderRadius: 3,
            background: alpha('#120f2a', 0.7),
            backdropFilter: 'blur(8px)',
            p: { xs: 2, md: 2.5 }
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Stack spacing={1.25} sx={{ minWidth: { md: 220 } }}>
              <Typography variant="overline" color="text.secondary">
                Sections
              </Typography>
              <Box sx={{ overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 0.5, md: 0 } }}>
                <ToggleButtonGroup
                  orientation={isDesktop ? 'vertical' : 'horizontal'}
                  exclusive
                  value={section}
                  onChange={(_, value) => value && setSection(value)}
                  size="small"
                  sx={{ width: { xs: 'max-content', md: 'auto' } }}
                >
                  <ToggleButton value="workspace" sx={{ justifyContent: 'flex-start', px: 1.25 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TuneRoundedIcon fontSize="small" />
                      <Typography variant="body2">Workspace</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="notifications" sx={{ justifyContent: 'flex-start', px: 1.25 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <NotificationsActiveRoundedIcon fontSize="small" />
                      <Typography variant="body2">Notifications</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="profile" sx={{ justifyContent: 'flex-start', px: 1.25 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonRoundedIcon fontSize="small" />
                      <Typography variant="body2">Profile</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="rbac" sx={{ justifyContent: 'flex-start', px: 1.25 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SecurityRoundedIcon fontSize="small" />
                      <Typography variant="body2">RBAC</Typography>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton value="users" sx={{ justifyContent: 'flex-start', px: 1.25 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonAddRoundedIcon fontSize="small" />
                      <Typography variant="body2">User Management</Typography>
                    </Stack>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Stack>

            <Box sx={{ width: '100%', borderLeft: { md: `1px solid ${alpha('#ffd447', 0.18)}` }, pl: { md: 3 } }}>
              {section === 'workspace' && (
                <Stack spacing={2.25} sx={{ maxWidth: 720 }}>
                  <Typography variant="h6">Workspace</Typography>
                  <TextField label="Workspace Name" defaultValue="FreeFlow" fullWidth />
                  <TextField label="Default Schema" defaultValue="public" fullWidth />
                  <FormControlLabel control={<Switch defaultChecked />} label="Enable connection validation on save" />
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" sx={{ pt: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      sx={{
                        minWidth: 220,
                        transition: 'transform 180ms ease',
                        '&:hover': { transform: 'translateY(-1px)' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </Stack>
              )}

              {section === 'notifications' && (
                <Stack spacing={2.25} sx={{ maxWidth: 760 }}>
                  <Typography variant="h6">Notifications</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a provider and configure separate webhook channels for failed and success events.
                  </Typography>

                  <Box
                    sx={{
                      display: 'grid',
                      gap: 1,
                      gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }
                    }}
                  >
                    {Object.entries(providerConfig).map(([key, cfg]) => {
                      const selected = provider === key;
                      return (
                        <Box
                          key={key}
                          onClick={() => setProvider(key)}
                          sx={{
                            borderRadius: 2,
                            border: `1px solid ${selected ? alpha('#ffd447', 0.85) : alpha('#ffd447', 0.22)}`,
                            background: selected ? alpha('#ffd447', 0.16) : alpha('#0f0c24', 0.55),
                            px: 1.2,
                            py: 1,
                            cursor: 'pointer',
                            transition: 'all 160ms ease',
                            '&:hover': {
                              borderColor: alpha('#ffd447', 0.7),
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            {cfg.iconType === 'mui' ? (
                              <cfg.icon sx={{ fontSize: 17 }} />
                            ) : (
                              <Box component="img" src={providerIconUrl(cfg.slug)} alt={cfg.label} sx={{ width: 16, height: 16 }} />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {cfg.label}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {cfg.subtitle}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Stack spacing={1.5}>
                    <Box sx={{ border: `1px solid ${alpha('#ff7a45', 0.32)}`, borderRadius: 2, p: 1.5, bgcolor: alpha('#200f1a', 0.45) }}>
                      <Stack spacing={1.25}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Failed events" />
                        <TextField
                          label="Failed Webhook URL"
                          placeholder={selectedProvider.placeholder}
                          fullWidth
                        />
                        <Typography variant="caption" color="text.secondary">
                          Triggered on extraction/load failures and runtime errors.
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<SendRoundedIcon fontSize="small" />}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          Test Failed Webhook
                        </Button>
                      </Stack>
                    </Box>

                    <Box sx={{ border: `1px solid ${alpha('#2ce6ff', 0.32)}`, borderRadius: 2, p: 1.5, bgcolor: alpha('#0f1623', 0.45) }}>
                      <Stack spacing={1.25}>
                        <FormControlLabel control={<Switch defaultChecked />} label="Success events" />
                        <TextField
                          label="Success Webhook URL"
                          placeholder={selectedProvider.placeholder}
                          fullWidth
                        />
                        <Typography variant="caption" color="text.secondary">
                          Triggered after successful pipeline sync completion.
                        </Typography>
                        <Button
                          variant="text"
                          size="small"
                          startIcon={<SendRoundedIcon fontSize="small" />}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          Test Success Webhook
                        </Button>
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" sx={{ pt: 0.5 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      sx={{
                        minWidth: 240,
                        transition: 'transform 180ms ease',
                        '&:hover': { transform: 'translateY(-1px)' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </Stack>
              )}

              {section === 'profile' && (
                <Stack spacing={2.25} sx={{ maxWidth: 760 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="h6">Profile Settings</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Avatar
                      src={profileImage}
                      alt={profileName}
                      sx={{ width: 68, height: 68, border: `2px solid ${alpha('#ffd447', 0.6)}` }}
                    >
                      {getInitials(profileName)}
                    </Avatar>
                    <Stack spacing={1} sx={{ width: '100%' }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<UploadRoundedIcon />}
                        sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                      >
                        Upload Profile Image
                        <input hidden accept="image/*" type="file" onChange={handleProfileImageUpload} />
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        PNG or JPG recommended. Image updates instantly in the top bar.
                      </Typography>
                    </Stack>
                  </Stack>
                  <TextField label="Full Name" value={profileName} onChange={(event) => setProfileName(event.target.value)} fullWidth />
                  <TextField label="Role" value={profileRole} onChange={(event) => setProfileRole(event.target.value)} fullWidth />
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" sx={{ pt: 0.5 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      onClick={handleProfileSave}
                      sx={{
                        minWidth: 220,
                        transition: 'transform 180ms ease',
                        '&:hover': { transform: 'translateY(-1px)' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </Stack>
              )}

              {section === 'rbac' && (
                <Stack spacing={2.25} sx={{ maxWidth: 760 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SecurityRoundedIcon color="secondary" fontSize="small" />
                    <Typography variant="h6">RBAC</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Configure role-based access controls and permission scopes for your workspace.
                  </Typography>
                  <TextField select label="Role Template" defaultValue="admin" fullWidth>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="operator">Operator</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </TextField>
                  <FormControlLabel control={<Switch defaultChecked />} label="Can manage connections" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Can run / stop pipelines" />
                  <FormControlLabel control={<Switch defaultChecked />} label="Can manage webhooks" />
                  <FormControlLabel control={<Switch />} label="Can manage RBAC policies" />
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="flex-end" sx={{ pt: 0.5 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      sx={{
                        minWidth: 220,
                        transition: 'transform 180ms ease',
                        '&:hover': { transform: 'translateY(-1px)' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </Stack>
              )}

              {section === 'users' && (
                <Stack spacing={2.25} sx={{ maxWidth: 760 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonAddRoundedIcon color="primary" fontSize="small" />
                    <Typography variant="h6">User Management</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Add users to your workspace and assign access roles.
                  </Typography>
                  <TextField label="User Name" placeholder="Jane Doe" fullWidth />
                  <TextField label="User Email" placeholder="jane@company.com" fullWidth />
                  <TextField select label="Assigned Role" defaultValue="operator" fullWidth>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="operator">Operator</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </TextField>
                  <FormControlLabel control={<Switch defaultChecked />} label="Send invite email immediately" />
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" sx={{ pt: 0.5, gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SendRoundedIcon />}
                      sx={{ transition: 'transform 180ms ease', '&:hover': { transform: 'translateY(-1px)' } }}
                    >
                      Preview Invite
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddRoundedIcon />}
                      sx={{
                        minWidth: 220,
                        transition: 'transform 180ms ease',
                        '&:hover': { transform: 'translateY(-1px)' }
                      }}
                    >
                      Add User
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Fade>
  );
}

export default SettingsPage;
