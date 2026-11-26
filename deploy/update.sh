#!/usr/bin/env bash
# Waffle Story — pull the latest code, rebuild, and reload with no downtime.
#   sudo bash /var/www/waffle-story/deploy/update.sh [branch]
set -euo pipefail
APP_USER="waffle"
APP_DIR="/var/www/waffle-story"
BRANCH="${1:-main}"

[[ $EUID -eq 0 ]] || { echo "Run as root: sudo bash $0"; exit 1; }

sudo -u "$APP_USER" bash -c "
  set -euo pipefail
  cd '$APP_DIR'
  git fetch --quiet origin '$BRANCH'
  git reset --hard 'origin/$BRANCH'
  npm ci --no-audit --no-fund
  NEXT_TELEMETRY_DISABLED=1 npm run build
  pm2 reload waffle-story --update-env
  pm2 save
"
echo "✓ Updated to $(sudo -u "$APP_USER" git -C "$APP_DIR" log -1 --format='%h %s')"
