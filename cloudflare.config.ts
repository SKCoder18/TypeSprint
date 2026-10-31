import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "typesprint",
    workersDev: true,
    previewUrls: false,
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-31",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      SITE_URL: bindings.text("https://typesprint.typesprint-sk18.workers.dev"),
      SUPABASE_URL: bindings.secret(),
      SUPABASE_PUBLISHABLE_KEY: bindings.secret(),
      SUPABASE_SECRET_KEY: bindings.secret(),
      YOUTUBE_API_KEY: bindings.secret(),
    },
  }),
});
