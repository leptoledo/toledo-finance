import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de performance
  reactStrictMode: true,

  // Otimiza o bundle removendo código não utilizado
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Configurações de performance
  poweredByHeader: false,
  compress: true,

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nswkqmamqoeovjspotvs.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Otimizações de imagem
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
