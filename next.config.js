/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan konfigurasi rewrites di sini
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Ganti dengan URL backend Laravel Anda
      },
    ];
  },
};

module.exports = nextConfig;