import { z } from 'zod'

/** These values describe a request, never an entitlement or a billing action. */
export const STARTUP_ROUTES = {
  direct: 'Самостоятельно',
  partner: 'Через организацию',
  invitation: 'Особые условия',
  organization: 'Для организаций',
} as const

export type StartupRoute = keyof typeof STARTUP_ROUTES

export const STARTUP_OPTIONS = {
  age: { under1: 'Меньше года', '1to2': '1–2 года', '3to4': '3–4 года', '5plus': '5 лет и больше' },
  team: { solo: 'Только основатель', '2to9': '2–9 человек', '10to29': '10–29 человек', '30plus': '30 человек и больше' },
  readiness: { month: 'В ближайшие 30 дней', later: 'Позже', help: 'Помогите с оценкой' },
  eligibility: {
    yes: 'Да, всем условиям',
    discuss: 'Есть исключение',
  },
  format: { participants: 'Условия для участников', nominations: 'Особые условия', both: 'Оба формата' },
} as const

const text = (max: number) => z.string().trim().min(1).max(max)
const website = text(200).refine((value) => {
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !!url.hostname && !url.username && !url.password
  } catch { return false }
}, 'Укажите публичный адрес сайта с https://')

const qualification = {
  product: text(300),
  age: z.enum(['under1', '1to2', '3to4', '5plus']),
  team: z.enum(['solo', '2to9', '10to29', '30plus']),
  readiness: z.enum(['month', 'later', 'help']),
  eligibility: z.enum(['yes', 'discuss']),
  launchPlan: text(450),
}

const startupSchema = z.discriminatedUnion('route', [
  z.object({ route: z.literal('direct'), ...qualification }),
  z.object({ route: z.literal('partner'), ...qualification, organization: text(150), evidence: text(250) }),
  z.object({ route: z.literal('invitation'), organization: text(150), evidence: text(350) }),
  z.object({ route: z.literal('organization'), audience: text(450), format: z.enum(['participants', 'nominations', 'both']) }),
])

export const startupLeadSchema = z.object({
  name: text(120),
  company: text(200),
  contact: text(200).email(),
  site: website,
  startup: startupSchema,
})

export type StartupApplication = z.infer<typeof startupSchema>

/** Bounded plain text: even at field limits the Telegram message fits in 4096 characters. */
export function formatStartupApplication(site: string, application: StartupApplication): string {
  const lines = [`Маршрут: ${STARTUP_ROUTES[application.route]}`, `Сайт: ${site}`]
  if (application.route === 'direct' || application.route === 'partner') {
    lines.push(
      `Продукт и покупатель: ${application.product}`,
      `Возраст проекта: ${STARTUP_OPTIONS.age[application.age]}`,
      `Команда: ${STARTUP_OPTIONS.team[application.team]}`,
      `Соответствие условиям программы: ${STARTUP_OPTIONS.eligibility[application.eligibility]}`,
      `Готовность: ${STARTUP_OPTIONS.readiness[application.readiness]}`,
      `План запуска: ${application.launchPlan}`,
    )
  }
  if (application.route === 'partner' || application.route === 'invitation') {
    lines.push(`Организация / инициатор: ${application.organization}`, `Основание: ${application.evidence}`)
  }
  if (application.route === 'organization') {
    lines.push(`Формат: ${STARTUP_OPTIONS.format[application.format]}`, `Участники и набор: ${application.audience}`)
  }
  lines.push('Требуется ручное рассмотрение. Специальные условия не подключены.')
  return lines.join('\n')
}
