type Store = Pick<Storage, 'getItem' | 'setItem'>;
const key = 'typesprint-homepage-ad-clicks-v1';
export type HomepageClick = {
  pathname: string;
  enabled: boolean;
  consent: boolean;
  privacyRestricted: boolean;
  trusted: boolean;
  button: number;
  modified: boolean;
};

// Separate from the retired three-visit experiment. No script or redirect is
// provided here: activation requires a verified publisher placement adapter.
// Use sessionStorage: navigation/reloading must not reset the tab's sequence.
export function countHomepageClick(storage: Store, click: HomepageClick) {
  if (click.pathname !== '/' || !click.enabled || !click.consent ||
    click.privacyRestricted || !click.trusted || click.button !== 0 || click.modified) {
    return {counted: false, opportunity: false};
  }
  try {
    const raw = storage.getItem(key);
    if (raw !== null && !/^(0|[1-9]\d*)$/.test(raw)) return {counted: false, opportunity: false};
    const previous = raw === null ? 0 : Number(raw);
    if (!Number.isSafeInteger(previous) || previous >= Number.MAX_SAFE_INTEGER) return {counted: false, opportunity: false};
    const count = previous + 1;
    storage.setItem(key, String(count));
    return {counted: true, opportunity: (count - 1) % 5 === 0};
  } catch {
    return {counted: false, opportunity: false};
  }
}
