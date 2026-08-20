import { Icon } from '../../../../components/Icon/Icon';
import { formatSignedCurrency } from '../../../../utils/formatSignedCurrency';
import { getStatusConfig } from '../../catalog/states';
import { getCategoryLabel } from '../../catalog/categories';
import type { Movement } from '../../types';
import {
  buildMovementRowAriaLabel,
  getQualityFlagLabel,
  getRelevantQualityFlags,
  getStatusLabel,
} from '../../utils/buildMovementRowLabel';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import styles from './MovementRow.module.css';

export type MovementRowProps = {
  readonly movement: Movement;
  readonly periodMonthName: string;
  readonly onSelect: (movementId: string) => void;
};

const getAmountClassName = (amountCents: number): string => {
  if (amountCents > 0) {
    return `${styles.movementRowAmount} ${styles.movementRowAmountIncome}`;
  }

  return `${styles.movementRowAmount} ${styles.movementRowAmountExpense}`;
};

export const MovementRow = ({ movement, periodMonthName, onSelect }: MovementRowProps) => {
  const categoryLabel = getCategoryLabel(movement.categoryId);
  const metaText = movement.account ? `${categoryLabel} · ${movement.account}` : categoryLabel;
  const statusConfig = getStatusConfig(movement.status);
  const qualityFlags = getRelevantQualityFlags(movement.flags);

  return (
    <button
      type="button"
      className={styles.movementRow}
      aria-label={buildMovementRowAriaLabel(movement)}
      onClick={() => onSelect(movement.id)}
    >
      <CategoryIcon categoryId={movement.categoryId} size="row" />

      <div className={styles.movementRowContent}>
        <p className={styles.movementRowMerchant}>{movement.merchant}</p>
        <p className={styles.movementRowMeta}>{metaText}</p>

        {(movement.status !== 'confirmada' || qualityFlags.length > 0) && (
          <div className={styles.movementRowBadges}>
            {movement.status !== 'confirmada' && (
              <span
                className={styles.movementRowStatusBadge}
                style={{
                  backgroundColor: statusConfig.background,
                  color: statusConfig.text,
                }}
              >
                {getStatusLabel(movement.status)}
              </span>
            )}

            {qualityFlags.map((flag) => {
              const label = getQualityFlagLabel(flag, periodMonthName);

              if (!label) {
                return null;
              }

              return (
                <span key={flag} className={styles.movementRowQualityBadge}>
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.movementRowTrailing}>
        <p className={getAmountClassName(movement.amountCents)}>
          {formatSignedCurrency(movement.amountCents, movement.currency)}
        </p>
        <Icon name="chevron_right" size={18} />
      </div>
    </button>
  );
};
