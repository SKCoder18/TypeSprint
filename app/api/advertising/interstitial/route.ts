import {homepageAdConfiguration} from '@/lib/advertising/homepage-config';

export function GET() {
  return Response.json(homepageAdConfiguration(process.env.TYPESPRINT_INTERSTITIAL_ENABLED), {
    headers: {'Cache-Control': 'no-store'},
  });
}
