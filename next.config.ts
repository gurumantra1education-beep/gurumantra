// import type { NextConfig } from 'next';

// /** @type {NextConfig} */
// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//       },
//     ],
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skips ESLint errors during production builds
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Allows images from Cloudinary
      },
    ],
  },
  // New MBA & PGDM homepage (static files in public/site). Other pages are unchanged.
  // To go back to the old homepage, delete this rewrites() block.
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: "/site/index.html" }],
    };
  },
};

module.exports = nextConfig;
