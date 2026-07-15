import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
export default function InvestmentAllocation({ allocation }) {
  if (!allocation || !allocation.breakdown?.length) return null;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>Investment Allocation</Typography>
          <Chip label={allocation.riskLevel} size="small" variant="outlined" color="primary" sx={{ textTransform: 'capitalize' }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ width: 160, height: 160, flexShrink: 0, mx: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation.breakdown} dataKey="percentage" cx="50%" cy="50%"
                  innerRadius={45} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                  {allocation.breakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e2744', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                  formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ flex: 1, minWidth: 160 }}>
            {allocation.breakdown.map(item => (
              <Box key={item.category} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color, flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{item.label}</Typography>
                </Box>
                <Typography variant="body2" fontWeight={600}>{item.percentage}%</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {allocation.emergencyFundStatus === 'incomplete' && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(245,158,11,0.08)', borderRadius: 2, border: '1px solid rgba(245,158,11,0.2)' }}>
            <Typography variant="caption" color="warning.main">
              ⚠️ Emergency fund incomplete. Allocation adjusted to prioritize building it first.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
