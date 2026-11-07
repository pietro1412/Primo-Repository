# DOMAIN

> Entità e regole di business, con esempi input → output. Ogni regola diventa un test in `src/domain`.

## Entità

(es. Ordine: id, utente, importi in centesimi)

## Regole

| #   | Regola                                              | Esempio                                           |
| --- | --------------------------------------------------- | ------------------------------------------------- |
| R1  | Lo sconto non supera il 30% del subtotale (esempio) | 10000 cent, sconto 90% → sconto 3000, totale 7000 |
