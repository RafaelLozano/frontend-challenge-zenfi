import { formatCurrency } from '../../../../utils/formatCurrency';
import type { MonthlySummary } from '../../types';
import styles from './MonthlySummary.module.css';

export type MonthlySummaryProps = {
  summary: MonthlySummary;
};

const TOP_CATEGORIES_LIMIT = 6;

export const MonthlySummaryView = ({ summary }: MonthlySummaryProps) => {
  const topCategories = summary.expensesByCategory.slice(0, TOP_CATEGORIES_LIMIT);

  return (
    <section className={styles.monthlySummary} aria-labelledby="monthly-summary-title">
      <header className={styles.monthlySummaryHeader}>
        <p className={styles.monthlySummaryEyebrow}>Resumen del mes</p>
        <h1 id="monthly-summary-title" className={styles.monthlySummaryTitle}>
          {summary.periodLabel}
        </h1>
        <p className={styles.monthlySummarySubtitle}>
          {summary.movementsInPeriod} movimientos en el periodo
        </p>
      </header>

      <div className={styles.monthlySummaryStats}>
        <article className={styles.monthlySummaryStat}>
          <p className={styles.monthlySummaryStatLabel}>Ingresos</p>
          <p className={`${styles.monthlySummaryStatValue} ${styles.monthlySummaryStatValueIncome}`}>
            {formatCurrency(summary.incomeCents)}
          </p>
        </article>
        <article className={styles.monthlySummaryStat}>
          <p className={styles.monthlySummaryStatLabel}>Gastos</p>
          <p className={`${styles.monthlySummaryStatValue} ${styles.monthlySummaryStatValueExpense}`}>
            {formatCurrency(summary.expensesCents)}
          </p>
        </article>
        <article className={styles.monthlySummaryStat}>
          <p className={styles.monthlySummaryStatLabel}>Balance</p>
          <p className={styles.monthlySummaryStatValue}>{formatCurrency(summary.balanceCents)}</p>
        </article>
      </div>

      <section className={styles.monthlySummaryCategories} aria-labelledby="expenses-by-category-title">
        <h2 id="expenses-by-category-title" className={styles.monthlySummaryCategoriesTitle}>
          ¿En qué se fue el dinero?
        </h2>
        <ul className={styles.monthlySummaryCategoryList}>
          {topCategories.map((category) => (
            <li key={category.categoryId} className={styles.monthlySummaryCategoryItem}>
              <div className={styles.monthlySummaryCategoryRow}>
                <span className={styles.monthlySummaryCategoryLabel}>{category.label}</span>
                <span className={styles.monthlySummaryCategoryMeta}>
                  {formatCurrency(category.totalCents)} · {category.percentage}%
                </span>
              </div>
              <div className={styles.monthlySummaryCategoryBar} aria-hidden="true">
                <div
                  className={styles.monthlySummaryCategoryBarFill}
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {summary.uncategorizedCount > 0 && (
        <p className={styles.monthlySummaryAlert} role="status">
          {summary.uncategorizedCount}{' '}
          {summary.uncategorizedCount === 1 ? 'movimiento necesita' : 'movimientos necesitan'}{' '}
          categoría — revísalos abajo.
        </p>
      )}

      {summary.excludedFromTotalsCount > 0 && (
        <p className={styles.monthlySummaryFootnote}>
          {summary.excludedFromTotalsCount} movimientos no entran al total (otra moneda, programados o en
          disputa).
        </p>
      )}
    </section>
  );
};
