const withPWA = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
}

const configWithoutEslint = { ...nextConfig }
delete configWithoutEslint.eslint

module.exports = withPWA(configWithoutEslint)
