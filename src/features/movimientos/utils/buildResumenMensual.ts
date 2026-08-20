import { getCategoriaLabel } from '../catalog/categorias';
import type { Movimiento, ResumenMensual } from '../types';
import { formatPeriodLabel } from './formatPeriod';

type CategoryAccumulator = {
  totalCents: number;
  movementCount: number;
};

const isExpense = (amountCents: number): boolean => amountCents < 0;

const isIncome = (amountCents: number): boolean => amountCents > 0;

const isInPeriod = (movimiento: Movimiento): boolean =>
  !movimiento.flags.includes('out-of-period');

export const buildResumenMensual = (
  movimientos: readonly Movimiento[],
  periodo: string,
): ResumenMensual => {
  let ingresosCents = 0;
  let gastosCents = 0;
  let sinCategorizarCount = 0;
  let movimientosEnPeriodo = 0;
  let excludedFromTotalsCount = 0;

  const gastosByCategory = new Map<string, CategoryAccumulator>();

  for (const movimiento of movimientos) {
    if (!isInPeriod(movimiento)) {
      continue;
    }

    movimientosEnPeriodo += 1;

    if (movimiento.flags.includes('missing-category')) {
      sinCategorizarCount += 1;
    }

    if (!movimiento.countsTowardTotals) {
      excludedFromTotalsCount += 1;
      continue;
    }

    if (isIncome(movimiento.amountCents)) {
      ingresosCents += movimiento.amountCents;
      continue;
    }

    if (!isExpense(movimiento.amountCents)) {
      continue;
    }

    const expenseCents = Math.abs(movimiento.amountCents);
    gastosCents += expenseCents;

    const existing = gastosByCategory.get(movimiento.categoryId);

    if (existing) {
      gastosByCategory.set(movimiento.categoryId, {
        totalCents: existing.totalCents + expenseCents,
        movementCount: existing.movementCount + 1,
      });
      continue;
    }

    gastosByCategory.set(movimiento.categoryId, {
      totalCents: expenseCents,
      movementCount: 1,
    });
  }

  const gastosPorCategoria = [...gastosByCategory.entries()]
    .map(([categoryId, data]) => ({
      categoryId: categoryId as Movimiento['categoryId'],
      label: getCategoriaLabel(categoryId as Movimiento['categoryId']),
      totalCents: data.totalCents,
      movementCount: data.movementCount,
      percentage: gastosCents === 0 ? 0 : Math.round((data.totalCents / gastosCents) * 1000) / 10,
    }))
    .sort((left, right) => right.totalCents - left.totalCents);

  return {
    periodo,
    periodoLabel: formatPeriodLabel(periodo),
    ingresosCents,
    gastosCents,
    balanceCents: ingresosCents - gastosCents,
    gastosPorCategoria,
    sinCategorizarCount,
    movimientosEnPeriodo,
    excludedFromTotalsCount,
  };
};
