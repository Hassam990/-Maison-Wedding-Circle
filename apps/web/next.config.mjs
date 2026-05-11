/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/vendor',
        destination: '/vendors',
        permanent: true,
      },
      {
        source: '/couple',
        destination: '/for-couples',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
