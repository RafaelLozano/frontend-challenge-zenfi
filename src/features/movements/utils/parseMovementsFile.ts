import type { MovementsDataset, MovementsFileRaw } from '../types';
import { buildDataQualityReport } from './buildDataQualityReport';
import { formatPeriodLabel } from './formatPeriod';
import { parseMovements } from './parseMovements';

const isMovementsFileRaw = (value: unknown): value is MovementsFileRaw => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.periodo === 'string' && Array.isArray(record.movimientos);
};

export const parseMovementsFile = (raw: unknown): MovementsDataset => {
  if (!isMovementsFileRaw(raw)) {
    throw new Error('El archivo de movimientos no tiene el formato esperado');
  }

  const movements = parseMovements(raw.movimientos, raw.periodo);
  const quality = buildDataQualityReport(movements);

  return {
    period: raw.periodo,
    periodLabel: formatPeriodLabel(raw.periodo),
    movements,
    quality,
  };
};
