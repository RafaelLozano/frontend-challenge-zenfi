import type { DataQualityFlag, DataQualityReport, Movimiento } from '../types';

const countByFlag = (movimientos: readonly Movimiento[], flag: DataQualityFlag): number =>
  movimientos.filter((movimiento) => movimiento.flags.includes(flag)).length;

export const buildDataQualityReport = (movimientos: readonly Movimiento[]): DataQualityReport => ({
  totalRecibidos: movimientos.length,
  contadosEnTotales: movimientos.filter((movimiento) => movimiento.countsTowardTotals).length,
  duplicados: countByFlag(movimientos, 'duplicate'),
  supersededPorEstado: countByFlag(movimientos, 'superseded-by-state'),
  fueraDePeriodo: countByFlag(movimientos, 'out-of-period'),
  otraMoneda: countByFlag(movimientos, 'foreign-currency'),
  sinCategoria: countByFlag(movimientos, 'missing-category'),
  signoInferido: countByFlag(movimientos, 'amount-sign-inferred'),
});
