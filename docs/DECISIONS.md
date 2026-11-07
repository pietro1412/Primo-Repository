# DECISIONS

Formato: data · decisione · motivo.

- 2026-11-07 · Next.js full-stack + Prisma/PostgreSQL: un solo progetto TypeScript, schema e migrazioni versionati.
- 2026-11-07 · Auth.js con sessioni JWT (nessuna tabella di sessione): più semplice; i ruoli viaggiano nel token.
- 2026-11-07 · Prisma 6 (schema con `url`), non la 7: evita driver adapter e config aggiuntiva per lo scaffold.
- 2026-11-07 · Dominio puro in `src/domain` (regola ESLint): testabile senza DB e difficile da rompere.
- 2026-11-07 · Vulnerabilità `npm audit` (deepmerge-ts via `prisma` CLI): rischio accettato — solo tooling di sviluppo/CLI, non eseguito a runtime in produzione; il fix richiede Prisma 7 (migrazione pianificata, vedi backlog).
- 2026-11-07 · `next-auth` fissato alla versione esatta (prerelease beta) per evitare aggiornamenti non voluti.
- 2026-11-07 · Validazione env centralizzata rimossa (codice inutilizzato): Next/Prisma/Auth.js falliscono già in modo esplicito se mancano le variabili.
