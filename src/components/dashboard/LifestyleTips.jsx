import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

function generateTips(profile, metrics) {
  const tips = [];
  if (!profile || !metrics) return ['Complete your profile to get personalized tips'];

  const { monthlyIncome, debtEMI = 0 } = profile.finances || {};

  if (metrics.savingsRate < 20) tips.push('Try to save at least 20% of your income — automate transfers on salary day.');
  if (metrics.emergencyFundGap > 0) tips.push('Build a 6-month emergency fund before aggressive investing.');
  if (debtEMI > monthlyIncome * 0.3) tips.push('Your EMI exceeds 30% of income. Consider refinancing or faster repayment.');
  if (metrics.expenseRatio > 70) tips.push('You spend over 70% of income. Review subscriptions and dining costs.');
  if (metrics.savingsRate >= 30) tips.push('Great savings rate! Consider increasing SIP amounts after each salary hike.');
  if (profile.preferences?.preferredAssets?.length < 3) tips.push('Diversify across 3+ asset types to reduce portfolio risk.');
  tips.push('Keep insurance (health + term) before investing aggressively.');
  tips.push('Review and rebalance your portfolio every 6 months.');

  return tips.slice(0, 5);
}

export default function LifestyleTips({ profile, metrics }) {
  const tips = generateTips(profile, metrics);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>💡 Lifestyle Tips</Typography>
        <List dense disablePadding>
          {tips.map((tip, i) => (
            <ListItem key={i} disablePadding sx={{ mb: 1, alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                <TipsAndUpdatesIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText primary={tip} primaryTypographyProps={{ variant: 'body2', lineHeight: 1.5 }} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
