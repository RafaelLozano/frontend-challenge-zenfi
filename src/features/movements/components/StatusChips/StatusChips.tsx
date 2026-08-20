import { getStatusConfig } from '../../catalog/states';
import type { MovementStatus } from '../../types';
import styles from './StatusChips.module.css';

type StatusChipOption = {
  readonly id: MovementStatus | null;
  readonly label: string;
};

const STATUS_CHIP_OPTIONS: readonly StatusChipOption[] = [
  { id: null, label: 'Todos los estados' },
  { id: 'confirmada', label: 'Confirmadas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'programada', label: 'Programadas' },
  { id: 'en_disputa', label: 'En disputa' },
];

export type StatusChipsProps = {
  readonly activeStatus: MovementStatus | null;
  readonly onSelectAll: () => void;
  readonly onToggle: (status: MovementStatus) => void;
};

export const StatusChips = ({ activeStatus, onSelectAll, onToggle }: StatusChipsProps) => (
  <div className={styles.statusChips} role="group" aria-label="Filtrar por estado">
    {STATUS_CHIP_OPTIONS.map((option) => {
      const isActive = activeStatus === option.id;
      const statusConfig = option.id ? getStatusConfig(option.id) : null;

      const handleClick = () => {
        if (option.id === null) {
          onSelectAll();
          return;
        }

        onToggle(option.id);
      };

      return (
        <button
          key={option.label}
          type="button"
          className={`${styles.statusChipsChip}${isActive ? ` ${styles.statusChipsChipActive}` : ''}`}
          aria-pressed={isActive}
          onClick={handleClick}
        >
          {statusConfig && (
            <span
              className={styles.statusChipsDot}
              style={{ backgroundColor: isActive ? 'var(--zf-accent)' : statusConfig.dot }}
              aria-hidden="true"
            />
          )}
          {option.label}
        </button>
      );
    })}
  </div>
);
