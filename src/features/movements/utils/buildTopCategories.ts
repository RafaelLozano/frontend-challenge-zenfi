import type { CategoryBreakdownItem, CategorySummary } from '../types';

const DEFAULT_TOP_COUNT = 5;

export const buildTopCategories = (
  expensesByCategory: readonly CategorySummary[],
  expensesCents: number,
  topCount = DEFAULT_TOP_COUNT,
): readonly CategoryBreakdownItem[] => {
  if (expensesByCategory.length === 0) {
    return [];
  }

  const topCategories = expensesByCategory.slice(0, topCount);
  const remainingCategories = expensesByCategory.slice(topCount);

  const topItems: CategoryBreakdownItem[] = topCategories.map((category) => ({
    key: category.categoryId,
    categoryId: category.categoryId,
    label: category.label,
    totalCents: category.totalCents,
    percentage: category.percentage,
    movementCount: category.movementCount,
  }));

  if (remainingCategories.length === 0) {
    return topItems;
  }

  const otherTotalCents = remainingCategories.reduce(
    (total, category) => total + category.totalCents,
    0,
  );
  const otherMovementCount = remainingCategories.reduce(
    (total, category) => total + category.movementCount,
    0,
  );
  const otherPercentage =
    expensesCents === 0 ? 0 : Math.round((otherTotalCents / expensesCents) * 1000) / 10;

  return [
    ...topItems,
    {
      key: 'otras',
      categoryId: null,
      label: 'Otras',
      totalCents: otherTotalCents,
      percentage: otherPercentage,
      movementCount: otherMovementCount,
    },
  ];
};
