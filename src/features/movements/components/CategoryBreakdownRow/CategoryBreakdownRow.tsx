import { CATEGORY_FAMILY_COLORS, getCategory } from '../../catalog/categories';
import type { CategoryBreakdownItem, CategoryId } from '../../types';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import { formatCurrency } from '../../../../utils/formatCurrency';
import styles from './CategoryBreakdownRow.module.css';

export type CategoryBreakdownRowProps = {
  readonly item: CategoryBreakdownItem;
  readonly onSelectCategory?: (categoryId: CategoryId) => void;
};

const getBarColor = (item: CategoryBreakdownItem): string => {
  if (item.categoryId === null) {
    return 'var(--zf-text-3)';
  }

  const category = getCategory(item.categoryId);
  return CATEGORY_FAMILY_COLORS[category.family].text;
};

export const CategoryBreakdownRow = ({ item, onSelectCategory }: CategoryBreakdownRowProps) => {
  const isInteractive = item.categoryId !== null && onSelectCategory !== undefined;
  const barColor = getBarColor(item);

  const content = (
    <>
      {item.categoryId ? (
        <CategoryIcon categoryId={item.categoryId} size="breakdown" />
      ) : (
        <span className={styles.categoryBreakdownRowOtherIcon} aria-hidden="true">
          <span className={styles.categoryBreakdownRowOtherDots}>···</span>
        </span>
      )}

      <div className={styles.categoryBreakdownRowContent}>
        <div className={styles.categoryBreakdownRowTop}>
          <span className={styles.categoryBreakdownRowLabel}>{item.label}</span>
          <div className={styles.categoryBreakdownRowAmounts}>
            <span className={styles.categoryBreakdownRowAmount}>
              {formatCurrency(item.totalCents)}
            </span>
            <span className={styles.categoryBreakdownRowPercentage}>{item.percentage}%</span>
          </div>
        </div>

        <div className={styles.categoryBreakdownRowBarTrack} aria-hidden="true">
          <span
            className={styles.categoryBreakdownRowBarFill}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
      </div>
    </>
  );

  if (!isInteractive || !item.categoryId || !onSelectCategory) {
    return <div className={styles.categoryBreakdownRow}>{content}</div>;
  }

  const categoryId = item.categoryId;

  return (
    <button
      type="button"
      className={styles.categoryBreakdownRow}
      onClick={() => onSelectCategory(categoryId)}
    >
      {content}
    </button>
  );
};
