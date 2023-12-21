/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["antd", ""],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
