# DOMAIN — Mantra

## Entità

- **Category**: nome, genitore opzionale (Sport › Tennis), proprietario (utente) oppure catalogo (admin).
- **Mantra**: testo breve (≤ 140 caratteri) appartenente a una categoria, con posizione.
- **PlaybackSession**: una riproduzione (utente, categoria, stile, minuti pianificati, pausa tra frasi, origine MANUAL|SCHEDULE, totale riproduzioni).
- **MantraPlayCount**: contatore giornaliero per utente e mantra.
- **Schedule**: orario (HH:mm), giorni della settimana, fuso orario, stile, durata, attivo/non attivo. _(B-012)_
- **PushSubscription**: endpoint di notifica del dispositivo. _(B-012)_

## Stili

`calm` · `energetic` · `shout` · `whisper` → parametri voce (velocità, tono, volume). Sono approssimazioni con la voce del browser.

## Regole

| #   | Regola                                                                                                 | Esempio                                                     |
| --- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| R1  | Un mantra ha testo non vuoto (dopo trim) e al massimo 140 caratteri.                                   | `"  "` → non valido; `"Guarda la palla"` → valido           |
| R2  | La durata di una sessione è un intero tra 1 e 120 minuti; la pausa tra frasi tra 0 e 60 secondi.       | 0 min → non valido; 20 min → valido                         |
| R3  | La sequenza di riproduzione non ripete lo stesso mantra due volte di fila (se la categoria ne ha ≥ 2). | `[A,B,C]` → mai `A,A`                                       |
| R4  | La sessione termina quando il tempo trascorso raggiunge la durata; non inizia una nuova frase dopo.    | 1 min, frase 3 s + pausa 2 s → al massimo 12 frasi iniziate |
| R5  | Una riproduzione si conta solo quando la frase è stata pronunciata fino in fondo.                      | Frase interrotta da stop → conteggio invariato              |
| R6  | I conteggi sono aggregati per utente, mantra e giorno (data nel fuso dell'utente).                     | 3 riproduzioni oggi + 2 oggi → count = 5                    |
| R7  | I mantra e le categorie utente sono privati: solo il proprietario li legge/modifica.                   | Utente B non vede le categorie di A                         |
| R8  | Il catalogo è modificabile solo da ADMIN; copiare dal catalogo crea una copia privata indipendente.    | Modificare la copia non cambia il catalogo                  |
| R9  | Una categoria con sotto-categorie al massimo di profondità 2 (Sport › Tennis).                         | Sport › Tennis › Servizio → non valido                      |
| R10 | Un orario è "dovuto" se oggi è un giorno attivo e l'ora locale è nella finestra di 5 min da timeOfDay. | 07:00 Lun, ora 07:03 Lun → dovuto; 07:06 → no _(B-012)_     |
