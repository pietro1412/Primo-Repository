# DECISIONS

Formato: data · decisione · motivo.

- 2026-11-07 · Next.js full-stack + Prisma/PostgreSQL: un solo progetto TypeScript, schema e migrazioni versionati.
- 2026-11-07 · Auth.js con sessioni JWT (nessuna tabella di sessione): più semplice; i ruoli viaggiano nel token.
- 2026-11-07 · Prisma 6 (schema con `url`), non la 7: evita driver adapter e config aggiuntiva per lo scaffold.
- 2026-11-07 · Dominio puro in `src/domain` (regola ESLint): testabile senza DB e difficile da rompere.
- 2026-11-07 · Vulnerabilità `npm audit` (deepmerge-ts via `prisma` CLI): rischio accettato — solo tooling di sviluppo/CLI, non eseguito a runtime in produzione; il fix richiede Prisma 7 (migrazione pianificata, vedi backlog).
- 2026-11-07 · `next-auth` fissato alla versione esatta (prerelease beta) per evitare aggiornamenti non voluti.
- 2026-11-07 · Validazione env centralizzata rimossa (codice inutilizzato): Next/Prisma/Auth.js falliscono già in modo esplicito se mancano le variabili.
- 2026-11-08 · Prodotto: piattaforma "Mantra" (vedi `docs/PRODUCT.md`). Web app/PWA mobile-first, mantra privati + catalogo admin.
- 2026-11-08 · Voce: MVP con Web Speech API del browser dietro l'interfaccia `SpeechEngine` (`src/lib/speech/`); TTS cloud in seguito (B-014) senza toccare player e dominio.
- 2026-11-08 · Orari: l'audio automatico in background non è affidabile sul web mobile → notifica push che apre la sessione. Il job di dispatch richiede uno scheduler ogni minuto (hosting da decidere in B-012).
- 2026-11-08 · Conteggi aggregati per utente/mantra/giorno e inviati dal client a blocchi, per evitare una riga per riproduzione.
- 2026-11-08 · Test e2e del player con `?engine=fake` (FakeSpeechEngine): la sintesi reale del browser non è disponibile/deterministica in Chromium headless.
