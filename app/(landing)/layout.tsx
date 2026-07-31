import type { ReactNode } from 'react'
import { Nav } from '@/components/ds/Nav'
import { Footer } from '@/components/ds/Footer'
import '@/components/ds/ds.css'

/**
 * Design System v2 surface. New marketing pages live here and get the DS-v2
 * shell (Nav + Footer) inside a `.ds-scope` wrapper that carries all v2 tokens
 * and the Geist font — fully isolated from the legacy (marketing) pages, which
 * keep their own styling. Add new v2 pages under app/(landing)/… and register
 * their path in middleware MARKETING_PATHS.
 */
export default function LandingV2Layout({ children }: { children: ReactNode }) {
  return (
    <div className="ds-scope">
      <div className="ds-topwash" aria-hidden />
      <Nav />
      <main className="min-w-0">{children}</main>
      <Footer />
    </div>
  )
}
