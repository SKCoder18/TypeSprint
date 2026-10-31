import {interstitialConfiguration} from '@/lib/advertising/interstitial';

export function GET() {
  return Response.json(interstitialConfiguration(process.env.TYPESPRINT_INTERSTITIAL_ENABLED), {
    headers: {'Cache-Control': 'no-store'},
  });
}
