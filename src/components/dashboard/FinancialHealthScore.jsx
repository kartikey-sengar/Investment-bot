import { Box, Card, CardContent, Typography, LinearProgress } from '@mui/material';

export default function FinancialHealthScore({ healthScore }) {
  if (!healthScore) return null;

  const { score, label, color, breakdown } = healthScore;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>Financial Health Score</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {/* Circle */}
          <Box sx={{ position: 'relative', width: 140, height: 140, flexShrink: 0, mx: 'auto' }}>
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h3" fontWeight={700} sx={{ color, lineHeight: 1 }}>{score}</Typography>
              <Typography variant="caption" color="text.secondary">/100</Typography>
            </Box>
          </Box>

          {/* Breakdown */}
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color }} mb={2}>{label}</Typography>
            {Object.values(breakdown).map(item => (
              <Box key={item.label} sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography variant="caption" fontWeight={600}>{item.score}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={item.score}
                  sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(148,163,184,0.08)',
                    '& .MuiLinearProgress-bar': { bgcolor: item.score >= 70 ? '#10b981' : item.score >= 40 ? '#f59e0b' : '#ef4444', borderRadius: 2 }
                  }} />
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
