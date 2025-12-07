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
  // Disable Webpack's persistent filesystem cache in dev to avoid
  // EBUSY/locking issues on Windows + OneDrive (.next/vendor-chunks).
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false
    }
    return config
  },
}

module.exports = nextConfig