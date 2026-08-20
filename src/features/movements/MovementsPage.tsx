import { useEffect, useCallback, useRef } from 'react';

import { CategoryBreakdown } from './components/CategoryBreakdown/CategoryBreakdown';
import { CategoryChips } from './components/CategoryChips/CategoryChips';
import { CategorySheet } from './components/CategorySheet/CategorySheet';
import { MovementDetail } from './components/MovementDetail/MovementDetail';
import { MovementList } from './components/MovementList/MovementList';
import { MovementSearch } from './components/MovementSearch/MovementSearch';
import { MonthHeadline } from './components/MonthHeadline/MonthHeadline';
import { MovementsHeader } from './components/MovementsHeader/MovementsHeader';
import { SummaryHeaderTiles } from './components/SummaryHeaderTiles/SummaryHeaderTiles';
import { StatusChips } from './components/StatusChips/StatusChips';
import { UndoToast } from './components/UndoToast/UndoToast';
import { CATEGORIES } from './catalog/categories';
import type { CategoryOption } from './catalog/categories';
import type { CategoryId } from './types';
import { CONFIRM_CHANGE } from './hooks/useRecategorize';
import { useFocusTrap } from './hooks/useFocusTrap';
import type { Movement } from './types';
import { formatPeriodLabel } from './utils/formatPeriod';
import { useMovementsPage } from './hooks/useMovementsPage';
import styles from './MovementsPage.module.css';

export type MovementsPageProps = {
  initialMovements: readonly Movement[];
  period: string;
  categoryOptions: readonly CategoryOption[];
};

const SELECTABLE_CATEGORY_IDS = CATEGORIES
  .filter((category) => category.id !== 'sin-categoria')
  .map((category) => category.id);

export const MovementsPage = ({
  initialMovements,
  period,
  categoryOptions: _categoryOptions,
}: MovementsPageProps) => {
  const periodLabel = formatPeriodLabel(period);

  const {
    summary,
    monthHeadline,
    dataQualityNotice,
    filters,
    dayGroups,
    presentCategoryIds,
    baselineCount,
    filteredCount,
    hasActiveFilters,
    periodMonthName,
    setQuery,
    selectAllCategories,
    toggleCategory,
    selectCategory,
    selectAllStatuses,
    toggleStatus,
    clearFilters,
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
  } = useMovementsPage({
    initialMovements,
    period,
    categoryOptions: _categoryOptions,
  });

  const movementListRef = useRef<HTMLElement>(null);

  const handleBreakdownCategorySelect = useCallback(
    (categoryId: CategoryId) => {
      selectCategory(categoryId);
      requestAnimationFrame(() => {
        movementListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [selectCategory],
  );

  const handleReviewUncategorized = useCallback(() => {
    selectCategory('sin-categoria');
    requestAnimationFrame(() => {
      movementListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [selectCategory]);

  useFocusTrap(sheetContainerRef, isSheetOpen);

  useEffect(() => {
    if (!isSheetOpen) {
      return;
    }

    requestAnimationFrame(() => {
      firstCategoryRef.current?.focus();
    });
  }, [isSheetOpen, firstCategoryRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (isSheetOpen) {
        event.preventDefault();
        handleCloseSheet();
        return;
      }

      if (selectedMovementId !== null) {
        event.preventDefault();
        closeDetail();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeDetail, handleCloseSheet, isSheetOpen, selectedMovementId]);

  const isDetailOpen = selectedMovement !== null;

  return (
    <div className={styles.movementsPage}>
      <div
        className={styles.movementsPageMain}
        inert={isDetailOpen ? true : undefined}
        aria-hidden={isDetailOpen ? true : undefined}
      >
        <MovementsHeader>
          <SummaryHeaderTiles summary={summary} />
        </MovementsHeader>

        <div className={styles.movementsPageBody}>
          <MonthHeadline text={monthHeadline} />
          <CategoryBreakdown
            items={summary.expenseBreakdown}
            onSelectCategory={handleBreakdownCategorySelect}
          />

          <div className={styles.movementsPageFilters}>
            <MovementSearch value={filters.query} onChange={setQuery} />
            <CategoryChips
              presentCategoryIds={presentCategoryIds}
              activeCategoryId={filters.categoryId}
              onSelectAll={selectAllCategories}
              onToggle={toggleCategory}
            />
            <StatusChips
              activeStatus={filters.status}
              onSelectAll={selectAllStatuses}
              onToggle={toggleStatus}
            />
          </div>

          <MovementList
            ref={movementListRef}
            dayGroups={dayGroups}
            periodMonthName={periodMonthName}
            filteredCount={filteredCount}
            baselineCount={baselineCount}
            uncategorizedCount={summary.uncategorizedCount}
            hasActiveFilters={hasActiveFilters}
            dataQualityNotice={dataQualityNotice}
            onClearFilters={clearFilters}
            onReviewUncategorized={handleReviewUncategorized}
            onSelectMovement={handleSelectMovement}
          />
        </div>
      </div>

      {selectedMovement && (
        <MovementDetail
          movement={selectedMovement}
          periodLabel={periodLabel}
          showUpdatedBadge={showUpdatedBadge}
          onClose={closeDetail}
          onOpenSheet={handleOpenSheet}
          changeButtonRef={changeButtonRef}
        />
      )}

      {isSheetOpen && selectedMovement && (
        <CategorySheet
          merchant={selectedMovement.merchant}
          amountCents={selectedMovement.amountCents}
          currency={selectedMovement.currency}
          currentCategoryId={selectedMovement.categoryId}
          categoryIds={SELECTABLE_CATEGORY_IDS}
          pendingCategoryId={pendingCategoryId}
          confirmMode={CONFIRM_CHANGE}
          containerRef={sheetContainerRef}
          firstCategoryRef={firstCategoryRef}
          onClose={handleCloseSheet}
          onSelectCategory={handleSheetCategorySelect}
          onConfirm={handleSheetConfirm}
        />
      )}

      {toast && (
        <UndoToast
          toast={toast}
          onUndo={undo}
          onFocusEnter={pauseTimer}
          onFocusLeave={resumeTimer}
        />
      )}
    </div>
  );
};
