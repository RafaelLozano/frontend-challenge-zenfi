# AGENTS.md — Frontend Challenge Zenfi

Guía para agentes y desarrolladores. Prioriza **simplicidad**, **tipado estricto** y **código fácil de revisar en vivo**. Este proyecto es un SPA con **Vite + React 19 + TypeScript strict**; no hay backend ni Next.js.

## Mentalidad

Actúa como un senior que prefiere lo aburrido y correcto:

- Menos capas, menos librerías, menos magia.
- Tipos explícitos antes que inferencia ambigua.
- UI con componentes pequeños; lógica fuera del JSX.
- Si una decisión no mejora claridad o mantenibilidad en 4 horas, no la tomes.

## Stack acordado

| Área | Decisión |
| --- | --- |
| Build | Vite |
| UI | React 19 (componentes funcionales) |
| Tipos | TypeScript `strict`, `noUncheckedIndexedAccess` |
| Estilos | **BEM** + CSS Modules (un `.module.css` por componente) |
| Datos | Import directo de `src/data/movimientos.json` |
| Calidad | `pnpm typecheck`, `pnpm lint`, `pnpm build` |

## Estructura de carpetas

```text
src/
├── components/          # UI básica reutilizable (Button, Badge, Select…)
├── features/
│   └── movements/       # dominio del reto
│       ├── components/  # piezas de la pantalla (una por archivo)
│       ├── hooks/       # estado, handlers, composición de datos
│       ├── utils/       # funciones puras (parseo, agregados, formato)
│       ├── types.ts     # tipos del dominio
│       └── MovementsPage.tsx
├── types/               # tipos compartidos (si aplica)
├── utils/               # utilidades globales (formato moneda, fechas)
├── App.tsx
└── main.tsx
```

Reglas:

- **Un componente React por archivo** (export default o named, nunca dos).
- **Un CSS Module por componente** (`MovementRow.module.css` ↔ `MovementRow.tsx`).
- No uses barrel files (`index.ts` que reexporta todo); importa desde la ruta concreta.

## Componentes TSX

### Responsabilidades

| Capa | Qué hace | Qué no hace |
| --- | --- | --- |
| **Componente** | Markup, clases BEM, props mínimas, callbacks | Fetch, parseo JSON, agregaciones, reglas de negocio |
| **Hook** | Estado, efectos, handlers, datos derivados para la vista | JSX |
| **Util** | Transformaciones puras, validación, mapeos | React hooks |

### Plantilla

```tsx
// features/movements/components/MovementRow/MovementRow.tsx
import type { Movement } from '../../types';
import styles from './MovementRow.module.css';

export type MovementRowProps = {
  movement: Movement;
  isSelected: boolean;
  onSelectCategory: (id: string, categoryId: string) => void;
};

export const MovementRow = ({
  movement,
  isSelected,
  onSelectCategory,
}: MovementRowProps) => (
  <article
    className={`${styles.movementRow}${isSelected ? ` ${styles.movementRowSelected}` : ''}`}
    aria-selected={isSelected}
  >
    <p className={styles.movementRowAmount}>{movimiento.amountLabel}</p>
    <button
      type="button"
      className={styles.movementRowCategory}
      onClick={() => onSelectCategory(movimiento.id, movimiento.categoryId)}
    >
      {movimiento.categoryLabel}
    </button>
  </article>
);
```

```tsx
// features/movements/hooks/useMovementsPage.ts
import { useMemo, useState } from 'react';
import { buildMonthlySummary, updateMovementCategory } from '../utils';
import type { Movement } from '../types';

export const useMovementsPage = (initialMovements: Movement[]) => {
  const [movements, setMovements] = useState(initialMovements);

  const summary = useMemo(() => buildMonthlySummary(movements), [movements]);

  const handleSelectCategory = (id: string, categoryId: string) => {
    setMovements((current) => updateMovementCategory(current, id, categoryId));
  };

  return { movements, summary, handleSelectCategory };
};
```

```tsx
// features/movements/MovementsPage.tsx — wiring fino
export const MovementsPage = ({ initialMovements }: MovementsPageProps) => {
  const { movements, summary, handleSelectCategory } = useMovementsPage(initialMovements);

  return (
    <main className={styles.page}>
      <MonthlySummaryView summary={summary} />
      <MovementList movements={movements} onSelectCategory={handleSelectCategory} />
    </main>
  );
};
```

### Reglas de componentes

- Props tipadas con `type` o `interface`; evita props opcionales encadenadas (`a?`, `b?`, `c?`).
- Prefiere **variantes explícitas** (`PrimaryButton`, `GhostButton`) antes que `variant="primary" | "ghost" | "danger"`.
- Evita props booleanas acumuladas (`isLoading`, `isDisabled`, `isCompact`); compón o divide componentes.
- No definas componentes dentro de otros componentes.
- No uses `any`, `as unknown as`, ni `@ts-ignore`.
- No uses estilos inline salvo prototipo temporal (borrar antes de entregar).
- Listas largas: considera `content-visibility: auto` en filas (ver skill Vercel `rendering-content-visibility`).

## BEM + CSS Modules

Convención del proyecto:

- **Block** = nombre del componente en kebab-case: `.movement-row`
- **Element** = `__`: `.movement-row__amount`
- **Modifier** = `--`: `.movement-row--selected`

En CSS Modules, el selector global BEM vive en el archivo; la clase exportada puede ser camelCase:

```css
/* MovementRow.module.css */
.movement-row { display: grid; gap: 0.5rem; }
.movement-row__amount { font-weight: 600; }
.movement-row--selected { outline: 2px solid var(--color-focus); }
```

```tsx
className={`${styles.movementRow} ${isSelected ? styles.movementRowSelected : ''}`}
```

Usa tokens CSS en `:root` (`--color-text`, `--space-md`) en lugar de valores mágicos repetidos.

## TypeScript estricto

El JSON **no viene limpio**. Modela el dominio en `types.ts`:

1. Tipo **raw** (forma del JSON).
2. Función **parse/normalize** en `utils/` que devuelve `Movement[]` o falla de forma explícita.
3. Tipos de dominio usados solo después del parseo.

```typescript
// ❌ BAD
const total = (data as any).movimientos.reduce(...);

// ✅ GOOD
export type Movement = {
  id: string;
  date: Date;
  amountCents: number;
  categoryId: CategoryId;
  description: string;
};

export const parseMovements = (raw: unknown): Movement[] => { /* validación */ };
```

- Usa `satisfies` para objetos literales con inferencia segura.
- Usa unions discriminadas para estados (`{ status: 'idle' } | { status: 'ready'; data: T }`).
- Prefiere `readonly` en props y retornos inmutables.
- Indexa arrays/objetos sabiendo que `noUncheckedIndexedAccess` puede devolver `undefined`.

## Hooks vs utils

| Usa `utils/` | Usa `hooks/` |
| --- | --- |
| Parseo, filtros, totales, formato moneda | `useState`, `useMemo`, `useCallback`, `useEffect` |
| Funciones testeables sin React | Orquestación de estado de pantalla |
| Validación de entrada | Handlers que llaman a `setState` |

Nombre de hooks: siempre `use` + sustantivo/acción (`useMovementsPage`, no `usePage`).

## Testing (opcional en el reto, recomendado para lógica)

No hay runner configurado aún. Si añades tests, prioriza:

1. **Utils** — Vitest puro (`parseMovements`, `buildMonthlySummary`).
2. **Hooks** — `@testing-library/react` + `renderHook`.
3. **Componentes** — solo interacción visible (cambiar categoría, resumen renderizado).

Mantén la lógica en hooks/utils para no repetir reglas en specs de UI.

## Skills de Vercel (instaladas)

Leer el `SKILL.md` completo antes de refactorizar o optimizar:

| Skill | Cuándo usarla | Ruta |
| --- | --- | --- |
| `vercel-react-best-practices` | Performance, bundles, re-renders | `.agents/skills/vercel-react-best-practices/SKILL.md` |
| `vercel-composition-patterns` | Evitar props booleanas, compound components | `.agents/skills/vercel-composition-patterns/SKILL.md` |
| `web-design-guidelines` | Revisar UX/accesibilidad de la pantalla | `.agents/skills/web-design-guidelines/SKILL.md` |
| `deploy-to-vercel` | Desplegar el SPA | `.agents/skills/deploy-to-vercel/SKILL.md` |

### Reglas Vercel relevantes para este SPA (Vite, sin RSC)

Prioridad alta:

- **Bundle**: imports directos, sin barrels; lazy import solo para piezas pesadas (charts).
- **Async**: `Promise.all` para trabajo independiente; no encadenar awaits innecesarios.
- **Re-render**: deriva estado en render; no copies props a state con `useEffect`.
- **Listas**: `content-visibility`, keys estables por `id`, evita inline objects en props.
- **JS**: `Map`/`Set` para búsquedas repetidas por id o categoría.

Ignora reglas `server-*`, RSC, `next/dynamic` y Server Actions — no aplican aquí.

## Checklist antes de entregar

- [ ] `pnpm typecheck` y `pnpm lint` pasan.
- [ ] Sin `any` ni estilos inline en componentes finales.
- [ ] JSON normalizado antes de llegar a la UI.
- [ ] Resumen mensual legible en ~10 segundos (criterio del reto).
- [ ] Flujo de corregir categoría funciona y persiste en estado local.
- [ ] `DECISIONES.md` actualizado (máx. una página).
- [ ] Commits pequeños con mensajes claros; push frecuente.

## Comandos

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck
pnpm lint
pnpm build
```

## Referencias del repo

- Enunciado: [`RETO.md`](./RETO.md)
- Decisiones de producto: [`DECISIONES.md`](./DECISIONES.md)
- Datos: [`src/data/movimientos.json`](./src/data/movimientos.json)
