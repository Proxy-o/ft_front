/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
