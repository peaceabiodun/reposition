/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lxhkvwokvmmgfgtncyzn.supabase.co',
      'res.cloudinary.com',
      'localhost',
    ],
  },
};

export default nextConfig;
