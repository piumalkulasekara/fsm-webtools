/** @type {import('next').NextConfig} */
const config = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reduce the size of generated HTML pages
  compress: true,

  // Disable unused features
  poweredByHeader: false,
};

module.exports = config;
