import nextra from 'nextra'

const withNextra = nextra({
  staticImage: false,
})

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ru'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      { source: '/docs', destination: '/ru/docs', permanent: false },
      { source: '/docs/:path*', destination: '/ru/docs/:path*', permanent: false },
      { source: '/help', destination: '/ru/help', permanent: false },
      { source: '/help/:path*', destination: '/ru/help/:path*', permanent: false },
    ]
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { hostname: 'assets.dub.co' },
      { hostname: 'dubassets.com' },
    ],
  },
}

export default withNextra(nextConfig)
