import { useCallback, useEffect, useRef, useState } from 'react';

import { getCategoryLabel } from '../catalog/categories';
import type { Movement } from '../types';
import type { CategoryChange } from './useRecategorize';

export const TOAST_DURATION_MS = 5200;

export type UndoToastPresentation = {
  readonly change: CategoryChange;
  readonly merchant: string;
  readonly previousLabel: string;
  readonly newLabel: string;
};

type UseUndoToastArgs = {
  readonly onUndo: (change: CategoryChange) => void;
  readonly onDismiss: (change: CategoryChange) => void;
};

export const useUndoToast = ({ onUndo, onDismiss }: UseUndoToastArgs) => {
  const [toast, setToast] = useState<UndoToastPresentation | null>(null);
  const toastRef = useRef<UndoToastPresentation | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const remainingMsRef = useRef(TOAST_DURATION_MS);
  const startedAtRef = useRef(0);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    const current = toastRef.current;

    if (!current) {
      return;
    }

    const change = current.change;
    clearTimer();
    isPausedRef.current = false;
    setToast(null);
    onDismiss(change);
  }, [clearTimer, onDismiss]);

  const startTimer = useCallback(
    (durationMs: number) => {
      clearTimer();
      startedAtRef.current = Date.now();
      remainingMsRef.current = durationMs;
      timeoutRef.current = setTimeout(() => {
        dismiss();
      }, durationMs);
    },
    [clearTimer, dismiss],
  );

  const showToast = useCallback(
    (change: CategoryChange, movement: Movement) => {
      clearTimer();
      isPausedRef.current = false;
      remainingMsRef.current = TOAST_DURATION_MS;

      const presentation: UndoToastPresentation = {
        change,
        merchant: movement.merchant,
        previousLabel: getCategoryLabel(change.previousCategoryId),
        newLabel: getCategoryLabel(change.newCategoryId),
      };

      setToast(presentation);
      toastRef.current = presentation;
      startTimer(TOAST_DURATION_MS);
    },
    [clearTimer, startTimer],
  );

  const pauseTimer = useCallback(() => {
    if (!toastRef.current || isPausedRef.current) {
      return;
    }

    isPausedRef.current = true;
    clearTimer();
    const elapsed = Date.now() - startedAtRef.current;
    remainingMsRef.current = Math.max(0, remainingMsRef.current - elapsed);
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    if (!toastRef.current || !isPausedRef.current) {
      return;
    }

    isPausedRef.current = false;
    startTimer(remainingMsRef.current);
  }, [startTimer]);

  const undo = useCallback(() => {
    const current = toastRef.current;

    if (!current) {
      return;
    }

    const change = current.change;
    clearTimer();
    isPausedRef.current = false;
    setToast(null);
    toastRef.current = null;
    onUndo(change);
  }, [clearTimer, onUndo]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    toast,
    showToast,
    dismiss,
    undo,
    pauseTimer,
    resumeTimer,
  };
};
