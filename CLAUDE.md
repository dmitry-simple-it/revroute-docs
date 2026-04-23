# revroute-docs

Документация и маркетинг-лендинг Revroute. Next.js 15 (App Router) + Nextra 4 + Tailwind 4.

## Стек
- Next.js 15 (Turbopack в dev), React 19
- Nextra 4 — docs движок (`content/*/help/**/*.mdx`)
- Tailwind 4 (через `@tailwindcss/postcss`)
- Pagefind — поиск по docs (`postbuild`)
- Dub Analytics — трекинг реферальных переходов

## Деплой
GitHub Actions → self-hosted runner → pm2 (`.github/workflows/deploy.yml`). Триггер — `push` в `main`. Только через CI, не через ручное копирование.

## Язык

### Документация (`/help/**`, Nextra)
**Двуязычная**: `content/ru/` и `content/en/`. Middleware определяет локаль из cookie/Accept-Language, ставит префикс `/ru/` или `/en/`.

### Маркетинг-лендинг (`app/(marketing)/**`)
**Только русский**. Строки захардкожены по-русски прямо в компонентах — i18n-wiring для этих страниц сознательно не сделан.

Список marketing-путей — в `middleware.ts` → `MARKETING_PATHS`. Они исключены из локали-роутинга: URL всегда без префикса (`/pricing`, `/analytics`, `/for-partners`, …), контент всегда RU.

**Если добавляете новый маркетинг-путь** — добавьте его в `MARKETING_PATHS` в `middleware.ts`, иначе он будет редиректиться на `/ru/<путь>` и сломается.

**Если понадобится EN-версия лендинга** — это отдельный большой рефактор: либо дублировать компоненты в `en/` с переводами, либо вводить i18n-словари (`next-intl`/dict-файлы) для marketing-веток. Не делать инкрементально.

## Структура

```
app/
  (marketing)/          — RU-only лендинг (pricing, analytics, partners, …)
  [locale]/help/        — двуязычные docs через Nextra
components/
  marketing/
    landing/            — секции главной (Hero, FeaturesSection, …)
    shared/             — переиспользуемые блоки (WorldMap, DashboardMocks, …)
    tools/              — интерактивные инструменты (LinkInspector, UtmBuilder, …)
content/
  ru/ en/               — MDX для Nextra
  *.ts                  — данные для лендинга (blog, customers, compare, …)
scripts/
  build-world-map.mjs   — офлайн-скрипт: генерит world-map.json через dotted-map
```

## Карта мира (`WorldMap`)
Точки континентов и координаты городов предрасчитаны офлайн через `dotted-map` и лежат в `components/marketing/shared/world-map.json` (~60 KB). Сам пакет `dotted-map` в клиентский бандл не идёт — только JSON.

Обновить список городов: правите `scripts/build-world-map.mjs`, запускаете `node scripts/build-world-map.mjs`, коммитите обновлённый JSON.

## Дев
```bash
npm run dev     # → http://localhost:3000 (Turbopack)
npm run build   # prod build + pagefind indexing
npx tsc --noEmit  # type-check
```
