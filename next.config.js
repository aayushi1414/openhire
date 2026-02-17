/** @type {import('next').NextConfig} */
const nextConfig = {
  // pg and Neon are Node.js-only — never bundle them for the browser
  serverExternalPackages: ["pg", "pg-native", "pg-pool", "pg-connection-string"],

  images: {
    remotePatterns: [],
  },
  webpack: (webpackConfig, { webpack, isServer }) => {
    webpackConfig.plugins.push(
      // Remove node: from import specifiers, because Next.js does not yet support node: scheme
      // https://github.com/vercel/next.js/issues/28774
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    );

    // Prevent Node.js-only modules from being bundled for the browser
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        "pg-native": false,
      };
    }

    return webpackConfig;
  },
};

module.exports = nextConfig;
