/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/",
      permanent: true,
      destination: "/auth/login",
    },
    {
      source: '/auth/login',
      has: [
        {
          type: 'cookie',
          key: 'token',
        },
      ],
      permanent: false,
      destination: '/app/home',
    },
    {
      source: '/auth/register',
      has: [
        {
          type: 'cookie',
          key: 'token',
        },
      ],
      permanent: false,
      destination: '/app/home',
    },
  ],
  /**
   * https://nextjs.org/docs/upgrading#swc-replacing-terser-for-minification
   */
  swcMinify: false,
};

module.exports = nextConfig;
