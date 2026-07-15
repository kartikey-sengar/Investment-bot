/**
 * Financial Health Score Algorithm (0–100)
 * 
 * Weighted scoring across 6 dimensions:
 * - Savings Rate: 25%
 * - Emergency Readiness: 20%
 * - Debt Ratio: 15%
 * - Investment Diversification: 15%
 * - Goal Clarity: 15%
 * - Risk Alignment: 10%
 */

export function calculateHealthScore(profile) {
  if (!profile || !profile.finances) return { score: 0, breakdown: {}, label: 'No Data' };

  const { finances, goals = [], preferences = {} } = profile;
  const { monthlyIncome = 0, monthlyExpenses = 0, currentSavings = 0, existingInvestments = 0, debtEMI = 0 } = finances;

  // ── 1. Savings Rate Score (25%) ──
  let savingsRateScore = 0;
  if (monthlyIncome > 0) {
    const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    if (savingsRate >= 30) savingsRateScore = 100;
    else if (savingsRate >= 20) savingsRateScore = 80;
    else if (savingsRate >= 10) savingsRateScore = 60;
    else if (savingsRate > 0) savingsRateScore = 40;
    else savingsRateScore = 10;
  }

  // ── 2. Emergency Fund Score (20%) ──
  let emergencyScore = 0;
  const emergencyTarget = monthlyExpenses * 6;
  if (emergencyTarget > 0) {
    const emergencyRatio = currentSavings / emergencyTarget;
    if (emergencyRatio >= 1) emergencyScore = 100;
    else if (emergencyRatio >= 0.75) emergencyScore = 80;
    else if (emergencyRatio >= 0.5) emergencyScore = 60;
    else if (emergencyRatio >= 0.25) emergencyScore = 40;
    else emergencyScore = 15;
  }

  // ── 3. Debt Ratio Score (15%) ──
  let debtScore = 100;
  if (monthlyIncome > 0 && debtEMI > 0) {
    const debtRatio = (debtEMI / monthlyIncome) * 100;
    if (debtRatio <= 10) debtScore = 100;
    else if (debtRatio <= 20) debtScore = 80;
    else if (debtRatio <= 30) debtScore = 60;
    else if (debtRatio <= 40) debtScore = 40;
    else debtScore = 15;
  }

  // ── 4. Investment Diversification Score (15%) ──
  let diversificationScore = 0;
  const preferredAssets = preferences.preferredAssets || [];
  if (existingInvestments > 0 && preferredAssets.length >= 4) diversificationScore = 100;
  else if (existingInvestments > 0 && preferredAssets.length >= 3) diversificationScore = 75;
  else if (existingInvestments > 0 && preferredAssets.length >= 2) diversificationScore = 50;
  else if (existingInvestments > 0) diversificationScore = 30;
  else diversificationScore = 10;

  // ── 5. Goal Clarity Score (15%) ──
  let goalScore = 0;
  const activeGoals = goals.filter(g => g.status !== 'completed');
  if (activeGoals.length >= 3) goalScore = 100;
  else if (activeGoals.length === 2) goalScore = 75;
  else if (activeGoals.length === 1) goalScore = 50;
  else goalScore = 10;

  // ── 6. Risk Alignment Score (10%) ──
  let riskScore = 50;
  const risk = preferences.riskAppetite || 'medium';
  const age = profile.personal?.age || 30;
  // Younger can afford higher risk, older should prefer lower
  if (age < 30 && (risk === 'high' || risk === 'medium')) riskScore = 90;
  else if (age >= 30 && age < 45 && risk === 'medium') riskScore = 90;
  else if (age >= 45 && (risk === 'low' || risk === 'medium')) riskScore = 90;
  else riskScore = 60;

  // ── Weighted Final Score ──
  const score = Math.round(
    savingsRateScore * 0.25 +
    emergencyScore * 0.20 +
    debtScore * 0.15 +
    diversificationScore * 0.15 +
    goalScore * 0.15 +
    riskScore * 0.10
  );

  const breakdown = {
    savingsRate: { score: savingsRateScore, weight: 25, label: 'Savings Rate' },
    emergencyFund: { score: emergencyScore, weight: 20, label: 'Emergency Fund' },
    debtRatio: { score: debtScore, weight: 15, label: 'Debt Management' },
    diversification: { score: diversificationScore, weight: 15, label: 'Diversification' },
    goalClarity: { score: goalScore, weight: 15, label: 'Goal Planning' },
    riskAlignment: { score: riskScore, weight: 10, label: 'Risk Alignment' },
  };

  return {
    score,
    breakdown,
    label: getScoreLabel(score),
    color: getScoreColor(score),
  };
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Needs Improvement';
  return 'Critical';
}

function getScoreColor(score) {
  if (score >= 85) return '#10b981';
  if (score >= 70) return '#22c55e';
  if (score >= 55) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}
