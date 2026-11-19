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
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "",
        pathname: "/thumbnail",
      },
    ],
    qualities: [100, 75],
  },
};

export default nextConfig;
