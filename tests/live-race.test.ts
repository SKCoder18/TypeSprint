import {test} from 'node:test';import assert from 'node:assert/strict';import {liveRace,RaceStore} from '../lib/server/live-race';import {StoredHub} from '../lib/multiplayer/durable';
test('local-profile rooms survive server instances and simultaneous writes, race, finish and reject outsiders',async t=>{
 let now=100000; t.mock.method(Date,'now',()=>now);let revision=0,state:StoredHub|null=null,conflicts=0;
 const store:RaceStore={async load(){return {revision,state:structuredClone(state)};},async save(expected,next){if(expected!==revision){conflicts++;return false;}state=structuredClone(next);revision++;return true;}};
 const a={token:'a'.repeat(64),name:'Player One'},b={token:'b'.repeat(64),name:'Player Two'},c={token:'c'.repeat(64),name:'Outsider'};
 const send=(player:typeof a,action:string,extra:Record<string,unknown>={})=>liveRace({player,action,...extra},store);
 await assert.rejects(liveRace({action:'create'},store),/local profile/);
 const room=await send(a,'create');assert.equal(room.players[0].name,a.name);assert.equal(room.verified,false);assert.ok(!JSON.stringify(state).includes(a.token));
 const code=room.code;await send(b,'join',{code});await assert.rejects(send(c,'poll',{code}),/denied/);
 await Promise.all([send(a,'ready',{code}),send(b,'ready',{code})]);assert.ok(conflicts>0);const start=await send(a,'poll',{code});assert.equal(start.status,'countdown');assert.equal(start.players.length,2);
 now+=3000;await send(a,'poll',{code});const opponent=await send(b,'poll',{code});assert.equal(opponent.status,'racing');const moving=await send(a,'input',{code,seq:1,keys:[opponent.passage[0]]});assert.equal(moving.sequence,1);assert.equal(moving.players.find(p=>p.id===moving.you)?.input,opponent.passage[0]);now+=100;const next=await send(b,'poll',{code});assert.ok(next.players.find(p=>p.id===moving.you)!.distance>0);await send(a,'input',{code,seq:1,keys:['x']});await assert.rejects(send(a,'input',{code,seq:3,keys:['x']}),/sequence/);
 state!.rooms[0].players[0].distance=1399;state!.rooms[0].players[0].speed=100;now+=100;const finish=await send(a,'poll',{code});assert.equal(finish.status,'finished');assert.equal(finish.winner,moving.you);assert.equal((await send(b,'poll',{code})).winner,moving.you);
 const queued=await send(a,'queue');assert.equal((await send(b,'queue')).code,queued.code);assert.equal((await send(b,'leave',{code:queued.code})).status,'cancelled');assert.equal((await send(a,'poll',{code:queued.code})).status,'cancelled');const expire=await send(a,'create');now+=31000;assert.equal((await send(a,'poll',{code:expire.code})).status,'cancelled');
});
