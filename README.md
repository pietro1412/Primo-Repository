# Daily Todo

Una web app minimalista per la gestione quotidiana dei task, con revisione giornaliera, calendario drag-and-drop e statistiche avanzate.

## Caratteristiche

### Gestione Task
- **Creazione Automatica**: i nuovi task vengono schedulati automaticamente al giorno corrente
- **Calendario Drag & Drop**: trascina i task sul calendario per schedulare o riorganizzare le tue attività
- **Vista Settimana/Mese**: passa facilmente tra visualizzazione settimanale e mensile
- **Tracciamento Date**: visualizza data di creazione, completamento e durata per ogni task

### Daily Review
- Revisione automatica dei task pending non schedulati
- Identificazione task in ritardo (overdue) da giorni precedenti
- Possibilità di riprogrammare o mantenere i task

### Statistiche e Metriche
- **Contatori in Tempo Reale**: visualizza task totali, completati e pending per settimana/mese
- **Tasso di Completamento**: percentuale di task completati nel periodo
- **Durata Media**: tempo medio di completamento dei task
- **Durata Individuale**: ogni task completato mostra quanto tempo hai impiegato

### Filtri e Visualizzazione
- Filtra per task completati
- Filtra per task pending
- Combinazione di filtri per personalizzare la vista

### Design e UX
- **Design Minimalista**: interfaccia pulita e intuitiva seguendo il principio "less is more"
- **Persistenza LocalStorage**: i tuoi task vengono salvati automaticamente nel browser
- **Responsive**: funziona perfettamente su desktop e dispositivi mobili

## Tecnologie Utilizzate

- **React 18** con TypeScript per type-safety completa
- **Vite** per build veloce e HMR
- **TailwindCSS** per styling minimalista e responsive
- **@dnd-kit** per drag and drop performante e accessibile
- **date-fns** per gestione professionale delle date

## Installazione e Avvio

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build

# Preview della build di produzione
npm run preview
```

## Come Funziona

1. **Aggiungi Task**: usa il form in alto per aggiungere nuovi task (vengono schedulati automaticamente al giorno corrente)
2. **Organizza**: trascina i task su altre date del calendario per riprogrammarli
3. **Monitora**: visualizza le statistiche settimanali/mensili e filtra per tipo di task
4. **Daily Review**: ogni giorno riceverai una revisione dei task in ritardo o non schedulati
5. **Completa**: segna i task come completati e visualizza quanto tempo ci hai messo

## Visualizzazioni

### Vista Settimana
- 7 giorni visibili con navigazione facile
- Perfetta per pianificazione a breve termine
- Mostra giorno della settimana e data

### Vista Mese
- Vista mensile completa con griglia
- Ideale per pianificazione a lungo termine
- Evidenzia il mese corrente

## Statistiche Disponibili

- **Total Tasks**: numero totale di task nel periodo
- **Completed**: task completati
- **Pending**: task ancora da fare
- **Completion Rate**: percentuale di completamento
- **Avg. Completion Time**: tempo medio di completamento

## Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── AddTask.tsx     # Form per aggiungere task
│   ├── Calendar.tsx    # Vista calendario con drag & drop e switch settimana/mese
│   ├── DailyReview.tsx # Modal revisione giornaliera
│   ├── TaskCard.tsx    # Card singolo task con date e durata
│   ├── TaskStats.tsx   # Pannello statistiche
│   └── TaskFilters.tsx # Filtri per visualizzazione task
├── hooks/              # Custom hooks
│   └── useTasks.ts     # Hook per gestione state task e logica business
├── types/              # TypeScript types
│   └── index.ts        # Definizioni tipi Task e DailyReviewState
└── utils/              # Utilities
```

## Best Practices Implementate

- Type-safety completa con TypeScript
- Component separation e single responsibility principle
- Custom hooks per logica riutilizzabile e testabile
- Accessibility con semantic HTML
- Performance optimization con React hooks
- Clean code e architettura scalabile
- Responsive design mobile-first

## Deploy

L'app è pronta per il deploy su piattaforme come:
- **Vercel**: deploy automatico con `vercel.json` già configurato
- **Netlify**: supporto completo per React SPA
- **GitHub Pages**: configurazione semplice
- **Cloudflare Pages**: deployment veloce

## Licenza

MIT
