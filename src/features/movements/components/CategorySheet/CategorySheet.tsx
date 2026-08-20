import type { RefObject } from 'react';

import { Icon } from '../../../../components/Icon/Icon';
import { formatCurrency } from '../../../../utils/formatCurrency';
import { getCategoryLabel } from '../../catalog/categories';
import type { CategoryId } from '../../types';
import { CategorySheetRow } from '../CategorySheetRow/CategorySheetRow';
import styles from './CategorySheet.module.css';

export type CategorySheetProps = {
  readonly merchant: string;
  readonly amountCents: number;
  readonly currency: string;
  readonly currentCategoryId: CategoryId;
  readonly categoryIds: readonly CategoryId[];
  readonly pendingCategoryId: CategoryId | null;
  readonly confirmMode: boolean;
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly firstCategoryRef: RefObject<HTMLButtonElement | null>;
  readonly onClose: () => void;
  readonly onSelectCategory: (categoryId: CategoryId) => void;
  readonly onConfirm: () => void;
};

export const CategorySheet = ({
  merchant,
  amountCents,
  currency,
  currentCategoryId,
  categoryIds,
  pendingCategoryId,
  confirmMode,
  containerRef,
  firstCategoryRef,
  onClose,
  onSelectCategory,
  onConfirm,
}: CategorySheetProps) => {
  const amountLabel = formatCurrency(Math.abs(amountCents), currency);
  const subtitle = `${merchant} · ${amountLabel}`;
  const effectivePending = pendingCategoryId ?? currentCategoryId;
  const canConfirm = pendingCategoryId !== null && pendingCategoryId !== currentCategoryId;

  return (
    <div className={styles.categorySheet} ref={containerRef}>
      <button
        type="button"
        className={styles.categorySheetBackdrop}
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div
        className={styles.categorySheetPanel}
        role="dialog"
        aria-modal="true"
        aria-label="Elegir categoría"
      >
        <div className={styles.categorySheetHandle} aria-hidden="true" />

        <header className={styles.categorySheetHeader}>
          <div className={styles.categorySheetHeaderText}>
            <h2 className={styles.categorySheetTitle}>Elegir categoría</h2>
            <p className={styles.categorySheetSubtitle}>{subtitle}</p>
          </div>

          <button
            type="button"
            className={styles.categorySheetClose}
            aria-label="Cerrar"
            onClick={onClose}
          >
            <Icon name="close" size={19} />
          </button>
        </header>

        <div className={styles.categorySheetDivider} />

        <div className={styles.categorySheetList}>
          {categoryIds.map((categoryId, index) => (
            <CategorySheetRow
              key={categoryId}
              ref={index === 0 ? firstCategoryRef : undefined}
              categoryId={categoryId}
              isCurrent={categoryId === currentCategoryId}
              isPending={confirmMode && categoryId === effectivePending && categoryId !== currentCategoryId}
              onSelect={() => onSelectCategory(categoryId)}
            />
          ))}
        </div>

        {confirmMode && (
          <footer className={styles.categorySheetFooter}>
            <button
              type="button"
              className={`${styles.categorySheetConfirm}${canConfirm ? ` ${styles.categorySheetConfirmEnabled}` : ` ${styles.categorySheetConfirmDisabled}`}`}
              disabled={!canConfirm}
              onClick={onConfirm}
            >
              {canConfirm
                ? `Guardar como ${getCategoryLabel(pendingCategoryId!)}`
                : 'Elige una categoría distinta'}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
