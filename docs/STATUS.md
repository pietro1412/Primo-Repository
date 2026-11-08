# STATUS — passaggio di consegne tra sessioni

> Leggilo a INIZIO sessione, aggiornalo a FINE sessione (o usa `/handoff`). Breve e aggiornato vale più di lungo.

## Stato attuale

- Ultimo aggiornamento: 2026-11-08 · branch: `claude/repository-cleanup-gpoeot`
- Piattaforma **Mantra** (vedi PRODUCT.md). Fatto: libreria (categorie, mantra, catalogo admin) con test e e2e. Sviluppo in corso: player + conteggi (B-011).

## In corso

| Feature   | Branch | Sessione/chi | Schema? | Stato |
| --------- | ------ | ------------ | ------- | ----- |
| (nessuna) |        |              |         |       |

## Prossimi passi immediati

1. B-011: player a voce + conteggi (migrazione sessioni/conteggi).
2. B-012: orari + push (decidere lo scheduler), B-013 statistiche, B-014 TTS cloud.

## Insidie note / debito tecnico

- Le funzioni di dominio per player/orari non esistono ancora (solo `validation.ts`).
- Il DB locale richiede Docker (`npm run db:up`) o un Postgres equivalente con `DATABASE_URL`.

## Log sessioni (più recente in alto)

- 2026-11-08 — definito il prodotto Mantra (docs), implementata la libreria (B-010) e rimosso l'esempio Order.
- 2026-11-07 — audit eseguito (`docs/AUDIT.md`) e fix applicati; scaffold, docs e comandi verificati da clone pulito.
- 2026-11-07 — scaffold iniziale creato.
