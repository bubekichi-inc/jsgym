import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wmxkzzzvbgifcbwzfwsy.supabase.co",
        pathname: "/storage/v1/object/public/profile_icons/private/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
