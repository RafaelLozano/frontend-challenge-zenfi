import type { RefObject } from 'react';

import { Icon } from '../../../../components/Icon/Icon';
import styles from './DetailHeader.module.css';

export type DetailHeaderProps = {
  readonly onBack: () => void;
  readonly backButtonRef?: RefObject<HTMLButtonElement | null>;
};

export const DetailHeader = ({ onBack, backButtonRef }: DetailHeaderProps) => (
  <header className={styles.detailHeader}>
    <button
      ref={backButtonRef}
      type="button"
      className={styles.detailHeaderBack}
      aria-label="Volver a la lista"
      onClick={onBack}
    >
      <Icon name="arrow_back" size={22} />
    </button>
    <h2 className={styles.detailHeaderTitle}>Detalle del movimiento</h2>
  </header>
);
