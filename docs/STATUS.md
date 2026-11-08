# STATUS — passaggio di consegne tra sessioni

> Leggilo a INIZIO sessione, aggiornalo a FINE sessione (o usa `/handoff`). Breve e aggiornato vale più di lungo.

## Stato attuale

- Ultimo aggiornamento: 2026-11-08 · branch: `claude/repository-cleanup-gpoeot`
- Piattaforma **Mantra** (vedi PRODUCT.md). Fatto: libreria (categorie, mantra, catalogo admin) con test e e2e. Player a voce con stili + conteggi riproduzioni (B-011) con test e e2e (voce finta).

## In corso

| Feature   | Branch | Sessione/chi | Schema? | Stato |
| --------- | ------ | ------------ | ------- | ----- |
| (nessuna) |        |              |         |       |

## Prossimi passi immediati

1. Provare il player con voce reale su telefono + auricolari (non automatizzabile).
2. B-012: orari + push (decidere lo scheduler), B-013 statistiche, B-014 TTS cloud.

## Insidie note / debito tecnico

- Il dominio per gli orari (R10) non esiste ancora (B-012).
- "Oggi" nel totale iniziale del player usa la data UTC del server; i conteggi salvati usano la data locale del client (R6): possibile scarto di un giorno vicino alla mezzanotte.
- `?engine=fake` nell'URL di /play attiva la voce finta (usata dai test e2e).
- La qualità/gli stili reali della voce del browser vanno valutati a orecchio su dispositivo.
- Il DB locale richiede Docker (`npm run db:up`) o un Postgres equivalente con `DATABASE_URL`.

## Log sessioni (più recente in alto)

- 2026-11-08 — CI sistemata: i test di integrazione richiedono il DB migrato prima di `npm test`.
- 2026-11-08 — player + conteggi (B-011): migrazione `playback`, dominio stili/sequenza/sessione, SpeechEngine, pagina /play.
- 2026-11-08 — definito il prodotto Mantra (docs), implementata la libreria (B-010) e rimosso l'esempio Order.
- 2026-11-07 — audit eseguito (`docs/AUDIT.md`) e fix applicati; scaffold, docs e comandi verificati da clone pulito.
- 2026-11-07 — scaffold iniziale creato.
