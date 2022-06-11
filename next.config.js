/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: "/",
      has: [
        {
          type: "cookie",
          key: "token",
        },
      ],
      permanent: false,
      destination: "/auth/login",
    },
  ],
  /**
   * https://nextjs.org/docs/upgrading#swc-replacing-terser-for-minification
   */
  swcMinify: false,
};

module.exports = nextConfig;
