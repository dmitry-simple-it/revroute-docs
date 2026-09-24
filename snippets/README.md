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
