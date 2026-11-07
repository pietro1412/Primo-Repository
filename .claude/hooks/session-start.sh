#!/bin/bash
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}"

# Contesto per ogni sessione: lo stato di consegna (stdout finisce nel contesto di Claude)
if [ -f docs/STATUS.md ]; then
  echo "=== docs/STATUS.md (leggi anche docs/BACKLOG.md e docs/WORKFLOW.md) ==="
  cat docs/STATUS.md
fi

# Installazione dipendenze solo negli ambienti cloud
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Variabili minime per lint/test/build (solo se .env manca; mai segreti reali)
if [ ! -f .env ] && [ -f .env.example ]; then
  cp .env.example .env
  sed -i 's/^AUTH_SECRET=.*/AUTH_SECRET="cloud-dev-secret-0123456789abcdef"/' .env
fi

# Installa solo se manifest/lockfile/script sono cambiati dall'ultima installazione riuscita
hashes=node_modules/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  npm install --no-audit --no-fund >&2
  sha256sum .claude/hooks/session-start.sh package.json package-lock.json prisma/schema.prisma 2>/dev/null > "$hashes" || rm -f "$hashes"
fi
