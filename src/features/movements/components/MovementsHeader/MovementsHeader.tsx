import type { ReactNode } from 'react';

import { Icon } from '../../../../components/Icon/Icon';
import styles from './MovementsHeader.module.css';

const USER_NAME = 'Rafa Lozano';

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

export type MovementsHeaderProps = {
  readonly children: ReactNode;
};

export const MovementsHeader = ({ children }: MovementsHeaderProps) => (
  <header className={styles.movementsHeader}>
    <div className={styles.movementsHeaderTop}>
      <div className={styles.movementsHeaderProfile}>
        <span className={styles.movementsHeaderAvatar} aria-hidden="true">
          {getInitials(USER_NAME)}
        </span>
        <div className={styles.movementsHeaderTitles}>
          <p className={styles.movementsHeaderGreeting}>Hola, {USER_NAME}</p>
          <h1 className={styles.movementsHeaderTitle}>Tus movimientos</h1>
        </div>
      </div>
      <div className={styles.movementsHeaderBell} aria-hidden="true">
        <Icon name="notifications" size={20} />
      </div>
    </div>
    {children}
  </header>
);
