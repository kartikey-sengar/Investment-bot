import { createContext, useContext, useMemo } from 'react';
import { useUser } from './UserContext.jsx';
import { computeAllMetrics } from '../services/financeEngine.js';
import { calculateHealthScore } from '../utils/scoring.js';
import { calculateAllocation } from '../utils/allocationRules.js';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { profile } = useUser();

  const computed = useMemo(() => {
    if (!profile) {
      return {
        metrics: null,
        healthScore: null,
        allocation: null,
      };
    }

    return {
      metrics: computeAllMetrics(profile),
      healthScore: calculateHealthScore(profile),
      allocation: calculateAllocation(profile),
    };
  }, [profile]);

  return <FinanceContext.Provider value={computed}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}
