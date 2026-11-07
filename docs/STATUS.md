# STATUS — passaggio di consegne tra sessioni

> Leggilo a INIZIO sessione, aggiornalo a FINE sessione (o usa `/handoff`). Breve e aggiornato vale più di lungo.

## Stato attuale

- Ultimo aggiornamento: (data) · branch: (nome)
- Scaffold completato: auth + ruoli, dominio di esempio, CI, e2e. Nessuna piattaforma reale ancora definita.

## In corso

| Feature   | Branch | Sessione/chi | Stato |
| --------- | ------ | ------------ | ----- |
| (nessuna) |        |              |       |

## Prossimi passi immediati

1. Compilare `docs/PRODUCT.md` e `docs/DOMAIN.md`.
2. Sostituire `Order` e `src/domain/example` con le entità reali.

## Insidie note / debito tecnico

- `Order` e `domain/example` sono esempi da rimuovere.
- Il DB locale richiede Docker (`npm run db:up`) o un Postgres equivalente con `DATABASE_URL`.

## Log sessioni (più recente in alto)

- (data) — scaffold iniziale creato.
