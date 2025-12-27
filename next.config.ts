import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 启用 Cache Components，允许使用 'use cache' 指令
    cacheComponents: true,
  },
};

export default nextConfig;
