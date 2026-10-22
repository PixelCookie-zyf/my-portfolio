import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // giscus loads the comment theme from giscus.app with crossorigin="anonymous".
  async headers() {
    return [
      {
        source: "/giscus/:file*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};

export default nextConfig;
