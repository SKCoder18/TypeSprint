'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {countHomepageClick} from '@/lib/advertising/homepage-clicks';
import {homepageSmartlink} from '@/lib/advertising/homepage-config';

export default function HomepageClickAds({enabled}:{enabled:boolean}) {
  const pathname = usePathname();
  useEffect(() => {
    if (!enabled || pathname !== '/') return;
    function onClick(event: MouseEvent) {
      // Recheck the live URL because an SPA navigation may precede effect cleanup.
      if (window.location.pathname !== '/' || event.defaultPrevented) return;
      const target = event.target;
      // Never intercept privacy choices, ad content, form inputs or editable text.
      if (target instanceof Element && target.closest('.sponsor-panel, input, textarea, select, [contenteditable="true"], [data-no-click-ad]')) return;
      try {
        const result = countHomepageClick(sessionStorage, {
          pathname: window.location.pathname, enabled,
          consent: localStorage.getItem('typesprint-sponsored-consent') === 'allow',
          privacyRestricted: (navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl === true,
          trusted: event.isTrusted, button: event.button,
          modified: event.ctrlKey || event.metaKey || event.shiftKey || event.altKey,
        });
        if (!result.opportunity) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(homepageSmartlink);
      } catch { /* Storage unavailable: keep normal navigation working. */ }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [enabled, pathname]);
  if (!enabled || pathname !== '/') return null;
  return <p className="hero-note" data-no-click-ad>Advertising notice: with sponsored content allowed, homepage clicks 1, 6, 11… open an advertiser page. Use your browser’s Back button to return. Other pages have no click redirects.</p>;
}
