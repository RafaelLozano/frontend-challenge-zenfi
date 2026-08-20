import { formatSignedCurrency } from '../../../../utils/formatSignedCurrency';
import { getStatusConfig } from '../../catalog/states';
import type { Movement } from '../../types';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import styles from './DetailIdentityCard.module.css';

export type DetailIdentityCardProps = {
  readonly movement: Movement;
};

const getDirectionLabel = (amountCents: number): string => {
  if (amountCents > 0) {
    return 'DINERO QUE ENTRÓ';
  }

  return 'DINERO QUE SALIÓ';
};

const getAmountClassName = (amountCents: number): string => {
  if (amountCents > 0) {
    return `${styles.detailIdentityCardAmount} ${styles.detailIdentityCardAmountIncome}`;
  }

  return `${styles.detailIdentityCardAmount} ${styles.detailIdentityCardAmountExpense}`;
};

export const DetailIdentityCard = ({ movement }: DetailIdentityCardProps) => {
  const statusConfig = getStatusConfig(movement.status);

  return (
    <article className={styles.detailIdentityCard}>
      <div className={styles.detailIdentityCardTop}>
        <CategoryIcon categoryId={movement.categoryId} size="detail" />
        <div className={styles.detailIdentityCardInfo}>
          <p className={styles.detailIdentityCardMerchant}>{movement.merchant}</p>
          <p className={styles.detailIdentityCardDate}>{movement.dateLongLabel}</p>
        </div>
      </div>

      <div className={styles.detailIdentityCardDivider} />

      <div className={styles.detailIdentityCardAmountRow}>
        <div>
          <p className={styles.detailIdentityCardDirection}>{getDirectionLabel(movement.amountCents)}</p>
          <p className={getAmountClassName(movement.amountCents)}>
            {formatSignedCurrency(movement.amountCents, movement.currency)}
          </p>
        </div>

        <span
          className={styles.detailIdentityCardStatus}
          style={{
            backgroundColor: statusConfig.background,
            color: statusConfig.text,
          }}
        >
          <span
            className={styles.detailIdentityCardStatusDot}
            style={{ backgroundColor: statusConfig.dot }}
          />
          {statusConfig.label}
        </span>
      </div>
    </article>
  );
};
