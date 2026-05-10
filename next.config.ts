import type { NextConfig } from "next";

const playbackFrameOrigins = [
  "https://embedmaster.link",
  "https://www.vidking.net",
  "https://player.videasy.net",
  "https://spencerdevs.xyz",
  process.env.EMBEDMASTER_BASE_URL,
  process.env.VIDKING_BASE_EMBED_URL,
  process.env.VIDEASY_BASE_URL,
  process.env.SPENEMBED_BASE_URL,
]
  .map(getOrigin)
  .filter((origin): origin is string => Boolean(origin));

const contentSecurityPolicy = [
  "default-src 'self'",
  `frame-src 'self' ${[...new Set(playbackFrameOrigins)].join(" ")}`,
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

function getOrigin(value: string | undefined) {
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

export default nextConfig;
