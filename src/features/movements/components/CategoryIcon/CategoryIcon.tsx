import { CATEGORY_FAMILY_COLORS, getCategory } from '../../catalog/categories';
import type { CategoryId } from '../../types';
import { Icon } from '../../../../components/Icon/Icon';
import styles from './CategoryIcon.module.css';

export type CategoryIconSize = 'row' | 'detail' | 'sheet';

export type CategoryIconProps = {
  readonly categoryId: CategoryId;
  readonly size?: CategoryIconSize;
};

const SIZE_CONFIG: Record<CategoryIconSize, { box: number; radius: number; icon: number }> = {
  row: { box: 42, radius: 14, icon: 20 },
  detail: { box: 52, radius: 16, icon: 24 },
  sheet: { box: 48, radius: 15, icon: 22 },
};

export const CategoryIcon = ({ categoryId, size = 'row' }: CategoryIconProps) => {
  const category = getCategory(categoryId);
  const colors = CATEGORY_FAMILY_COLORS[category.family];
  const dimensions = SIZE_CONFIG[size];

  return (
    <span
      className={styles.categoryIcon}
      style={{
        width: dimensions.box,
        height: dimensions.box,
        borderRadius: dimensions.radius,
        backgroundColor: colors.background,
        color: colors.text,
      }}
      aria-hidden="true"
    >
      <Icon name={category.icon} size={dimensions.icon} />
    </span>
  );
};
