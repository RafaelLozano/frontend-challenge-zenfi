import { formatSignedCurrency } from '../../../../utils/formatSignedCurrency';
import type { DayGroup } from '../../utils/groupByDay';
import { MovementRow } from '../MovementRow/MovementRow';
import styles from './MovementDayGroup.module.css';

export type MovementDayGroupProps = {
  readonly group: DayGroup;
  readonly periodMonthName: string;
  readonly onSelectMovement: (movementId: string, sourceElement?: HTMLElement | null) => void;
};

export const MovementDayGroup = ({
  group,
  periodMonthName,
  onSelectMovement,
}: MovementDayGroupProps) => (
  <section className={styles.movementDayGroup} aria-label={group.dayLabel}>
    <header className={styles.movementDayGroupHeader}>
      <h3 className={styles.movementDayGroupLabel}>{group.dayLabel}</h3>
      <p className={styles.movementDayGroupSum}>{formatSignedCurrency(group.sumCents)}</p>
    </header>

    <ul className={styles.movementDayGroupList}>
      {group.movements.map((movement) => (
        <li key={movement.id}>
          <MovementRow
            movement={movement}
            periodMonthName={periodMonthName}
            onSelect={onSelectMovement}
          />
        </li>
      ))}
    </ul>
  </section>
);
