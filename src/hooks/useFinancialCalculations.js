import { useMemo } from 'react';
import { computeAllMetrics, runWhatIf } from '../services/financeEngine.js';

export function useFinancialCalculations(profile, adjustments = null) {
  const result = useMemo(() => {
    if (!profile) return null;

    if (adjustments) {
      return runWhatIf(profile, adjustments);
    }

    return {
      profile,
      metrics: computeAllMetrics(profile),
    };
  }, [profile, adjustments]);

  return result;
}
