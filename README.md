# TypeSprint — Phase 1

Run `npm install`, then `npm run dev`. Open http://localhost:3000. `npm test` runs engine tests; `npm run build` produces the production application, served by `npm start`.

Requires Node.js 20.9+ and a physical keyboard for scored sessions. No secrets or backend required. Guest history and Academy completion remain on this browser. Restricted storage produces a visible warning. Timers continue while unfocused and use performance.now(). WPM is retained correct characters / 5 / elapsed minutes; accuracy measures all attempts. Balanced mistakes reset combos and remain in accuracy after correction. Paste, modifier shortcuts, key repeat, and IME composition do not award score. Touch/IME scoring is not supported in Phase 1.

`lib/engine.ts` is React-independent. `lib/content.ts` owns lessons, practice text, and storage. `components/Session.tsx` connects the engine to practice and Academy. Phase 2 routes now provide offline games and music challenges. Online racing remains an informational Phase 3 route.

## Phase 2 — Arcade and music

Routes: `/games`, `/shadow`, `/racing`, `/youtube`, `/rhythm`. Offline games use original procedural Canvas artwork and Web Audio synthesis (no third-party assets or music). Start each match, focus the typing field, and include spaces. Escape or loss of window focus pauses gameplay. Buttons spend earned energy. Shadow Battle has a sentinel followed by a 160-HP boss; every third enemy attack doubles damage. Shield absorbs 80% of the next hit, Dash dodges for two seconds. Racing starts after a three-second countdown; independent AI uses difficulty-specific pace.

`lib/games/controllers.ts` contains deterministic simulation and a pause-aware event adapter around the existing engine. `render.ts` draws the environments; `audio.ts` owns synthesized sound and cleanup. Music challenges pause after five idle seconds. Original Rhythm Mode runs at 120 BPM. Accuracy and combo are typing-based, not beat-window judgments.

YouTube requires a server-only `YOUTUBE_API_KEY` in `.env.local` with YouTube Data API v3 enabled. Without it, limited embed mode loads the full official video player while clearly marking duration and embedding availability as unverified. Metadata validates duration (maximum 300 seconds) and embedding before loading the official IFrame API. Network, quota, private-video, embedding and player errors are surfaced. YouTube playback is never controlled by typing penalties. Loading the player contacts YouTube. No cloud accounts or Phase 3 gameplay were added.

Correction: Ninja Battle is retired; `/ninja` redirects to `/games`. Racing uses a curved perspective coastal road with moving roadside scenery, kerbs, boost exhaust, gear/speed readouts and independent AI gap. Shadow attacks display the triggering word and damage; energy and enemy wind-up have dedicated indicators.

## Final video and racing correction

`/video-challenge` plays the original local 60-second Horizon Flight MP4 in a native HTML5 player. Generate it using `python scripts/generate-video.py` with Pillow and imageio-ffmpeg available under `.asset-tools`. Asset provenance is in `public/media/LICENSE.txt`. Start Game requests playback and begins typing; mistakes queue one-second seeks, serialized through seeked events and capped at the video end. Fifteen idle seconds pause both. Resume preserves position; Restart resets; Finish freezes results.

YouTube Start Game requests official playback but never seeks or pauses it. Errors advance only the separate challenge timeline. Fifteen seconds of inactivity pause only typing. Limited mode uses a 180-second challenge and does not verify duration; a server key enables metadata validation. No key was configured during development.

Racing now uses side-profile right-facing cars, actual-distance camera tracking, parallax scenery, road stripes, rotating wheels, checkpoints and a world-space finish line. All three difficulties retain independent AI. Easy penalties are more forgiving, while accurate word combos provide boosts.

## Phase 3 integration

Accounts, opt-in cloud merge, player profiles, badges, verified leaderboards and online lobbies are implemented. Supabase credentials and the additive migration are required. Run `npm run race:server` alongside Next.js for authoritative private races and Quick Match. See `DEPLOYMENT.md` for runtime constraints, setup, security boundaries and prelaunch checks. No public deployment, AdSense activation or external database setup has been performed.
