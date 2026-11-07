---
description: Cambia lo schema dati in modo sicuro (migrazione Prisma)
---

Modifica richiesta: $ARGUMENTS

1. Controlla in docs/STATUS.md che nessun'altra feature `doing` stia modificando prisma/schema.prisma; altrimenti fermati e avvisami.
2. Modifica prisma/schema.prisma, poi `npx prisma migrate dev --name <nome-descrittivo>`.
3. Aggiorna seed, services e test impattati; mostrami la migrazione SQL generata e aspetta il mio ok prima del commit.
