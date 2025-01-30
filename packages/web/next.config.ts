import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    externalDir: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
                frame-src 'self';
                frame-ancestors https://*.mittwald.de https://*.mittwald.systems https://*.mittwald.it http://localhost:3000;
            `.replace(/\n/g, " "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
