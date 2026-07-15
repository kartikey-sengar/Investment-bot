import { Box, Card, CardContent, Typography, LinearProgress, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatMonths } from '../../utils/formatters.js';

const feasibilityColors = { comfortable: 'success', tight: 'warning', stretch: 'error', infeasible: 'error', achieved: 'success' };

export default function GoalTracker({ metrics, profile }) {
  const navigate = useNavigate();
  if (!metrics?.goalContributions?.length) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
          <Typography variant="h6" mb={1}>No Goals Set</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>Add financial goals to track your progress</Typography>
          <Button variant="outlined" size="small" onClick={() => navigate('/goals')}>Add Goals</Button>
        </CardContent>
      </Card>
    );
  }

  const currency = profile?.personal?.currency || 'INR';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>Goal Tracker</Typography>
          <Button size="small" onClick={() => navigate('/goals')}>View All</Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {metrics.goalContributions.slice(0, 4).map(goal => (
            <Box key={goal.title || goal.id} sx={{ p: 2, bgcolor: 'rgba(148,163,184,0.04)', borderRadius: 2, border: '1px solid rgba(148,163,184,0.06)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>{goal.title}</Typography>
                <Chip label={goal.feasibility} size="small" color={feasibilityColors[goal.feasibility] || 'default'} variant="outlined" sx={{ textTransform: 'capitalize', height: 22, fontSize: '0.7rem' }} />
              </Box>
              <LinearProgress variant="determinate" value={Math.min(goal.progress, 100)}
                sx={{ height: 6, borderRadius: 3, mb: 1, bgcolor: 'rgba(148,163,184,0.08)',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, background: goal.progress >= 80 ? '#10b981' : 'linear-gradient(90deg, #4f8cff, #7c5cfc)' }
                }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  {formatCurrency(goal.monthlyContribution, currency)}/mo needed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatMonths(goal.timelineMonths)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
