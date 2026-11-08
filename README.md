# Platform Scaffold

Scaffold per piattaforme web (Next.js + Prisma + PostgreSQL) con auth e ruoli, pensato per Claude Code. Vedi `CLAUDE.md`.

## Avvio rapido

```bash
cp .env.example .env
npm install
npm run db:up && npm run db:migrate && npm run db:seed
npm run dev
```

Login iniziale: valori `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` di `.env`.

## Qualità

`npm run lint && npm run typecheck && npm test` · e2e: `npm run test:e2e`
