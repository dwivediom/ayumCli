/** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
  // disable: process.env.NODE_ENV === 'development'
});

const nextConfig = withPWA({
  images: {
    domains: [
      "www.pexels.com",
      "i.postimg.cc",
      "img.icons8.com",
      "lh3.googleusercontent.com",
      "www.chatserver.ayum.in",
      "i.ibb.co",
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    Bport: "http://localhost:5000",
  },
});

module.exports = nextConfig;
