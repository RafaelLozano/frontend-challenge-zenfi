import { getStatusConfig } from '../../catalog/states';
import type { Movement } from '../../types';
import styles from './DetailMetaCard.module.css';

export type DetailMetaCardProps = {
  readonly movement: Movement;
};

type MetaRow = {
  readonly key: string;
  readonly value: string;
};

export const DetailMetaCard = ({ movement }: DetailMetaCardProps) => {
  const rows: MetaRow[] = [
    { key: 'Cuenta', value: movement.account ?? 'Sin cuenta asignada' },
    { key: 'Estado', value: getStatusConfig(movement.status).label },
    { key: 'Moneda', value: movement.currency },
    { key: 'Referencia', value: movement.id },
  ];

  return (
    <article className={styles.detailMetaCard}>
      {rows.map((row, index) => (
        <div
          key={row.key}
          className={`${styles.detailMetaCardRow}${index === rows.length - 1 ? ` ${styles.detailMetaCardRowLast}` : ''}`}
        >
          <span className={styles.detailMetaCardKey}>{row.key}</span>
          <span className={styles.detailMetaCardValue}>{row.value}</span>
        </div>
      ))}
    </article>
  );
};
