/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@libsql/client", "libsql"],
  transpilePackages: ["@shrimphub/database", "@shrimphub/ui", "@shrimphub/core-logic", "sonner"],
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
      config.externals = config.externals || [];
      config.externals.push({
        "@libsql/client": "commonjs @libsql/client",
        libsql: "commonjs libsql",
      });
    }
    return config;
  },
};

export default nextConfig;
