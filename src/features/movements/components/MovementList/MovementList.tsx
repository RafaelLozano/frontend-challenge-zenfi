import { forwardRef } from 'react';

import type { DataQualityNoticeContent } from '../../types';
import type { DayGroup } from '../../utils/groupByDay';
import { DataQualityNotice } from '../DataQualityNotice/DataQualityNotice';
import { MovementDayGroup } from '../MovementDayGroup/MovementDayGroup';
import { MovementsEmptyState } from '../MovementsEmptyState/MovementsEmptyState';
import styles from './MovementList.module.css';

export type MovementListProps = {
  readonly dayGroups: readonly DayGroup[];
  readonly periodMonthName: string;
  readonly filteredCount: number;
  readonly baselineCount: number;
  readonly uncategorizedCount: number;
  readonly hasActiveFilters: boolean;
  readonly dataQualityNotice: DataQualityNoticeContent;
  readonly onClearFilters: () => void;
  readonly onReviewUncategorized: () => void;
  readonly onSelectMovement: (movementId: string, sourceElement?: HTMLElement | null) => void;
};

const buildCountLabel = (
  filteredCount: number,
  baselineCount: number,
  periodMonthName: string,
  hasActiveFilters: boolean,
): string => {
  if (hasActiveFilters) {
    return `${filteredCount} de ${baselineCount} movimientos`;
  }

  return `${baselineCount} movimientos en ${periodMonthName}`;
};

export const MovementList = forwardRef<HTMLElement, MovementListProps>(
  (
    {
      dayGroups,
      periodMonthName,
      filteredCount,
      baselineCount,
      uncategorizedCount,
      hasActiveFilters,
      dataQualityNotice,
      onClearFilters,
      onReviewUncategorized,
      onSelectMovement,
    },
    ref,
  ) => {
    const countLabel = buildCountLabel(
      filteredCount,
      baselineCount,
      periodMonthName,
      hasActiveFilters,
    );

    return (
      <main ref={ref} className={styles.movementList} aria-label="Lista de movimientos">
        <div className={styles.movementListToolbar}>
          <div className={styles.movementListCountGroup}>
            <p className={styles.movementListCount}>{countLabel}</p>
            {uncategorizedCount > 0 && (
              <button
                type="button"
                className={styles.movementListReview}
                onClick={onReviewUncategorized}
              >
                {uncategorizedCount} sin categoría · Revisar
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <button type="button" className={styles.movementListClear} onClick={onClearFilters}>
              Limpiar filtros
            </button>
          )}
        </div>

        {dayGroups.length === 0 ? (
          <div className={styles.movementListGroups}>
            <MovementsEmptyState />
            <DataQualityNotice content={dataQualityNotice} />
          </div>
        ) : (
          <div className={styles.movementListGroups}>
            {dayGroups.map((group) => (
              <MovementDayGroup
                key={group.dayKey}
                group={group}
                periodMonthName={periodMonthName}
                onSelectMovement={onSelectMovement}
              />
            ))}
            <DataQualityNotice content={dataQualityNotice} />
          </div>
        )}
      </main>
    );
  },
);

MovementList.displayName = 'MovementList';
