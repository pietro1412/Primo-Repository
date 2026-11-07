---
description: Esegue tutte le verifiche di qualità
---

Esegui `npm run lint && npm run typecheck && npm test`. Se la modifica tocca un flusso utente esegui anche `npm run test:e2e` (usa PW_CHROMIUM_PATH se serve). Riporta fedelmente i risultati; se qualcosa fallisce, indaga la causa e correggi senza saltare o disabilitare test.
