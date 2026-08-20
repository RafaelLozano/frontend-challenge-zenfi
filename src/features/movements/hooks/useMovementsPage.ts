import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CategoryOption } from '../catalog/categories';
import type { CategoryId, DataQualityNoticeContent, Movement } from '../types';
import { buildDataQualityNoticeContent } from '../utils/buildDataQualityNoticeContent';
import { buildDataQualityReport } from '../utils/buildDataQualityReport';
import { buildMonthHeadline } from '../utils/buildMonthHeadline';
import { buildMonthlySummary } from '../utils/buildMonthlySummary';
import { useMovementFilters } from './useMovementFilters';
import { useMovementSelection } from './useMovementSelection';
import type { CategoryChange } from './useRecategorize';
import { useRecategorize } from './useRecategorize';
import { useUndoToast } from './useUndoToast';

type UseMovementsPageArgs = {
  initialMovements: readonly Movement[];
  period: string;
  categoryOptions: readonly CategoryOption[];
};

export const useMovementsPage = ({ initialMovements, period }: UseMovementsPageArgs) => {
  const [movements, setMovements] = useState<readonly Movement[]>(initialMovements);
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  const sheetContainerRef = useRef<HTMLDivElement>(null);
  const firstCategoryRef = useRef<HTMLButtonElement>(null);

  const undoHandlersRef = useRef<{
    revertCategoryChange: (change: CategoryChange) => void;
    clearLastCategoryChange: (movementId?: string) => void;
  }>({
    revertCategoryChange: () => {},
    clearLastCategoryChange: () => {},
  });

  const { selectedMovementId, selectMovement, closeDetail } = useMovementSelection();

  const summary = useMemo(() => buildMonthlySummary(movements, period), [movements, period]);
  const filterState = useMovementFilters({ movements, period });

  const monthHeadline = useMemo(
    () => buildMonthHeadline(filterState.periodMonthName, summary.expenseBreakdown),
    [filterState.periodMonthName, summary.expenseBreakdown],
  );

  const dataQualityNotice = useMemo((): DataQualityNoticeContent => {
    const quality = buildDataQualityReport(movements);

    return buildDataQualityNoticeContent(
      movements,
      quality,
      period,
      summary.includedInSummaryCount,
    );
  }, [movements, period, summary.includedInSummaryCount]);

  const selectedMovement = useMemo(
    () => movements.find((movement) => movement.id === selectedMovementId) ?? null,
    [movements, selectedMovementId],
  );

  const { toast, showToast, undo, pauseTimer, resumeTimer } = useUndoToast({
    onUndo: (change) => {
      undoHandlersRef.current.revertCategoryChange(change);
    },
    onDismiss: (change) => {
      undoHandlersRef.current.clearLastCategoryChange(change.movementId);
    },
  });

  const {
    isSheetOpen,
    openSheet,
    closeSheet,
    pendingCategoryId,
    lastCategoryChange,
    handleCategorySelect,
    confirmPendingChange,
    revertCategoryChange,
    clearLastCategoryChange,
  } = useRecategorize({
    movements,
    setMovements,
    onCategoryApplied: showToast,
  });

  useEffect(() => {
    undoHandlersRef.current = {
      revertCategoryChange,
      clearLastCategoryChange,
    };
  }, [clearLastCategoryChange, revertCategoryChange]);

  const showUpdatedBadge =
    selectedMovement !== null && lastCategoryChange?.movementId === selectedMovement.id;

  const handleSelectMovement = useCallback(
    (movementId: string, sourceElement?: HTMLElement | null) => {
      selectMovement(movementId, sourceElement);
    },
    [selectMovement],
  );

  const handleOpenSheet = useCallback(() => {
    openSheet();
  }, [openSheet]);

  const handleCloseSheet = useCallback(() => {
    closeSheet();
    requestAnimationFrame(() => {
      changeButtonRef.current?.focus();
    });
  }, [closeSheet]);

  const handleSheetCategorySelect = useCallback(
    (categoryId: CategoryId) => {
      if (!selectedMovement) {
        return;
      }

      handleCategorySelect(selectedMovement.id, categoryId);
    },
    [handleCategorySelect, selectedMovement],
  );

  const handleSheetConfirm = useCallback(() => {
    if (!selectedMovement) {
      return;
    }

    confirmPendingChange(selectedMovement.id);
  }, [confirmPendingChange, selectedMovement]);

  return {
    movements,
    summary,
    monthHeadline,
    dataQualityNotice,
    selectedMovement,
    selectedMovementId,
    showUpdatedBadge,
    changeButtonRef,
    sheetContainerRef,
    firstCategoryRef,
    handleSelectMovement,
    closeDetail,
    handleOpenSheet,
    handleCloseSheet,
    handleSheetCategorySelect,
    handleSheetConfirm,
    isSheetOpen,
    pendingCategoryId,
    toast,
    undo,
    pauseTimer,
    resumeTimer,
    ...filterState,
  };
};
