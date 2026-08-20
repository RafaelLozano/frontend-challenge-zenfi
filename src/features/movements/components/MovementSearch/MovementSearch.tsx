import { Icon } from '../../../../components/Icon/Icon';
import styles from './MovementSearch.module.css';

export type MovementSearchProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export const MovementSearch = ({ value, onChange }: MovementSearchProps) => (
  <div className={styles.movementSearch}>
    <Icon name="search" size={20} />
    <input
      type="search"
      className={styles.movementSearchInput}
      value={value}
      placeholder="Buscar comercio, categoría o cuenta"
      aria-label="Buscar movimientos"
      onChange={(event) => onChange(event.target.value)}
    />
    {value.length > 0 && (
      <button
        type="button"
        className={styles.movementSearchClear}
        aria-label="Limpiar búsqueda"
        onClick={() => onChange('')}
      >
        <Icon name="close" size={18} />
      </button>
    )}
  </div>
);
