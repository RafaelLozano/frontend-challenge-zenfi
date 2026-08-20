import { getCategoryLabel } from '../catalog/categories';
import type { Movement, MonthlySummary } from '../types';
import { buildTopCategories } from './buildTopCategories';
import { formatPeriodLabel } from './formatPeriod';

type CategoryAccumulator = {
  totalCents: number;
  movementCount: number;
};

const isExpense = (amountCents: number): boolean => amountCents < 0;

const isIncome = (amountCents: number): boolean => amountCents > 0;

const isInPeriod = (movement: Movement): boolean => !movement.flags.includes('out-of-period');

export const buildMonthlySummary = (
  movements: readonly Movement[],
  period: string,
): MonthlySummary => {
  let incomeCents = 0;
  let expensesCents = 0;
  let uncategorizedCount = 0;
  let movementsInPeriod = 0;
  let excludedFromTotalsCount = 0;

  const expensesByCategoryMap = new Map<string, CategoryAccumulator>();

  for (const movement of movements) {
    if (!isInPeriod(movement)) {
      continue;
    }

    movementsInPeriod += 1;

    if (movement.flags.includes('missing-category')) {
      uncategorizedCount += 1;
    }

    if (!movement.countsTowardTotals) {
      excludedFromTotalsCount += 1;
      continue;
    }

    if (isIncome(movement.amountCents)) {
      incomeCents += movement.amountCents;
      continue;
    }

    if (!isExpense(movement.amountCents)) {
      continue;
    }

    const expenseCents = Math.abs(movement.amountCents);
    expensesCents += expenseCents;

    const existing = expensesByCategoryMap.get(movement.categoryId);

    if (existing) {
      expensesByCategoryMap.set(movement.categoryId, {
        totalCents: existing.totalCents + expenseCents,
        movementCount: existing.movementCount + 1,
      });
      continue;
    }

    expensesByCategoryMap.set(movement.categoryId, {
      totalCents: expenseCents,
      movementCount: 1,
    });
  }

  const expensesByCategory = [...expensesByCategoryMap.entries()]
    .map(([categoryId, data]) => ({
      categoryId: categoryId as Movement['categoryId'],
      label: getCategoryLabel(categoryId as Movement['categoryId']),
      totalCents: data.totalCents,
      movementCount: data.movementCount,
      percentage: expensesCents === 0 ? 0 : Math.round((data.totalCents / expensesCents) * 1000) / 10,
    }))
    .sort((left, right) => right.totalCents - left.totalCents);

  const includedInSummaryCount = movementsInPeriod - excludedFromTotalsCount;

  return {
    period,
    periodLabel: formatPeriodLabel(period),
    incomeCents,
    expensesCents,
    balanceCents: incomeCents - expensesCents,
    expensesByCategory,
    expenseBreakdown: buildTopCategories(expensesByCategory, expensesCents),
    uncategorizedCount,
    movementsInPeriod,
    excludedFromTotalsCount,
    includedInSummaryCount,
  };
};
