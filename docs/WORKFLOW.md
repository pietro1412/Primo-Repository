# WORKFLOW — sessioni successive e parallele

## Inizio sessione

1. Leggi `CLAUDE.md`, `docs/STATUS.md`, `docs/BACKLOG.md`.
2. `git fetch` e verifica il branch; parti da `main`/default aggiornato salvo diversa indicazione.
3. Prendi UN elemento del backlog, marcalo `doing` con il tuo branch, committa e pusha subito questa riga.

## Sessioni parallele — regole anti-collisione

- Un branch per sessione/feature: `feature/<slug>` (o quello assegnato dalla sessione). Mai due sessioni sullo stesso branch.
- Non lavorare sugli stessi file di un'altra feature `doing`; se serve, dividi in passi o aspetta il merge.
- **Migrazioni Prisma**: alto rischio di conflitto. Una sola feature `doing` alla volta può modificare `prisma/schema.prisma`; dichiaralo in `STATUS.md`. Dopo un merge che cambia lo schema: rebase, `npm run db:migrate`, rigenera.
- File condivisi (`CLAUDE.md`, `STATUS.md`, `BACKLOG.md`): modifiche piccole, rebase spesso, risolvi i conflitti conservando entrambe le versioni.
- Per isolare il lavoro locale usa git worktree: `git worktree add ../wt-<slug> -b feature/<slug>`; ogni worktree ha il proprio `.env` e (idealmente) un DB distinto (`DATABASE_URL` con nome DB diverso).

## Durante la sessione

- Piano prima (plan mode) per feature non banali; per quelle grandi copia `docs/features/_TEMPLATE.md`.
- Commit piccoli; prima di ogni commit: `npm run lint && npm run typecheck && npm test`.
- Se scopri una regola/insidia, scrivila in `CLAUDE.md` o `docs/DECISIONS.md` subito.

## Fine sessione (obbligatorio)

1. Verifiche verdi, commit e push.
2. Aggiorna `docs/BACKLOG.md` (stato) e `docs/STATUS.md` (in corso, prossimi passi, insidie, riga di log). Comando rapido: `/handoff`.
3. Non lasciare lavoro solo in locale: il container cloud è effimero.

## Ripresa dopo un'interruzione

Leggi `STATUS.md`, `git log --oneline -15`, `git status`, la spec in `docs/features/` e riparti dal primo passo non spuntato.
