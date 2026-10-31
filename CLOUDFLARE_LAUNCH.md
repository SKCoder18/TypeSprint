# Cloudflare launch — 31 October 2026

Public Worker: https://typesprint.typesprint-sk18.workers.dev

Vercel fallback: https://type-sprint-sigma-six.vercel.app

Rollback source: Git tag `typesprint-before-cloudflare-2026-10-31` (commit `84c2877`). Vercel and Supabase were not removed or reset.

## Development and deployment

- `npm run dev`, `npm run build`, and `npm start` keep the original Next.js workflow.
- `npm run dev:vinext`, `npm run build:vinext`, `npm run start:vinext`, and `npm run deploy:vinext` use Cloudflare's official vinext/Vite tooling.
- Cloudflare tooling requires Node 24.22 or a supported newer release. The system Node installation was not replaced. A supported runtime was obtained from the official npm `node` package for launch commands.
- Cloudflare CLI authentication is local, never committed. Authenticate `cf` separately or supply a scoped `CLOUDFLARE_API_TOKEN` privately. The launch reused the user's approved Wrangler OAuth token in process memory.
- `cloudflare.config.ts` declares only static assets, the public site origin and encrypted server secrets. No KV, R2, Images, containers, paid plans or purchased domains are enabled.
- Required encrypted secrets retain their existing names: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `YOUTUBE_API_KEY`. Legacy Supabase environment names remain supported by application code. Values must never be committed. New Workers can initialize these via Cloudflare's `cf deploy --prebuilt --secrets-file <ignored-local-file>` flow; existing deployments retain configured secrets.
- Optional `GOOGLE_SITE_VERIFICATION` is the public HTML-tag verification value, not a Google password or API credential. Optional `CONTACT_EMAIL` is a public operator contact address.

## Verification

The vinext compatibility check reported no unsupported imports or settings. Cloudflare production build passed. All 35 existing tests passed. Dependency audit reported zero known vulnerabilities after patching generated tooling dependencies. The built output contained no configured server secret values.

The public Worker served the homepage, practice, academy, stories, Shadow Battle, offline racing, rhythm, video, local account/profile pages, online racing, leaderboards, About, Privacy, Terms and Contact. Native video loaded and actual typing-controlled playback was exercised in Chrome with no reported console errors. YouTube metadata validation and community leaderboard APIs responded successfully. Two independent HTTP sessions shared a live room and countdown, moved using server-controlled typing input and reconnected; the test was cancelled without adding test leaderboard scores.

Browser-local accounts and progress are isolated by website origin. Existing Vercel profiles remain available on Vercel and are not automatically transferred to workers.dev. Shared room state and community scores continue using the existing Supabase database. Real uploaded audio/video files were not retransmitted or copied to any server.

## Cost and limits

No purchases or paid services were enabled. Workers Free currently allows 100,000 dynamic requests/day and 10 ms CPU/request; static assets have separate free delivery limits. This is a small-traffic deployment, not a promise of unlimited multiplayer capacity. Exceeding free quotas can interrupt service. The existing Supabase free-tier limits still apply.

## Advertising and Search Console

Adsterra accepted the workers.dev address. The publisher dashboard confirmed website `6165647` Approved and Native Banner unit `32025334` Active. Its genuine code is served by the separate free `typesprint-ads` Worker at https://typesprint-ads.typesprint-sk18.workers.dev/native.html inside a sandboxed iframe only after visitor consent. This separate origin protects the main app's local profiles from advertising code. Deploy that Worker with `npx wrangler deploy --config workers/ad-frame/wrangler.jsonc`. The slot appears only in the homepage's static informational area. Global Privacy Control keeps it off; visitors can withdraw consent. No fake publisher IDs, popunders, Social Bar, forced top-level redirects or notification ads are installed. Actual recommendations rendered inside the live homepage iframe during the final Chrome check. No live advertisements were clicked.

The Cloudflare URL-prefix property was successfully verified in Google Search Console. Google's genuine ownership file is `public/google18b969f9979d870e.html` and must remain published. The sitemap was submitted once and Google acknowledged submission, but its current status is "Couldn't fetch / Sitemap could not be read." Independent public requests, including a Googlebot user agent, returned HTTP 200 and valid XML. One homepage indexing request was attempted, but Google reported a submission failure and a reCAPTCHA service connection error. Indexing has not been accepted or confirmed. The owner can retry manually later when Google's service is available; no CAPTCHA was bypassed.

`CANONICAL_SITE_URL` was added to Vercel production with the Cloudflare origin. It controls SEO metadata independently from `SITE_URL`, preserving the working Vercel request origin. The matching source changes take effect when the Vercel deployment rebuilds. `/video-challenge` canonicals point to `/youtube` and the duplicate was removed from the sitemap. Privacy copy describes local profiles, shared community scores and optional ads accurately; Contact offers the public project support tracker without inventing a private operator email.
