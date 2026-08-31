# ops — деплой revroute-docs

## Автодеплой (git-poll, без GitHub Actions)

GitHub Actions у аккаунта **заблокированы биллингом** — `deploy.yml` падал на каждом
push за ~4 секунды и ничего не выкатывал. Деплой переведён на **git-poll** через
systemd-таймер (тот же приём, что у основного репо `revroute` → `revroute-autodeploy`).

### Как работает

`revroute-docs-autodeploy.timer` раз в ~1 мин запускает
`/usr/local/bin/revroute-docs-autodeploy` (исходник — [`scripts/autodeploy-poll.sh`](../scripts/autodeploy-poll.sh)):

1. `git fetch origin main`; если `origin/main` == текущий HEAD → тихий no-op.
2. Если изменился **только** `offers-static/**` → `git reset --hard` и выход:
   витрина **offers.revroute.ru** снята с публикации 31.08.2026 (Caddy отдаёт `410 Gone`),
   выкладывать нечего.
3. Иначе → `make deploy`: `build` → `image` → `up` → healthcheck `:3335`.

`flock` не даёт двум деплоям пересечься. Лог: `/var/log/revroute-docs-autodeploy.log`.

### Что куда деплоится

| Источник в репо | Назначение на проде | Чем отдаётся |
|-----------------|---------------------|--------------|
| Next-приложение docs | Docker `revroute-docs` (`:3335`) | Caddy → `docs.revroute.ru` |
| `offers-static/` | `/var/www/revroute-offers/` | снято с публикации 31.08.2026 — Caddy отдаёт `410 Gone`; выкладка только вручную через `make offers` |

### Установка / обновление (на проде)

```bash
cd /var/www/revroute-docs && sudo bash ops/install-autodeploy.sh
```

Идемпотентно: ставит run-скрипт в `/usr/local/bin`, юниты в `/etc/systemd/system`,
делает `daemon-reload` и `enable --now` таймера.

### Ручные команды

```bash
# немедленный деплой (не дожидаясь таймера)
systemctl start revroute-docs-autodeploy.service

# или напрямую на сервере из чекаута
cd /var/www/revroute-docs && make deploy      # docs
cd /var/www/revroute-docs && make offers      # только витрину offers (снята с публикации — файлы синкнутся, но Caddy отдаёт 410)

# логи
tail -f /var/log/revroute-docs-autodeploy.log
systemctl list-timers revroute-docs-autodeploy.timer
```

### Порядок выкатки

Коммит → push в `main` → таймер в течение ~1 мин подхватит новый SHA и задеплоит.
Срочно — `systemctl start revroute-docs-autodeploy.service` на сервере.
