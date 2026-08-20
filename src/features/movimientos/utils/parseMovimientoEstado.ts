import type { MovimientoEstado } from '../types';
import { countsTowardTotalsByStatus, getEstadoPrecedence } from '../catalog/estados';

const ESTADOS_VALIDOS = new Set<MovimientoEstado>([
  'confirmada',
  'pendiente',
  'programada',
  'en_disputa',
]);

export const parseMovimientoEstado = (estado: string): MovimientoEstado => {
  if (ESTADOS_VALIDOS.has(estado as MovimientoEstado)) {
    return estado as MovimientoEstado;
  }

  return 'confirmada';
};

export const countsTowardTotals = (status: MovimientoEstado): boolean =>
  countsTowardTotalsByStatus(status);

export const getMovimientoEstadoPrecedence = (status: MovimientoEstado): number =>
  getEstadoPrecedence(status);
