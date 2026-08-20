import type { CategoriaOption } from './catalog/categorias';
import type { Movimiento } from './types';
import { useMovimientosPage } from './hooks/useMovimientosPage';
import { MovementList } from './components/MovementList/MovementList';
import { ResumenMensual } from './components/ResumenMensual/ResumenMensual';
import styles from './MovimientosPage.module.css';

export type MovimientosPageProps = {
  initialMovimientos: readonly Movimiento[];
  periodo: string;
  categorias: readonly CategoriaOption[];
};

export const MovimientosPage = ({
  initialMovimientos,
  periodo,
  categorias,
}: MovimientosPageProps) => {
  const { movimientos, resumen, handleSelectCategory } = useMovimientosPage({
    initialMovimientos,
    periodo,
    categorias,
  });

  return (
    <main className={styles.movimientosPage}>
      <p className={styles.movimientosPageBrand}>Zenfi</p>
      <ResumenMensual resumen={resumen} />
      <MovementList
        movimientos={movimientos}
        categorias={categorias}
        onSelectCategory={handleSelectCategory}
      />
    </main>
  );
};
