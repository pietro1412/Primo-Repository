# CLAUDE.md

Scaffold riusabile per piattaforme web con logica di business e database, sviluppato con Claude Code.

## Stack

Next.js (App Router) + TypeScript strict · Tailwind · PostgreSQL + Prisma 6 · Auth.js (credentials, sessioni JWT, ruoli `ADMIN|USER`) · Vitest · Playwright.

## Comandi

- `npm run db:up` (Postgres via Docker) · `npm run db:migrate` · `npm run db:seed`
- `npm run dev` · `npm run build`
- Qualità (tutti devono passare prima di ogni commit): `npm run lint && npm run typecheck && npm test`
- E2E: `npm run test:e2e` (richiede DB migrato e seed; `PW_CHROMIUM_PATH` per usare un Chromium esistente)
- Setup: `cp .env.example .env`

## Architettura e convenzioni

- `src/domain/`: logica di business PURA (funzioni, nessun import da DB/UI/Next; imposto da ESLint). Ogni regola ha test Vitest accanto.
- `src/services/`: orchestrano dominio + Prisma. Niente regole di business qui.
- `src/app/`: route e server actions, sottili. Validare gli input con zod.
- `src/lib/`: infrastruttura (prisma, auth, env). `auth.config.ts` è edge-safe, `auth.ts` usa il DB.
- Importi di denaro: interi in centesimi.
- Schema DB solo tramite migrazioni Prisma (`prisma migrate dev`); mai modificare il DB a mano.
- Autorizzazione: `requireUser(role?)` nelle pagine/azioni + `src/proxy.ts` per i prefissi protetti.
- Nessun segreto nel repo: solo variabili d'ambiente (`.env` è ignorato).
- Ogni funzionalità: branch dedicato, piano prima, test insieme al codice, commit piccoli.
- `Order` e `domain/example` sono ESEMPI: sostituiscili con le entità della piattaforma reale.
- Aggiorna `docs/` e questo file quando prendi una decisione o scopri un'insidia.

## Documentazione

`docs/PRODUCT.md` (cosa/chi), `docs/DOMAIN.md` (entità e regole con esempi), `docs/DECISIONS.md` (decisioni).

## Sessioni successive e parallele

- A inizio sessione: `/start` (legge `docs/STATUS.md`, `docs/BACKLOG.md`, `docs/WORKFLOW.md`). A fine sessione: `/handoff`.
- Comandi in `.claude/commands/`: `/start`, `/plan-feature`, `/check`, `/new-migration`, `/handoff`.
- Un branch per sessione; marca l'elemento `doing` nel backlog prima di lavorare; una sola feature alla volta può toccare `prisma/schema.prisma`. Dettagli in `docs/WORKFLOW.md`.
- Non lasciare lavoro non pushato: l'ambiente cloud è effimero.
