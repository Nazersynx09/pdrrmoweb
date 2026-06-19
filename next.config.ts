import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'khqcunmiuyrkflwjklwl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
