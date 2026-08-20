import { countsTowardTotalsByStatus } from '../catalog/states';
import type { Movement } from '../types';

export const computeCountsTowardTotals = (
  movement: Pick<Movement, 'amountCents' | 'currency' | 'status' | 'flags'>,
): boolean => {
  if (movement.currency !== 'MXN') {
    return false;
  }

  if (!countsTowardTotalsByStatus(movement.status)) {
    return false;
  }

  if (movement.flags.includes('out-of-period')) {
    return false;
  }

  if (movement.flags.includes('duplicate')) {
    return false;
  }

  if (movement.flags.includes('superseded-by-state')) {
    return false;
  }

  return true;
};
