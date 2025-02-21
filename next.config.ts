import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.ppy.sh",
      },
      {
        protocol: "https",
        hostname: "a.ppy.sh",
      },
      {
        protocol: "https",
        hostname: "osu.ppy.sh",
      },
    ],
  },
};

export default nextConfig;
