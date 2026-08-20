import { formatCurrency } from '../../../../utils/formatCurrency';
import type { CategoriaOption } from '../../catalog/categorias';
import type { CategoriaId, Movimiento } from '../../types';
import { formatMovimientoDate } from '../../utils/formatPeriod';
import styles from './MovementRow.module.css';

export type MovementRowProps = {
  movimiento: Movimiento;
  categorias: readonly CategoriaOption[];
  onSelectCategory: (movimientoId: string, categoryId: CategoriaId) => void;
};

const STATUS_LABELS: Record<Movimiento['status'], string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  programada: 'Programada',
  en_disputa: 'En disputa',
};

const getAmountClassName = (amountCents: number): string => {
  if (amountCents > 0) {
    return `${styles.movementRowAmount} ${styles.movementRowAmountIncome}`;
  }

  return `${styles.movementRowAmount} ${styles.movementRowAmountExpense}`;
};

const getStatusBadgeClassName = (status: Movimiento['status']): string => {
  if (status === 'pendiente' || status === 'programada' || status === 'en_disputa') {
    return `${styles.movementRowBadge} ${styles.movementRowBadgePending}`;
  }

  return `${styles.movementRowBadge} ${styles.movementRowBadgeMuted}`;
};

export const MovementRow = ({ movimiento, categorias, onSelectCategory }: MovementRowProps) => {
  const needsCategoryReview = movimiento.flags.includes('missing-category');
  const isOutOfPeriod = movimiento.flags.includes('out-of-period');

  const rowClassName = needsCategoryReview
    ? `${styles.movementRow} ${styles.movementRowNeedsReview}`
    : styles.movementRow;

  return (
    <article className={rowClassName}>
      <p className={styles.movementRowDate}>{formatMovimientoDate(movimiento.date)}</p>

      <div className={styles.movementRowMain}>
        <p className={styles.movementRowDescription} title={movimiento.description}>
          {movimiento.description}
        </p>
        <div className={styles.movementRowMeta}>
          {needsCategoryReview && (
            <span className={`${styles.movementRowBadge} ${styles.movementRowBadgeWarning}`}>
              Sin categoría
            </span>
          )}
          {isOutOfPeriod && (
            <span className={`${styles.movementRowBadge} ${styles.movementRowBadgeMuted}`}>
              Fuera del mes
            </span>
          )}
          {movimiento.status !== 'confirmada' && (
            <span className={getStatusBadgeClassName(movimiento.status)}>
              {STATUS_LABELS[movimiento.status]}
            </span>
          )}
        </div>
      </div>

      <p className={getAmountClassName(movimiento.amountCents)}>
        {formatCurrency(movimiento.amountCents, movimiento.currency)}
      </p>

      <select
        className={styles.movementRowCategory}
        value={movimiento.categoryId}
        aria-label={`Categoría de ${movimiento.description}`}
        onChange={(event) => onSelectCategory(movimiento.id, event.target.value as CategoriaId)}
      >
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.label}
          </option>
        ))}
      </select>
    </article>
  );
};
