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
  // New MBA & PGDM website (static files in public/site). Pages not listed here
  // (/mba, /ipm, /enquiry, /colleges/<city>/..., etc.) are unchanged.
  // To restore an old page, delete its line below.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/site/index.html" },
        { source: "/colleges", destination: "/site/colleges.html" },
        { source: "/cat-predictor", destination: "/site/predictor.html" },
        { source: "/mba-vs-pgdm", destination: "/site/mba-vs-pgdm.html" },
        { source: "/about", destination: "/site/about.html" },
        { source: "/contact", destination: "/site/contact.html" },
      ],
    };
  },
};

module.exports = nextConfig;
