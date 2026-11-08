# PRODUCT — Mantra

## Obiettivo

Aiutare le persone a migliorare una capacità (sport, studio, lavoro…) riascoltando frasi brevi — i **mantra** — mentre la praticano. Esempio: in allenamento di tennis si ascolta "guarda la palla", "alza il gomito", "gira le spalle".

## Utenti e ruoli

| Ruolo | Cosa può fare                                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------- |
| USER  | Crea categorie e mantra propri (privati), copia categorie dal catalogo, avvia sessioni, imposta orari, vede le statistiche. |
| ADMIN | Tutto ciò che fa USER + gestisce il catalogo di categorie/mantra di base (es. Sport › Tennis).                              |

## Funzionalità (in ordine di priorità)

1. **Libreria**: categorie (anche annidate: Sport › Tennis) con elenco di mantra; copia dal catalogo. _(B-010)_
2. **Player**: riproduce a voce i mantra della categoria in ripetizione per N minuti, con stile (calma, carica, urla, sussurro). Funziona da telefono con auricolari. _(B-011)_
3. **Conteggio**: traccia quante volte ogni mantra è stato riprodotto. _(B-011)_
4. **Orari**: l'utente imposta quando una categoria deve partire; arriva una notifica e al tocco parte la sessione. _(B-012)_
5. **Statistiche**: totali per mantra, categoria, giorno. _(B-013)_
6. **Voce cloud di qualità** al posto della voce del browser. _(B-014)_

## Vincoli di piattaforma (noti)

- Web app/PWA mobile-first. I browser mobile bloccano l'audio automatico in background: l'orario produce una **notifica**, la riproduzione parte al tocco.
- Su iOS le notifiche push richiedono la PWA installata in home (iOS ≥ 16.4).
- Con la voce del browser gli stili sono approssimati (velocità, tono, volume) e variano per dispositivo.

## Fuori scope (per ora)

Condivisione pubblica di mantra tra utenti, app nativa, registrazione della propria voce, musica di sottofondo.
