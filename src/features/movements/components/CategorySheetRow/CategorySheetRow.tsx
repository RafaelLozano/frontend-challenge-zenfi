import { forwardRef } from 'react';

import { Icon } from '../../../../components/Icon/Icon';
import { getCategoryLabel } from '../../catalog/categories';
import type { CategoryId } from '../../types';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import styles from './CategorySheetRow.module.css';

export type CategorySheetRowProps = {
  readonly categoryId: CategoryId;
  readonly isCurrent: boolean;
  readonly isPending: boolean;
  readonly onSelect: () => void;
};

export const CategorySheetRow = forwardRef<HTMLButtonElement, CategorySheetRowProps>(
  ({ categoryId, isCurrent, isPending, onSelect }, ref) => {
    const label = getCategoryLabel(categoryId);
    const isHighlighted = isCurrent || isPending;

    const className = isHighlighted
      ? `${styles.categorySheetRow} ${styles.categorySheetRowCurrent}`
      : styles.categorySheetRow;

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        aria-pressed={isCurrent}
        onClick={onSelect}
      >
        <CategoryIcon categoryId={categoryId} size="sheetRow" />
        <span
          className={
            isCurrent
              ? `${styles.categorySheetRowLabel} ${styles.categorySheetRowLabelCurrent}`
              : styles.categorySheetRowLabel
          }
        >
          {label}
        </span>
        {isCurrent && (
          <Icon name="check_circle" size={22} className={styles.categorySheetRowCheck} />
        )}
      </button>
    );
  },
);

CategorySheetRow.displayName = 'CategorySheetRow';
