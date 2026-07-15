import { RISK_PROFILES } from './riskProfiles.js';

/**
 * Deterministic Investment Allocation Engine
 * Generates a % breakdown across asset classes based on risk, goals, and timeline.
 */
export function calculateAllocation(profile) {
  if (!profile) return getDefaultAllocation();

  const { finances = {}, preferences = {}, goals = [] } = profile;
  const risk = preferences.riskAppetite || 'medium';
  const riskProfile = RISK_PROFILES[risk] || RISK_PROFILES.medium;
  const monthlyIncome = finances.monthlyIncome || 0;
  const monthlyExpenses = finances.monthlyExpenses || 0;
  const currentSavings = finances.currentSavings || 0;

  // Calculate investable amount
  const investable = Math.max(0, monthlyIncome - monthlyExpenses - (finances.debtEMI || 0));

  // Check emergency fund status
  const emergencyTarget = monthlyExpenses * 6;
  const emergencyGap = Math.max(0, emergencyTarget - currentSavings);
  const needsEmergencyFund = emergencyGap > 0;

  // Determine avg goal timeline
  const avgTimeline = goals.length > 0
    ? goals.reduce((sum, g) => sum + (g.timelineMonths || 12), 0) / goals.length
    : 36;

  // Adjust allocation based on timeline
  let allocation = { ...riskProfile.allocation };

  // If emergency fund isn't built, boost it
  if (needsEmergencyFund) {
    const boost = Math.min(15, allocation.stocks);
    allocation.emergency += boost;
    allocation.stocks -= boost;
  }

  // If short timeline, reduce stocks, increase stable
  if (avgTimeline < 24) {
    const shift = Math.min(10, allocation.stocks);
    allocation.stocks -= shift;
    allocation.fixedIncome += shift;
  }

  // If long timeline, can afford more equity
  if (avgTimeline > 60 && risk !== 'low') {
    const shift = Math.min(5, allocation.fixedIncome);
    allocation.fixedIncome -= shift;
    allocation.stocks += shift;
  }

  // Normalize to 100%
  const total = Object.values(allocation).reduce((a, b) => a + b, 0);
  if (total !== 100) {
    const factor = 100 / total;
    for (const key in allocation) {
      allocation[key] = Math.round(allocation[key] * factor);
    }
    // Fix rounding
    const newTotal = Object.values(allocation).reduce((a, b) => a + b, 0);
    if (newTotal !== 100) {
      allocation.emergency += (100 - newTotal);
    }
  }

  return {
    allocation,
    investableAmount: investable,
    breakdown: Object.entries(allocation).map(([key, pct]) => ({
      category: key,
      label: getAllocationLabel(key),
      percentage: pct,
      amount: Math.round((investable * pct) / 100),
      color: getAllocationColor(key),
    })),
    riskLevel: risk,
    emergencyFundStatus: needsEmergencyFund ? 'incomplete' : 'complete',
    emergencyGap,
  };
}

function getDefaultAllocation() {
  return {
    allocation: { emergency: 20, mutualFunds: 30, stocks: 15, gold: 15, fixedIncome: 20 },
    investableAmount: 0,
    breakdown: [],
    riskLevel: 'medium',
    emergencyFundStatus: 'unknown',
    emergencyGap: 0,
  };
}

function getAllocationLabel(key) {
  const labels = {
    emergency: 'Emergency / Liquid',
    mutualFunds: 'Mutual Funds / SIP',
    stocks: 'Stocks / ETFs',
    gold: 'Gold / Commodities',
    fixedIncome: 'Fixed Income / FD',
  };
  return labels[key] || key;
}

function getAllocationColor(key) {
  const colors = {
    emergency: '#3b82f6',
    mutualFunds: '#10b981',
    stocks: '#f59e0b',
    gold: '#f97316',
    fixedIncome: '#8b5cf6',
  };
  return colors[key] || '#64748b';
}
