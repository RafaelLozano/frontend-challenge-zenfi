import { useCallback, useMemo, useState } from 'react';

import { CATEGORIES, getCategoryLabel } from '../catalog/categories';
import type { CategoryId, Movement, MovementStatus } from '../types';
import { filterMovements, hasActiveFilters, type FiltersState } from '../utils/filterMovements';
import { groupByDay } from '../utils/groupByDay';
import { formatPeriodMonthName } from '../utils/formatPeriod';

const EMPTY_FILTERS: FiltersState = {
  query: '',
  categoryId: null,
  status: null,
};

type UseMovementFiltersArgs = {
  readonly movements: readonly Movement[];
  readonly period: string;
};

export const useMovementFilters = ({ movements, period }: UseMovementFiltersArgs) => {
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS);

  const categoryLabels = useMemo(
    () => new Map(CATEGORIES.map((category) => [category.id, category.label])),
    [],
  );

  const filteredMovements = useMemo(
    () => filterMovements(movements, filters, categoryLabels),
    [movements, filters, categoryLabels],
  );

  const dayGroups = useMemo(() => groupByDay(filteredMovements, period), [filteredMovements, period]);

  const presentCategoryIds = useMemo(() => {
    const ids = new Set(movements.map((movement) => movement.categoryId));
    return CATEGORIES.filter((category) => ids.has(category.id)).map((category) => category.id);
  }, [movements]);

  const baselineCount = useMemo(
    () =>
      movements.filter(
        (movement) => movement.countsTowardTotals && !movement.flags.includes('out-of-period'),
      ).length,
    [movements],
  );

  const periodMonthName = useMemo(() => formatPeriodMonthName(period), [period]);

  const setQuery = useCallback((query: string) => {
    setFilters((current) => ({ ...current, query }));
  }, []);

  const selectAllCategories = useCallback(() => {
    setFilters((current) => ({ ...current, categoryId: null }));
  }, []);

  const toggleCategory = useCallback((categoryId: CategoryId) => {
    setFilters((current) => ({
      ...current,
      categoryId: current.categoryId === categoryId ? null : categoryId,
    }));
  }, []);

  const selectAllStatuses = useCallback(() => {
    setFilters((current) => ({ ...current, status: null }));
  }, []);

  const toggleStatus = useCallback((status: MovementStatus) => {
    setFilters((current) => ({
      ...current,
      status: current.status === status ? null : status,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  return {
    filters,
    filteredMovements,
    dayGroups,
    presentCategoryIds,
    baselineCount,
    filteredCount: filteredMovements.length,
    hasActiveFilters: hasActiveFilters(filters),
    periodMonthName,
    setQuery,
    selectAllCategories,
    toggleCategory,
    selectAllStatuses,
    toggleStatus,
    clearFilters,
    getCategoryLabel: (categoryId: CategoryId) =>
      categoryLabels.get(categoryId) ?? getCategoryLabel(categoryId),
  };
};

export type UseMovementFiltersReturn = ReturnType<typeof useMovementFilters>;
