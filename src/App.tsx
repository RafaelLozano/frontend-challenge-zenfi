import movimientosRaw from './data/movimientos.json';
import { getSelectableCategoriaOptions } from './features/movimientos/catalog/categorias';
import { MovimientosPage } from './features/movimientos/MovimientosPage';
import { parseMovimientosFile } from './features/movimientos/utils/parseMovimientosFile';

const { periodo, movimientos } = parseMovimientosFile(movimientosRaw);
const categorias = getSelectableCategoriaOptions();

const App = () => (
  <MovimientosPage
    initialMovimientos={movimientos}
    periodo={periodo}
    categorias={categorias}
  />
);

export default App;
