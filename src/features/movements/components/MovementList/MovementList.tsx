import type { DayGroup } from '../../utils/groupByDay';
import { MovementDayGroup } from '../MovementDayGroup/MovementDayGroup';
import { MovementsEmptyState } from '../MovementsEmptyState/MovementsEmptyState';
import styles from './MovementList.module.css';

export type MovementListProps = {
  readonly dayGroups: readonly DayGroup[];
  readonly periodMonthName: string;
  readonly filteredCount: number;
  readonly baselineCount: number;
  readonly hasActiveFilters: boolean;
  readonly onClearFilters: () => void;
  readonly onSelectMovement: (movementId: string) => void;
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

export const MovementList = ({
  dayGroups,
  periodMonthName,
  filteredCount,
  baselineCount,
  hasActiveFilters,
  onClearFilters,
  onSelectMovement,
}: MovementListProps) => {
  const countLabel = buildCountLabel(
    filteredCount,
    baselineCount,
    periodMonthName,
    hasActiveFilters,
  );

  return (
    <section className={styles.movementList} aria-label="Lista de movimientos">
      <div className={styles.movementListToolbar}>
        <p className={styles.movementListCount}>{countLabel}</p>
        {hasActiveFilters && (
          <button type="button" className={styles.movementListClear} onClick={onClearFilters}>
            Limpiar filtros
          </button>
        )}
      </div>

      {dayGroups.length === 0 ? (
        <MovementsEmptyState />
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
        </div>
      )}
    </section>
  );
};
