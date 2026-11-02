# Free Typeloria address — 2 November 2026

Primary address: **https://typeloria.pages.dev/**. No domain was purchased and no paid plan was enabled. Cloudflare free-tier quotas still apply.

## Hosting

The free Pages project `typeloria` forwards requests through an account-local service binding to the existing `typesprint` application Worker. The Pages project has no Supabase or YouTube credentials. Its configuration is `workers/typeloria-pages/wrangler.jsonc`; deploy from that directory with `npx wrangler pages deploy public --project-name typeloria --branch main`. Production traffic uses the normal app; preview URLs redirect to the primary address. Backend errors return a temporary 503 without exposing internals.

The old workers.dev address remains usable. `SITE_URL` retains that legacy origin; `CANONICAL_SITE_URL` is `https://typeloria.pages.dev` in Cloudflare and Vercel production. API writes accept only explicitly configured origins. Canonicals, structured data, sitemap and robots references point to the new address. Build the app with the same canonical value and existing ad flag before deploying it through the established Cloudflare build/deploy process.

Browser-local profiles and progress belong to their original website origin. They are not automatically copied to the new address. The new account page links to the old account page so users can still access old profiles. Shared races and community scores continue using the existing database. No database reset or credential migration occurred.

## Advertising

Adsterra approved `typeloria.pages.dev` as website `6169741`. Native Banner `32053790` and Smartlink `32053791` are Active. The genuine new code is selected only on the new address; legacy placements remain separate. The Native Banner is served from the isolated ad Worker at `/typeloria.html`, whose embedding policy explicitly permits the new origin. Actual recommendations rendered in Chrome after consent. The Smartlink destination and homepage clicks 1, 6, 11, 16… were verified through configuration and focused tests; live advertiser links were not self-clicked.

Existing consent, Global Privacy Control, homepage-only redirect rules and the server kill switch remain in effect. No paid-impression or revenue claim is inferred from testing.

## Google

Google Search Console automatically verified ownership of the new URL-prefix property through the existing genuine HTML ownership file. The new sitemap was submitted exactly once and accepted. Its processing report initially displayed "Couldn't fetch"; success is not confirmed. The new homepage indexing request was attempted once and rejected with **Quota Exceeded**, alongside a reCAPTCHA service connection error. Do not repeatedly retry or bypass the challenge/quota. Google controls indexing, displayed site name, favicon and ranking; first position and removal of a provider fallback label are not guaranteed.

## Validation

The 51-test regression suite passed before the final placement wiring; all 11 focused address/ad checks passed afterward, including the new placement test. Production build passed. Eight routes passed live branding, logo, metadata and canonical checks. The new sitemap, robots.txt and ownership file returned HTTP 200 without a noindex header. Native video returned video/mp4. Two independent real HTTP clients created and joined a room through the new address, shared countdown and movement, and reconnected; the test room was cancelled without adding fake leaderboard scores. Legacy practice and account pages remained HTTP 200.
