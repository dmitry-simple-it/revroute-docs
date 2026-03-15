import nextra from 'nextra'

const withNextra = nextra({
  staticImage: false,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  images: {
    remotePatterns: [
      { hostname: 'assets.dub.co' },
      { hostname: 'dubassets.com' },
    ],
  },
}

export default withNextra(nextConfig)
