// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: [
//       'images.unsplash.com',
//       'localhost',
//       'res.cloudinary.com',
//       'lh3.googleusercontent.com',
//       'avatars.githubusercontent.com'
//     ],
//   },
//   reactCompiler: true,
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'encrypted-tbn0.gstatic.com',
      'localhost',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com'
    ],
  },
  reactCompiler: true,
};

export default nextConfig;