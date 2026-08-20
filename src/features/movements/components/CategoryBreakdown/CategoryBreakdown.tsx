import { useId, useState } from 'react';

import { Icon } from '../../../../components/Icon/Icon';
import type { CategoryBreakdownItem, CategoryId } from '../../types';
import { CategoryBreakdownRow } from '../CategoryBreakdownRow/CategoryBreakdownRow';
import styles from './CategoryBreakdown.module.css';

export type CategoryBreakdownProps = {
  readonly items: readonly CategoryBreakdownItem[];
  readonly onSelectCategory: (categoryId: CategoryId) => void;
};

const buildCollapsedHint = (items: readonly CategoryBreakdownItem[]): string | null => {
  const topItem = items[0];

  if (!topItem || topItem.key === 'otras') {
    return null;
  }

  return `${topItem.label} · ${topItem.percentage}% del gasto`;
};

export const CategoryBreakdown = ({ items, onSelectCategory }: CategoryBreakdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const collapsedHint = buildCollapsedHint(items);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.categoryBreakdown} aria-label="Desglose por categoría">
      <div
        className={`${styles.categoryBreakdownCard}${isExpanded ? ` ${styles.categoryBreakdownCardExpanded}` : ''}`}
      >
        <button
          type="button"
          className={styles.categoryBreakdownToggle}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          onClick={() => setIsExpanded((current) => !current)}
        >
          <span className={styles.categoryBreakdownToggleText}>
            <span className={styles.categoryBreakdownTitle}>Desglose por categoría</span>
            {!isExpanded && collapsedHint && (
              <span className={styles.categoryBreakdownHint}>{collapsedHint}</span>
            )}
          </span>
          <span className={styles.categoryBreakdownChevronWrap} aria-hidden="true">
            <Icon
              name="expand_more"
              size={20}
              className={`${styles.categoryBreakdownChevron}${isExpanded ? ` ${styles.categoryBreakdownChevronExpanded}` : ''}`}
            />
          </span>
        </button>

        {isExpanded && (
          <div id={panelId} className={styles.categoryBreakdownPanel}>
            <div className={styles.categoryBreakdownRows}>
              {items.map((item) => (
                <CategoryBreakdownRow
                  key={item.key}
                  item={item}
                  onSelectCategory={onSelectCategory}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
