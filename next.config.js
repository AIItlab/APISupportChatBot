/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    PINECONE_API_KEY: process.env.PINECONE_API_KEY,
    REDACTED: process.env.REDACTED,
    PINECONE_INDEX: process.env.PINECONE_INDEX,
    SENDGRID_USER: process.env.SENDGRID_USER,
    SENDGRID_PASS: process.env.SENDGRID_PASS,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

