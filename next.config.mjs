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
  images: {
    qualities: [75, 90],
    remotePatterns: [
      { hostname: 'assets.dub.co' },
      { hostname: 'dubassets.com' },
    ],
  },
}

export default withNextra(nextConfig)
