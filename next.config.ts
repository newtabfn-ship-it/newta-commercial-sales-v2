import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/equipment/galion-12-ton-semi-hydraulic-crane-truck-newta-2026-0017",
        destination: "/equipment/used-galion-12-ton-semi-hydraulic-crane-truck-newta-2026-0017",
        permanent: true,
      },
      {
        source: "/equipment/mercedes-benz-2224-8000lt-watertank-truck-no-papers-newta-2026-0019",
        destination: "/equipment/used-mercedes-benz-2224-8000lt-watertank-water-tanktruck-newta-2026-0019",
        permanent: true,
      },
      {
        source: "/equipment/2023-tan-st-leader-side-tipper-trailer-papers-newta-2026-0003",
        destination: "/equipment/used-2023-tan-st-leader-side-tipper-trailer-newta-2026-0003",
        permanent: true,
      },
      {
        source: "/equipment/grove-18-ton-all-terrain-crane-truck-newta-2026-0018",
        destination: "/equipment/used-grove-18-ton-all-terrain-crane-truck-newta-2026-0018",
        permanent: true,
      },
      {
        source: "/equipment/tata-honey-sucker-newta-2026-0014",
        destination: "/equipment/used-tata-honey-sucker-truck-newta-2026-0014",
        permanent: true,
      },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
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
