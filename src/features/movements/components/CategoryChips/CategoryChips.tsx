import { getCategory } from '../../catalog/categories';
import type { CategoryId } from '../../types';
import { Icon } from '../../../../components/Icon/Icon';
import styles from './CategoryChips.module.css';

export type CategoryChipsProps = {
  readonly presentCategoryIds: readonly CategoryId[];
  readonly activeCategoryId: CategoryId | null;
  readonly onSelectAll: () => void;
  readonly onToggle: (categoryId: CategoryId) => void;
};

export const CategoryChips = ({
  presentCategoryIds,
  activeCategoryId,
  onSelectAll,
  onToggle,
}: CategoryChipsProps) => (
  <div className={styles.categoryChips} role="group" aria-label="Filtrar por categoría">
    <button
      type="button"
      className={`${styles.categoryChipsChip}${activeCategoryId === null ? ` ${styles.categoryChipsChipActive}` : ''}`}
      aria-pressed={activeCategoryId === null}
      onClick={onSelectAll}
    >
      <Icon name="apps" size={17} />
      Todas
    </button>

    {presentCategoryIds.map((categoryId) => {
      const category = getCategory(categoryId);
      const isActive = activeCategoryId === categoryId;

      return (
        <button
          key={categoryId}
          type="button"
          className={`${styles.categoryChipsChip}${isActive ? ` ${styles.categoryChipsChipActive}` : ''}`}
          aria-pressed={isActive}
          onClick={() => onToggle(categoryId)}
        >
          <Icon name={category.icon} size={17} />
          {category.label}
        </button>
      );
    })}
  </div>
);
