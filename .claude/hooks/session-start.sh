#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
cd "$CLAUDE_PROJECT_DIR"
npm install

# Configure git to push directly to GitHub
git remote set-url origin "https://scottrileyjones:${GITHUB_PAT:-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}@github.com/scottrileyjones/hewn-life.git"
