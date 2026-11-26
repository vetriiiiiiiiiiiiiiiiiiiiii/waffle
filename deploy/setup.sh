#!/usr/bin/env bash
# Waffle Story — first-time VPS setup (Ubuntu 22.04/24.04 or Debian 12).
#
#   sudo bash setup.sh <domain> <email-for-ssl> [repo-url] [branch]
#
# Installs Node 22, PM2, Nginx and Certbot, clones and builds the site,
# runs it under PM2 as user "waffle", puts Nginx in front and gets HTTPS.
# Safe to re-run: every step checks what is already there.
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"
REPO="${3:-https://github.com/vetriiiiiiiiiiiiiiiiiiiiii/waffle.git}"
BRANCH="${4:-main}"
APP_USER="waffle"
APP_DIR="/var/www/waffle-story"
SITE="waffle-story"

say() { printf '\n\033[1;35m▸ %s\033[0m\n' "$*"; }
die() { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || die "Run as root: sudo bash setup.sh <domain> <email>"
[[ -n "$DOMAIN" && -n "$EMAIL" ]] || die "Usage: sudo bash setup.sh <domain> <email-for-ssl> [repo-url] [branch]"
command -v apt-get >/dev/null || die "This script expects Ubuntu or Debian (apt)."
DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%%/*}"

say "Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git ca-certificates gnupg nginx certbot python3-certbot-nginx dnsutils

say "Node.js 22"
NODE_MAJOR=$(node -v 2>/dev/null | sed 's/^v\([0-9]*\).*/\1/' || echo 0)
if [[ "${NODE_MAJOR:-0}" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v

say "PM2"
command -v pm2 >/dev/null || npm install -g pm2

# next build needs ~1.5 GB of memory; small VPSes get a swap file so it doesn't get killed
MEM_MB=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
if [[ $MEM_MB -lt 2000 && -z "$(swapon --show)" ]]; then
  say "Adding a 2 GB swap file (this server has ${MEM_MB} MB RAM)"
  fallocate -l 2G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

say "App user and code"
id "$APP_USER" >/dev/null 2>&1 || useradd --create-home --shell /bin/bash "$APP_USER"
mkdir -p "$(dirname "$APP_DIR")"
if [[ -d "$APP_DIR/.git" ]]; then
  sudo -u "$APP_USER" git -C "$APP_DIR" fetch --quiet origin "$BRANCH"
  sudo -u "$APP_USER" git -C "$APP_DIR" reset --hard "origin/$BRANCH"
else
  mkdir -p "$APP_DIR" && chown "$APP_USER:$APP_USER" "$APP_DIR"
  sudo -u "$APP_USER" git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
fi

say "Environment"
cat > "$APP_DIR/.env.production" <<ENV
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
ENV
chown "$APP_USER:$APP_USER" "$APP_DIR/.env.production"

say "Install and build (a few minutes)"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && npm ci --no-audit --no-fund && NEXT_TELEMETRY_DISABLED=1 npm run build"

say "Start with PM2 (restarts on crash and on reboot)"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && pm2 startOrReload deploy/ecosystem.config.cjs --update-env && pm2 save"
pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER" >/dev/null
systemctl enable "pm2-$APP_USER" >/dev/null 2>&1 || true

say "Waiting for the app on 127.0.0.1:3000"
for i in $(seq 1 30); do
  curl -fsS -o /dev/null http://127.0.0.1:3000/ && break
  sleep 1
  [[ $i -eq 30 ]] && die "The app didn't start. Check: sudo -u $APP_USER pm2 logs waffle-story"
done

say "Nginx"
sed "s/__DOMAIN__/$DOMAIN/g" "$APP_DIR/deploy/nginx.conf.template" > "/etc/nginx/sites-available/$SITE"
# only answer for www if it actually has DNS
if [[ -z "$(dig +short "www.$DOMAIN" A)" ]]; then
  sed -i "s/ www\.$DOMAIN//" "/etc/nginx/sites-available/$SITE"
fi
ln -sf "/etc/nginx/sites-available/$SITE" "/etc/nginx/sites-enabled/$SITE"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

say "HTTPS (Let's Encrypt)"
SERVER_IP=$(curl -fsS4 https://api.ipify.org || true)
DOMAIN_IP=$(dig +short "$DOMAIN" A | tail -n1)
if [[ -n "$SERVER_IP" && "$DOMAIN_IP" != "$SERVER_IP" ]]; then
  echo "  $DOMAIN points to '${DOMAIN_IP:-nothing}', but this server is $SERVER_IP."
  echo "  Point the DNS A record at $SERVER_IP, wait for it to update, then run:"
  echo "  sudo certbot --nginx -d $DOMAIN --redirect -m $EMAIL --agree-tos -n"
else
  DOMAINS=(-d "$DOMAIN")
  [[ -n "$(dig +short "www.$DOMAIN" A)" ]] && DOMAINS+=(-d "www.$DOMAIN")
  certbot --nginx "${DOMAINS[@]}" --redirect -m "$EMAIL" --agree-tos -n
fi

say "Done. Waffle Story is live at https://$DOMAIN"
echo "  Update later with: sudo bash $APP_DIR/deploy/update.sh"
