# Decisiones

## Arquitectura

**Tipo:** módulos por feature (vertical slice) con capas internas.

- Todo el dominio vive en `src/features/movements/`: tipos, utils, hook y componentes de la pantalla.
- **Componentes** — solo presentación (markup, BEM, callbacks).
- **Hooks** — estado y orquestación (`useMovementsPage`).
- **Utils** — lógica pura (parseo del JSON, resumen mensual, actualizar categoría).
- **Utils globales** — solo lo compartido de verdad (`src/utils/formatCurrency.ts`).
- Imports directos; sin barrel files ni capas extra (services, repositories, store global).

**Por qué:** El reto es una sola pantalla sin backend. Organizar por feature concentra el código del dominio en un lugar fácil de recorrer en la revisión en vivo. Separar utils del hook deja el parseo y los agregados testeables sin React, y los componentes delgados — sin sobre-arquitectura para un time-box de 4 horas.

## Qué mostré y qué dejé fuera

**Mostré (prioridad al objetivo de 10 segundos + corregir categoría):**

- **Resumen arriba de todo** — ingresos, gastos y balance del mes en tiles; debajo, top 5 categorías de gasto con barra y porcentaje (el resto va a «Otras»).
- **Frase narrativa** — una línea automática («En agosto, tu mayor gasto fue…») para quien no quiere leer números.
- **Lista secundaria** — 60 movimientos agrupados por día, con badges de estado, sin categoría, fuera del mes o duplicado cuando aplica.
- **Corregir categoría** — tap en fila → detalle a pantalla completa (comercio, monto, explicación en lenguaje claro) → sheet de categorías → cambio inmediato + toast «Deshacer».
- **Navegación extra** — búsqueda y chips de categoría/estado para llegar rápido al movimiento mal clasificado; tap en una categoría del resumen filtra la lista.
- **Marco móvil** — `PhoneShell` + splash de carga con conteo real; sin backend ni persistencia.

**Dejé fuera (time-box y fuera del enunciado):**

- Backend, auth, API, localStorage y rutas — una pantalla, estado en memoria; recargar = JSON original.
- Gráficos elaborados, comparación con meses anteriores, presupuestos y metas — el reto pide entender _este_ mes, no analytics histórico.
- Edición inline, swipe o crear categorías — catálogo cerrado de 16; el flujo es entender el cargo y elegir bien.
- Tests automatizados — prioricé parseo tipado y UX del flujo principal; con una semana más empezaría por utils.
- Responsive desktop y librerías de UI — mobile-first acotado; CSS Modules + BEM sin dependencias de componentes.
- Ocultar duplicados o datos «sucios» — prefiero mostrarlos con aviso y dejar que el usuario decida.

## Supuestos que tuve que inventar

_Lo que el requerimiento no decía y resolviste por tu cuenta._

- **Vista móvil primero.** Enmarqué la app en un `PhoneShell` porque el reto habla de “abrir la app y ver 60 renglones”; asumí contexto smartphone, no dashboard de escritorio.
- **Resumen antes que lista.** Para el objetivo de “10 segundos”, prioricé arriba ingresos/gastos/balance, top 5 categorías de gasto (el resto va a «Otras») y una frase narrativa automática — la lista queda como segundo plano.
- **Corregir categoría = detalle → sheet, no inline.** El reto pide corregir, no cómo. Elegí pantalla de detalle a pantalla completa (entender el cargo) + bottom sheet para elegir categoría; sin swipe ni edición en la fila.
- **Cambio inmediato + deshacer.** Al elegir categoría se aplica al instante, se recalcula el resumen y aparece un toast ~5 s con «Deshacer» (pausa el timer si el foco entra al toast).
- **Solo estado local.** Las correcciones viven en React state; no hay API, localStorage ni URL — al recargar vuelve el JSON original.
- **Convención de signos.** Monto negativo = gasto, positivo = ingreso. Si el JSON trae el monto como string sin `+`, lo trato como gasto y marco el flag `amount-sign-inferred`.
- **Qué entra al resumen mensual.** Solo movimientos en MXN, dentro del `periodo` del archivo, no duplicados ni versiones «supersedidas» por estado, y con estado `confirmada`, `pendiente` o `en_disputa`. `programada` se muestra pero no suma.
- **Catálogo cerrado.** Inferí las 16 categorías de las etiquetas del JSON. «Sin categoría» es solo para datos rotos; al corregir no se puede volver a elegirla.
- **Duplicados con criterio, no borrado.** Mismo registro exacto → el primero cuenta, los demás se marcan duplicado. Mismo cargo con distinto estado → gana el de mayor precedencia (`confirmada` > `en_disputa` > `pendiente` > `programada`).
- **Nombre legible del comercio.** No hay campo `merchant` en el JSON; lo derivé de `descripcion` con un diccionario de marcas conocidas + limpieza de códigos/sucursales del estado de cuenta.
- **Filtros extra (fuera del mínimo).** Añadí búsqueda, chips de categoría y de estado para navegar 60 movimientos; no eran requisito, pero ayudan a llegar al movimiento mal clasificado.

## Qué encontré en los datos y cómo lo manejé

_El JSON no viene limpio. ¿Qué venía mal y qué hiciste al respecto?_

- **No confío en la forma del export.** Tipé un `MovementRaw`, valido el archivo en `parseMovementsFile` y normalizo cada registro a `Movement` antes de que llegue a React. Fechas inválidas o montos no numéricos lanzan error temprano.
- **Categorías faltantes** (`null` o `""`, p. ej. Spotify, OXXO, cargo en disputa) → `normalizeCategory` las mapea a «Sin categoría», marca `needsCategoryReview: true`, las subo al inicio de la lista y muestro badge + aviso en el resumen.
- **Categorías mal asignadas** (p. ej. Didi en «Salud») → no las corrijo en el parseo; el usuario las arregla con el selector. Ese es el segundo requisito del reto.
- **Montos inconsistentes** — mezcla de `number` y `string` (`"1876.40"`), decimales y un cargo de `$0` → `parseAmountToCents` unifica todo a centavos enteros; el monto cero no entra a ingresos ni gastos.
- **Estados heterogéneos** (`confirmada`, `pendiente`, `programada`, `en_disputa`) → solo `confirmada` y `pendiente` suman al resumen; `programada` y `en_disputa` se muestran en la fila pero quedan fuera del total, con nota al pie.
- **Movimientos fuera del mes** (`periodo: "2026-08"` pero hay fechas de nov-2025 y sep-2026) → `isInPeriod` los excluye del resumen mensual; siguen visibles en la lista con badge «Fuera del mes».
- **Moneda USD** en un cargo de AWS → se muestra con su moneda pero no se mezcla con los totales en MXN.
- **Duplicados aparentes** (dos Rappi idénticos; Uber confirmado + pendiente) → no dedupliqué: en datos reales puede ser doble cargo o estados distintos del mismo evento; prefiero mostrarlos y dejar que el usuario decida.

## Cómo usé IA

_Qué herramienta, en qué te ayudó, qué generó que tuviste que corregir o tirar._

- Stitch design.md — paleta de colores, tokens y pantallas sencillas; lo demás lo fui puliendo en base a mi experiencia.
- Plans mode con Claude; ejecuté con modelos chinos.
- Tiré los primeros approach de plans porque la IA me daba planes con soluciones genéricas; preferí enfocarme en el verdadero pain del user e invertir un poco más en UX.
- Talacha como DS,planes completos,css tokens ect con IA y modelos baratos.

## Qué haría con una semana más

- Funciones de análisis con IA para dar sugerencias inteligentes de posibles errores de movimientos mal clasificados.

## Tiempo invertido

_El time-box es de 4 horas. Si te quedaste corto, dilo aquí — también cuenta._

- Invertí 3 h 30 min.
