export const UTM_FIELDS = [
  { key: 'utm_source', label: 'Источник', hint: 'Где разместите ссылку', placeholder: 'yandex, telegram, newsletter', required: true },
  { key: 'utm_medium', label: 'Канал', hint: 'Как придёт посетитель', placeholder: 'cpc, social, email', required: true },
  { key: 'utm_campaign', label: 'Кампания', hint: 'Общее название для одной кампании', placeholder: 'autumn-sale-2026', required: true },
  { key: 'utm_content', label: 'Вариант объявления', hint: 'Чтобы сравнить креативы или кнопки', placeholder: 'banner-a, footer-button', required: false },
  { key: 'utm_term', label: 'Ключевое слово', hint: 'Запрос или сегмент аудитории', placeholder: 'running-shoes или {keyword}', required: false },
] as const

export type UtmKey = (typeof UTM_FIELDS)[number]['key']
export type UtmParams = Record<UtmKey, string>

export const EMPTY_UTM: UtmParams = {
  utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', utm_term: '',
}

export const UTM_PRESETS = [
  { id: 'yandex', label: 'Яндекс.Директ', source: 'yandex', medium: 'cpc' },
  { id: 'vk', label: 'VK Реклама', source: 'vk_ads', medium: 'cpc' },
  { id: 'telegram-ads', label: 'Telegram Ads', source: 'telegram_ads', medium: 'cpc' },
  { id: 'telegram', label: 'Пост в Telegram', source: 'telegram', medium: 'messenger' },
  { id: 'email', label: 'Email', source: 'newsletter', medium: 'email' },
  { id: 'partner', label: 'Партнёр', source: 'partner', medium: 'referral' },
  { id: 'qr', label: 'QR-код', source: 'offline', medium: 'qr' },
] as const

const managedKeys = new Set<string>(UTM_FIELDS.map((field) => field.key))

export function parseDestination(input: string): { url: URL | null; error: string | null; addedHttps: boolean } {
  const value = input.trim()
  if (!value) return { url: null, error: null, addedHttps: false }
  const bareHostWithPort = /^(?:[^/?#:\s]+\.[^/?#:\s]+|localhost):\d+(?:[/?#]|$)/i.test(value)
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(value) && !bareHostWithPort
  const addedHttps = !hasScheme
  try {
    const url = new URL(hasScheme ? value : value.startsWith('//') ? `https:${value}` : `https://${value}`)
    if (!['https:', 'http:'].includes(url.protocol)) {
      return { url: null, error: 'Нужна ссылка на сайт с http:// или https://.', addedHttps: false }
    }
    if (!url.hostname.includes('.') && url.hostname !== 'localhost' && !url.hostname.startsWith('[')) {
      return { url: null, error: 'Укажите адрес сайта, например example.ru/page.', addedHttps: false }
    }
    return { url, error: null, addedHttps }
  } catch {
    return { url: null, error: 'Не удалось прочитать адрес. Проверьте домен и формат ссылки.', addedHttps: false }
  }
}

/** Read an existing tagged link into the editor; canonical keys are lowercase. */
export function readUtmParams(input: string): { params: UtmParams; found: boolean; duplicates: boolean } {
  const { url } = parseDestination(input)
  const params = { ...EMPTY_UTM }
  const seen = new Set<string>()
  let duplicates = false
  if (url) {
    for (const [name, value] of url.searchParams) {
      const key = name.toLowerCase()
      if (!managedKeys.has(key)) continue
      if (seen.has(key)) duplicates = true
      else params[key as UtmKey] = value
      seen.add(key)
    }
  }
  return { params, found: seen.size > 0, duplicates }
}

function queryKey(pair: string): string {
  try {
    return decodeURIComponent(pair.split('=', 1)[0].replace(/\+/g, ' ')).toLowerCase()
  } catch {
    return ''
  }
}

function encodeValue(value: string): string {
  // Ad platforms substitute macros such as {keyword}. Escape data, retain macros.
  return encodeURIComponent(value)
    .replace(/%7B%7B([a-z\d_.-]+)%7D%7D/gi, '{{$1}}')
    .replace(/%7B([a-z\d_.-]+)%7D/gi, '{$1}')
}

/** Replace only these five fields. Preserve other query pairs verbatim and the fragment. */
export function buildUtmUrl(input: string, params: UtmParams): string {
  const { url } = parseDestination(input)
  if (!url) return ''
  const pairs = url.search.slice(1).split('&').filter((pair) => pair && !managedKeys.has(queryKey(pair)))
  for (const { key } of UTM_FIELDS) {
    const value = params[key].trim()
    if (value) pairs.push(`${key}=${encodeValue(value)}`)
  }
  url.search = pairs.length ? `?${pairs.join('&')}` : ''
  return url.toString()
}

export function missingUtmFields(params: UtmParams): UtmKey[] {
  return UTM_FIELDS.filter((field) => field.required && !params[field.key].trim()).map((field) => field.key)
}
