# Decisiones

## Arquitectura

**Tipo:** módulos por feature (vertical slice) con capas internas.

- Todo el dominio vive en `src/features/movimientos/`: tipos, utils, hook y componentes de la pantalla.
- **Componentes** — solo presentación (markup, BEM, callbacks).
- **Hooks** — estado y orquestación (`useMovimientosPage`).
- **Utils** — lógica pura (parseo del JSON, resumen mensual, actualizar categoría).
- **Utils globales** — solo lo compartido de verdad (`src/utils/formatCurrency.ts`).
- Imports directos; sin barrel files ni capas extra (services, repositories, store global).

**Por qué:** El reto es una sola pantalla sin backend. Organizar por feature concentra el código del dominio en un lugar fácil de recorrer en la revisión en vivo. Separar utils del hook deja el parseo y los agregados testeables sin React, y los componentes delgados — sin sobre-arquitectura para un time-box de 4 horas.

## Qué mostré y qué dejé fuera

- ...

## Supuestos que tuve que inventar

_Lo que el requerimiento no decía y resolviste por tu cuenta._

- ...

## Qué encontré en los datos y cómo lo manejé

_El JSON no viene limpio. ¿Qué venía mal y qué hiciste al respecto?_

- **No confío en la forma del export.** Tipé un `MovimientoRaw`, valido el archivo en `parseMovimientosFile` y normalizo cada registro a `Movimiento` antes de que llegue a React. Fechas inválidas o montos no numéricos lanzan error temprano.
- **Categorías faltantes** (`null` o `""`, p. ej. Spotify, OXXO, cargo en disputa) → `normalizeCategory` las mapea a «Sin categoría», marca `needsCategoryReview: true`, las subo al inicio de la lista y muestro badge + aviso en el resumen.
- **Categorías mal asignadas** (p. ej. Didi en «Salud») → no las corrijo en el parseo; el usuario las arregla con el selector. Ese es el segundo requisito del reto.
- **Montos inconsistentes** — mezcla de `number` y `string` (`"1876.40"`), decimales y un cargo de `$0` → `parseAmountToCents` unifica todo a centavos enteros; el monto cero no entra a ingresos ni gastos.
- **Estados heterogéneos** (`confirmada`, `pendiente`, `programada`, `en_disputa`) → solo `confirmada` y `pendiente` suman al resumen; `programada` y `en_disputa` se muestran en la fila pero quedan fuera del total, con nota al pie.
- **Movimientos fuera del mes** (`periodo: "2026-08"` pero hay fechas de nov-2025 y sep-2026) → `isInPeriod` los excluye del resumen mensual; siguen visibles en la lista con badge «Fuera del mes».
- **Moneda USD** en un cargo de AWS → se muestra con su moneda pero no se mezcla con los totales en MXN.
- **Duplicados aparentes** (dos Rappi idénticos; Uber confirmado + pendiente) → no dedupliqué: en datos reales puede ser doble cargo o estados distintos del mismo evento; prefiero mostrarlos y dejar que el usuario decida.

## Cómo usé IA

_Qué herramienta, en qué te ayudó, qué generó que tuviste que corregir o tirar._

- ...

## Qué haría con una semana más

- ...

## Tiempo invertido

_El time-box es de 4 horas. Si te quedaste corto, dilo aquí — también cuenta._

- ...
