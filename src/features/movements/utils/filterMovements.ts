import { getCategoryLabel } from '../catalog/categories';
import type { CategoryId, Movement, MovementStatus } from '../types';
import { normalizeSearchText } from './normalizeSearchText';

export type FiltersState = {
  readonly query: string;
  readonly categoryId: CategoryId | null;
  readonly status: MovementStatus | null;
};

const matchesQuery = (
  movement: Movement,
  normalizedQuery: string,
  categoryLabel: string,
): boolean => {
  const haystack = [
    movement.merchant,
    movement.description,
    categoryLabel,
    movement.account ?? '',
  ]
    .map(normalizeSearchText)
    .join(' ');

  return haystack.includes(normalizedQuery);
};

export const filterMovements = (
  movements: readonly Movement[],
  filters: FiltersState,
  categoryLabels: ReadonlyMap<CategoryId, string>,
): readonly Movement[] => {
  const normalizedQuery = normalizeSearchText(filters.query);

  return movements.filter((movement) => {
    if (filters.categoryId !== null && movement.categoryId !== filters.categoryId) {
      return false;
    }

    if (filters.status !== null && movement.status !== filters.status) {
      return false;
    }

    if (normalizedQuery.length === 0) {
      return true;
    }

    const categoryLabel =
      categoryLabels.get(movement.categoryId) ?? getCategoryLabel(movement.categoryId);
    return matchesQuery(movement, normalizedQuery, categoryLabel);
  });
};

export const hasActiveFilters = (filters: FiltersState): boolean =>
  filters.query.length > 0 || filters.categoryId !== null || filters.status !== null;
