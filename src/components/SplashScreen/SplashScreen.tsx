import type { CSSProperties } from 'react';

import { Icon } from '../Icon/Icon';
import { SPLASH_DURATION_MS } from './useSplashScreen';
import styles from './SplashScreen.module.css';

export type SplashScreenProps = {
  readonly movementCount: number;
  readonly periodMonthLabel: string;
};

export const SplashScreen = ({ movementCount, periodMonthLabel }: SplashScreenProps) => {
  const statusMessage = `Ordenando ${movementCount} movimientos de ${periodMonthLabel}`;

  return (
    <div
      className={styles.splashScreen}
      role="status"
      aria-live="polite"
      aria-label={statusMessage}
      style={{ '--splash-duration': `${SPLASH_DURATION_MS}ms` } as CSSProperties}
    >
      <div className={styles.splashScreenIconBox} aria-hidden="true">
        <Icon name="swap_vert" size={38} />
      </div>

      <h1 className={styles.splashScreenTitle}>Ordenando tus movimientos</h1>
      <p className={styles.splashScreenSubtitle}>
        Estamos leyendo tu estado de cuenta de {periodMonthLabel}
      </p>

      <div className={styles.splashScreenBarTrack} aria-hidden="true">
        <span className={styles.splashScreenBarFill} />
      </div>

      <p className={styles.splashScreenFooter} aria-hidden="true">
        Sincronizando {movementCount} movimientos
      </p>
    </div>
  );
};
