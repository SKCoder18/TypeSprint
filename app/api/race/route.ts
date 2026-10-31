import {NextRequest,NextResponse} from 'next/server';import {sameOrigin,failure} from '@/lib/server/supabase';import {liveRace} from '@/lib/server/live-race';import {RateLimit} from '@/lib/server/validation';
const limit=new RateLimit();
export async function POST(request:NextRequest){try{sameOrigin(request);const text=await request.text();if(text.length>5000)throw Error('Request too large.');limit.check(request.headers.get('x-forwarded-for')??'local',600);return NextResponse.json(await liveRace(JSON.parse(text)),{headers:{'Cache-Control':'no-store'}});}catch(e){return failure(e,400);}}
