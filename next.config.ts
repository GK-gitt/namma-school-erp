import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Security headers applied to every response.
  // These are "defense in depth" — they tell the browser to behave safely.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop the site from being embedded in an <iframe> (clickjacking protection)
          { key: "X-Frame-Options", value: "DENY" },
          // Stop browsers from guessing file types (MIME sniffing protection)
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak the full URL when users click external links
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for 2 years once visited
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Lock down powerful browser features we don't use
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
