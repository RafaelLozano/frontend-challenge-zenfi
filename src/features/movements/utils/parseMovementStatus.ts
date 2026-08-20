import type { MovementStatus } from '../types';
import { countsTowardTotalsByStatus, getStatusPrecedence } from '../catalog/states';

const VALID_STATUSES = new Set<MovementStatus>([
  'confirmada',
  'pendiente',
  'programada',
  'en_disputa',
]);

export const parseMovementStatus = (estado: string): MovementStatus => {
  if (VALID_STATUSES.has(estado as MovementStatus)) {
    return estado as MovementStatus;
  }

  return 'confirmada';
};

export const countsTowardTotals = (status: MovementStatus): boolean =>
  countsTowardTotalsByStatus(status);

export const getMovementStatusPrecedence = (status: MovementStatus): number =>
  getStatusPrecedence(status);
