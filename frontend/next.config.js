/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${(process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') || 'https://hacktoberfest-copilot-backend-production-fe4a.up.railway.app'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
