import { useEffect, useRef, type RefObject } from 'react';

import type { Movement } from '../../types';
import { DetailCategoryCard } from '../DetailCategoryCard/DetailCategoryCard';
import { DetailExplanationCard } from '../DetailExplanationCard/DetailExplanationCard';
import { DetailHeader } from '../DetailHeader/DetailHeader';
import { DetailIdentityCard } from '../DetailIdentityCard/DetailIdentityCard';
import { DetailMetaCard } from '../DetailMetaCard/DetailMetaCard';
import styles from './MovementDetail.module.css';

export type MovementDetailProps = {
  readonly movement: Movement;
  readonly periodLabel: string;
  readonly showUpdatedBadge: boolean;
  readonly onClose: () => void;
  readonly onOpenSheet: () => void;
  readonly changeButtonRef?: RefObject<HTMLButtonElement | null>;
};

export const MovementDetail = ({
  movement,
  periodLabel,
  showUpdatedBadge,
  onClose,
  onOpenSheet,
  changeButtonRef,
}: MovementDetailProps) => {
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backButtonRef.current?.focus();
  }, [movement.id]);

  return (
    <section
      className={styles.movementDetail}
      role="dialog"
      aria-modal="true"
      aria-label="Detalle del movimiento"
    >
      <DetailHeader onBack={onClose} backButtonRef={backButtonRef} />

      <div className={styles.movementDetailScroll}>
        <div className={styles.movementDetailCards}>
          <DetailIdentityCard movement={movement} />
          <DetailExplanationCard movement={movement} periodLabel={periodLabel} />
          <DetailMetaCard movement={movement} />
          <DetailCategoryCard
            movement={movement}
            showUpdatedBadge={showUpdatedBadge}
            onOpenSheet={onOpenSheet}
            changeButtonRef={changeButtonRef}
          />
        </div>
      </div>
    </section>
  );
};
