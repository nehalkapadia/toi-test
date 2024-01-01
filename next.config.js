/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["antd", ""],
  images: {
    domains: ['localhost'],
  },
  devIndicators: {
    buildActivity: false
  }
};

module.exports = nextConfig;
