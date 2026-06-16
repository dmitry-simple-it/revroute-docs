#!/usr/bin/env bash
# Install / update the revroute-docs git-poll autodeploy on the prod host.
# Idempotent — safe to re-run after editing the script or units.
#
# Run ON the prod server (79.174.90.206) from the repo checkout:
#   cd /var/www/revroute-docs && sudo bash ops/install-autodeploy.sh
set -euo pipefail

REPO=/var/www/revroute-docs
BIN=/usr/local/bin/revroute-docs-autodeploy
UNIT_DIR=/etc/systemd/system

cd "$REPO"

echo "==> install run script -> $BIN"
install -m 0755 scripts/autodeploy-poll.sh "$BIN"

echo "==> install systemd units -> $UNIT_DIR"
install -m 0644 ops/revroute-docs-autodeploy.service "$UNIT_DIR/revroute-docs-autodeploy.service"
install -m 0644 ops/revroute-docs-autodeploy.timer   "$UNIT_DIR/revroute-docs-autodeploy.timer"

echo "==> reload systemd + enable timer"
systemctl daemon-reload
systemctl enable --now revroute-docs-autodeploy.timer

echo "==> done. Status:"
systemctl status revroute-docs-autodeploy.timer --no-pager | head -5 || true
echo
echo "Log: /var/log/revroute-docs-autodeploy.log"
echo "Manual one-shot deploy: systemctl start revroute-docs-autodeploy.service"
