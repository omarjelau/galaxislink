
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    // No experimental features are currently enabled.
  },
  allowedDevOrigins: [
      "https://6000-firebase-studio-1760523200749.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev",
      "https://9000-firebase-studio-1760523200749.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev"
  ],
};

export default nextConfig;
