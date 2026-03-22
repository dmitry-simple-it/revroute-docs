import nextra from 'nextra'

const withNextra = nextra({
  staticImage: false,
})

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'assets.dub.co' },
      { hostname: 'dubassets.com' },
    ],
  },
}

export default withNextra(nextConfig)
