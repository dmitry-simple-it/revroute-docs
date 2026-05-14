# Figma source — Revroute Brand

## Master file

**Figma URL:** https://www.figma.com/design/LZ81AmEmu9LTAsk5ESkr3E

**File key:** `LZ81AmEmu9LTAsk5ESkr3E`
**Team:** Aleksandr Marchuk's team
**Created:** 2026-05-14 (Claude через Figma MCP коннектор)

## Содержимое мастера

Все бренд-элементы лежат на странице `Brand System`. Node IDs ключевых компонентов:

| Компонент | Node ID | Размер |
|---|---|---|
| `wordmark-light` | `1:4` | 220×56, viewBox |
| `wordmark-dark` | `1:6` | 220×56, viewBox |
| `icon-24-light` | `1:8` | 24×24, для SVG export |
| `icon-24-dark` | `1:10` | 24×24, для SVG export |
| `lockup-light` | `1:12` | 240×56 |
| `lockup-dark` | `1:15` | 240×56 |
| `apple-icon-180` | `1:18` | 180×180 |
| `icon-192` | `1:20` | 192×192, dark bg + white R |
| `icon-512` | `1:22` | 512×512, dark bg + white R (использовался растеризацией из SVG) |
| `logo-1024` | `1:24` | 1024×1024, white bg + dark R |
| `og-default-1200x630` | `1:26` | 1200×630 |

## Шрифт

DM Sans (Google Fonts) — то же семейство, что в `app/layout.tsx`. В Figma подгружается автоматически. Fallback на Inter, если DM Sans недоступен.

## Процесс синхронизации

После изменения мастера в Figma:

### Вариант A — через Claude (Figma MCP)

Запросить:
> Перегенерируй бренд-ассеты из Figma `LZ81AmEmu9LTAsk5ESkr3E` — нода X изменилась.

Claude через MCP:
1. Экспортирует SVG напрямую через Figma plugin API.
2. Экспортирует PNG через `get_screenshot` нужного размера.
3. Запустит `node scripts/rasterize-brand.mjs` для PNG, которые генерируются из SVG.
4. Обновит `public/brand/` и `app/`.
5. Закоммитит.

### Вариант B — вручную

1. Открыть мастер в Figma.
2. Selected frame → **Export** → выбрать формат и размер.
3. Положить файл в правильное место (`public/brand/` или `app/`):
   - `icon-24-light` → SVG → `app/icon.svg`
   - `apple-icon-180` → PNG 180×180 → `app/apple-icon.png`
   - `wordmark-light` → SVG → `public/brand/wordmark-light.svg`
   - `wordmark-dark` → SVG → `public/brand/wordmark-dark.svg`
   - `lockup-light` → SVG → `public/brand/lockup.svg`
   - `icon-192` → PNG 192×192 → `public/brand/icons/icon-192.png`
   - `icon-512` → PNG 512×512 → `public/brand/icons/icon-512.png`
   - `logo-1024` → PNG 1024×1024 → `public/brand/logo-1024.png`
   - `og-default-1200x630` → PNG 1200×630 → `public/brand/og-default.png`
4. Закоммитить с сообщением `chore(brand): re-export from Figma`.

### Регенерация PNG из SVG (без Figma)

Если изменения только в цветах/композиции — можно регенерировать PNG локально из существующих SVG:

```bash
cd revroute-docs
node scripts/rasterize-brand.mjs
```

Скрипт пересоберёт:
- `public/brand/icons/icon-512.png` (из `app/icon.svg` + dark background)
- `public/brand/logo-1024.png` (из `app/icon.svg` + white background)
- `public/brand/wordmark-light.png`, `wordmark-dark.png` (из SVG @3×)
- `public/brand/og-default.png` (композитная сборка)

Не пересобирает: `icon-192.png` и `apple-icon.png` — их экспортирует Figma напрямую с правильной safe area для maskable.

## Ограничения текущей реализации

1. **Стартер-план Figma MCP** ограничивает число tool calls. Если хитнули лимит — `scripts/rasterize-brand.mjs` закрывает большинство случаев через локальный Sharp.
2. **OG-image шрифт** в `rasterize-brand.mjs` использует системный sans-serif (fallback из DM Sans). Точное матчинг возможно только если экспортировать готовый PNG из Figma.
3. **Maskable icons (192/512)** — должны иметь safe area ~10% по краям. Текущие версии экспортированы из Figma frames с этой safe area; при ручной правке master — следить за этим.
