import movimientosRaw from './data/movimientos.json';
import { PhoneShell } from './components/PhoneShell/PhoneShell';
import { getSelectableCategoryOptions } from './features/movements/catalog/categories';
import { MovementsPage } from './features/movements/MovementsPage';
import { parseMovementsFile } from './features/movements/utils/parseMovementsFile';

const { period, movements } = parseMovementsFile(movimientosRaw);
const categoryOptions = getSelectableCategoryOptions();

const App = () => (
  <PhoneShell>
    <MovementsPage
      initialMovements={movements}
      period={period}
      categoryOptions={categoryOptions}
    />
  </PhoneShell>
);

export default App;
