import movimientosRaw from './data/movimientos.json';
import { PhoneShell } from './components/PhoneShell/PhoneShell';
import { getSelectableCategoriaOptions } from './features/movimientos/catalog/categorias';
import { MovimientosPage } from './features/movimientos/MovimientosPage';
import { parseMovimientosFile } from './features/movimientos/utils/parseMovimientosFile';

const { periodo, movimientos } = parseMovimientosFile(movimientosRaw);
const categorias = getSelectableCategoriaOptions();

const App = () => (
  <PhoneShell>
    <MovimientosPage
      initialMovimientos={movimientos}
      periodo={periodo}
      categorias={categorias}
    />
  </PhoneShell>
);

export default App;
