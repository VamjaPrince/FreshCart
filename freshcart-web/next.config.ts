import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Authentication and user images
      {
        hostname: "lh3.googleusercontent.com",
      },
      // Stock photography
      {
        hostname: "images.pexels.com",
      },
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "plus.unsplash.com",
      },
      // Retail and product images
      {
        hostname: "indian-retailer.s3.ap-south-1.amazonaws.com",
      },
      {
        hostname: "png.pngtree.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      // Additional grocery and food image sources
      {
        hostname: "www.bigbasket.com",
      },
      {
        hostname: "www.jiomart.com",
      },
      {
        hostname: "www.amazon.in",
      },
      {
        hostname: "m.media-amazon.com",
      },
      {
        hostname: "images.freshtohome.com",
      },
      {
        hostname: "cdn.grofers.com",
      },
      {
        hostname: "www.licious.in",
      },
      {
        hostname: "d2d22nphq0yz8t.cloudfront.net",
      },
      {
        hostname: "cdn.shopify.com",
      },
      {
        hostname: "ik.imagekit.io",
      },
      {
        hostname: "images.ctfassets.net",
      },
      {
        hostname: "prod-img.thesouledstore.com",
      },
      {
        hostname: "www.naturesbasket.co.in",
      },
      {
        hostname: "www.farmdrop.com",
      },
      {
        hostname: "dk0dc4rjg2p5e.cloudfront.net",
      },
      {
        hostname: "i.imgur.com",
      },
      {
        hostname: "ibb.co",
      },
      {
        hostname: "i.ibb.co",
      },
      {
        hostname: "via.placeholder.com",
      },
      // Development and local testing
      {
        hostname: "localhost",
      },
      {
        hostname: "127.0.0.1",
      },
    ],
    // Optional: Add device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optional: Add image sizes for different contexts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optional: Set minimum cache TTL for images
    minimumCacheTTL: 60,
    // Optional: Enable dangerous SVG (if you need SVG support)
    dangerouslyAllowSVG: true,
    // Optional: Set content security policy for images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Optional: Add other Next.js configurations
  reactStrictMode: true,
  // Optional: Configure compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Optional: Add experimental features if needed
  experimental: {
    optimizeCss: true, // Be careful with this in production
  },
};

export default nextConfig;