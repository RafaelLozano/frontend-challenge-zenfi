import { Icon } from '../../../../components/Icon/Icon';
import type { UndoToastPresentation } from '../../hooks/useUndoToast';
import styles from './UndoToast.module.css';

export type UndoToastProps = {
  readonly toast: UndoToastPresentation;
  readonly onUndo: () => void;
  readonly onFocusEnter: () => void;
  readonly onFocusLeave: () => void;
};

export const UndoToast = ({ toast, onUndo, onFocusEnter, onFocusLeave }: UndoToastProps) => (
  <div
    className={styles.undoToast}
    role="status"
    aria-live="polite"
    onFocus={onFocusEnter}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        onFocusLeave();
      }
    }}
  >
    <Icon name="check_circle" size={22} className={styles.undoToastIcon} />
    <div className={styles.undoToastContent}>
      <p className={styles.undoToastTitle}>Ahora es {toast.newLabel}</p>
      <p className={styles.undoToastDetail}>
        {toast.merchant} · antes {toast.previousLabel}
      </p>
    </div>
    <button type="button" className={styles.undoToastButton} onClick={onUndo}>
      Deshacer
    </button>
  </div>
);
