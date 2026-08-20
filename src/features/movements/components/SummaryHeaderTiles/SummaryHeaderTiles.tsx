import { Icon } from '../../../../components/Icon/Icon';
import { formatSignedCurrency } from '../../../../utils/formatSignedCurrency';
import type { MonthlySummary } from '../../types';
import { formatPeriodShortLabel } from '../../utils/formatPeriod';
import styles from './SummaryHeaderTiles.module.css';

export type SummaryHeaderTilesProps = {
  readonly summary: MonthlySummary;
};

export const SummaryHeaderTiles = ({ summary }: SummaryHeaderTilesProps) => (
  <div className={styles.summaryHeaderTiles}>
    <article className={styles.summaryHeaderTilesTile}>
      <div className={styles.summaryHeaderTilesTileHeader}>
        <Icon name="south_west" size={16} />
        <span className={styles.summaryHeaderTilesLabel}>Ingresos</span>
      </div>
      <p className={styles.summaryHeaderTilesValue}>
        {formatSignedCurrency(summary.incomeCents)}
      </p>
    </article>

    <article className={styles.summaryHeaderTilesTile}>
      <div className={styles.summaryHeaderTilesTileHeader}>
        <Icon name="north_east" size={16} />
        <span className={styles.summaryHeaderTilesLabel}>Gastos</span>
      </div>
      <p className={styles.summaryHeaderTilesValue}>
        {formatSignedCurrency(-summary.expensesCents)}
      </p>
    </article>

    <article className={`${styles.summaryHeaderTilesTile} ${styles.summaryHeaderTilesTilePeriod}`}>
      <span className={styles.summaryHeaderTilesLabel}>Periodo</span>
      <p className={styles.summaryHeaderTilesValue}>{formatPeriodShortLabel(summary.period)}</p>
    </article>
  </div>
);
