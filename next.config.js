/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 's3.images-iherb.com',
      },
      {
        protocol: 'https',
        hostname: 'images-iherb-com.b-cdn.net',
      },
    ],
  },
  // Optimize caching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Enable SWC minification
  swcMinify: true,
  // Optimize production builds
  compress: true,
}

module.exports = nextConfig 