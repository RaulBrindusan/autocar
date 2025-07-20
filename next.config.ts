import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.openlane.eu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.openlane.eu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openlane.eu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.copart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cs.copart.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'auctions.copart.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
