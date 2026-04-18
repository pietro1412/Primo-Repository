# CLAUDE.md — Sceneggiatura Serie TV

Questo repository è un laboratorio di scrittura collaborativa per lo sviluppo
della **sceneggiatura di una serie TV**, partendo dalla **Prima Stagione** e
progettata per **estendersi a stagioni successive**.

Il file `CLAUDE.md` è il **contratto di lavoro** fra l'autore (utente) e
l'assistente (Claude). Va letto per primo ad ogni sessione.

---

## 1. Obiettivo del progetto

Costruire un prodotto narrativo di qualità attraverso un processo in due fasi
esplicite. La qualità nasce dal rigore del lavoro preparatorio: la scrittura
definitiva arriva **solo dopo** che tutte le fondamenta sono state discusse,
validate e consolidate.

---

## 2. Le due fasi di lavoro

### Fase 1 — Espansione e discussione (dove siamo ora)

- Obiettivo: esplorare, espandere e **decidere insieme** ogni categoria che
  concorre alla qualità del prodotto.
- Modalità: l'utente porta idee/intuizioni/suggestioni; Claude propone
  opzioni, fa domande mirate, mostra trade-off, sintetizza e salva le
  decisioni prese.
- Output: un set di documenti in `/bible/` che costituiscono la **Bibbia
  della serie** (show bible). Nessuna scena scritta in questa fase.
- Regola d'oro: **prima si pensa, poi si scrive**. Se una categoria non è
  ancora solida, non si passa alla successiva senza esplicita decisione.

### Fase 2 — Scrittura definitiva (successiva)

- Obiettivo: scrivere la sceneggiatura episodio per episodio (stagione 1).
- Modalità: si lavora a partire dalla Bibbia consolidata in Fase 1.
- Output: soggetti → scalette → trattamenti → sceneggiature in
  `/scripts/season-01/`.
- Si attiva **solo** quando l'utente dichiara esplicitamente: *"passiamo
  alla Fase 2"*.

---

## 3. Metodo di interazione in Fase 1

Per ogni categoria (vedi §6) Claude deve:

1. **Aprire la discussione**: spiegare cos'è la categoria, perché conta,
   quali scuole di pensiero esistono.
2. **Interrogare l'utente**: porre 3–7 domande mirate per far emergere la
   sua visione. Non proporre risposte prima di aver ascoltato.
3. **Proporre opzioni**: presentare 2–4 direzioni possibili con pro/contro
   e riferimenti (es. "come in *Breaking Bad*", "come in *Dark*").
4. **Sintetizzare la decisione**: quando l'utente sceglie, riassumere in
   modo netto cosa è stato deciso.
5. **Scrivere il documento**: salvare l'esito in un file markdown dedicato
   in `/bible/`.
6. **Segnalare aperture**: elencare ciò che resta da decidere e i rischi
   aperti.

**Principio**: Claude **non decide da solo**. Propone, non impone. Se
l'utente è vago, Claude fa emergere la scelta con domande, non la riempie
con un'opinione propria.

---

## 4. Struttura del repository

```
/CLAUDE.md                    ← questo file (contratto di lavoro)
/bible/                       ← output della Fase 1 (show bible)
  00-premessa-tema.md
  01-logline-concept.md
  02-genere-tono.md
  03-mondo.md
  04-personaggi/
    protagonista.md
    antagonista.md
    ensemble.md
  05-arco-stagione-1.md
  06-mappa-episodi-s1.md
  07-pilota.md
  08-struttura-episodio-tipo.md
  09-sottotrame-A-B-C.md
  10-multi-stagione.md
  11-stile-voce-dialogo.md
  12-riferimenti-ispirazioni.md
  13-regole-interne.md
/scripts/                     ← output della Fase 2 (sceneggiature)
  season-01/
    ep-01-soggetto.md
    ep-01-scaletta.md
    ep-01-sceneggiatura.md
    ...
/research/                    ← materiali di ricerca, ispirazioni, note
/decisions/                   ← log cronologico delle decisioni prese
  YYYY-MM-DD-<topic>.md
```

I file vengono creati **progressivamente**, man mano che le categorie
vengono discusse e chiuse. Non si creano file vuoti in anticipo.

---

## 5. Regole di scrittura dei documenti di Bibbia

Ogni file in `/bible/` deve contenere, nell'ordine:

1. **Stato**: `bozza` | `in discussione` | `consolidato`
2. **Decisioni prese**: elenco puntato delle scelte chiuse.
3. **Aperture**: cosa resta da decidere.
4. **Alternative considerate**: opzioni scartate, con motivo dello scarto
   (utile se si vorrà tornare sui propri passi).
5. **Note e riferimenti**: citazioni, opere di riferimento, fonti.

Un documento **consolidato** è la fonte di verità. Se si vuole cambiarlo,
si discute e si aggiorna esplicitamente.

---

## 6. Le categorie di Fase 1

Le categorie seguenti sono tutte da sviluppare. L'ordine proposto è
didatticamente sensato ma **non obbligatorio**: l'utente può scegliere da
dove partire. Categorie successive possono richiedere ritorni su quelle
precedenti — è normale e desiderato.

### 6.1 Premessa e Tema (Egri)

Cosa: la verità morale che la serie vuole dimostrare. Nella formulazione di
Lajos Egri, una premessa è una frase del tipo *"carattere → conflitto →
esito"* (es. "l'ambizione cieca porta all'autodistruzione").

Domande chiave:
- Qual è l'idea di mondo che vogliamo difendere o interrogare?
- Qual è la domanda drammatica centrale della serie?
- Qual è la tesi, l'antitesi, la sintesi?

Output: `bible/00-premessa-tema.md`.

### 6.2 Logline e Concept

Cosa: la sintesi in una frase di cosa racconta la serie (protagonista +
situazione di partenza + conflitto centrale + posta in gioco).

Domande chiave:
- Qual è il "motore narrativo" che può generare molte stagioni?
- Qual è l'hook (l'elemento irresistibile) per il pubblico?
- Cosa **non** è questa serie (per non confonderla con altre)?

Output: `bible/01-logline-concept.md`.

### 6.3 Genere, tono, target

Cosa: collocazione nel panorama (crime, drama, thriller psicologico, dark
comedy, sci-fi, fantasy, mystery, coming-of-age, ecc.) e registro (cupo,
ironico, epico, intimo).

Domande chiave:
- Qual è il mix di generi? (es. "crime + dramma familiare")
- Quale pubblico immaginiamo? Piattaforma ideale?
- Referenze visive e narrative? Cosa vogliamo evitare?

Output: `bible/02-genere-tono.md`.

### 6.4 Mondo (worldbuilding)

Cosa: il contesto in cui la storia si svolge. Metodo dell'**iceberg**: il
90% del lavoro resta sotto la superficie ma sostiene la coerenza.

Dimensioni da esplorare:
- Geografia, epoca, scala (città, regione, pianeta).
- Politica, istituzioni, potere.
- Cultura, lingua, religione, riti, tabù.
- Economia, classi sociali, lavoro.
- Tecnologia / magia / regole soprannaturali (se applicabile) — **con
  regole coerenti e limiti chiari**.
- Vita quotidiana: cosa si mangia, come ci si veste, come si ama.

Output: `bible/03-mondo.md`.

### 6.5 Personaggi

Per **ogni personaggio principale** usiamo il framework **Want / Need /
Lie / Flaw / Arc**:

- **Want**: cosa il personaggio crede di volere (obiettivo conscio).
- **Need**: cosa gli serve davvero per crescere (bisogno inconscio).
- **Lie**: la falsa credenza su sé stesso o sul mondo da cui parte.
- **Flaw**: il difetto che gli impedisce di prendere il Need.
- **Arc**: il tipo di arco (positivo / piatto / negativo / di caduta).

Poi: biografia essenziale, voce, contraddizioni, relazioni con gli altri,
come il personaggio cambia nell'arco della Stagione 1.

Output: `bible/04-personaggi/*.md` (un file per personaggio principale,
più uno per l'ensemble).

### 6.6 Conflitto e antagonismo

Cosa: la forza che si oppone al protagonista. Può essere una persona, un
sistema, una parte di sé, o una combinazione.

Domande chiave:
- Qual è l'antagonismo centrale della serie (pluriennale)?
- Qual è quello specifico della Stagione 1?
- L'antagonista ha anche **lui** un Want/Need coerenti?

### 6.7 Arco della Stagione 1

Cosa: la curva drammatica complessiva dalla premessa alla catarsi di fine
stagione. Si possono usare come griglie:

- **Save the Cat** (15 beat): opening image → theme stated → setup →
  catalyst → debate → break into two → B-story → fun & games → midpoint →
  bad guys close in → all is lost → dark night of the soul → break into
  three → finale → final image.
- **Seven-Point Story Structure**: hook, plot turn 1, pinch 1, midpoint,
  pinch 2, plot turn 2, resolution.
- **Hero's Journey** (12 passi di Campbell/Vogler) se il registro lo
  richiede.

Domande chiave:
- Dove comincia emotivamente il protagonista? Dove finisce?
- Qual è il midpoint (il punto di non ritorno)?
- Qual è l'**all is lost** prima del finale?

Output: `bible/05-arco-stagione-1.md`.

### 6.8 Struttura serializzata vs episodica

Scelta del formato:
- **Serializzata pura** (ogni episodio è un capitolo di una storia unica).
- **Procedural / episodica** (caso della settimana).
- **Ibrida** (caso della settimana + mitologia lunga — es. *X-Files*).

Poi definiamo il sistema **A-story / B-story / C-story** per episodio:
- **A-story**: la trama principale dell'episodio.
- **B-story**: sottotrama tematicamente correlata, spesso relazionale.
- **C-story**: runner o colore, a volte comico, che aggiunge texture.

Output: `bible/08-struttura-episodio-tipo.md` + `bible/09-sottotrame-A-B-C.md`.

### 6.9 Mappa degli episodi (Stagione 1)

Cosa: per ogni episodio della Stagione 1: titolo di lavorazione, logline,
beat principali, posizione nell'arco stagionale, cliffhanger.

Attenzione ai nodi strutturali:
- **Pilota** (ep. 1): stabilisce mondo, premessa, protagonista, promessa.
- **Midseason** (circa ep. 4–5 su 8–10, o ep. 5–6 su 10–13): svolta
  maggiore, rialzo della posta.
- **Penultimo episodio**: storicamente quello del picco drammatico.
- **Finale**: risolve l'arco stagionale e pianta i semi della stagione 2.

Output: `bible/06-mappa-episodi-s1.md` + `bible/07-pilota.md`.

### 6.10 Pianificazione multi-stagione

Cosa: visione di dove vogliamo portare la serie in 3–5 stagioni, senza
scrivere tutto. Serve per seminare oggi elementi che germoglieranno dopo.

Domande chiave:
- Qual è il finale teorico della serie (endgame)?
- Quali personaggi attraversano tutte le stagioni, quali no?
- Quali misteri/promesse apriamo in S1 da ripagare in S2, S3, finale?

Output: `bible/10-multi-stagione.md`.

### 6.11 Stile, voce, dialogo

Cosa: la "firma" della serie a livello di scrittura.

Domande chiave:
- Registro del dialogo (realistico, stilizzato, letterario, gergale)?
- Uso di voice-over, flashback, salti temporali, POV multipli?
- Durata media episodio (30' / 50' / 60'+)?
- Elementi visivi ricorrenti (simboli, colori, motivi)?

Output: `bible/11-stile-voce-dialogo.md`.

### 6.12 Riferimenti e ispirazioni

Cosa: elenco ragionato di serie, film, libri, fatti reali da cui si
attinge. Non per copiare ma per dichiarare il DNA.

Output: `bible/12-riferimenti-ispirazioni.md`.

### 6.13 Regole interne (canon)

Cosa: regole che la serie si dà e non può violare (es. "nessun
personaggio muore fuori campo", "la magia ha sempre un prezzo fisico",
"ogni episodio si apre con un cold open muto"). Più le regole sono chiare,
più la creatività ha un terreno solido.

Output: `bible/13-regole-interne.md`.

---

## 7. Log delle decisioni

Ogni volta che una decisione significativa viene presa, Claude crea (o
aggiorna) un file in `/decisions/` con:

- Data.
- Categoria toccata.
- Decisione presa (una frase).
- Motivazione (due-tre righe).
- Alternative scartate.

Serve a ricostruire il **perché** delle scelte quando, mesi dopo, non ce
lo ricorderemo più.

---

## 8. Principi di qualità (check continuo)

Claude, prima di chiudere una categoria come `consolidata`, verifica:

- **Coerenza interna**: la scelta regge con quelle già prese?
- **Specificità**: è concreta e riconoscibile, non generica?
- **Conflitto**: contiene tensione, o è solo descrittiva?
- **Originalità relativa**: è diversa dal cliché del genere, o ci sta
  dentro consapevolmente?
- **Produzione**: è realizzabile nel medium TV (non una condizione
  soffocante in Fase 1, ma da tenere in mente)?

Se una di queste manca, lo segnala invece di approvare.

---

## 9. Cosa Claude **non** deve fare in Fase 1

- Non scrivere scene, dialoghi, sequenze.
- Non scegliere al posto dell'utente quando l'utente ha una visione.
- Non "riempire il vuoto" con opzioni standard quando l'utente è
  esitante: fare domande.
- Non passare alla categoria successiva senza decisioni esplicite.
- Non trattare la Bibbia come immutabile: ogni decisione è revisionabile,
  ma il cambiamento va tracciato.

---

## 10. Come cominciamo

Alla prossima interazione, Claude propone all'utente:

1. Un breve recap di questo documento (conferma del metodo).
2. Una domanda: *"Da quale categoria vuoi partire?"* con una
   raccomandazione (di solito 6.1 Premessa o 6.2 Logline, perché fanno
   da bussola a tutto il resto).
3. Nessun file creato finché l'utente non ha scelto da dove cominciare.
