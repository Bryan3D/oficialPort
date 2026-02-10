/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.codepen.io" },
    ],
  },
};

module.exports = nextConfig;
