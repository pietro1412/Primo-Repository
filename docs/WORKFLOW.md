# WORKFLOW — sessioni successive e parallele

## Inizio sessione

1. Leggi `CLAUDE.md`, `docs/STATUS.md`, `docs/BACKLOG.md`.
2. `git fetch` e verifica il branch su cui sei.
3. Prendi UN elemento del backlog (o aggiungine uno: nuova riga con ID successivo `B-nnn`, stato `todo`). Poi, nell'ordine: (a) crea/usa il tuo branch, (b) marca la riga `doing` con il nome del branch e, se tocca lo schema Prisma, scrivilo in `STATUS.md` → "In corso" (colonna "Schema?"), (c) committa e pusha subito.

## Branch

- **Base**: il branch indicato dalla sessione; in sua assenza il branch di default del repository. ⚠️ Il default attuale su GitHub è ancora il vecchio `claude/daily-todo-webapp-…`: va sostituito con `main` (decisione del proprietario, vedi `docs/AUDIT.md`).
- **Nome**: se la sessione cloud ne assegna uno (`claude/<slug>-<id>`) usa quello e non crearne altri. Altrimenti `feature/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>` con slug in minuscolo-trattini (max 4 parole).
- **Merge**: via Pull Request, creata solo su richiesta esplicita del proprietario; chi fa il merge marca l'elemento `done` nel backlog.

## Sessioni parallele — regole anti-collisione

- Un branch per sessione/feature: `feature/<slug>` (o quello assegnato dalla sessione). Mai due sessioni sullo stesso branch.
- Non lavorare sugli stessi file di un'altra feature `doing`; se serve, dividi in passi o aspetta il merge.
- **Lock schema**: la colonna "Schema?" in `STATUS.md` → "In corso" è l'unico registro; `/new-migration` e `/plan-feature` lo controllano entrambi. Se due branch hanno già migrazioni con timestamp diversi ma sovrapposte: il secondo a fare merge rigenera la propria migrazione dopo il rebase (elimina la cartella migrazione locale non ancora in origin e rifai `prisma migrate dev`).
- **Migrazioni Prisma**: alto rischio di conflitto. Una sola feature `doing` alla volta può modificare `prisma/schema.prisma`; dichiaralo in `STATUS.md`. Dopo un merge che cambia lo schema: rebase, `npm run db:migrate`, rigenera.
- File condivisi (`CLAUDE.md`, `STATUS.md`, `BACKLOG.md`): modifiche piccole, rebase spesso, risolvi i conflitti conservando entrambe le versioni.
- Per isolare il lavoro locale usa git worktree: `git worktree add ../wt-<slug> -b feature/<slug>`; ogni worktree ha il proprio `.env` e (idealmente) un DB distinto (`DATABASE_URL` con nome DB diverso).

## Durante la sessione

- Piano prima (plan mode) per ogni feature "non banale" = tocca schema, auth, più di 3 file o una regola di dominio; i fix di una riga no; per quelle grandi copia `docs/features/_TEMPLATE.md`.
- Commit piccoli; prima di ogni commit: `npm run lint && npm run typecheck && npm test`.
- Se scopri una regola/insidia, scrivila in `CLAUDE.md` o `docs/DECISIONS.md` subito.

## Fine sessione (obbligatorio)

1. Verifiche verdi, commit e push. Se le verifiche sono rosse e non puoi sistemarle: commit `WIP:` e push comunque (mai lavoro solo locale), e scrivi il guasto in `STATUS.md` → "Insidie".
2. Aggiorna `docs/BACKLOG.md` (stato) e `docs/STATUS.md` (in corso, prossimi passi, insidie, riga di log). Comando rapido: `/handoff`.
3. Non lasciare lavoro solo in locale: il container cloud è effimero.

## Ripresa dopo un'interruzione

Leggi `STATUS.md`, `git log --oneline -15`, `git status`, la spec in `docs/features/` e riparti dal primo passo non spuntato.
