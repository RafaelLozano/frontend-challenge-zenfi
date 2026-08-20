# Reto técnico — Frontend Developer (React + TypeScript)

Hola 👋

Gracias por el tiempo que nos diste en la primera plática. Este es el siguiente paso del proceso.

Antes que nada: **este reto está diseñado para tomarte 4 horas, no más.** Va en serio. Preferimos ver algo acotado y bien pensado que algo enorme y a medias. Si llegas a las 4 horas y falta trabajo, para ahí y escríbelo en tu documento de decisiones — eso también cuenta.

---

## El contexto

En Zenfi conectamos las cuentas bancarias de nuestros usuarios y les mostramos sus movimientos. El problema no es traer los datos, es que la gente los entienda: la mayoría abre la app, ve una lista de 60 renglones y la cierra sin sacar nada en claro.

Te pasamos un archivo `movimientos.json` con un mes de actividad de una cuenta.

## Lo que queremos que construyas

Una pantalla donde una persona pueda:

1. **Entender en unos 10 segundos en qué se le fue el dinero este mes.**
2. **Corregir la categoría de un movimiento que quedó mal clasificado.**

Eso es todo el requerimiento. Cómo se ve, qué muestras primero, qué dejas fuera y cómo lo resuelves técnicamente son decisiones tuyas — y son justamente lo que vamos a platicar.

## Reglas

- **React + TypeScript.** Todo lo demás lo eliges tú: build tool, estilos, librerías, estructura. Prepárate para explicar por qué.
- **4 horas.** Time-box real.
- **Puedes usar IA** (Claude, Copilot, Cursor, lo que uses normalmente). Nosotros la usamos todos los días. Solo pedimos que nos cuentes cómo la usaste.
- **No hace falta backend.** Importa el JSON directo.
- **No hay diseño ni mockup.** Es a propósito.

## Sobre los datos

El JSON es un export representativo de lo que recibimos de un agregador bancario real, con todo lo que eso implica. No asumas que viene limpio.

## Cómo trabajas en el repo

Este repo es un **template**. Dale a **"Use this template" → "Create a new repository"** y créalo **en tu propia cuenta**. El repo es tuyo y te lo quedas.

Hazlo **público**: así puedes desplegarlo gratis donde quieras — GitHub Pages, por ejemplo, no publica desde repos privados sin plan de pago. Si prefieres tenerlo privado, también está bien; nada más invítanos como colaboradores: `SaulMoreyra` y `JohanAlvarado`.

Trabajas directo sobre `main`. No hace falta rama ni PR.

- **Commitea conforme avanzas.** Haz los commits que necesites, con mensajes que se entiendan. No queremos un único commit "entrega final": los commits nos cuentan cómo fuiste pensando el problema, y es material para la sesión de revisión.
- **Haz push seguido.** Si algo se cae el último día, lo que esté empujado es lo que existe. Sube tu primer commit temprano — nos sirve como marca de arranque del time-box.

## Qué nos entregas

**1. El código** — en tu repo, con el README actualizado si cambiaste cómo se corre.

**2. `DECISIONES.md` — máximo una página.** Este documento pesa tanto como el código. Queremos:

- Qué decidiste mostrar y qué dejaste fuera, y por qué.
- Qué supuestos tuviste que inventar porque el requerimiento no lo decía.
- Qué encontraste en los datos y cómo lo manejaste.
- Cómo usaste IA: qué te ayudó, qué te generó y tuviste que corregir o tirar.
- Qué harías con una semana más.

Sin adornos. Bullets están perfecto.

**3. Un correo cuando termines** — a los dos, con el link de tu repo. Ese correo cierra la entrega: lo que esté en `main` en ese momento es lo que revisamos.

- saul.aragon@yotepresto.com
- johan@yotepresto.com

**Plus: si lo dejas desplegado**, mándanos también la URL. Vercel, Netlify, GitHub Pages, lo que uses. No es requisito ni resta si no lo haces — pero poder abrirlo sin clonar suma.

## Qué evaluamos

- **TypeScript de verdad**, no `any` decorativo.
- **Criterio de producto y UI.** No buscamos pixel perfect ni que seas diseñador. Buscamos que las decisiones tengan razón de ser.
- **Cómo manejas lo que el requerimiento no dice.**
- **Cómo lo explicas.**

## Qué NO evaluamos

- Backend, autenticación, base de datos.
- Cobertura de tests (si escribes alguna, cuéntanos por qué esa y no otras).
- Responsive perfecto en todos los breakpoints.
- Cantidad de features.

## Siguiente paso

Después de que entregues, agendamos una sesión de ~60 minutos donde revisamos el código juntos, te pedimos un cambio en vivo y platicamos de cómo trabajas. Ahí es donde se decide la mayor parte, así que llega con tu proyecto fresco en la cabeza.

---

## Dudas

**Si algo del enunciado no te queda claro, escríbenos.** Preguntar no es penalizado — al contrario, aquí trabajamos así.

Escribe **con copia a ambos correos**, así te contesta el primero que lo vea:

- saul.aragon@yotepresto.com
- johan@yotepresto.com

