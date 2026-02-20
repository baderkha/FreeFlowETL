import { Box, Fade, Paper, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';

const iconDrift = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

const slowSpin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const cards = [
  {
    title: 'Total Connections',
    value: '0',
    subtitle: 'Create a source/target pair to begin',
    icon: LanRoundedIcon,
    color: '#ffd447'
  },
  {
    title: 'Active Pipelines',
    value: '0',
    subtitle: 'Pipeline runtime integration comes next',
    icon: CheckCircleRoundedIcon,
    color: '#2ce6ff'
  },
  {
    title: 'Last Sync',
    value: '--',
    subtitle: 'No sync runs yet',
    icon: AutorenewRoundedIcon,
    color: '#ff7a45'
  }
];

function DashboardPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Dashboard</Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)'
          }
        }}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Fade in timeout={500 + index * 160} key={card.title}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  borderTop: `4px solid ${card.color}`,
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  animation: `${iconDrift} 4.5s ease-in-out ${index * 180}ms infinite`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 0 0 1px rgba(255, 212, 71, 0.24), 0 14px 28px rgba(0, 0, 0, 0.34)'
                  }
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="overline" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Icon
                    sx={{
                      color: card.color,
                      animation: card.title === 'Last Sync' ? `${slowSpin} 6s linear infinite` : undefined
                    }}
                  />
                </Stack>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {card.value}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {card.subtitle}
                </Typography>
              </Paper>
            </Fade>
          );
        })}
      </Box>
    </Stack>
  );
}

export default DashboardPage;
