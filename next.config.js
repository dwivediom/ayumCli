/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  swSrc: "worker/service-worker.js",

  buildExcludes: [
    /middleware-manifest.json$/,
    /server\/middleware-manifest.json$/,
  ],

  disable: isDev,
});

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  poweredByHeader: false,

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

  env: {
    NEXT_PUBLIC_BPORT: process.env.NEXT_PUBLIC_BPORT || "http://localhost:5000",
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
