import { AnnouncementBar } from '@/components/marketing/landing/AnnouncementBar'
import { HeroSection } from '@/components/marketing/landing/HeroSection'
import { ProductTabs } from '@/components/marketing/landing/ProductTabs'
import { LogoMarquee } from '@/components/marketing/landing/LogoMarquee'
import { ManifestoSection } from '@/components/marketing/landing/ManifestoSection'
import { FeaturesSection } from '@/components/marketing/landing/FeaturesSection'
import { EnterpriseSection } from '@/components/marketing/landing/EnterpriseSection'
import { TestimonialsSection } from '@/components/marketing/landing/TestimonialsSection'
import { CTASection } from '@/components/marketing/landing/CTASection'
import { JsonLd } from '@/components/marketing/seo/JsonLd'
import { organization, website, softwareApp } from '@/lib/seo/schemas'

export const metadata = {
  title: 'Revroute — Превращайте клики в выручку',
  description:
    'Revroute — платформа партнёрского маркетинга. Сокращение ссылок, аналитика конверсий и партнёрские программы.',
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function LandingPage() {
  return (
    <>
      <JsonLd
        data={[
          organization(),
          website(),
          softwareApp({
            name: 'Revroute',
            url: '/',
            description:
              'Российская платформа атрибуции маркетинговых ссылок и партнёрского маркетинга: короткие ссылки, аналитика конверсий, выплаты партнёрам.',
            featureList: [
              'Короткие ссылки на своём домене',
              'UTM-конструктор и шаблоны',
              'Брендированные QR-коды',
              'Аналитика кликов и конверсий',
              'Гео- и устройство-таргетинг',
              'A/B-тесты ссылок',
              'Партнёрские программы с автовыплатами',
            ],
            offers: [
              { name: 'Links Free', price: '0', description: '1 000 ссылок, 50 000 кликов/мес, 1 кастомный домен' },
              { name: 'Links Pro', price: '299', description: '50 000 ссылок, 1 млн кликов/мес, 10 доменов' },
              { name: 'Links Business', price: '999', description: '500 000 ссылок, 10 млн кликов/мес, 50 доменов' },
              { name: 'Partners Business', price: '2950', description: 'Лимит 250 000 ₽ выплат партнёрам/мес' },
              { name: 'Partners Advanced', price: '9999', description: 'Лимит 1 500 000 ₽ выплат/мес, white-label' },
            ],
          }),
        ]}
      />
      <AnnouncementBar />
      <HeroSection />
      <ProductTabs />
      <LogoMarquee />
      <ManifestoSection />
      <FeaturesSection />
      <EnterpriseSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
