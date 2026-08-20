import type { CategoryBreakdownItem } from '../types';

export const buildMonthHeadline = (
  periodMonthName: string,
  breakdown: readonly CategoryBreakdownItem[],
): string => {
  const topCategory = breakdown[0];

  if (!topCategory || topCategory.key === 'otras') {
    return '';
  }

  const secondCategory = breakdown[1];
  const thirdCategory = breakdown[2];

  if (topCategory.percentage >= 50) {
    return `En ${periodMonthName}, la mitad de tu gasto fue ${topCategory.label}.`;
  }

  if (topCategory.percentage >= 30) {
    return `En ${periodMonthName}, tu mayor gasto fue ${topCategory.label} (${topCategory.percentage}%).`;
  }

  if (
    secondCategory &&
    thirdCategory &&
    secondCategory.key !== 'otras' &&
    thirdCategory.key !== 'otras'
  ) {
    return `En ${periodMonthName}, tu gasto se repartió entre ${topCategory.label}, ${secondCategory.label} y ${thirdCategory.label}.`;
  }

  return `En ${periodMonthName}, tu mayor gasto fue ${topCategory.label} (${topCategory.percentage}%).`;
};
