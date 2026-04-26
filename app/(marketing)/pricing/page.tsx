import type { Metadata } from 'next'
import { PricingTabs } from '@/components/marketing/pricing/PricingTabs'
import PricingFAQ from '@/components/marketing/pricing/PricingFAQ'
import PricingTestimonial from '@/components/marketing/pricing/PricingTestimonial'

export const metadata: Metadata = {
  title: 'Тарифы — прозрачное ценообразование Revroute',
  description:
    'Гибкие тарифы для партнёрских и реферальных программ Revroute. Прозрачное ценообразование без скрытых платежей.',
}

export default function PricingPage() {
  return (
    <>
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
          <div className="flex justify-center gap-3">
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
