'use client'

import { useState, type ReactNode } from 'react'

interface FAQItem {
  question: string
  answer: ReactNode
}

const faqItems: FAQItem[] = [
  {
    question: 'Какой тариф Revroute мне подходит?',
    answer: (
      <>
        Если вы только запускаете партнёрскую программу, начните с тарифа{' '}
        <strong className="font-semibold text-[var(--text)]">Business</strong>. Для команд с высокими
        объёмами трафика и потребностью в white-label рекомендуем{' '}
        <strong className="font-semibold text-[var(--text)]">Advanced</strong>. Крупным организациям с
        индивидуальными требованиями подойдёт{' '}
        <strong className="font-semibold text-[var(--text)]">Enterprise</strong>.
      </>
    ),
  },
  {
    question: 'Есть ли бесплатный пробный период?',
    answer:
      'Да, вы можете начать бесплатно и протестировать базовые возможности платформы. При переходе на платный тариф вы получите доступ ко всем функциям партнёрской программы.',
  },
  {
    question: 'Что произойдёт при превышении лимита выплат?',
    answer:
      'При превышении лимита выплат на вашем тарифе мы свяжемся с вами и предложим перейти на следующий уровень. Выплаты партнёрам не будут прерваны.',
  },
  {
    question: 'Можно ли отменить подписку в любой момент?',
    answer:
      'Да, вы можете отменить подписку в любой момент. При годовой оплате доступ сохраняется до конца оплаченного периода.',
  },
  {
    question: 'Предоставляете ли вы скидки?',
    answer: (
      <>
        Да, при годовой оплате вы экономите 17%. Для стартапов и некоммерческих организаций доступны
        дополнительные программы —{' '}
        <a
          href="/contact/support"
          className="text-[var(--text)] font-medium underline underline-offset-2"
        >
          свяжитесь с нами
        </a>
        .
      </>
    ),
  },
  {
    question: 'Какова политика конфиденциальности и безопасности?',
    answer:
      'Мы серьёзно относимся к безопасности данных. Платформа соответствует стандартам SOC 2 Type II. Все данные шифруются при передаче и хранении.',
  },
]

export default function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-10 pb-24">
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,44px)] font-normal text-center mb-12">
        Частые вопросы
      </h2>
      <div className="max-w-[720px] mx-auto">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className="border-b border-[var(--border)]">
              <button
                onClick={() => toggle(index)}
                className="w-full py-5 flex items-center justify-between text-left text-base font-semibold text-[var(--text)] hover:text-[var(--text-secondary)] transition-colors duration-200 cursor-pointer bg-transparent border-none"
              >
                {item.question}
                <span
                  className={`shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                >
                  <svg
                    className="w-4 h-4 text-[var(--text-muted)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: isOpen ? '300px' : '0' }}
              >
                <div className="pb-5 text-[15px] text-[var(--text-muted)] leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
