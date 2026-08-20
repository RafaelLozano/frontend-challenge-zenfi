# Technical challenge — Frontend (React + TypeScript)

Starter repo for the challenge. It ships the bare minimum to get going: **Vite + React + TypeScript**.
Everything else —styling, libraries, folder structure, state— is up to you.

The full statement is in [`RETO.md`](./RETO.md).

## Your repo

This repo is a **template**. Hit **"Use this template" → "Create a new repository"** and create it
**under your own account**. The repo is yours and you keep it.

Make it **public** — that way you can deploy it for free anywhere; GitHub Pages, for one, won't
publish from a private repo without a paid plan. If you'd rather keep it private, that's fine too:
just invite the two of us as collaborators, `SaulMoreyra` and `JohanAlvarado`.

Work straight on `main`. Commit as you go and push often — make as many commits as you need with
messages that read, because we look at the history, not just the final state, and if something
breaks on the last day what's pushed is what exists. Get your first commit up early: that's how we
timestamp the start of the time-box.

## Requirements

- Node `>=22.12` (there's an `.nvmrc`)
- pnpm 10 (`corepack enable`). If you'd rather use npm or yarn, go ahead: delete the
  `packageManager` field from `package.json` and that's it.

## How to run it

```bash
corepack enable
pnpm install
pnpm dev
```

It runs at http://localhost:5173.

## Scripts

| Script           | What it does                     |
| ---------------- | -------------------------------- |
| `pnpm dev`       | Development server               |
| `pnpm build`     | Typecheck + production build     |
| `pnpm preview`   | Serves the build                 |
| `pnpm lint`      | ESLint                           |
| `pnpm typecheck` | TypeScript only                  |

## The data

`src/data/movimientos.json` — one month of transactions from an account, exactly as it comes
out of a bank aggregator. **It's deliberately untyped**: modeling and normalizing that data is
part of the challenge. Import it directly, no backend needed.

```ts
import movimientos from './data/movimientos.json';
```

## What you deliver

1. The code, with this README updated if you change how it's run.
2. [`DECISIONES.md`](./DECISIONES.md) — one page max. It counts as much as the code.
3. An email to both of us when you're done, with the link to your repo. That email closes the
   submission: whatever is on `main` at that point is what we review.

**Plus: deploy it** (Vercel, Netlify, GitHub Pages, whatever) and send the URL too. Not required and
it doesn't count against you — but being able to open it without cloning helps.

## What's decided and what isn't

Decided (so you don't spend time there):

- Vite as the build tool, TypeScript in `strict` mode
- ESLint with the standard Vite + React Hooks config

Not decided (your call, and that's what we'll talk about):

- Styling: plain CSS, Modules, Tailwind, CSS-in-JS, whatever you use
- State, routing, charts, dates, currency formatting
- Folder structure and data model
- What gets shown first and what stays out

## Questions

Something in the statement unclear? Ask — it's not penalized. Email **both addresses in copy**, so
whoever sees it first can answer:

- saul.aragon@yotepresto.com
- johan@yotepresto.com
