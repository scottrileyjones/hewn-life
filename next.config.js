/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/palette', destination: '/brand', permanent: true },
      { source: '/font-options', destination: '/brand', permanent: true },
      { source: '/website-in-a-week', destination: '/website-in-a-day', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dsx2wcqte/**',
      },
    ],
  },
}
module.exports = nextConfig
