/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
