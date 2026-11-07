# AUDIT — 2026-11-07

Verifiche eseguite da clone pulito del branch (`npm ci` → `migrate deploy` → seed ×2 → lint, typecheck, test, build, e2e) + prove mirate + test "sessione fredda" con un agente senza contesto + controllo CI su GitHub.

## A. Scaffold

| Area                                                  | Esito                                                 | Note                                                                                      |
| ----------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Catena completa da clone pulito                       | OK                                                    | Tutto verde; CI GitHub `success` sul commit precedente ai fix                             |
| Drift schema ↔ migrazioni                             | OK                                                    | `prisma migrate diff`: nessuna differenza                                                 |
| Seed idempotente                                      | OK                                                    | Eseguito due volte                                                                        |
| Dominio puro (ESLint)                                 | OK                                                    | Import `@/lib/prisma` in `src/domain` → errore `no-restricted-imports`                    |
| Segreti nel repo                                      | OK                                                    | `.env` ignorato; nessuna chiave trovata                                                   |
| Autorizzazione                                        | OK                                                    | `/admin` e `/dashboard` protetti da proxy + `requireUser`; `listOrders` filtra per utente |
| Input server action dashboard                         | **Corretto**                                          | Mancava zod: `NaN`/negativi → 500. Ora errore gestito + test e2e                          |
| Enumerazione utenti via tempi di login                | **Corretto**                                          | Hash fittizio quando l'utente non esiste                                                  |
| `lib/env.ts` inutilizzato                             | **Corretto**                                          | Rimosso (decisione in `DECISIONS.md`)                                                     |
| `next-auth` beta con caret                            | **Corretto**                                          | Versione esatta                                                                           |
| Node non specificato                                  | **Corretto**                                          | `.nvmrc` + `engines`                                                                      |
| `npm audit` 3 high (prisma CLI → deepmerge-ts)        | Rischio accettato                                     | Solo tooling; fix = Prisma 7 → B-003                                                      |
| Rate limiting login/registrazione                     | Aperto (medio)                                        | B-004                                                                                     |
| Ruolo JWT non si aggiorna dopo una modifica del ruolo | Aperto (basso)                                        | B-004                                                                                     |
| Docker Compose                                        | Non verificabile                                      | Docker assente nell'ambiente: solo revisione statica                                      |
| e2e in CI                                             | Verificato solo localmente con Chromium preinstallato | In CI usa `playwright install`                                                            |

## B. Memoria e sessioni

Test a freddo: l'agente ha risposto correttamente su stack, comandi, posizione delle regole, chiusura sessione. Lacune trovate e correzioni:

| Lacuna                                                                                     | Correzione                                                                                                        |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Branch base/nome vaghi ("main" inesistente; default GitHub = vecchio branch)               | Sezione "Branch" in `WORKFLOW.md`; **decisione aperta per il proprietario**: impostare `main` come default        |
| Ordine "marca doing e pusha" vs creazione branch; come aggiungere elementi al backlog      | Passi (a)(b)(c) espliciti, regola per nuovi `B-nnn`                                                               |
| Lock schema in due posti diversi                                                           | Colonna "Schema?" in `STATUS.md`, controllata da `/new-migration` e `/plan-feature`                               |
| Migrazioni con timestamp sovrapposti                                                       | Procedura di rigenerazione dopo rebase                                                                            |
| `/handoff` con verifiche rosse                                                             | Commit `WIP:` + push + nota in STATUS                                                                             |
| Stato `done` / merge / PR                                                                  | Definiti in "Branch"                                                                                              |
| `AGENTS.md` non citato                                                                     | Richiamato in `CLAUDE.md`                                                                                         |
| Segnaposto in STATUS/DECISIONS; B-000 mancante                                             | Date compilate, B-000 `done`                                                                                      |
| Nome file test, struttura dominio, setup completo, `build`, criterio e2e, CI, "non banale" | Chiariti in `CLAUDE.md` / `WORKFLOW.md`                                                                           |
| Slash command visibili come skill                                                          | OK (`start`, `check`, `handoff`, `plan-feature`, `new-migration`) — mai eseguiti end-to-end in una sessione reale |

## Non fatto / proposto

- Simulazione con due worktree e conflitti reali: non eseguita; le regole sono verificate solo a livello documentale.
- `.claude/settings.json` (permessi) e hook SessionStart che stampa `STATUS.md`: proposti, non aggiunti.
