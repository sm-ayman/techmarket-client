/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://techmarket-server.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
