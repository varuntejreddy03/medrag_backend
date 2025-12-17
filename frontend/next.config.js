/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://medrag-final.loca.lt' 
      : 'http://localhost:8000',
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig