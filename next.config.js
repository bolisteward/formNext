/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        //hostname: 'form.rosekingdom.world', //localhost 
        hostname: 'form.visaglobal.com.ec', //localhost 
        port: '', //3000
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  
  experimental: {
    serverActions: true,
  },
  
  //output: "export",
};

module.exports = nextConfig;
