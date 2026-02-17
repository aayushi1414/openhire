/** @type {import('next').NextConfig} */
const nextConfig = {
  // pg and Neon are Node.js-only — never bundle them for the browser
  serverExternalPackages: ["pg", "pg-native", "pg-pool", "pg-connection-string"],

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
