import { useCallback, useState } from 'react';

import type { CategoryId, Movement } from '../types';
import { updateMovementCategory } from '../utils/updateMovementCategory';

/** Flip to `true` in a live review to demo explicit confirmation mode. */
export const CONFIRM_CHANGE = false;

export type CategoryChange = {
  readonly movementId: string;
  readonly previousCategoryId: CategoryId;
  readonly newCategoryId: CategoryId;
};

type UseRecategorizeArgs = {
  readonly movements: readonly Movement[];
  readonly setMovements: (updater: (current: readonly Movement[]) => Movement[]) => void;
  readonly onCategoryApplied: (change: CategoryChange, movement: Movement) => void;
};

export const useRecategorize = ({
  movements,
  setMovements,
  onCategoryApplied,
}: UseRecategorizeArgs) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState<CategoryId | null>(null);
  const [lastCategoryChange, setLastCategoryChange] = useState<CategoryChange | null>(null);

  const openSheet = useCallback(() => {
    setIsSheetOpen(true);
    setPendingCategoryId(null);
  }, []);

  const closeSheet = useCallback(() => {
    setIsSheetOpen(false);
    setPendingCategoryId(null);
  }, []);

  const applyCategory = useCallback(
    (movementId: string, categoryId: CategoryId) => {
      const movement = movements.find((entry) => entry.id === movementId);

      if (!movement) {
        return;
      }

      if (categoryId === movement.categoryId) {
        closeSheet();
        return;
      }

      const change: CategoryChange = {
        movementId,
        previousCategoryId: movement.categoryId,
        newCategoryId: categoryId,
      };

      const nextMovements = updateMovementCategory(movements, movementId, categoryId);
      const updatedMovement = nextMovements.find((entry) => entry.id === movementId);

      setMovements(() => nextMovements);
      setLastCategoryChange(change);
      closeSheet();

      if (updatedMovement) {
        onCategoryApplied(change, updatedMovement);
      }
    },
    [closeSheet, movements, onCategoryApplied, setMovements],
  );

  const handleCategorySelect = useCallback(
    (movementId: string, categoryId: CategoryId) => {
      const movement = movements.find((entry) => entry.id === movementId);

      if (!movement) {
        return;
      }

      if (categoryId === movement.categoryId) {
        closeSheet();
        return;
      }

      if (CONFIRM_CHANGE) {
        setPendingCategoryId(categoryId);
        return;
      }

      applyCategory(movementId, categoryId);
    },
    [applyCategory, closeSheet, movements],
  );

  const confirmPendingChange = useCallback(
    (movementId: string) => {
      if (!pendingCategoryId) {
        return;
      }

      applyCategory(movementId, pendingCategoryId);
    },
    [applyCategory, pendingCategoryId],
  );

  const clearLastCategoryChange = useCallback((movementId?: string) => {
    setLastCategoryChange((current) => {
      if (!current) {
        return null;
      }

      if (movementId && current.movementId !== movementId) {
        return current;
      }

      return null;
    });
  }, []);

  const revertCategoryChange = useCallback(
    (change: CategoryChange) => {
      setMovements((current) =>
        updateMovementCategory(current, change.movementId, change.previousCategoryId),
      );
      setLastCategoryChange(null);
    },
    [setMovements],
  );

  return {
    isSheetOpen,
    openSheet,
    closeSheet,
    pendingCategoryId,
    lastCategoryChange,
    handleCategorySelect,
    confirmPendingChange,
    clearLastCategoryChange,
    revertCategoryChange,
  };
};
