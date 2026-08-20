import { countsTowardTotalsByStatus } from '../catalog/estados';
import type { Movimiento } from '../types';

export const computeCountsTowardTotals = (
  movimiento: Pick<Movimiento, 'amountCents' | 'currency' | 'status' | 'flags'>,
): boolean => {
  if (movimiento.currency !== 'MXN') {
    return false;
  }

  if (!countsTowardTotalsByStatus(movimiento.status)) {
    return false;
  }

  if (movimiento.flags.includes('out-of-period')) {
    return false;
  }

  if (movimiento.flags.includes('duplicate')) {
    return false;
  }

  if (movimiento.flags.includes('superseded-by-state')) {
    return false;
  }

  return true;
};
