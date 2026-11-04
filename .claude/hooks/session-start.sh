#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
cd "$CLAUDE_PROJECT_DIR"
npm install

# Alias: git deploy → push current HEAD to Vercel production branch
git config alias.deploy "push origin HEAD:claude/modest-ritchie-TS2pv --force"
