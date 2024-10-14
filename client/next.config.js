const NEXT_PROXY_BACKEND_URL = process.env.NEXT_PROXY_BACKEND_URL;

if (process.env.NODE_ENV !== "production" && !NEXT_PROXY_BACKEND_URL) {
  throw new Error("NEXT_PROXY_BACKEND_URL is not defined");
}

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async rewrites() {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "Suppressed NextJS rewrites as they are disabled in production.",
      );
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `http://${NEXT_PROXY_BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default config;
