/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'example.com', 'uploadthing.com'],
  },
}

module.exports = nextConfig
