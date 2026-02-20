import { Box, Fade, Paper, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import LanRoundedIcon from '@mui/icons-material/LanRounded';
import MonitorHeartRoundedIcon from '@mui/icons-material/MonitorHeartRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';

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
    value: '8',
    subtitle: '2 production-ready taps configured',
    icon: LanRoundedIcon,
    color: '#ffd447'
  },
  {
    title: 'Active Pipelines',
    value: '5',
    subtitle: '3 currently running on schedule',
    icon: CheckCircleRoundedIcon,
    color: '#2ce6ff'
  },
  {
    title: 'Last Sync',
    value: '4m ago',
    subtitle: 'Latest completed run: postgres_orders',
    icon: AutorenewRoundedIcon,
    color: '#ff7a45'
  }
];

const trendCards = [
  { label: 'Rows Replicated', value: '184K', delta: '+12.5%', color: '#ffd447', points: [14, 18, 22, 30, 26, 34, 41, 45] },
  { label: 'Pipeline Latency', value: '38s', delta: '-8.1%', color: '#2ce6ff', points: [58, 54, 48, 52, 44, 41, 39, 38] },
  { label: 'Error Rate', value: '0.7%', delta: '-0.3%', color: '#ff7a45', points: [2.1, 1.7, 1.9, 1.3, 1.1, 0.9, 0.8, 0.7] }
];

const throughputByHour = [18, 24, 20, 27, 31, 26, 29, 35, 38, 33, 30, 36];

const syncState = [
  { label: 'Healthy', value: 68, color: '#7dff95' },
  { label: 'Warning', value: 21, color: '#ffd447' },
  { label: 'Failed', value: 11, color: '#ff7a45' }
];

function buildPolyline(points, width, height) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = Math.max(1, max - min);
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
}

function Sparkline({ points, color }) {
  const width = 180;
  const height = 56;
  const polyline = buildPolyline(points, width, height);

  return (
    <Box component="svg" viewBox={`0 0 ${width} ${height}`} sx={{ width: '100%', height: 56 }}>
      <polyline fill="none" stroke={color} strokeWidth="3" points={polyline} strokeLinecap="round" />
    </Box>
  );
}

function DashboardPage() {
  const maxThroughput = Math.max(...throughputByHour);

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

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          }
        }}
      >
        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <QueryStatsRoundedIcon color="primary" fontSize="small" />
            <Typography variant="h6">Monitoring Trends</Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)'
              }
            }}
          >
            {trendCards.map((item) => (
              <Paper key={item.label} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mt: 0.5 }}>
                  <Typography variant="h6">{item.value}</Typography>
                  <Typography variant="caption" sx={{ color: item.color }}>
                    {item.delta}
                  </Typography>
                </Stack>
                <Sparkline points={item.points} color={item.color} />
              </Paper>
            ))}
          </Box>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
            Throughput (last 12 runs)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${throughputByHour.length}, minmax(0, 1fr))`, gap: 0.75, alignItems: 'end', height: 120 }}>
            {throughputByHour.map((value, idx) => (
              <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: '100%',
                    borderRadius: 1,
                    height: `${(value / maxThroughput) * 100}%`,
                    minHeight: 6,
                    background: 'linear-gradient(180deg, rgba(44,230,255,0.85) 0%, rgba(255,212,71,0.8) 100%)'
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {idx + 1}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <MonitorHeartRoundedIcon color="secondary" fontSize="small" />
            <Typography variant="h6">Sync Health</Typography>
          </Stack>
          <Stack spacing={1.25}>
            {syncState.map((state) => (
              <Box key={state.label}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{state.label}</Typography>
                  <Typography variant="body2">{state.value}%</Typography>
                </Stack>
                <Box sx={{ mt: 0.5, height: 8, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <Box sx={{ width: `${state.value}%`, height: '100%', bgcolor: state.color }} />
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}

export default DashboardPage;
