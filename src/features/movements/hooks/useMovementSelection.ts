import { useCallback, useRef, useState } from 'react';

export const useMovementSelection = () => {
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const selectMovement = useCallback((movementId: string, sourceElement?: HTMLElement | null) => {
    returnFocusRef.current =
      sourceElement ?? document.getElementById(`movement-row-${movementId}`);
    setSelectedMovementId(movementId);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedMovementId(null);

    requestAnimationFrame(() => {
      returnFocusRef.current?.focus();
    });
  }, []);

  return {
    selectedMovementId,
    selectMovement,
    closeDetail,
    returnFocusRef,
  };
};
