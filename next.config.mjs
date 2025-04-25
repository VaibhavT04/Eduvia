/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  },
  experimental: {
    appDir: true, // ensures app directory routing
    serverActions: true // only if you're using server actions
  },
};

export default nextConfig;
