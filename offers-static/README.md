# offers-static — зеркало витрины `offers.revroute.ru`

Версионируемая копия статического сайта **offers.revroute.ru** — «витрины офферов для партнёров».
До этого исходники жили **только на проде**, без git. Папка добавлена, чтобы отслеживать изменения.

> ⚠️ Это **НЕ часть Next-сборки** `revroute-docs`. Папка лежит вне `app/` и в продакшн-бандл не попадает —
> хранится исключительно для версионирования. Деплой витрины происходит **отдельно** (см. ниже).

## Где живёт на проде

- Сервер: `79.174.90.206` (SSH host `revroute_ru`)
- Каталог: `/var/www/revroute-offers/`
- Отдаётся **Caddy** напрямую как статика (`file_server`), без Docker/Next:
  ```
  @offers host offers.revroute.ru
  handle @offers {
      root * /var/www/revroute-offers
      header X-Robots-Tag "noindex, nofollow"
      file_server
  }
  ```
- Индексация закрыта намеренно: `robots.txt` (`Disallow: /`) + `X-Robots-Tag: noindex, nofollow` + `<meta robots>`.

## Состав

| Файл | Назначение |
|------|-----------|
| `index.html` | Единственная HTML-страница (SPA-подобная, рендер через `app.js`) |
| `app.js` | Логика витрины |
| `offers-data.js` | Данные офферов (~1.1 МБ) |
| `styles.css` | Стили |
| `assets/` | Картинки (placeholder и пр.) |
| `robots.txt` | `User-agent: * / Disallow: /` |

## Как обновить зеркало (стянуть текущий прод в репо)

```bash
cd revroute-docs
ssh revroute_ru 'cd /var/www/revroute-offers && tar czf - --exclude="*.bak-*" .' \
  | tar xzf - -C offers-static
```

## Как задеплоить изменения ОБРАТНО на прод

Автодеплоя у витрины нет (файлы заливались вручную). Чтобы выкатить правки из этой папки:

```bash
cd revroute-docs/offers-static
tar czf - --exclude=README.md . | ssh revroute_ru 'tar xzf - -C /var/www/revroute-offers'
```

## TODO / заметки

- **Яндекс.Метрика** (счётчик `108559142`) — на момент создания зеркала **ещё не вставлена** в `index.html`.
  После вставки на прод не забыть обновить это зеркало (см. «Как обновить зеркало»).
  В интерфейсе Метрики домен `offers.revroute.ru` нужно добавить в список доменов счётчика.
