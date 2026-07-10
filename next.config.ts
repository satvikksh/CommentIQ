import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      new URL("https://i.ytimg.com/**"),
      new URL("https://yt3.ggpht.com/**"),
      new URL("https://*.googleusercontent.com/**"),
    ],
  },
};

export default nextConfig;
