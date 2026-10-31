// Preparation only: no approved interstitial placement or network adapter exists.
export function interstitialConfiguration(flag: string | undefined) {
  return {requested: flag === 'true', enabled: false, approval: 'unverified' as const};
}

export const DAY = 24 * 60 * 60 * 1000;
const key = 'typesprint-interstitial-v1';
const sessionKey = key + '-session';
export type Metric = 'eligible_visits' | 'opportunities' | 'requests' | 'displays' | 'dismissals' | 'errors' | 'typing_starts' | 'typing_completions' | 'early_exits';
type State = {visits: number; lastAttempt: number | null; metrics: Partial<Record<Metric, number>>};
type Store = Pick<Storage, 'getItem' | 'setItem'>;
export type Context = {
  consent: boolean; privacyRestricted: boolean; enabled: boolean;
  pathname: string; naturalTransition: boolean; gameplayOrPaused: boolean;
  mediaPlaying: boolean; submissionOrAuth: boolean;
};
// Explicit safe-page allowlist; every game, result, login and matchmaking route is excluded.
const safePages = new Set(['/', '/about', '/learn', '/privacy', '/terms', '/contact']);

export function createInterstitialPolicy(local: Store, session: Store, now = Date.now) {
  let failed = false;
  let attempted = false;
  let visited = false;
  function read(): State {
    const raw = local.getItem(key);
    if (!raw) return {visits: 0, lastAttempt: null, metrics: {}};
    const state = JSON.parse(raw) as State;
    if (!Number.isSafeInteger(state.visits) || state.visits < 0 ||
      !(state.lastAttempt === null || (Number.isFinite(state.lastAttempt) && state.lastAttempt >= 0)) ||
      !state.metrics || typeof state.metrics !== 'object' ||
      Object.values(state.metrics).some(v => !Number.isSafeInteger(v) || v < 0)) throw Error('Invalid advertising preferences');
    return state;
  }
  function write(state: State) { local.setItem(key, JSON.stringify(state)); }
  const permitted = (c: Context) => c.consent && !c.privacyRestricted && c.enabled;
  function record(event: Metric, c: Context) {
    if (failed || !permitted(c)) return;
    try { const s = read(); s.metrics[event] = (s.metrics[event] ?? 0) + 1; write(s); }
    catch { failed = true; }
  }
  return {
    // Call once on a consented browsing session, never on restart/navigation.
    visit(c: Context) {
      if (failed || !permitted(c)) return false;
      try {
        const s = read();
        if (session.getItem(sessionKey) !== 'counted') {
          session.setItem(sessionKey, 'counted');
          s.visits += 1;
          s.metrics.eligible_visits = (s.metrics.eligible_visits ?? 0) + 1;
          write(s);
        }
        visited = true;
        return true;
      } catch { failed = true; return false; }
    },
    // Reserve before any future network request; failures also consume the cap.
    // Future integration must serialize cross-tab callers with Web Locks, or decline.
    reserve(c: Context) {
      if (failed || attempted || !visited || !permitted(c) || !c.naturalTransition ||
        !safePages.has(c.pathname) || c.gameplayOrPaused || c.mediaPlaying || c.submissionOrAuth) return false;
      try {
        const s = read(), time = now();
        if (s.visits < 3 || (s.lastAttempt !== null && time - s.lastAttempt < DAY)) return false;
        s.visits = 0;
        s.lastAttempt = time;
        s.metrics.opportunities = (s.metrics.opportunities ?? 0) + 1;
        write(s);
        attempted = true;
        return true;
      } catch { failed = true; return false; }
    },
    record,
  };
}
