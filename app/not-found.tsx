import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Страница не найдена',
  description: 'Запрошенная страница не существует или была перемещена.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="bg-grid relative flex min-h-screen items-center justify-center px-6 py-24">
      <div
        className="relative z-10 mx-auto max-w-3xl text-center"
        style={{ animation: '0.8s ease 0s 1 normal both running fadeUp' }}
      >
        <p
          className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500"
        >
          Ошибка 404
        </p>

        <h1
          className="relative mb-7"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 9vw, 88px)',
            fontWeight: 400,
            letterSpacing: '-1.5px',
            lineHeight: 1,
          }}
        >
          Эта страница
          <br />
          <em
            className="italic"
            style={{
              background:
                'linear-gradient(135deg, rgb(12, 10, 9) 0%, rgb(37, 99, 235) 40%, rgb(124, 58, 237) 70%, rgb(12, 10, 9) 100%) 0% 0% / 200% 100% text',
              WebkitTextFillColor: 'transparent',
              animation:
                '6s ease-in-out 0s infinite normal none running gradientShift',
            }}
          >
            потерялась
          </em>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
          Возможно, вы перешли по устаревшей ссылке или ввели адрес с опечаткой.
          Вернитесь на главную и продолжите оттуда.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-7 text-sm font-medium text-white transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-950"
          >
            На главную
          </Link>
          <Link
            href="/ru/help"
            className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white px-7 text-sm font-medium text-stone-900 transition-colors hover:border-stone-400 hover:bg-stone-50"
          >
            Открыть Help-центр
          </Link>
        </div>
      </div>
    </main>
  )
}
