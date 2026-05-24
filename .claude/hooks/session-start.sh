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
