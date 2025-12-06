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
}

module.exports = nextConfig 