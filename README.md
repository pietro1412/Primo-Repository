# Daily Todo

Una web app minimalista per la gestione quotidiana dei task, con revisione giornaliera e calendario drag-and-drop.

## Caratteristiche

- **Daily Review**: ogni giorno viene mostrata una revisione dei task pending non schedulati, permettendo di pianificarli per oggi o per giorni futuri
- **Calendario Drag & Drop**: trascina i task sul calendario per schedulare facilmente le tue attività
- **Design Minimalista**: interfaccia pulita e intuitiva seguendo il principio "less is more"
- **Persistenza LocalStorage**: i tuoi task vengono salvati automaticamente nel browser
- **Responsive**: funziona su desktop e dispositivi mobili

## Tecnologie Utilizzate

- **React 18** con TypeScript per type-safety
- **Vite** per build veloce e HMR
- **TailwindCSS** per styling minimalista
- **@dnd-kit** per drag and drop performante
- **date-fns** per gestione delle date

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

1. **Aggiungi Task**: usa il form in alto per aggiungere nuovi task
2. **Daily Review**: ogni giorno all'apertura dell'app, riceverai una revisione dei task pending per decidere se schedulare oggi o in futuro
3. **Drag & Drop**: trascina i task dalle sezioni "Unscheduled" alle celle del calendario per schedulare
4. **Gestione Task**: completa o elimina i task direttamente dalle card

## Struttura del Progetto

```
src/
├── components/         # Componenti React
│   ├── AddTask.tsx    # Form per aggiungere task
│   ├── Calendar.tsx   # Vista calendario con drag & drop
│   ├── DailyReview.tsx # Modal revisione giornaliera
│   └── TaskCard.tsx   # Card singolo task
├── hooks/             # Custom hooks
│   └── useTasks.ts    # Hook per gestione state task
├── types/             # TypeScript types
│   └── index.ts       # Definizioni tipi Task e DailyReviewState
└── utils/             # Utilities
```

## Best Practices Implementate

- Type-safety completa con TypeScript
- Component separation e single responsibility
- Custom hooks per logica riutilizzabile
- Accessibility con semantic HTML
- Performance optimization con React hooks
- Clean code e commenti dove necessario
