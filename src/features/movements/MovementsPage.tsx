import { CategoryChips } from './components/CategoryChips/CategoryChips';
import { MovementList } from './components/MovementList/MovementList';
import { MovementSearch } from './components/MovementSearch/MovementSearch';
import { MovementsHeader } from './components/MovementsHeader/MovementsHeader';
import { SummaryHeaderTiles } from './components/SummaryHeaderTiles/SummaryHeaderTiles';
import { StatusChips } from './components/StatusChips/StatusChips';
import type { CategoryOption } from './catalog/categories';
import type { Movement } from './types';
import { useMovementsPage } from './hooks/useMovementsPage';
import styles from './MovementsPage.module.css';

export type MovementsPageProps = {
  initialMovements: readonly Movement[];
  period: string;
  categoryOptions: readonly CategoryOption[];
};

export const MovementsPage = ({
  initialMovements,
  period,
  categoryOptions: _categoryOptions,
}: MovementsPageProps) => {
  const {
    summary,
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
    selectAllStatuses,
    toggleStatus,
    clearFilters,
    handleSelectMovement,
  } = useMovementsPage({
    initialMovements,
    period,
    categoryOptions: _categoryOptions,
  });

  return (
    <div className={styles.movementsPage}>
      <MovementsHeader>
        <SummaryHeaderTiles summary={summary} />
      </MovementsHeader>

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
        dayGroups={dayGroups}
        periodMonthName={periodMonthName}
        filteredCount={filteredCount}
        baselineCount={baselineCount}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onSelectMovement={handleSelectMovement}
      />
    </div>
  );
};
