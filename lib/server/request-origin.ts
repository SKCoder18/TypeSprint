// Keep the legacy site working while explicitly authorizing the new primary host.
export function allowedRequestOrigin(origin:string|null, requestUrl:string, siteUrl?:string, canonicalUrl?:string) {
  if (!origin) return false;
  try {
    const configured=[siteUrl,canonicalUrl].filter((url):url is string=>Boolean(url));
    const allowed=(configured.length?configured:[requestUrl]).map(url=>new URL(url).origin);
    return allowed.includes(origin);
  } catch { return false; }
}
