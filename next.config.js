const withTM = require("next-transpile-modules")([]);

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  // enabled: Boolean(process.env.ANALYZE) === true,
  enabled: false,
});

module.exports = withBundleAnalyzer(
  withTM({
    reactStrictMode: true,
    compiler: {
      removeConsole: false,
    },
    async redirects() {
      return [
        {
          source: "/",
          destination: "/menu",
          permanent: true,
        },
      ];
    },
    images: {
      domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
      // unoptimized: true
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    // env: {
    //   FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    //   FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    //   FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    //   FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    //   FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    //   FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    //   FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    // },
  })
);
