#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install npm dependencies
cd "$CLAUDE_PROJECT_DIR"
npm install

# Configure git to push directly to GitHub
git remote set-url origin "https://scottrileyjones:${GITHUB_PAT}@github.com/scottrileyjones/hewn-life.git"
