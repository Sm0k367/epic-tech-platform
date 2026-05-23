/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Removed 'standalone' to avoid conflicts with Railway
  // output: 'standalone',   ← Commented out
};

export default nextConfig;
