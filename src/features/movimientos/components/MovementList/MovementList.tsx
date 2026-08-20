import type { CategoriaOption } from '../../catalog/categorias';
import type { CategoriaId, Movimiento } from '../../types';
import { MovementRow } from '../MovementRow/MovementRow';
import styles from './MovementList.module.css';

export type MovementListProps = {
  movimientos: readonly Movimiento[];
  categorias: readonly CategoriaOption[];
  onSelectCategory: (movimientoId: string, categoryId: CategoriaId) => void;
};

export const MovementList = ({ movimientos, categorias, onSelectCategory }: MovementListProps) => (
  <section className={styles.movementList} aria-labelledby="movement-list-title">
    <header className={styles.movementListHeader}>
      <h2 id="movement-list-title" className={styles.movementListTitle}>
        Movimientos
      </h2>
      <p className={styles.movementListSubtitle}>
        Cambia la categoría si el banco la clasificó mal.
      </p>
    </header>

    <ul className={styles.movementListItems}>
      {movimientos.map((movimiento) => (
        <li key={movimiento.id}>
          <MovementRow
            movimiento={movimiento}
            categorias={categorias}
            onSelectCategory={onSelectCategory}
          />
        </li>
      ))}
    </ul>
  </section>
);
