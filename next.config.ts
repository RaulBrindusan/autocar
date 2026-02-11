import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          }
        ],
      },
    ]
  },
  
  // Server Actions security
  experimental: {
    serverActions: {
      allowedOrigins: [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
        ...(process.env.NODE_ENV === 'production' ? ['https://automode.ro'] : [])
      ],
    },
  },

  // Image optimization with security
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
      // Supabase storage for user uploads
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
      // Firebase storage for car images
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Security: Disable external image optimization for unoptimized images
    unoptimized: false,
    // Security: Set reasonable limits
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Image optimization settings for faster loading
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days cache
    dangerouslyAllowSVG: false,
  },

  // Turbopack configuration (default in Next.js 16+)
  turbopack: {
    // Turbopack handles source maps automatically based on environment
    // Production builds don't include source maps by default
  },

  // Webpack security configuration (for when using --webpack flag)
  webpack: (config, { isServer }) => {
    // Security: Disable source maps in production
    if (process.env.NODE_ENV === 'production') {
      config.devtool = false
    }

    return config
  },

  // Environment variable validation
  env: {
    // Only expose safe environment variables
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // Security: Disable X-Powered-By header
  poweredByHeader: false,

  // Security: Enable HTTPS redirects in production
  async redirects() {
    return process.env.NODE_ENV === 'production' ? [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://automode.ro/:path*',
        permanent: true,
      },
    ] : []
  },
};

export default nextConfig;
