import { useCallback, useMemo, useState } from 'react';

import type { CategoryOption } from '../catalog/categories';
import type { CategoryId, Movement } from '../types';
import { buildMonthlySummary } from '../utils/buildMonthlySummary';
import { updateMovementCategory } from '../utils/updateMovementCategory';
import { useMovementFilters } from './useMovementFilters';

type UseMovementsPageArgs = {
  initialMovements: readonly Movement[];
  period: string;
  categoryOptions: readonly CategoryOption[];
};

export const useMovementsPage = ({ initialMovements, period }: UseMovementsPageArgs) => {
  const [movements, setMovements] = useState(initialMovements);
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);

  const summary = useMemo(() => buildMonthlySummary(movements, period), [movements, period]);

  const filterState = useMovementFilters({ movements, period });

  const handleSelectMovement = useCallback((movementId: string) => {
    setSelectedMovementId(movementId);
    console.debug('movement selected:', movementId);
  }, []);

  const handleSelectCategory = useCallback((movementId: string, categoryId: CategoryId) => {
    setMovements((current) => updateMovementCategory(current, movementId, categoryId));
  }, []);

  return {
    movements,
    summary,
    selectedMovementId,
    handleSelectMovement,
    handleSelectCategory,
    ...filterState,
  };
};
