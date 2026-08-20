import { Icon } from '../../../../components/Icon/Icon';
import styles from './MovementsEmptyState.module.css';

export const MovementsEmptyState = () => (
  <div className={styles.movementsEmptyState}>
    <div className={styles.movementsEmptyStateIcon} aria-hidden="true">
      <Icon name="search_off" size={27} />
    </div>
    <h2 className={styles.movementsEmptyStateTitle}>Sin movimientos que coincidan</h2>
    <p className={styles.movementsEmptyStateBody}>
      Prueba con otra categoría o quita los filtros activos.
    </p>
  </div>
);
