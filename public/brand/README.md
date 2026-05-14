# Revroute Brand

Единый источник правды для логотипа, иконок и брендированных материалов revroute.ru.

## Где master

- **Figma**: `Revroute Brand` (file key `LZ81AmEmu9LTAsk5ESkr3E`). Доступ — Aleksandr Marchuk + команда. Все правки начинаются здесь.
- **Локальный бэкап**: SVG-ассеты в этой папке экспортированы из Figma через MCP-коннектор Claude (2026-05-14). После любого изменения master — переэкспортируй и закоммить.
- **Подробности процесса**: [`source/figma.md`](./source/figma.md).

## Что лежит в этой папке

| Файл | Размер | Где используется |
|---|---|---|
| `wordmark-light.svg` | 220×56, viewBox 220×56 | Шапка сайта на светлом фоне |
| `wordmark-dark.svg` | то же, белый fill | Шапка/футер на тёмном фоне |
| `wordmark-light.png` / `wordmark-dark.png` | 660×168 (3×) | Где SVG не поддерживается |
| `lockup.svg` | 240×56 | Icon + wordmark вместе — для презентаций, marketing materials |
| `logo-1024.png` | 1024×1024 | Organization JSON-LD logo + регистрация в каталогах |
| `og-default.png` | 1200×630 | Дефолтный OG-image для соцсетей |
| `icons/icon-192.png` | 192×192 (maskable) | PWA manifest |
| `icons/icon-512.png` | 512×512 (maskable) | PWA manifest + Android home screen |
| `source/master.svg` | — | TODO: backup мастера из Figma |
| `source/figma.md` | — | Ссылка на master + правила синхронизации |

Иконка `app/icon.svg` (Next.js root convention) и `app/apple-icon.png` (180×180) лежат в `app/`, не здесь, по конвенции Next.js.

## Три варианта лого и когда какой

1. **Icon-only mark (`app/icon.svg`, 24×24)** — буква «R» в DM Sans Bold. Используется как favicon, app-icon, маленькие компактные применения (≤ 32px).
2. **Wordmark (`wordmark-light.svg` / `wordmark-dark.svg`)** — только текст «Revroute» в DM Sans Semi Bold. Используется в шапке сайта, подвалах email-рассылок, узких горизонтальных контейнерах.
3. **Full lockup (`lockup.svg`)** — icon + wordmark вместе. Используется в презентациях, маркетинговых материалах, OG-image, баннерах. Самый распознаваемый вариант.

## Защитная зона (clear space)

Вокруг лого должно быть свободное пространство не меньше высоты буквы «R» в wordmark. Это применимо ко всем трём вариантам — icon, wordmark, lockup.

## Минимальные размеры

| Вариант | Минимум |
|---|---|
| Icon-only mark | 16×16 px (favicon в табе) |
| Wordmark | 80px по ширине |
| Full lockup | 120px по ширине |

## Цветовая палитра

Канонический источник — `app/globals.css` (CSS-переменные). Здесь — мэппинг для справки:

| Имя | HEX | CSS-переменная | Где используется |
|---|---|---|---|
| Primary / Text | `#0c0a09` | `--accent`, `--text`, `--bg-dark` | Лого на светлом фоне, текст, акцент |
| Background | `#ffffff` | `--bg-white`, `--bg-card` | Карточки, белый фон |
| Surface | `#fafaf9` | `--bg` | Базовый фон сайта |
| Muted | `#f5f5f4` | `--bg-muted` | Приглушённый фон секций |
| Text muted | `#78716c` | `--text-muted` | Подписи, второстепенный текст |

Бренд монохромный — чёрный/белый/серые. Никаких дополнительных цветов в логотипе.

## Типографика

| Шрифт | Где | Источник |
|---|---|---|
| **DM Sans** (Semi Bold, Bold) | Wordmark, headings, body | Google Fonts, подключён в `app/layout.tsx` |
| **Instrument Serif** (Regular, Italic) | Display-акценты, headings в hero | Google Fonts, подключён в `app/layout.tsx` |

## Что нельзя

1. **Растягивать или сжимать** лого по одной оси — пропорции сохраняются всегда.
2. **Менять цвета** иконки или wordmark на нестандартные (только из палитры выше).
3. **Добавлять обводки, тени, градиенты** к лого. Бренд монохромный и плоский.
4. **Использовать на низкоконтрастном фоне** без подложки. На сером/цветном фоне — добавь rectangle background из палитры.
5. **Размещать поверх изображений** без safe area и подложки. На фото — только wordmark-dark на полупрозрачной dark подложке.

## Процесс для новых ассетов

1. **Открыть master в Figma** (ссылка в `source/figma.md`).
2. **Обновить компонент** в Figma (icon / wordmark / lockup / новый ассет).
3. **Экспортировать** изменённые ассеты:
   - SVG: `figma export` → положить в `public/brand/` или `app/`.
   - PNG: `figma export` нужного размера, либо запустить `node scripts/rasterize-brand.mjs` (для регенерации стандартных размеров из SVG через Sharp).
4. **Закоммитить** в `revroute-docs` с явным сообщением: `chore(brand): re-export X` или `feat(brand): add new asset Y`.
5. **Обновить этот README** если добавлен новый файл или изменён формат.

## Где НЕ использовать ассеты из этой папки

- **app/icon.svg** — это Next.js root convention для favicon. Хранится в `app/`, не дублируется в `public/brand/`.
- **app/apple-icon.png** — то же, конвенция Next.js, хранится в `app/`.
- **app/favicon.ico** — backwards-compat fallback для старых браузеров, хранится в `app/`.

## История

- **2026-05-14** — Bootstrap бренд-системы. Создан Figma master file, экспортированы все базовые ассеты через MCP-коннектор. Удалены legacy dub-эра ассеты (`public/logos/favicon.png`, `wordmark.svg`, `wordmark-dark.svg`).
