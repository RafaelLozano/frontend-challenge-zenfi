import type { MovimientosDataset, MovimientosFileRaw } from '../types';
import { buildDataQualityReport } from './buildDataQualityReport';
import { formatPeriodLabel } from './formatPeriod';
import { parseMovimientos } from './parseMovimientos';

const isMovimientosFileRaw = (value: unknown): value is MovimientosFileRaw => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.periodo === 'string' && Array.isArray(record.movimientos);
};

export const parseMovimientosFile = (raw: unknown): MovimientosDataset => {
  if (!isMovimientosFileRaw(raw)) {
    throw new Error('El archivo de movimientos no tiene el formato esperado');
  }

  const movimientos = parseMovimientos(raw.movimientos, raw.periodo);
  const quality = buildDataQualityReport(movimientos);

  return {
    periodo: raw.periodo,
    periodoLabel: formatPeriodLabel(raw.periodo),
    movimientos,
    quality,
  };
};
