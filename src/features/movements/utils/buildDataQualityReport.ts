import type { DataQualityFlag, DataQualityReport, Movement } from '../types';

const countByFlag = (movements: readonly Movement[], flag: DataQualityFlag): number =>
  movements.filter((movement) => movement.flags.includes(flag)).length;

export const buildDataQualityReport = (movements: readonly Movement[]): DataQualityReport => ({
  totalReceived: movements.length,
  countedInTotals: movements.filter((movement) => movement.countsTowardTotals).length,
  duplicates: countByFlag(movements, 'duplicate'),
  supersededByStatus: countByFlag(movements, 'superseded-by-state'),
  outOfPeriod: countByFlag(movements, 'out-of-period'),
  foreignCurrency: countByFlag(movements, 'foreign-currency'),
  missingCategory: countByFlag(movements, 'missing-category'),
  inferredSign: countByFlag(movements, 'amount-sign-inferred'),
});
