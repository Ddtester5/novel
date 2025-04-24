import type { NextConfig } from "next";
const isDev = process.env.NODE_ENV !== "production";
const s3Endpoint = process.env.S3_ENDPOINT || "http://localhost:9000";
let s3Hostname = "localhost";

try {
  s3Hostname = new URL(s3Endpoint).hostname;
} catch (error) {
  console.error("Invalid S3_ENDPOINT:", error);
  console.error("Falling back to default hostname:", s3Hostname);
}
const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  poweredByHeader: false,
  rewrites: async () => [{ source: "/storage/:path*", destination: `${s3Endpoint}/:path*` }],
  staticPageGenerationTimeout: 240,
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400,
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      { protocol: "https", hostname: s3Hostname },
      { protocol: "https", hostname: "**" },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Content-Security-Policy",
          value: `
            default-src 'self';
            img-src 'self' data: https:;
            script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com;
            style-src 'self' 'unsafe-inline';
            frame-src 'self';
           connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com;
          `.replace(/\n/g, ""),
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Permissions-Policy",
          value: "geolocation=(self), microphone=()",
        },
        { key: "Cross-Origin-Embedder-Policy", value: "credentialless " },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        {
          key: "Set-Cookie",
          value: "SameSite=None; Secure",
        },
      ],
    },
  ],
};
if (isDev) {
  nextConfig.experimental = {
    serverActions: {
      allowedOrigins: ["localhost:3000", "**.app.github.dev"],
    },
  };

  nextConfig.productionBrowserSourceMaps = true;
}
export default nextConfig;
