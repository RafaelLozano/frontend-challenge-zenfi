import { Icon } from '../../../../components/Icon/Icon';
import { getStatusConfig } from '../../catalog/states';
import type { Movement } from '../../types';
import { buildQualityWarnings } from '../../utils/buildQualityWarnings';
import styles from './DetailExplanationCard.module.css';

export type DetailExplanationCardProps = {
  readonly movement: Movement;
  readonly periodLabel: string;
};

export const DetailExplanationCard = ({ movement, periodLabel }: DetailExplanationCardProps) => {
  const statusConfig = getStatusConfig(movement.status);
  const qualityWarnings = buildQualityWarnings(movement.flags, periodLabel);

  return (
    <article className={styles.detailExplanationCard}>
      <div className={styles.detailExplanationCardHeader}>
        <Icon name="help" size={19} className={styles.detailExplanationCardHelpIcon} />
        <h3 className={styles.detailExplanationCardTitle}>¿Qué es este cargo?</h3>
      </div>

      <p className={styles.detailExplanationCardNote}>{movement.note}</p>

      <div className={styles.detailExplanationCardRawBlock}>
        <p className={styles.detailExplanationCardRawLabel}>COMO APARECE EN TU ESTADO DE CUENTA</p>
        <p className={styles.detailExplanationCardRawValue}>{movement.description}</p>
      </div>

      <div className={styles.detailExplanationCardInfoRow}>
        <Icon name="info" size={17} className={styles.detailExplanationCardInfoIcon} />
        <p className={styles.detailExplanationCardInfoText}>{statusConfig.explanation}</p>
      </div>

      {qualityWarnings.map((warning) => (
        <div key={warning} className={styles.detailExplanationCardWarningRow}>
          <Icon name="warning" size={17} className={styles.detailExplanationCardWarningIcon} />
          <p className={styles.detailExplanationCardWarningText}>{warning}</p>
        </div>
      ))}
    </article>
  );
};
