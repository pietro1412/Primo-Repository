# BACKLOG

Una riga per elemento. Stati: `todo` · `doing` · `done`. Per aggiungere un elemento: nuova riga con il successivo ID `B-nnn`, stato `todo`. Chi inizia un elemento lo marca `doing` con il proprio branch PRIMA di lavorare (evita collisioni tra sessioni parallele).

| ID    | Elemento                                                           | Stato | Branch                           | Spec                            |
| ----- | ------------------------------------------------------------------ | ----- | -------------------------------- | ------------------------------- |
| B-000 | Scaffold (Next.js, Prisma, auth+ruoli, CI, e2e, docs per sessioni) | done  | claude/repository-cleanup-gpoeot | docs/AUDIT.md                   |
| B-001 | Definire prodotto e dominio reali                                  | done  | claude/repository-cleanup-gpoeot | docs/PRODUCT.md, docs/DOMAIN.md |
| B-002 | Rimuovere esempio Order e sostituire con entità reali              | doing | claude/repository-cleanup-gpoeot | (parte di B-010)                |
| B-003 | Migrare a Prisma 7 (risolve advisory npm audit)                    | todo  |                                  |                                 |
| B-004 | Rate limiting su login/registrazione; invalidazione ruolo JWT      | todo  |                                  |                                 |
| B-010 | Libreria: categorie, mantra, catalogo admin                        | doing | claude/repository-cleanup-gpoeot | PRODUCT §1, DOMAIN R1,R7-R9     |
| B-011 | Player a voce + conteggi riproduzioni                              | todo  |                                  | PRODUCT §2-3, DOMAIN R2-R6      |
| B-012 | Orari + notifiche push (scelta scheduler)                          | todo  |                                  | PRODUCT §4, DOMAIN R10          |
| B-013 | Statistiche                                                        | todo  |                                  | PRODUCT §5                      |
| B-014 | Voce TTS cloud con cache                                           | todo  |                                  | PRODUCT §6                      |
