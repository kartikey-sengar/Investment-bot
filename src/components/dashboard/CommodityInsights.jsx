import { Box, Card, CardContent, Typography, Chip, LinearProgress } from '@mui/material';

export default function CommodityInsights({ allocation }) {
  const goldPct = allocation?.allocation?.gold || 0;

  const insights = [
    { asset: 'Gold', pct: goldPct, icon: '🥇', rationale: 'Traditional inflation hedge. Safe haven during market volatility.', status: goldPct >= 10 ? 'allocated' : 'underweight' },
    { asset: 'Silver', pct: 0, icon: '🥈', rationale: 'Industrial + precious metal. Consider 2–5% for diversification.', status: 'optional' },
    { asset: 'General Commodities', pct: 0, icon: '📦', rationale: 'Use commodities only for diversification, not primary wealth creation.', status: 'cautionary' },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>🏆 Commodity Insights</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {insights.map(item => (
            <Box key={item.asset} sx={{ p: 2, bgcolor: 'rgba(148,163,184,0.04)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>{item.icon} {item.asset}</Typography>
                <Chip label={item.status} size="small" variant="outlined"
                  color={item.status === 'allocated' ? 'success' : item.status === 'cautionary' ? 'warning' : 'default'}
                  sx={{ height: 22, fontSize: '0.7rem', textTransform: 'capitalize' }} />
              </Box>
              <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                {item.rationale}
              </Typography>
              {item.pct > 0 && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress variant="determinate" value={item.pct}
                    sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(148,163,184,0.08)',
                      '& .MuiLinearProgress-bar': { bgcolor: '#f97316', borderRadius: 2 }
                    }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{item.pct}% of portfolio</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
