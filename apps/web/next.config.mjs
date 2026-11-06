/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@libsql/client", "libsql"],
  transpilePackages: ["@shrimphub/database", "@shrimphub/ui", "@shrimphub/core-logic"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@libsql/client", "libsql"];
    }
    config.module.rules.push({
      test: /\.(md|LICENSE)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
