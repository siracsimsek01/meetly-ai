import type { KpiSnapshot } from './types';

export const baselineKpis: KpiSnapshot = {
  meetingsThisWeek: 14,
  avgDurationMin: 28,
  minutesSaved: 162,
  recordings: 9,
};

export const mergeKpis = (
  real: Partial<KpiSnapshot>,
): KpiSnapshot => ({
  ...baselineKpis,
  ...real,
});
