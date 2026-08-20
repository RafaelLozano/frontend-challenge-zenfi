import type { CategoriaId, DataQualityFlag, Movimiento } from '../types';
import { buildNota } from './buildNota';
import { computeCountsTowardTotals } from './computeCountsTowardTotals';

export { getCategoriaLabel } from '../catalog/categorias';

const removeFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => flags.filter((current) => current !== flag);

const addFlag = (
  flags: readonly DataQualityFlag[],
  flag: DataQualityFlag,
): readonly DataQualityFlag[] => (flags.includes(flag) ? flags : [...flags, flag]);

const finalizeMovimiento = (movimiento: Movimiento): Movimiento => ({
  ...movimiento,
  note: buildNota(movimiento),
  countsTowardTotals: computeCountsTowardTotals(movimiento),
});

export const updateMovimientoCategoria = (
  movimientos: readonly Movimiento[],
  movimientoId: string,
  categoryId: CategoriaId,
): Movimiento[] =>
  movimientos.map((movimiento) => {
    if (movimiento.id !== movimientoId) {
      return movimiento;
    }

    const flags =
      categoryId === 'sin-categoria'
        ? addFlag(removeFlag(movimiento.flags, 'missing-category'), 'missing-category')
        : removeFlag(movimiento.flags, 'missing-category');

    return finalizeMovimiento({
      ...movimiento,
      categoryId,
      flags,
    });
  });
