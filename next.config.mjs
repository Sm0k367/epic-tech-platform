/** @type {import('next').NextConfig} */
const nextConfig = {
  // General Optimizations
  reactStrictMode: true,
  swcMinify: true,

  // Performance & Bundle Size
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@headlessui/react'
    ],
    // Better memory usage during build
    turbotrace: {
      memoryLimit: 4096,
    },
  },

  // Ignore common build warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all external images (for fal.ai generated images)
      },
    ],
    minimumCacheTTL: 60,
  },

  // Headers for better security & performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Output for better compatibility
  output: 'standalone', // Good for Railway + Cloudflare
};

export default nextConfig;
