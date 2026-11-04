#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
cd "$CLAUDE_PROJECT_DIR"
npm install

# Configure git to push directly to GitHub
# Only rewrite the remote when a token is provided via the environment (never hardcode it)
if [ -n "${GITHUB_PAT:-}" ]; then
  git remote set-url origin "https://scottrileyjones:${GITHUB_PAT}@github.com/scottrileyjones/hewn-life.git"
fi

# Alias: git deploy → push current HEAD to Vercel production branch
git config alias.deploy "push origin HEAD:claude/modest-ritchie-TS2pv --force"
