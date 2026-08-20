import movimientosRaw from './data/movimientos.json';
import { PhoneShell } from './components/PhoneShell/PhoneShell';
import { SplashScreen } from './components/SplashScreen/SplashScreen';
import { useSplashScreen } from './components/SplashScreen/useSplashScreen';
import { getSelectableCategoryOptions } from './features/movements/catalog/categories';
import { MovementsPage } from './features/movements/MovementsPage';
import { formatPeriodMonthName } from './features/movements/utils/formatPeriod';
import { parseMovementsFile } from './features/movements/utils/parseMovementsFile';
import styles from './App.module.css';

const { period, movements } = parseMovementsFile(movimientosRaw);
const categoryOptions = getSelectableCategoryOptions();
const periodMonthLabel = formatPeriodMonthName(period);

const App = () => {
  const { isVisible: isSplashVisible } = useSplashScreen();

  return (
    <PhoneShell>
      <div
        className={styles.appContent}
        inert={isSplashVisible ? true : undefined}
        aria-hidden={isSplashVisible ? true : undefined}
      >
        <MovementsPage
          initialMovements={movements}
          period={period}
          categoryOptions={categoryOptions}
        />
      </div>
      {isSplashVisible && (
        <SplashScreen movementCount={movements.length} periodMonthLabel={periodMonthLabel} />
      )}
    </PhoneShell>
  );
};

export default App;
