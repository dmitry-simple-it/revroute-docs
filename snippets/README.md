# snippets/

## `ru/`, `en/` — рабочие сниппеты

Кусочки MDX, которые переиспользуются несколькими страницами (`ConversionTrackingPrerequisites`,
`LeadsIntro`, `ViewConversions`…). Подключаются обычным импортом из страницы **своей локали**:

```mdx
import LeadsIntro from '../../../../../snippets/ru/leads-intro.mdx'

<LeadsIntro />
```

Локали разделены не только из-за языка: в EN нет разделов `/docs/api-reference/*` и
`/docs/sdks/client-side/*`, поэтому набор ссылок в EN и RU отличается.

Сниппет, который нужен ровно одной странице, заводить здесь не надо — пишите текст прямо
в странице.

## Файлы в корне — архив Mintlify (НЕ подключать вслепую)

Это исходные сниппеты dub.co, оставшиеся с переезда на Nextra (март 2026). Они **не
подключены ни к одной странице** и лежат здесь только как исходный текст. Писались они
про dub, а не про RevRoute, и местами прямо врут про нас:

- `dubcdn.com/analytics/script.js` вместо `app.revroute.ru/analytics/script.js`;
- cookie `dub_id` и глобаль `dubAnalytics` вместо `rr_id` и `revRouteAnalytics`;
- npm-пакеты `@dub/analytics`, `@dub/react-native` — под `@revroute` их не существует
  (опубликованы только `@revroute/embed-core` и `@revroute/embed-react`);
- ссылки на `/docs/sdks/client-side/installation-guides/{react,framer,shopify,…}` — таких
  страниц у нас нет;
- ссылки на `github.com/dubinc/examples` — чужой репозиторий;
- скриншоты и диаграммы с интерфейсом dub, ценами в долларах и `dub_id`.

Прежде чем брать отсюда текст, сверьте факты с прод-скриптом
(`https://app.revroute.ru/analytics/script.js`), схемами в `apps/web/lib/zod/schemas/`
и живыми URL приложения. Разбор — в спеке
`docs/superpowers/specs/2026-09-09-docs-snippets-restore.md` мета-репозитория.
