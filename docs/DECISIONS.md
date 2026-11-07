# DECISIONS

Formato: data · decisione · motivo.

- Next.js full-stack + Prisma/PostgreSQL: un solo progetto TypeScript, schema e migrazioni versionati.
- Auth.js con sessioni JWT (nessuna tabella di sessione): più semplice; i ruoli viaggiano nel token.
- Prisma 6 (schema con `url`), non la 7: evita driver adapter e config aggiuntiva per lo scaffold.
- Dominio puro in `src/domain` (regola ESLint): testabile senza DB e difficile da rompere.
