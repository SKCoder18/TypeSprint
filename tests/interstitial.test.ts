import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createInterstitialPolicy, DAY, interstitialConfiguration, type Context} from '../lib/advertising/interstitial';

class MemoryStore {
  values = new Map<string, string>();
  getItem(k: string) { return this.values.get(k) ?? null; }
  setItem(k: string, v: string) { this.values.set(k, v); }
}
const context: Context = {consent:true, privacyRestricted:false, enabled:true, pathname:'/', naturalTransition:true, gameplayOrPaused:false, mediaPlaying:false, submissionOrAuth:false};
test('server status stays disabled without approved placement, including when requested', () => {
  for (const flag of [undefined, 'false', 'true']) assert.equal(interstitialConfiguration(flag).enabled, false);
});
test('three distinct sessions required; repeat clicks/restarts do not count; rolling cap survives sessions', () => {
  const local = new MemoryStore(); let time = DAY;
  const visit = () => {const p = createInterstitialPolicy(local, new MemoryStore(), () => time); p.visit(context); return p;};
  const first = visit(); for (let i=0;i<10;i++) first.visit(context);
  assert.equal(first.reserve(context), false);
  assert.equal(visit().reserve(context), false);
  const third = visit(); assert.equal(third.reserve(context), true);
  assert.equal(third.reserve(context), false);
  visit(); visit(); assert.equal(visit().reserve(context), false);
  time += DAY - 1; assert.equal(visit().reserve(context), false);
  time += 1; assert.equal(visit().reserve(context), true);
});
test('arrival, gameplay, paused games, media, account, submission and all unsafe paths are excluded', () => {
  const local = new MemoryStore();
  for(let i=0;i<3;i++) createInterstitialPolicy(local,new MemoryStore()).visit(context);
  const p = createInterstitialPolicy(local,new MemoryStore()); p.visit(context);
  for(const patch of [{naturalTransition:false},{gameplayOrPaused:true},{mediaPlaying:true},{submissionOrAuth:true},
    ...['/practice','/games','/academy','/stories','/youtube','/online-racing','/account','/profile','/leaderboards','/unknown'].map(pathname=>({pathname}))]) {
    assert.equal(p.reserve({...context,...patch}), false);
  }
  assert.equal(p.reserve(context), true);
});
test('consent, GPC, disabled switch and storage failure decline safely', () => {
  for(const patch of [{consent:false},{privacyRestricted:true},{enabled:false}]) {
    const local = new MemoryStore(), p=createInterstitialPolicy(local,new MemoryStore());
    assert.equal(p.visit({...context,...patch}),false);
    assert.equal(p.reserve({...context,...patch}),false);
    p.record('requests',{...context,...patch}); assert.equal(local.values.size,0);
  }
  const broken={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  for(const [local,session] of [[broken,new MemoryStore()],[new MemoryStore(),broken]]) {
    const p=createInterstitialPolicy(local,session); assert.equal(p.visit(context),false); assert.equal(p.reserve(context),false);
  }
});
test('kill switch blocks reservations after eligibility; counters contain no content or identity', () => {
  const local=new MemoryStore();
  for(let i=0;i<3;i++) createInterstitialPolicy(local,new MemoryStore()).visit(context);
  const p=createInterstitialPolicy(local,new MemoryStore()); p.visit(context);
  assert.equal(p.reserve({...context,enabled:false}),false);
  p.record('typing_starts',context); p.record('typing_completions',context);
  const saved=JSON.parse([...local.values.values()][0]);
  assert.deepEqual(Object.keys(saved).sort(),['lastAttempt','metrics','visits']);
  assert.equal(saved.metrics.typing_completions,1);
  assert.equal(saved.metrics.displays,undefined);
});
test('corrupt state fails closed', () => {
  const local=new MemoryStore(); local.setItem('typesprint-interstitial-v1','invalid');
  const p=createInterstitialPolicy(local,new MemoryStore()); assert.equal(p.visit(context),false); assert.equal(p.reserve(context),false);
});
