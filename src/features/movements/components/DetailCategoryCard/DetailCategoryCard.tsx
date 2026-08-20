import type { RefObject } from 'react';

import { Icon } from '../../../../components/Icon/Icon';
import { getCategoryLabel } from '../../catalog/categories';
import type { Movement } from '../../types';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import styles from './DetailCategoryCard.module.css';

export type DetailCategoryCardProps = {
  readonly movement: Movement;
  readonly showUpdatedBadge: boolean;
  readonly onOpenSheet: () => void;
  readonly changeButtonRef?: RefObject<HTMLButtonElement | null>;
};

export const DetailCategoryCard = ({
  movement,
  showUpdatedBadge,
  onOpenSheet,
  changeButtonRef,
}: DetailCategoryCardProps) => {
  const categoryLabel = getCategoryLabel(movement.categoryId);

  return (
    <article className={styles.detailCategoryCard}>
      <div className={styles.detailCategoryCardHeader}>
        <h3 className={styles.detailCategoryCardTitle}>Categoría</h3>
        {showUpdatedBadge && (
          <span className={styles.detailCategoryCardUpdated}>
            <Icon name="check_circle" size={15} />
            Actualizada
          </span>
        )}
      </div>

      <div className={styles.detailCategoryCardCurrent}>
        <CategoryIcon categoryId={movement.categoryId} size="categoryCard" />
        <div>
          <p className={styles.detailCategoryCardLabel}>{categoryLabel}</p>
          <p className={styles.detailCategoryCardSubtitle}>Clasificación actual</p>
        </div>
      </div>

      <button
        ref={changeButtonRef}
        type="button"
        className={styles.detailCategoryCardCta}
        onClick={onOpenSheet}
      >
        <Icon name="edit" size={20} />
        Cambiar categoría
      </button>

      <p className={styles.detailCategoryCardFootnote}>
        Si no coincide con lo que compraste, corrígela. Tu resumen del mes se recalcula al
        instante.
      </p>
    </article>
  );
};
