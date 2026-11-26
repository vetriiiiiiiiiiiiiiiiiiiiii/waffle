# Deploying Waffle Story to a VPS

The setup: **Node 22 + PM2 + Nginx + Let's Encrypt** on Ubuntu 22.04/24.04 or Debian 12. Next.js runs under PM2 on `127.0.0.1:3000`, which restarts it on crash and on reboot. Nginx serves it to the world on ports 80/443 and caches the static assets.

```
browser ──https──▶ Nginx :443 ──▶ Next.js (PM2, 127.0.0.1:3000)
```

## Before you start

1. **A VPS** running Ubuntu or Debian, with SSH access as root (or a user with `sudo`). 1 GB of RAM is enough; the script adds swap for the build.
2. **Your domain's DNS:** add an `A` record for `yourdomain.com` pointing at the VPS's IP address. Add another for `www` if you want it. If DNS hasn't updated yet, the script still deploys over HTTP and tells you the one command to run for HTTPS later.
3. **Ports 80 and 443 open** in your VPS provider's firewall or security group.

## First deploy (one time)

SSH into the server:

```bash
ssh root@YOUR_SERVER_IP
```

Download the setup script and run it with your domain and an email address (Let's Encrypt uses the email for certificate expiry notices). By passing `--agree-tos` the script accepts the [Let's Encrypt terms](https://letsencrypt.org/repository/) on your behalf:

```bash
curl -fsSLO https://raw.githubusercontent.com/vetriiiiiiiiiiiiiiiiiiiiii/waffle/main/deploy/setup.sh
```

```bash
sudo bash setup.sh yourdomain.com you@example.com
```

The script takes about 5–10 minutes. It installs everything, builds the site into `/var/www/waffle-story`, starts it as the `waffle` user and turns on HTTPS. When it finishes, open `https://yourdomain.com`.

> **Private repo?** The script clones over HTTPS, which only works without a login for a public repo. For a private one, add a [deploy key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys) to the `waffle` user and pass the SSH URL as the third argument: `git@github.com:vetriiiiiiiiiiiiiiiiiiiiii/waffle.git`.

## Updating after you push changes

```bash
sudo bash /var/www/waffle-story/deploy/update.sh
```

It pulls `main`, reinstalls, rebuilds and reloads PM2. Requests made while the build is running may briefly error.

## Day-to-day commands

| What | Command |
| --- | --- |
| Is it running? | `sudo -u waffle pm2 status` |
| Live logs | `sudo -u waffle pm2 logs waffle-story` |
| Restart | `sudo -u waffle pm2 restart waffle-story` |
| Nginx config check / reload | `sudo nginx -t && sudo systemctl reload nginx` |
| HTTPS later (after DNS is ready) | `sudo certbot --nginx -d yourdomain.com --redirect -m you@example.com --agree-tos -n` |
| Certificate renewal test | `sudo certbot renew --dry-run` (renewal itself is automatic) |

## Files

| File | Purpose |
| --- | --- |
| `deploy/setup.sh` | First-time install and deploy. Safe to re-run. |
| `deploy/update.sh` | Pull, build, reload. |
| `deploy/ecosystem.config.cjs` | PM2 process definition (port 3000, localhost only, restarts if memory goes over 600 MB). |
| `deploy/nginx.conf.template` | Nginx site: proxy, gzip, long cache for `/_next/static`, one week for `/art` and `/textures`, 10 MB upload limit. |
| `/var/www/waffle-story/.env.production` | Written by the setup script: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`, used for Open Graph and schema.org URLs. |

## Notes

- **Firewall:** the script doesn't change `ufw`. If you use it, allow SSH *before* enabling it, or you can lock yourself out: `sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw enable`.
- **Demo backend:** the Storybook, code redemption (`/api/redeem`), uploads and orders are still demo-only (see the README's "Before launch" list). The deployed site behaves the same as it does locally.
