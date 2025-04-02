/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
  },
};

export default nextConfig;
