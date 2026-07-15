import { Box, Typography, Grid, Button, Alert, AlertTitle, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useUser } from '../context/UserContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import Loader from '../components/common/Loader.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import FinancialHealthScore from '../components/dashboard/FinancialHealthScore.jsx';
import SavingsOverview from '../components/dashboard/SavingsOverview.jsx';
import InvestmentAllocation from '../components/dashboard/InvestmentAllocation.jsx';
import GoalTracker from '../components/dashboard/GoalTracker.jsx';
import LifestyleTips from '../components/dashboard/LifestyleTips.jsx';
import CommodityInsights from '../components/dashboard/CommodityInsights.jsx';
import AIExecutiveSummary from '../components/dashboard/AIExecutiveSummary.jsx';
import RecentExpensesWidget from '../components/dashboard/RecentExpensesWidget.jsx';
import WealthTracker from '../components/dashboard/WealthTracker.jsx';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading, isOnboarded, refreshProfile } = useUser();
  const { metrics, healthScore, allocation } = useFinance();

  if (loading) return <Loader variant="card" count={6} />;

  if (!isOnboarded) {
    return (
      <Box className="dashboard-empty" textAlign="center" py={10}>
        <Typography variant="h4" mb={2}>Welcome to FinPilot AI</Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Set up your financial profile to unlock personalized insights.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/setup')}>
          Create Your Profile →
        </Button>
      </Box>
    );
  }

  const monthlyIncome   = profile?.finances?.monthlyIncome   || 0;
  const monthlyExpenses = profile?.finances?.monthlyExpenses || 0;
  const currentSavings  = profile?.finances?.currentSavings  || 0;
  const debtEMI         = profile?.finances?.debtEMI         || 0;

  const savingsRate = monthlyIncome > 0
    ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
    : 0;
  const dti = monthlyIncome > 0 ? Math.round((debtEMI / monthlyIncome) * 100) : 0;

  // healthScore can be a number OR an object { score, label, color, breakdown }
  const scoreNum = typeof healthScore === 'object'
    ? Math.round(healthScore?.score || 0)
    : Math.round(healthScore || 0);

  // Smart alerts
  const alerts = [];
  if (dti > 40)
    alerts.push({ severity: 'error',   title: '⚠️ High Debt Load',        msg: `Your debt-to-income ratio is ${dti}%. Consider reducing EMI commitments.` });
  else if (dti > 25)
    alerts.push({ severity: 'warning', title: '📊 Moderate Debt',         msg: `Your DTI is ${dti}%. Try to bring it below 25%.` });
  if (savingsRate < 10)
    alerts.push({ severity: 'warning', title: '💰 Low Savings Rate',      msg: `You're saving ${savingsRate}% of income. Aim for 20%+.` });
  if (metrics?.emergencyFundGap > 0 && currentSavings < monthlyExpenses * 3)
    alerts.push({ severity: 'info',    title: '🛡️ Build Emergency Fund',  msg: `You need ₹${metrics.emergencyFundGap.toLocaleString()} more for a 6-month safety net.` });

  return (
    <Box className="dashboard-page page-container">

      {/* ── HEADER ── */}
      <Box sx={{ mb: 4, animation: 'slideInUp 600ms ease' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', letterSpacing: '-0.02em', mb: 0.5 }}
            >
              Welcome back, <span className="text-gradient">{profile?.personal?.name?.split(' ')[0]}</span>! 👋
            </Typography>
            <Typography sx={{ fontSize: '1rem', color: 'rgba(176,181,212,0.85)' }}>
              Here's your complete financial snapshot for today
            </Typography>
          </Box>
          <Tooltip title="Sync latest profile data">
            <Button
              startIcon={<RefreshIcon />}
              onClick={refreshProfile}
              variant="outlined"
              sx={{
                borderColor: 'rgba(0,212,255,0.3)',
                color: '#00d4ff',
                '&:hover': { borderColor: 'rgba(0,212,255,0.6)', background: 'rgba(0,212,255,0.08)' },
              }}
            >
              Refresh
            </Button>
          </Tooltip>
        </Box>

        {/* AI Executive Summary banner */}
        <AIExecutiveSummary />
      </Box>

      {/* ── SMART ALERTS ── */}
      {alerts.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
          {alerts.map((a, i) => (
            <Alert
              key={i}
              severity={a.severity}
              sx={{
                borderRadius: '14px',
                backdropFilter: 'blur(10px)',
                background:
                  a.severity === 'error'   ? 'rgba(239,68,68,0.08)'  :
                  a.severity === 'warning' ? 'rgba(245,158,11,0.08)' :
                                             'rgba(0,212,255,0.08)',
                border:
                  a.severity === 'error'   ? '1px solid rgba(239,68,68,0.25)'  :
                  a.severity === 'warning' ? '1px solid rgba(245,158,11,0.25)' :
                                             '1px solid rgba(0,212,255,0.25)',
              }}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>{a.title}</AlertTitle>
              {a.msg}
            </Alert>
          ))}
        </Box>
      )}

      {/* ── ROW 1: KEY STAT CARDS ── */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(0,212,255,0.7)', mb: 2 }}>
          📈 Your Financial Metrics
        </Typography>
        <Grid container spacing={2.5} className="stagger-children">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Monthly Income"
              value={monthlyIncome.toLocaleString()}
              unit="₹"
              icon={PaymentsIcon}
              color="#00d4ff"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Monthly Expenses"
              value={monthlyExpenses.toLocaleString()}
              unit="₹"
              icon={TrendingUpIcon}
              color="#a855f7"
              isPositive={false}
              change={monthlyExpenses > 0 ? 5 : undefined}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Savings Rate"
              value={savingsRate}
              unit="%"
              icon={AccountBalanceIcon}
              change={savingsRate > 15 ? 'Healthy' : savingsRate > 10 ? 'Good' : 'Needs Work'}
              isPositive={savingsRate > 15}
              color="#10b981"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Financial Score"
              value={scoreNum}
              unit="/100"
              icon={EmojiEventsIcon}
              progress={scoreNum}
              color="#fbbf24"
            />
          </Grid>
        </Grid>
      </Box>

      {/* ── ROW 2: WEALTH OVERVIEW (fixed) + HEALTH SCORE ── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }} className="stagger-children">
        <Grid item xs={12} md={7}>
          {/* WealthTracker is now a self-contained card — no nested Grid wrappers */}
          <WealthTracker metrics={metrics} profile={profile} />
        </Grid>
        <Grid item xs={12} md={5}>
          <FinancialHealthScore healthScore={healthScore} />
        </Grid>
      </Grid>

      {/* ── ROW 3: SAVINGS OVERVIEW ── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid item xs={12}>
          <SavingsOverview metrics={metrics} profile={profile} />
        </Grid>
      </Grid>

      {/* ── ROW 4: INVESTMENT ALLOCATION + RECENT EXPENSES ── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }} className="stagger-children">
        <Grid item xs={12} md={6}>
          <InvestmentAllocation allocation={allocation} />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentExpensesWidget />
        </Grid>
      </Grid>

      {/* ── ROW 5: GOAL TRACKER + COMMODITY INSIGHTS ── */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }} className="stagger-children">
        <Grid item xs={12} md={6}>
          <GoalTracker />
        </Grid>
        <Grid item xs={12} md={6}>
          <CommodityInsights />
        </Grid>
      </Grid>

      {/* ── ROW 6: LIFESTYLE TIPS ── */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <LifestyleTips />
        </Grid>
      </Grid>

    </Box>
  );
}
