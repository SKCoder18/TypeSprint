import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allowedRequestOrigin} from '../lib/server/request-origin';
import gateway from '../workers/typeloria-pages/public/_worker.js';
const PUBLIC_ORIGIN='https://typeloria.pages.dev';
test('API writes allow only the explicit primary and legacy origins',()=>{
  const legacy='https://typesprint.typesprint-sk18.workers.dev';
  for(const origin of [PUBLIC_ORIGIN,legacy]) assert.equal(allowedRequestOrigin(origin,PUBLIC_ORIGIN+'/api/live-race',legacy,PUBLIC_ORIGIN),true);
  for(const origin of [null,'null','https://outside.example',PUBLIC_ORIGIN+'.outside.example','http://typeloria.pages.dev']) assert.equal(allowedRequestOrigin(origin,PUBLIC_ORIGIN,legacy,PUBLIC_ORIGIN),false);
  assert.equal(allowedRequestOrigin(PUBLIC_ORIGIN,PUBLIC_ORIGIN,'not a URL',PUBLIC_ORIGIN),false);
});
test('new address forwards URL, body and security headers to the existing application unchanged',async()=>{
  const request=new Request(PUBLIC_ORIGIN+'/api/live-race?room=example',{method:'POST',headers:{Origin:PUBLIC_ORIGIN,Authorization:'Bearer test-only'},body:'{"action":"join"}'});
  const response=await gateway.fetch(request,{PUBLIC_ORIGIN,APP:{async fetch(received:Request){
    assert.equal(received.url,request.url); assert.equal(received.headers.get('Origin'),PUBLIC_ORIGIN);
    assert.equal(received.headers.get('Authorization'),'Bearer test-only');
    assert.equal(await received.text(),'{"action":"join"}');
    return new Response('ok',{headers:{'Set-Cookie':'test=1; HttpOnly; Secure; SameSite=Lax'}});
  }}});
  assert.equal(await response.text(),'ok'); assert.match(response.headers.get('Set-Cookie')??'',/HttpOnly/);
});
test('preview addresses redirect to the production host without allowing external redirect paths',async()=>{
  let calls=0;const env={PUBLIC_ORIGIN,APP:{fetch(){calls++;}}};
  for(const path of ['/practice?duration=60','//outside.example/']){
    const r=await gateway.fetch(new Request('https://preview.typeloria.pages.dev'+path),env);
    assert.equal(r.status,308);const location=r.headers.get('Location');assert.ok(location);assert.equal(new URL(location).origin,PUBLIC_ORIGIN);
  }
  assert.equal(calls,0);
});
test('backend failures return a temporary response without leaking errors or caching failure',async()=>{
  const r=await gateway.fetch(new Request(PUBLIC_ORIGIN),{PUBLIC_ORIGIN,APP:{fetch(){throw Error('private details');}}});
  assert.equal(r.status,503);assert.equal(r.headers.get('Cache-Control'),'no-store');assert.doesNotMatch(await r.text(),/private details/);
});
