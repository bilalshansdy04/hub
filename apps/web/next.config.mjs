/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@shrimphub/database", "@shrimphub/ui", "@shrimphub/core-logic"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
