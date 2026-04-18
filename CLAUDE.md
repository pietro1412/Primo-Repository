# CLAUDE.md — Romanzo YA (saga)

Questo repository è un laboratorio di scrittura collaborativa per lo sviluppo
di un **romanzo YA (Young Adult)** con registro **poetico**, concepito come
**Libro 1 di una possibile saga**.

Progetto di partenza: *Le Avventure di Crypto Guy — Discovering the Soul of
the Universe*.

Il file `CLAUDE.md` è il **contratto di lavoro** fra l'autore (utente) e
l'assistente (Claude). Va letto per primo ad ogni sessione.

---

## 1. Obiettivo del progetto

Costruire un romanzo YA di qualità attraverso un processo in due fasi
esplicite. La qualità nasce dal rigore del lavoro preparatorio: la scrittura
definitiva arriva **solo dopo** che tutte le fondamenta sono state discusse,
validate e consolidate.

---

## 2. Le due fasi di lavoro

### Fase 1 — Espansione e discussione (dove siamo ora)

- Obiettivo: esplorare, espandere e **decidere insieme** ogni categoria che
  concorre alla qualità del romanzo.
- Modalità: l'utente porta idee/intuizioni/suggestioni; Claude propone
  opzioni, fa domande mirate, mostra trade-off, sintetizza e salva le
  decisioni prese.
- Output: un set di documenti in `/bible/` che costituiscono la **Bibbia
  del romanzo** (story bible).
- In Fase 1 **non si scrive prosa narrativa definitiva**: solo appunti,
  sintesi, strutture. Eccezione: brevi "saggi di voce" per testare il
  registro, che restano in `/research/` e non sono parte del romanzo.

### Fase 2 — Scrittura definitiva (successiva)

- Obiettivo: scrivere il romanzo capitolo per capitolo (Libro 1).
- Modalità: si lavora a partire dalla Bibbia consolidata in Fase 1.
- Output: in `/manuscript/book-01/` con soggetto → scaletta → capitoli.
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
   e riferimenti (es. "come in *Il piccolo principe*", "come in *His Dark
   Materials*").
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
/CLAUDE.md                       ← questo file (contratto di lavoro)
/bible/                          ← output della Fase 1 (story bible)
  00-premessa-tema.md
  01-logline-concept.md
  02-genere-tono-target.md
  03-mondo.md
  04-personaggi/
    protagonista.md
    genitori.md
    antagonista.md
    ensemble.md
  05-conflitto-antagonismo.md
  06-voce-pov.md
  07-stile-registro-poetico.md
  08-struttura-romanzo.md
  09-arco-libro-1.md
  10-mappa-capitoli-libro-1.md
  11-saga-multi-libro.md
  12-regole-interne.md
  13-riferimenti-ispirazioni.md
/manuscript/                     ← output della Fase 2 (il romanzo)
  book-01/
    00-soggetto.md
    01-scaletta.md
    02-capitoli/
      cap-01-la-scomparsa.md
      ...
/research/                       ← materiali di ricerca, testi esistenti,
                                   saggi di voce, ispirazioni
  source/                        ← la traccia originale fornita dall'autore
/decisions/                      ← log cronologico delle decisioni prese
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

L'ordine proposto è didatticamente sensato ma **non obbligatorio**:
l'utente può scegliere da dove partire. Categorie successive possono
richiedere ritorni su quelle precedenti — è normale e desiderato.

### 6.1 Premessa e Tema (Egri)

Cosa: la verità morale che il romanzo vuole dimostrare. Nella
formulazione di Lajos Egri, una premessa è una frase del tipo
*"carattere → conflitto → esito"* (es. "l'ascolto empatico apre porte che
la sola tecnica non apre").

Domande chiave:
- Qual è la domanda drammatica centrale del romanzo?
- Qual è la tesi, l'antitesi, la sintesi?
- Cosa vogliamo che il lettore porti a casa, chiuso il libro?

Output: `bible/00-premessa-tema.md`.

### 6.2 Logline e concept

Cosa: la sintesi in una frase di cosa racconta il romanzo (protagonista
+ situazione di partenza + conflitto centrale + posta in gioco).

Domande chiave:
- Qual è il motore narrativo che può sostenere un intero libro (ed
  eventuali sequel)?
- Qual è l'hook (l'elemento irresistibile) per il lettore YA?
- Cosa **non** è questo romanzo?

Output: `bible/01-logline-concept.md`.

### 6.3 Genere, tono, target (YA)

Cosa: collocazione nel panorama editoriale e tono del romanzo.

Convenzioni YA di riferimento:
- Protagonista tipicamente 13–18 anni.
- Temi: identità, scoperta di sé, appartenenza, prima responsabilità.
- Voce: diretta, onesta, mai condiscendente verso l'adolescente.
- Lunghezza capitoli tipica: 2.000–4.000 parole.
- Lunghezza libro YA: circa 60.000–90.000 parole.

Domande chiave:
- Quale sottogenere principale? (sci-fi poetico / fantasy scientifico /
  bildungsroman cosmico / mystery quantistico)
- Quali sottogeneri in mix?
- Quale fascia YA (younger YA 12–14 / core YA 14–17 / upper YA 16–18)?
- Quale piattaforma editoriale immaginiamo (ragazzi, crossover adulti)?

Output: `bible/02-genere-tono-target.md`.

### 6.4 Mondo (worldbuilding)

Cosa: il contesto in cui la storia si svolge. Metodo dell'**iceberg**: il
90% del lavoro resta sotto la superficie ma sostiene la coerenza.

Dimensioni da esplorare:
- Geografia, epoca, scala (città, regione, pianeta, cosmo).
- Politica, istituzioni, potere.
- Cultura, lingua, religione, riti, tabù.
- Economia, classi sociali, lavoro.
- Tecnologia / scienza speculativa / regole soprannaturali — **con
  regole coerenti e limiti chiari**.
- Vita quotidiana di un quindicenne nel mondo che stiamo costruendo.

Output: `bible/03-mondo.md`.

### 6.5 Personaggi

Per **ogni personaggio principale** usiamo il framework **Want / Need /
Lie / Flaw / Arc**:

- **Want**: cosa il personaggio crede di volere (obiettivo conscio).
- **Need**: cosa gli serve davvero per crescere (bisogno inconscio).
- **Lie**: la falsa credenza da cui parte.
- **Flaw**: il difetto che gli impedisce di prendere il Need.
- **Arc**: il tipo di arco (positivo / piatto / negativo / di caduta).

Poi: biografia essenziale, voce, contraddizioni, relazioni con gli altri,
come il personaggio cambia nell'arco del Libro 1.

Output: `bible/04-personaggi/*.md` (un file per personaggio principale,
più uno per l'ensemble).

### 6.6 Conflitto e antagonismo

Cosa: la forza che si oppone al protagonista. Può essere una persona,
un sistema, una parte di sé, o una combinazione.

Domande chiave:
- Qual è l'antagonismo centrale della saga (pluriennale)?
- Qual è quello specifico del Libro 1?
- L'antagonista ha anche **lui** un Want/Need coerenti?

Output: `bible/05-conflitto-antagonismo.md`.

### 6.7 Voce narrante e POV

Cosa: chi racconta, da quale distanza, con quale accesso ai pensieri.

Opzioni principali:
- **Prima persona** (io, Crypto Guy): massima intimità, limite alla
  percezione del protagonista.
- **Terza limitata** (lui, Crypto Guy, ma con libertà descrittiva):
  compromesso classico YA, permette prosa poetica senza perdere
  aggancio emotivo.
- **Terza onnisciente poetica**: voce narrante che si permette libertà
  cosmiche (tipica dell'incipit già scritto).
- **Multipla / alternata** (es. Crypto Guy + altra voce): utile per saga.

Domande chiave:
- Quanta intimità serve col protagonista?
- La voce può cambiare fra parti del libro?
- C'è un narratore esterno/metaforico (es. l'Universo stesso che racconta)?

Output: `bible/06-voce-pov.md`.

### 6.8 Stile, lingua, registro poetico

Cosa: la "firma" del romanzo a livello di frase.

Il registro scelto è **poetico**, con le implicazioni:
- Immagini sensoriali ricorrenti, sinestesie, metafore scientifiche
  trasfigurate in immagini emotive.
- Ritmo: alternanza di frasi lunghe (respiro) e frasi brevi (impatto).
- Lessico: elevato ma accessibile a un quindicenne motivato — mai
  accademico, mai bambinesco.
- Rischio da presidiare: prosa che diventa ornamento senza azione.

Domande chiave:
- Quanto è denso il registro? Sempre poetico, o alternato a momenti più
  asciutti (dialogo, azione)?
- Quale rapporto tra prosa e silenzi/pause/capitoli brevi?
- Ci sono parole-chiave ricorrenti (motivi verbali) che vogliamo seminare?

Output: `bible/07-stile-registro-poetico.md`.

### 6.9 Struttura del romanzo

Griglie a disposizione (da scegliere o combinare):

- **Tre atti classici** (25% / 50% / 25%).
- **Save the Cat! Writes a Novel** — 15 beat (Jessica Brody): opening
  image, theme stated, setup, catalyst, debate, break into two, B story,
  fun & games, midpoint, bad guys close in, all is lost, dark night of
  the soul, break into three, finale, final image.
- **Seven-Point Story Structure**: hook, plot turn 1, pinch 1, midpoint,
  pinch 2, plot turn 2, resolution.
- **Hero's Journey** (12 passi di Campbell/Vogler) — spesso naturale per
  YA con protagonista in viaggio di formazione.

Domande chiave:
- Quale griglia sentiamo più affine al progetto?
- Il romanzo segue un arco lineare o ha una struttura non-lineare
  (flashback, cornice, intreccio)?
- Prologo/prefazione: resta com'è, si rielabora, si sposta?

Output: `bible/08-struttura-romanzo.md`.

### 6.10 Arco del Libro 1

Cosa: la curva drammatica complessiva dalla premessa alla catarsi di
fine libro.

Domande chiave:
- Dove comincia emotivamente il protagonista? Dove finisce?
- Qual è il midpoint (il punto di non ritorno)?
- Qual è l'**all is lost** prima del finale?
- Il Libro 1 chiude il primo arco o lascia cliffhanger per il Libro 2?

Output: `bible/09-arco-libro-1.md`.

### 6.11 Mappa dei capitoli (Libro 1)

Cosa: per ogni capitolo del Libro 1: titolo di lavorazione, logline,
beat principali, posizione nell'arco, suo "gancio" finale.

Riferimenti di pacing YA:
- Capitoli di 2.000–4.000 parole.
- Gancio/domanda aperta alla fine di quasi ogni capitolo.
- Alternanza scene interne/esterne, azione/riflessione.

Output: `bible/10-mappa-capitoli-libro-1.md`.

### 6.12 Pianificazione della saga (multi-libro)

Cosa: visione di dove vogliamo portare la saga in 2–5 libri, senza
scrivere tutto. Serve per seminare oggi elementi che germoglieranno
dopo.

Domande chiave:
- Qual è il finale teorico della saga (endgame)?
- Quali personaggi attraversano tutti i libri, quali no?
- Quali misteri/promesse apriamo nel Libro 1 da ripagare in Libro 2, 3,
  finale?
- Struttura finale: dilogia / trilogia / serie aperta?

Output: `bible/11-saga-multi-libro.md`.

### 6.13 Regole interne (canon) e limiti YA

Cosa: regole che il romanzo si dà e non può violare (es. "la comunicazione
con altre coscienze ha sempre un prezzo fisico o emotivo", "il
protagonista non ha mai una soluzione tecnica magica senza averla
guadagnata", "ogni capitolo si apre con un'immagine cosmica").

Componente YA specifica: limiti di contenuto (violenza, sessualità,
linguaggio) coerenti con la fascia di età scelta in §6.3.

Output: `bible/12-regole-interne.md`.

### 6.14 Riferimenti e ispirazioni

Cosa: elenco ragionato di romanzi, film, serie, fatti reali da cui si
attinge. Non per copiare ma per dichiarare il DNA.

Output: `bible/13-riferimenti-ispirazioni.md`.

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
- **Adeguatezza YA**: parla all'adolescente senza adultizzare o
  infantilizzare?
- **Sostenibilità del registro poetico**: la scelta regge per 70.000
  parole senza diventare stucchevole?

Se una di queste manca, lo segnala invece di approvare.

---

## 9. Cosa Claude **non** deve fare in Fase 1

- Non scrivere prosa narrativa definitiva (scene, dialoghi).
- Non scegliere al posto dell'utente quando l'utente ha una visione.
- Non "riempire il vuoto" con opzioni standard quando l'utente è
  esitante: fare domande.
- Non passare alla categoria successiva senza decisioni esplicite.
- Non trattare la Bibbia come immutabile: ogni decisione è revisionabile,
  ma il cambiamento va tracciato.

---

## 10. Stato attuale del progetto

Punti già fissati dall'utente (base di partenza):

- **Medium**: romanzo (non serie TV).
- **Target**: YA.
- **Registro**: poetico.
- **Protagonista**: Crypto Guy, 15 anni, nome vero (non nickname).
- **Inciting incident**: i genitori (Evelyn Quantum, Alan Cipher)
  scompaiono nell'esperimento quantistico narrato nella Prefazione.
- **Tesi morale embrionale**: siamo in grado di comunicare fra specie
  diverse (es. animali domestici) e di raggiungere la coscienza
  dell'Universo. → **Da raffinare in §6.1 Premessa/Tema nella forma di
  Egri.**
- **Materiale esistente**: Prefazione + inizio Cap. 1 "La Scomparsa"
  (fornito dall'autore in forma di screenshot). Da trascrivere in
  `/research/source/` come punto zero del lavoro.

Prima categoria consigliata per cominciare: **§6.1 Premessa e Tema**,
perché la tesi morale è già embrionalmente formulata e raffinarla ora
dà bussola a tutto il resto. Alternativa: **§6.3 Genere/tono/target**,
se si preferisce fissare prima il "contenitore" editoriale.

L'utente decide da dove partire.
