#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
repo_name="${1:-selsabil-delivery}"
command -v git >/dev/null || { echo 'Install Git first.' >&2; exit 1; }
command -v gh >/dev/null || { echo 'Install GitHub CLI: https://cli.github.com/' >&2; exit 1; }
gh auth status
if [[ ! -d .git ]]; then git init -b main; fi
git add -A
if [[ -n "$(git status --porcelain)" ]]; then
  git commit -m "Initial Selsabil Delivery demo and Pages deployment"
fi
gh repo create "$repo_name" --public --source=. --remote=origin --push
printf '%s\n' 'Enable GitHub Pages: Settings > Pages > Source: GitHub Actions.'
