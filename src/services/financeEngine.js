/**
 * FinPilot Finance Engine
 * Core financial calculation functions
 */

export function calcSavingsRate(income, expenses) {
  if (!income || income <= 0) return 0;
  return ((income - expenses) / income) * 100;
}

export function calcEmergencyFundTarget(monthlyExpenses) {
  return monthlyExpenses * 6;
}

export function calcEmergencyFundGap(monthlyExpenses, currentSavings) {
  const target = calcEmergencyFundTarget(monthlyExpenses);
  return Math.max(0, target - currentSavings);
}

export function calcSafeInvestmentCapacity(income, expenses, debtEMI = 0) {
  const buffer = expenses * 0.1; // 10% essential buffer
  return Math.max(0, income - expenses - debtEMI - buffer);
}

export function calcMaxSafeEMI(income) {
  return income * 0.30;
}

export function calcGoalContribution(targetAmount, timelineMonths, currentAmount = 0) {
  const remaining = Math.max(0, targetAmount - currentAmount);
  if (timelineMonths <= 0) return remaining;
  return remaining / timelineMonths;
}

export function calcGoalProgress(targetAmount, currentAmount = 0) {
  if (targetAmount <= 0) return 100;
  return Math.min(100, (currentAmount / targetAmount) * 100);
}

export function calcGoalFeasibility(monthlyContribution, investableAmount) {
  if (monthlyContribution <= 0) return 'achieved';
  if (investableAmount <= 0) return 'infeasible';
  const ratio = investableAmount / monthlyContribution;
  if (ratio >= 1.5) return 'comfortable';
  if (ratio >= 1) return 'tight';
  if (ratio >= 0.5) return 'stretch';
  return 'infeasible';
}

export function calcExpenseRatio(expenses, income) {
  if (!income || income <= 0) return 100;
  return (expenses / income) * 100;
}

/**
 * What-If Simulator
 * Recalculate all metrics with adjusted parameters
 */
export function runWhatIf(baseProfile, adjustments = {}) {
  const profile = JSON.parse(JSON.stringify(baseProfile));
  const { finances } = profile;

  if (adjustments.incomeChange) {
    finances.monthlyIncome *= (1 + adjustments.incomeChange / 100);
  }
  if (adjustments.expenseChange) {
    finances.monthlyExpenses *= (1 + adjustments.expenseChange / 100);
  }
  if (adjustments.savingsBoost) {
    finances.currentSavings += adjustments.savingsBoost;
  }

  // Adjust goal timelines
  if (adjustments.goalTimelineChange && profile.goals) {
    profile.goals = profile.goals.map(g => ({
      ...g,
      timelineMonths: Math.max(1, g.timelineMonths + adjustments.goalTimelineChange),
    }));
  }

  // Recalculate core metrics
  const income = finances.monthlyIncome;
  const expenses = finances.monthlyExpenses;
  const savings = finances.currentSavings;
  const debtEMI = finances.debtEMI || 0;

  return {
    profile,
    metrics: {
      savingsRate: calcSavingsRate(income, expenses),
      emergencyFundTarget: calcEmergencyFundTarget(expenses),
      emergencyFundGap: calcEmergencyFundGap(expenses, savings),
      safeInvestment: calcSafeInvestmentCapacity(income, expenses, debtEMI),
      maxSafeEMI: calcMaxSafeEMI(income),
      expenseRatio: calcExpenseRatio(expenses, income),
      monthlySurplus: income - expenses - debtEMI,
    },
  };
}

/**
 * Generate all computed metrics from a profile
 */
export function computeAllMetrics(profile) {
  if (!profile || !profile.finances) {
    return {
      savingsRate: 0,
      emergencyFundTarget: 0,
      emergencyFundGap: 0,
      safeInvestment: 0,
      maxSafeEMI: 0,
      expenseRatio: 100,
      monthlySurplus: 0,
      goalContributions: [],
    };
  }

  const { monthlyIncome, monthlyExpenses, currentSavings, debtEMI = 0 } = profile.finances;

  const goalContributions = (profile.goals || []).map(goal => ({
    ...goal,
    monthlyContribution: calcGoalContribution(goal.targetAmount, goal.timelineMonths, goal.currentAmount),
    progress: calcGoalProgress(goal.targetAmount, goal.currentAmount),
    feasibility: calcGoalFeasibility(
      calcGoalContribution(goal.targetAmount, goal.timelineMonths, goal.currentAmount),
      calcSafeInvestmentCapacity(monthlyIncome, monthlyExpenses, debtEMI)
    ),
  }));

  return {
    savingsRate: calcSavingsRate(monthlyIncome, monthlyExpenses),
    emergencyFundTarget: calcEmergencyFundTarget(monthlyExpenses),
    emergencyFundGap: calcEmergencyFundGap(monthlyExpenses, currentSavings),
    safeInvestment: calcSafeInvestmentCapacity(monthlyIncome, monthlyExpenses, debtEMI),
    maxSafeEMI: calcMaxSafeEMI(monthlyIncome),
    expenseRatio: calcExpenseRatio(monthlyExpenses, monthlyIncome),
    monthlySurplus: monthlyIncome - monthlyExpenses - debtEMI,
    totalAssets: currentSavings + (profile?.finances?.existingInvestments || 0),
    goalContributions,
  };
}
