import { Box, Card, CardContent, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';

const MetricTile = ({ icon: Icon, iconBg, iconColor, label, value, valueSx, sub }) => (
  <Box sx={{
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    p: 2.5,
    borderRadius: '14px',
    background: iconBg.replace('0.15', '0.07'),
    border: `1px solid ${iconColor}22`,
    transition: 'all 0.25s ease',
    cursor: 'default',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: `0 8px 24px ${iconColor}22`,
      borderColor: `${iconColor}44`,
    },
  }}>
    <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: iconBg, flexShrink: 0, display: 'flex' }}>
      <Icon sx={{ color: iconColor, fontSize: 28 }} />
    </Box>
    <Box>
      <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(176,181,212,0.65)', mb: 0.4 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.7rem)', fontWeight: 800, lineHeight: 1, ...valueSx }}>
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: iconColor, mt: 0.3 }}>
          {sub}
        </Typography>
      )}
    </Box>
  </Box>
);

export default function WealthTracker({ metrics, profile }) {
  if (!metrics || !profile) return null;
  const currency = profile.personal?.currency || 'INR';

  return (
    <Card sx={{
      height: '100%',
      background: 'rgba(20,28,50,0.7)',
      border: '1px solid rgba(0,212,255,0.1)',
      backdropFilter: 'blur(16px)',
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(0,212,255,0.7)', mb: 2.5 }}>
          💼 Wealth Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <MetricTile
            icon={AccountBalanceWalletIcon}
            iconBg="rgba(79,140,255,0.15)"
            iconColor="#4f8cff"
            label="Total Assets"
            value={formatCurrency(metrics.totalAssets, currency)}
            valueSx={{ background: 'linear-gradient(135deg, #4f8cff, #7c5cfc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
          />
          <MetricTile
            icon={TrendingUpIcon}
            iconBg="rgba(16,185,129,0.15)"
            iconColor="#10b981"
            label="Monthly Cashflow"
            value={formatCurrency(metrics.monthlySurplus, currency)}
            valueSx={{ color: metrics.monthlySurplus >= 0 ? '#10b981' : '#ef4444' }}
            sub={`Savings Rate: ${formatPercent(metrics.savingsRate)}`}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
