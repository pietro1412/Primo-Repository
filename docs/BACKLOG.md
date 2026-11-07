# BACKLOG

Una riga per elemento. Stati: `todo` · `doing` · `done`. Per aggiungere un elemento: nuova riga con il successivo ID `B-nnn`, stato `todo`. Chi inizia un elemento lo marca `doing` con il proprio branch PRIMA di lavorare (evita collisioni tra sessioni parallele).

| ID    | Elemento                                                           | Stato | Branch                           | Spec                            |
| ----- | ------------------------------------------------------------------ | ----- | -------------------------------- | ------------------------------- |
| B-000 | Scaffold (Next.js, Prisma, auth+ruoli, CI, e2e, docs per sessioni) | done  | claude/repository-cleanup-gpoeot | docs/AUDIT.md                   |
| B-001 | Definire prodotto e dominio reali                                  | todo  |                                  | docs/PRODUCT.md, docs/DOMAIN.md |
| B-002 | Rimuovere esempio Order e sostituire con entità reali              | todo  |                                  |                                 |
| B-003 | Migrare a Prisma 7 (risolve advisory npm audit)                    | todo  |                                  |                                 |
| B-004 | Rate limiting su login/registrazione; invalidazione ruolo JWT      | todo  |                                  |                                 |
