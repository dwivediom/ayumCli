/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  swSrc: "worker/service-worker.js",
  buildExcludes: [/middleware-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  // 🔥 REQUIRED for Azure App Service

  images: {
    domains: [
      "www.pexels.com",
      "images.pexels.com",
      "i.postimg.cc",
      "img.icons8.com",
      "icons8.com",
      "lh3.googleusercontent.com",
      "www.chatserver.ayum.in",
      "ayummedia.blob.core.windows.net",
      "i.ibb.co",
      "www.imgbb.com",
    ],
  },

  reactStrictMode: true,
  swcMinify: true,

  env: {
    // Client-safe env (compile-time)
    Bport: "http://localhost:5000",
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
});

module.exports = nextConfig;
