import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';

export default function SavingsOverview({ metrics, profile }) {
  if (!metrics) return null;

  const currency = profile?.personal?.currency || 'INR';
  const income = profile?.finances?.monthlyIncome || 0;
  const expenses = profile?.finances?.monthlyExpenses || 0;

  const data = [
    { name: 'Income', value: income, color: '#10b981' },
    { name: 'Expenses', value: expenses, color: '#f59e0b' },
    { name: 'Surplus', value: metrics.monthlySurplus, color: metrics.monthlySurplus >= 0 ? '#4f8cff' : '#ef4444' },
    { name: 'Safe Invest', value: metrics.safeInvestment, color: '#7c5cfc' },
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>Savings Overview</Typography>
          <Chip label={`${formatPercent(metrics.savingsRate)} saved`}
            size="small" color={metrics.savingsRate >= 20 ? 'success' : 'warning'} />
        </Box>

        <Box sx={{ height: 180, mb: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ backgroundColor: '#1e2744', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 8, color: '#f1f5f9' }}
                formatter={(v) => formatCurrency(v, currency)} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Emergency Fund Gap</Typography>
            <Typography variant="body2" fontWeight={600} color={metrics.emergencyFundGap > 0 ? 'warning.main' : 'success.main'}>
              {metrics.emergencyFundGap > 0 ? formatCurrency(metrics.emergencyFundGap, currency) : '✅ Covered'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Max Safe EMI</Typography>
            <Typography variant="body2" fontWeight={600}>{formatCurrency(metrics.maxSafeEMI, currency)}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
