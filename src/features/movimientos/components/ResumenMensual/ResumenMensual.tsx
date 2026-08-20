import { formatCurrency } from '../../../../utils/formatCurrency';
import type { ResumenMensual as ResumenMensualData } from '../../types';
import styles from './ResumenMensual.module.css';

export type ResumenMensualProps = {
  resumen: ResumenMensualData;
};

const TOP_CATEGORIES_LIMIT = 6;

export const ResumenMensual = ({ resumen }: ResumenMensualProps) => {
  const topCategories = resumen.gastosPorCategoria.slice(0, TOP_CATEGORIES_LIMIT);

  return (
    <section className={styles.resumenMensual} aria-labelledby="resumen-mensual-title">
      <header className={styles.resumenMensualHeader}>
        <p className={styles.resumenMensualEyebrow}>Resumen del mes</p>
        <h1 id="resumen-mensual-title" className={styles.resumenMensualTitle}>
          {resumen.periodoLabel}
        </h1>
        <p className={styles.resumenMensualSubtitle}>
          {resumen.movimientosEnPeriodo} movimientos en el periodo
        </p>
      </header>

      <div className={styles.resumenMensualStats}>
        <article className={styles.resumenMensualStat}>
          <p className={styles.resumenMensualStatLabel}>Ingresos</p>
          <p className={`${styles.resumenMensualStatValue} ${styles.resumenMensualStatValueIncome}`}>
            {formatCurrency(resumen.ingresosCents)}
          </p>
        </article>
        <article className={styles.resumenMensualStat}>
          <p className={styles.resumenMensualStatLabel}>Gastos</p>
          <p className={`${styles.resumenMensualStatValue} ${styles.resumenMensualStatValueExpense}`}>
            {formatCurrency(resumen.gastosCents)}
          </p>
        </article>
        <article className={styles.resumenMensualStat}>
          <p className={styles.resumenMensualStatLabel}>Balance</p>
          <p className={styles.resumenMensualStatValue}>{formatCurrency(resumen.balanceCents)}</p>
        </article>
      </div>

      <section className={styles.resumenMensualCategories} aria-labelledby="gastos-categoria-title">
        <h2 id="gastos-categoria-title" className={styles.resumenMensualCategoriesTitle}>
          ¿En qué se fue el dinero?
        </h2>
        <ul className={styles.resumenMensualCategoryList}>
          {topCategories.map((categoria) => (
            <li key={categoria.categoryId} className={styles.resumenMensualCategoryItem}>
              <div className={styles.resumenMensualCategoryRow}>
                <span className={styles.resumenMensualCategoryLabel}>{categoria.label}</span>
                <span className={styles.resumenMensualCategoryMeta}>
                  {formatCurrency(categoria.totalCents)} · {categoria.percentage}%
                </span>
              </div>
              <div className={styles.resumenMensualCategoryBar} aria-hidden="true">
                <div
                  className={styles.resumenMensualCategoryBarFill}
                  style={{ width: `${categoria.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {resumen.sinCategorizarCount > 0 && (
        <p className={styles.resumenMensualAlert} role="status">
          {resumen.sinCategorizarCount}{' '}
          {resumen.sinCategorizarCount === 1 ? 'movimiento necesita' : 'movimientos necesitan'}{' '}
          categoría — revísalos abajo.
        </p>
      )}

      {resumen.excludedFromTotalsCount > 0 && (
        <p className={styles.resumenMensualFootnote}>
          {resumen.excludedFromTotalsCount} movimientos no entran al total (otra moneda, programados o en
          disputa).
        </p>
      )}
    </section>
  );
};
