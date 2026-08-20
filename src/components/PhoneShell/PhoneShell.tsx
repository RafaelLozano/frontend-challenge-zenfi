import type { ReactNode } from 'react';

import styles from './PhoneShell.module.css';

export type PhoneShellProps = {
  readonly children: ReactNode;
};

export const PhoneShell = ({ children }: PhoneShellProps) => (
  <div className={styles.phoneShell}>{children}</div>
);
