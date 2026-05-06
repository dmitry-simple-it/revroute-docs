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
    shared/             — переиспользуемые блоки (WorldMap, BrowserMockup, …)
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

## /tools/link-shortener (server-side ключ)
`/tools/link-shortener` — публичный бесплатный сокращатель без регистрации. На клиенте он вызывает `POST /api/public/shorten`, а этот роут на сервере создаёт ссылку через API платформы RevRoute с помощью server-side API key.

Переменные окружения для `app/api/public/shorten/route.ts`:
- `REVROUTE_API_URL` (по умолчанию `https://app.revroute.ru/api`)
- `REVROUTE_SHORT_LINKER_API_KEY` (обязателен) — ключ `dub_*` (также поддерживается `REVROUTE_API_KEY`)
- `REVROUTE_WORKSPACE_ID` (опционально) — workspaceId, в котором создавать ссылки
- `REVROUTE_PUBLIC_DOMAIN` (опционально) — домен для коротких ссылок

Чтобы не “жечь” ключи пользователя и не зависеть от лимитов обычных тарифов, используйте отдельный внутренний workspace на плане `system` и отдельный API key.

### SQL: создать system workspace + API key (idempotent)
Ниже — один скрипт (транзакция). Он создаёт:
- machine user (если нет по email),
- workspace со всеми лимитами = `INFINITY_NUMBER` (1_000_000_000),
- связь user↔workspace (owner),
- restricted token `dub_*` (API key) для workspace,
- запись подписки `subscriptions` с планом `system` и датой следующего списания далеко в будущем.

Перед запуском замените значения `@system_email`, `@workspace_slug`, `@workspace_name`, `@token_plain`.

```sql
START TRANSACTION;

SET @system_email = _utf8mb4'system-link-shortener@revroute.local';
SET @workspace_slug = _utf8mb4'system-link-shortener';
SET @workspace_name = _utf8mb4'System (link-shortener)';

-- Вставьте ваш секретный токен вручную (формат должен быть dub_*)
SET @token_plain = 'dub_CHANGE_ME_24_CHARS_MIN';

SET @infinity = 1000000000;

-- Prisma-идентификаторы (cuid()) генерируются на стороне приложения, в MySQL default обычно нет.
-- Поэтому для raw SQL создаём id сами и подгоняем длину под схему таблиц.
SELECT
  COALESCE(MAX(COALESCE(CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH)), 30)
INTO @user_id_len
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND LOWER(TABLE_NAME) = 'user'
  AND LOWER(COLUMN_NAME) = 'id';

SELECT
  COALESCE(MAX(COALESCE(CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH)), 30)
INTO @workspace_id_len
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND LOWER(TABLE_NAME) = 'project'
  AND LOWER(COLUMN_NAME) = 'id';

SELECT
  COALESCE(MAX(COALESCE(CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH)), 30)
INTO @project_users_id_len
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND LOWER(TABLE_NAME) = 'projectusers'
  AND LOWER(COLUMN_NAME) = 'id';

SELECT
  COALESCE(MAX(COALESCE(CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH)), 30)
INTO @restricted_token_id_len
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND LOWER(TABLE_NAME) = 'restrictedtoken'
  AND LOWER(COLUMN_NAME) = 'id';

SELECT
  COALESCE(MAX(COALESCE(CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH)), 30)
INTO @tag_id_len
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND LOWER(TABLE_NAME) = 'tag'
  AND LOWER(COLUMN_NAME) = 'id';

SELECT
  COALESCE(MAX(COALESCE(CHARACTER_MAXIMUM_LENGTH, CHARACTER_OCTET_LENGTH)), 30)
INTO @subscription_id_len
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND LOWER(TABLE_NAME) = 'subscriptions'
  AND LOWER(COLUMN_NAME) = 'id';

SET @user_id = (
  SELECT id FROM `User` WHERE BINARY email = BINARY @system_email LIMIT 1
);

SET @user_id = IFNULL(
  @user_id,
  CONCAT(
    'user_',
    LEFT(
      REPLACE(UUID(), '-', ''),
      GREATEST(1, IFNULL(@user_id_len, 32) - 5)
    )
  )
);

INSERT INTO `User` (`id`, `name`, `email`, `isMachine`, `createdAt`)
SELECT @user_id, 'System (machine)', @system_email, TRUE, NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `User` WHERE BINARY email = BINARY @system_email
);

SET @user_id = (
  SELECT id FROM `User` WHERE BINARY email = BINARY @system_email LIMIT 1
);

SET @workspace_id = (
  SELECT id FROM `Project` WHERE BINARY slug = BINARY @workspace_slug LIMIT 1
);

SET @workspace_id = IFNULL(
  @workspace_id,
  CONCAT(
    'ws_',
    LEFT(
      REPLACE(UUID(), '-', ''),
      GREATEST(1, IFNULL(@workspace_id_len, 32) - 3)
    )
  )
);

INSERT INTO `Project` (
  `id`,
  `name`,
  `slug`,
  `plan`,
  `planTier`,
  `billingCycleStart`,
  `usageLimit`,
  `linksLimit`,
  `payoutsLimit`,
  `domainsLimit`,
  `tagsLimit`,
  `foldersLimit`,
  `groupsLimit`,
  `usersLimit`,
  `aiLimit`,
  `networkInvitesLimit`,
  `usageLastChecked`,
  `createdAt`,
  `updatedAt`
)
SELECT
  @workspace_id,
  @workspace_name,
  @workspace_slug,
  'system',
  1,
  1,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  @infinity,
  NOW(),
  NOW(),
  NOW()
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `plan` = VALUES(`plan`),
  `planTier` = VALUES(`planTier`),
  `billingCycleStart` = VALUES(`billingCycleStart`),
  `usageLimit` = VALUES(`usageLimit`),
  `linksLimit` = VALUES(`linksLimit`),
  `payoutsLimit` = VALUES(`payoutsLimit`),
  `domainsLimit` = VALUES(`domainsLimit`),
  `tagsLimit` = VALUES(`tagsLimit`),
  `foldersLimit` = VALUES(`foldersLimit`),
  `groupsLimit` = VALUES(`groupsLimit`),
  `usersLimit` = VALUES(`usersLimit`),
  `aiLimit` = VALUES(`aiLimit`),
  `networkInvitesLimit` = VALUES(`networkInvitesLimit`),
  `usageLastChecked` = VALUES(`usageLastChecked`),
  `updatedAt` = VALUES(`updatedAt`);

SET @workspace_id = (
  SELECT id FROM `Project` WHERE BINARY slug = BINARY @workspace_slug LIMIT 1
);

SET @project_user_id = CONCAT(
  'pu_',
  LEFT(
    REPLACE(UUID(), '-', ''),
    GREATEST(1, IFNULL(@project_users_id_len, 32) - 3)
  )
);

INSERT INTO `ProjectUsers` (`id`, `role`, `userId`, `projectId`, `createdAt`, `updatedAt`)
SELECT
  @project_user_id,
  'owner',
  @user_id,
  @workspace_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `ProjectUsers`
  WHERE BINARY userId = BINARY @user_id AND BINARY projectId = BINARY @workspace_id
);

SET @token_hash = LOWER(SHA2(TRIM(@token_plain), 256));
SET @token_partial = CONCAT(LEFT(@token_plain, 3), '...', RIGHT(@token_plain, 4));

SET @restricted_token_id = CONCAT(
  'rt_',
  LEFT(
    REPLACE(UUID(), '-', ''),
    GREATEST(1, IFNULL(@restricted_token_id_len, 32) - 3)
  )
);

INSERT INTO `RestrictedToken` (`id`, `name`, `hashedKey`, `partialKey`, `scopes`, `userId`, `projectId`, `createdAt`, `updatedAt`)
SELECT
  @restricted_token_id,
  'System: link-shortener',
  @token_hash,
  @token_partial,
  'apis.all',
  @user_id,
  @workspace_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `RestrictedToken` WHERE BINARY hashedKey = BINARY @token_hash
);

SET @landing_widget_tag_name = _utf8mb4'landing-widget';
SET @landing_widget_tag_id = CONCAT(
  'tag_',
  LEFT(
    REPLACE(UUID(), '-', ''),
    GREATEST(1, IFNULL(@tag_id_len, 32) - 4)
  )
);

INSERT INTO `Tag` (`id`, `name`, `color`, `projectId`, `createdAt`, `updatedAt`)
SELECT
  @landing_widget_tag_id,
  @landing_widget_tag_name,
  'blue',
  @workspace_id,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `Tag`
  WHERE BINARY projectId = BINARY @workspace_id
    AND BINARY name = BINARY @landing_widget_tag_name
);

SET @subscription_id = CONCAT(
  'sub_',
  LEFT(
    REPLACE(UUID(), '-', ''),
    LEAST(
      26,
      GREATEST(1, IFNULL(@subscription_id_len, 30) - 4)
    )
  )
);

INSERT INTO `subscriptions` (
  `id`,
  `workspaceId`,
  `planId`,
  `planTier`,
  `period`,
  `amount`,
  `currency`,
  `status`,
  `cancelAtPeriodEnd`,
  `currentPeriodStart`,
  `currentPeriodEnd`,
  `nextChargeDate`,
  `failedAttempts`,
  `createdAt`,
  `updatedAt`
)
SELECT
  @subscription_id,
  @workspace_id,
  'system',
  1,
  'yearly',
  0,
  'RUB',
  'active',
  TRUE,
  NOW(),
  DATE_ADD(NOW(), INTERVAL 100 YEAR),
  DATE_ADD(NOW(), INTERVAL 100 YEAR),
  0,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM `subscriptions` WHERE BINARY workspaceId = BINARY @workspace_id
);

COMMIT;
```

После этого:
- в `REVROUTE_SHORT_LINKER_API_KEY` ставьте `@token_plain` (или в `REVROUTE_API_KEY`)
- `REVROUTE_WORKSPACE_ID` можно не задавать, если `REVROUTE_API_KEY` — workspace API key (`dub_*` из `RestrictedToken`, привязанный к `projectId`)
