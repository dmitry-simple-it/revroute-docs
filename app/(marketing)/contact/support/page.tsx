import type { Metadata } from 'next'
import { CONTACT_EMAILS, CONTACT_MESSENGERS } from '@/lib/contacts'
import { IconMax, IconTelegram } from '@/components/marketing/shared/Icons'

export const metadata: Metadata = {
  title: 'Поддержка — свяжитесь с командой Revroute',
  alternates: { canonical: '/contact/support' },
  openGraph: { url: '/contact/support' },
}

export default function SupportPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-[520px] rounded-3xl border border-stone-200 bg-white p-12 text-center shadow-lg max-sm:px-6 max-sm:py-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>

        <h1 className="mb-3 font-serif text-3xl font-normal tracking-tight max-sm:text-2xl">
          Свяжитесь с нами
        </h1>

        <p className="mb-8 text-base leading-relaxed text-stone-500">
          Напишите нам, и мы поможем с любым вопросом по продукту, биллингу или
          интеграциям.
        </p>

        <a
          href={`mailto:${CONTACT_EMAILS.support}`}
          data-ym-goal="landing_lead_form_submit"
          className="inline-flex items-center gap-2.5 rounded-full bg-stone-900 px-7 py-3.5 text-[15px] font-semibold text-white transition-all hover:-translate-y-px hover:bg-stone-800 hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {CONTACT_EMAILS.support}
        </a>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={CONTACT_MESSENGERS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-[15px] font-semibold text-stone-700 transition-all hover:-translate-y-px hover:border-stone-300 hover:bg-stone-50"
          >
            <IconTelegram width={18} height={18} style={{ color: '#229ED9' }} />
            Telegram
          </a>
          <a
            href={CONTACT_MESSENGERS.max}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-5 py-3 text-[15px] font-semibold text-stone-700 transition-all hover:-translate-y-px hover:border-stone-300 hover:bg-stone-50"
          >
            <IconMax width={18} height={18} style={{ color: '#1a1a1f' }} />
            MAX
          </a>
        </div>

        <p className="mt-6 text-[13px] text-stone-400">
          Обычно отвечаем в течение нескольких часов
        </p>

        <div className="mt-8 border-t border-stone-100 pt-6 text-left">
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-stone-400">Сотрудничество и партнёрства</dt>
              <dd>
                <a
                  href={`mailto:${CONTACT_EMAILS.partners}`}
                  className="font-medium text-stone-700 underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAILS.partners}
                </a>
              </dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-stone-400">Вопросы по работе и вакансии</dt>
              <dd>
                <a
                  href={`mailto:${CONTACT_EMAILS.jobs}`}
                  className="font-medium text-stone-700 underline-offset-2 hover:underline"
                >
                  {CONTACT_EMAILS.jobs}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </main>
  )
}
