import movimientos from './data/movimientos.json';

const App = () => (
  <main style={{ padding: 24 }}>
    <h1>Reto técnico — Movimientos</h1>
    <p>
      {movimientos.movimientos.length} movimientos cargados desde <code>src/data/movimientos.json</code>.
    </p>
    <p>Borra este componente y empieza aquí.</p>
  </main>
);

export default App;
