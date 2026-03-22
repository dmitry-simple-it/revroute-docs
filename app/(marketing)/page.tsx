import { AnnouncementBar } from '@/components/marketing/landing/AnnouncementBar'
import { HeroSection } from '@/components/marketing/landing/HeroSection'
import { ProductTabs } from '@/components/marketing/landing/ProductTabs'
import { LogoMarquee } from '@/components/marketing/landing/LogoMarquee'
import { ManifestoSection } from '@/components/marketing/landing/ManifestoSection'
import { FeaturesSection } from '@/components/marketing/landing/FeaturesSection'
import { EnterpriseSection } from '@/components/marketing/landing/EnterpriseSection'
import { TestimonialsSection } from '@/components/marketing/landing/TestimonialsSection'
import { ChangelogSection } from '@/components/marketing/landing/ChangelogSection'
import { CTASection } from '@/components/marketing/landing/CTASection'

export const metadata = {
  title: 'Revroute — Превращайте клики в выручку',
  description:
    'Revroute — платформа для управления ссылками нового поколения. Короткие ссылки, аналитика конверсий и партнерские программы.',
}

export default function LandingPage() {
  return (
    <>
      <AnnouncementBar />
      <HeroSection />
      <ProductTabs />
      <LogoMarquee />
      <ManifestoSection />
      <FeaturesSection />
      <EnterpriseSection />
      <TestimonialsSection />
      <ChangelogSection />
      <CTASection />
    </>
  )
}
