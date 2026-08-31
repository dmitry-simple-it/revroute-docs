#!/usr/bin/env bash
# Git-poll autodeploy for revroute-docs (no GitHub Actions).
#
# Why poll instead of GitHub Actions: the GitHub account's Actions are
# billing-blocked — every push to main fails in ~4s, so the deploy.yml workflow
# never actually deploys. We sidestep GitHub entirely (same approach as the main
# `revroute` repo's `revroute-autodeploy`).
#
# A systemd timer runs this every ~1 min. If origin/main moved past the deployed
# HEAD, it deploys. `flock` guards against overlap (a docs build takes minutes).
#
# Витрина offers.revroute.ru снята с публикации 31.08.2026 (Caddy отдаёт 410),
# поэтому выкладки `make offers` здесь больше нет: правка offers-static/**
# сама по себе деплоить нечего, и такой push пропускается без пересборки docs.
# Любой другой путь → полный `make deploy` (build → image → up → healthcheck).
#
# Canonical run copy lives at /usr/local/bin/revroute-docs-autodeploy on prod.
# This repo copy is the source of truth — after editing, re-copy it there:
#   sudo cp scripts/autodeploy-poll.sh /usr/local/bin/revroute-docs-autodeploy
set -uo pipefail

REPO=/var/www/revroute-docs
LOG=/var/log/revroute-docs-autodeploy.log
LOCK=/tmp/revroute-docs-autodeploy.lock

log(){ echo "[$(date -u +%FT%TZ)] $*" >>"$LOG"; }

exec 9>"$LOCK"
flock -n 9 || { log "another run in progress — skip"; exit 0; }

cd "$REPO" || { log "repo $REPO missing"; exit 1; }

git fetch --quiet origin main 2>>"$LOG" || { log "git fetch failed"; exit 1; }
LOCAL=$(git rev-parse HEAD 2>/dev/null)
REMOTE=$(git rev-parse origin/main 2>/dev/null)

[ "$LOCAL" = "$REMOTE" ] && exit 0   # up to date — quiet no-op

CHANGED=$(git diff --name-only "$LOCAL" "$REMOTE" 2>/dev/null)
log "main moved ${LOCAL:0:10} -> ${REMOTE:0:10}"

# offers-static-only change → выкладывать нечего (витрина снята с публикации):
# просто подтягиваем код, чтобы HEAD не отставал, и выходим без пересборки.
if [ -n "$CHANGED" ] && ! printf '%s\n' "$CHANGED" | grep -qvE '^offers-static/'; then
  log "offers-static-only — витрина снята с публикации, деплой не нужен (git reset only)"
  git reset --hard origin/main >>"$LOG" 2>&1
  exit 0
fi

log "full deploy (docs)"
git reset --hard origin/main >>"$LOG" 2>&1
if make deploy >>"$LOG" 2>&1; then
  log "deploy OK -> $(git rev-parse --short HEAD)"
else
  log "deploy FAILED (see make output above) — docs container left on previous image"
fi
