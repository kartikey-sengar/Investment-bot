export const RISK_PROFILES = {
  low: {
    label: 'Conservative',
    description: 'Focus on capital preservation with modest growth',
    allocation: {
      emergency: 25,
      mutualFunds: 20,
      stocks: 5,
      gold: 20,
      fixedIncome: 30,
    },
    maxEquityExposure: 15,
    recommendedAssets: ['fd', 'ppf', 'gold', 'mutual_funds'],
    summary: 'Your portfolio prioritizes stability with fixed income instruments and emergency reserves.',
  },
  medium: {
    label: 'Balanced',
    description: 'Balance between growth and stability',
    allocation: {
      emergency: 20,
      mutualFunds: 30,
      stocks: 15,
      gold: 15,
      fixedIncome: 20,
    },
    maxEquityExposure: 35,
    recommendedAssets: ['mutual_funds', 'sip', 'etf', 'gold', 'stocks'],
    summary: 'Your portfolio balances steady growth through SIPs with protective hedges from gold and FDs.',
  },
  high: {
    label: 'Aggressive',
    description: 'Maximize growth potential with higher volatility tolerance',
    allocation: {
      emergency: 15,
      mutualFunds: 25,
      stocks: 30,
      gold: 10,
      fixedIncome: 20,
    },
    maxEquityExposure: 55,
    recommendedAssets: ['stocks', 'etf', 'mutual_funds', 'sip', 'crypto'],
    summary: 'Your portfolio is growth-oriented with higher equity exposure for maximum long-term returns.',
  },
};
