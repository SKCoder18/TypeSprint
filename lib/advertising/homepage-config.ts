// Genuine active publisher Smartlink 32025964. Not an impression endpoint.
export const homepageSmartlink = 'https://araplhn.org/4/0cc89b8b0fdda35d499e3a78cce0242d';
export function homepagePlacement(hostname:string) {
  return hostname==='typeloria.pages.dev'
    ? {smartlink:'https://araplhn.org/4/2c257a1a8bb9c1fd3db40b924aca7a07',nativePath:'/typeloria.html'}
    : {smartlink:homepageSmartlink,nativePath:'/native.html'};
}
export function homepageAdConfiguration(flag: string | undefined) {
  return {enabled: flag === 'true', approval: 'active' as const, mode: 'homepage-clicks' as const};
}
