// Genuine active publisher Smartlink 32025964. Not an impression endpoint.
export const homepageSmartlink = 'https://araplhn.org/4/0cc89b8b0fdda35d499e3a78cce0242d';
export function homepageAdConfiguration(flag: string | undefined) {
  return {enabled: flag === 'true', approval: 'active' as const, mode: 'homepage-clicks' as const};
}
