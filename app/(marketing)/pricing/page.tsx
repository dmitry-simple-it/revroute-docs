import type { Metadata } from 'next'
import { PricingTabs } from '@/components/marketing/pricing/PricingTabs'
import PricingFAQ from '@/components/marketing/pricing/PricingFAQ'
import PricingTestimonial from '@/components/marketing/pricing/PricingTestimonial'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { breadcrumbs, faqPage, product } from '@/lib/seo/schemas'

export const metadata: Metadata = {
  title: 'Тарифы — прозрачное ценообразование Revroute',
  description:
    'Гибкие тарифы для партнёрских и реферальных программ Revroute. Прозрачное ценообразование без скрытых платежей.',
  alternates: { canonical: '/pricing' },
  openGraph: { url: '/pricing', images: ['/brand/og-default.png'] },
}

const pricingFaq = [
  {
    q: 'Какой тариф Revroute мне подходит?',
    a: 'Если вы только запускаете партнёрскую программу — начните с тарифа Business. Для команд с высокими объёмами трафика и потребностью в white-label рекомендуем Advanced. Крупным организациям с индивидуальными требованиями подойдёт Enterprise.',
  },
  {
    q: 'Есть ли бесплатный пробный период?',
    a: 'Да, вы можете начать бесплатно и протестировать базовые возможности платформы. При переходе на платный тариф вы получите доступ ко всем функциям партнёрской программы.',
  },
  {
    q: 'Что произойдёт при превышении лимита выплат?',
    a: 'При превышении лимита выплат на вашем тарифе мы свяжемся с вами и предложим перейти на следующий уровень. Выплаты партнёрам не будут прерваны.',
  },
  {
    q: 'Можно ли отменить подписку в любой момент?',
    a: 'Да, вы можете отменить подписку в любой момент. При годовой оплате доступ сохраняется до конца оплаченного периода.',
  },
  {
    q: 'Предоставляете ли вы скидки?',
    a: 'Да, при годовой оплате вы экономите 17%. Для стартапов и некоммерческих организаций доступны дополнительные программы — свяжитесь с нами.',
  },
  {
    q: 'Какова политика конфиденциальности и безопасности?',
    a: 'Мы серьёзно относимся к безопасности данных. Платформа соответствует стандартам SOC 2 Type II. Все данные шифруются при передаче и хранении.',
  },
]

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([
            { name: 'Главная', url: '/' },
            { name: 'Тарифы' },
          ]),
          product({
            name: 'Revroute',
            description:
              'Платформа атрибуции маркетинговых ссылок и партнёрского маркетинга. Тарифы для Links и Partners.',
            url: '/pricing',
            offers: [
              { name: 'Links Free', price: '0', url: '/pricing#free', description: '1 000 ссылок, 50 000 кликов/мес, 1 кастомный домен' },
              { name: 'Links Pro', price: '299', url: '/pricing#pro', description: '50 000 ссылок, 1 млн кликов/мес, 10 доменов' },
              { name: 'Links Business', price: '999', url: '/pricing#business', description: '500 000 ссылок, 10 млн кликов/мес, 50 доменов' },
              { name: 'Partners Business', price: '2950', url: '/pricing#partners-business', description: 'Лимит 250 000 ₽ выплат партнёрам/мес' },
              { name: 'Partners Advanced', price: '9999', url: '/pricing#partners-advanced', description: 'Лимит 1 500 000 ₽ выплат/мес, white-label' },
            ],
          }),
          faqPage(pricingFaq),
        ]}
      />
      {/* Hero */}
      <section className="pt-30 pb-12 text-center relative">
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(231,229,228,0.5)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,64px)] font-normal tracking-tight leading-[1.1] mb-5">
            Гибкие тарифы,<br />
            растущие <em className="italic bg-gradient-to-br from-[#0c0a09] from-20% to-[#78716c] bg-clip-text text-transparent">вместе с вами</em>
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-[520px] mx-auto mb-4">
            Простое, прозрачное ценообразование с понятной мотивацией.
          </p>
          <p className="text-sm text-[var(--text-dim)]">
            Без платы за подключение. Без скрытых платежей.
          </p>
        </div>
      </section>

      {/* Pricing Cards + Compare with Links/Partners tabs */}
      <section>
        <PricingTabs />
      </section>

      {/* Testimonial */}
      <div className="max-w-[1200px] mx-auto px-6">
        <PricingTestimonial />
      </div>

      {/* FAQ */}
      <div className="max-w-[1200px] mx-auto px-6">
        <PricingFAQ />
      </div>

      {/* CTA */}
      <section className="text-center py-20 pb-24 bg-[var(--bg-dark)] text-white relative overflow-hidden">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(120,113,108,0.3)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(36px,5vw,56px)] font-normal leading-[1.1] mb-5">
            Масштабируйте<br />
            <em className="italic">партнёрскую программу</em>
          </h2>
          <p className="text-lg text-[var(--text-dim)] max-w-[480px] mx-auto mb-9">
            Запустите реферальную и партнёрскую программу за минуты, а не месяцы.
          </p>
          <div className="flex flex-col items-stretch sm:flex-row sm:items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
            <a
              href="https://app.revroute.ru/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-white text-[var(--text)] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:bg-stone-100 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-200"
            >
              Начать бесплатно
            </a>
            <a
              href="/contact/support"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/30 transition-all duration-200"
            >
              Запросить демо
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
