import { useCallback, useMemo, useState } from 'react';

import type { CategoriaOption } from '../catalog/categorias';
import type { CategoriaId, Movimiento } from '../types';
import { buildResumenMensual } from '../utils/buildResumenMensual';
import { updateMovimientoCategoria } from '../utils/updateMovimientoCategoria';

type UseMovimientosPageArgs = {
  initialMovimientos: readonly Movimiento[];
  periodo: string;
  categorias: readonly CategoriaOption[];
};

export const useMovimientosPage = ({
  initialMovimientos,
  periodo,
  categorias,
}: UseMovimientosPageArgs) => {
  const [movimientos, setMovimientos] = useState(initialMovimientos);

  const resumen = useMemo(
    () => buildResumenMensual(movimientos, periodo),
    [movimientos, periodo],
  );

  const sortedMovimientos = useMemo(
    () =>
      [...movimientos].sort((left, right) => {
        const leftNeedsReview = left.flags.includes('missing-category');
        const rightNeedsReview = right.flags.includes('missing-category');

        if (leftNeedsReview !== rightNeedsReview) {
          return leftNeedsReview ? -1 : 1;
        }

        return right.date.getTime() - left.date.getTime();
      }),
    [movimientos],
  );

  const handleSelectCategory = useCallback((movimientoId: string, categoryId: CategoriaId) => {
    setMovimientos((current) => updateMovimientoCategoria(current, movimientoId, categoryId));
  }, []);

  return {
    movimientos: sortedMovimientos,
    resumen,
    categorias,
    handleSelectCategory,
  };
};
