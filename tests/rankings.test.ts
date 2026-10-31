import {test} from 'node:test';import assert from 'node:assert/strict';import {RaceHub} from '../lib/multiplayer/hub';import {recordFinished,leaderboardRows,RaceRankings,weekKey} from '../lib/multiplayer/rankings';
test('personal best persists across lower scores, duplicates, cancellation, periods and sorting',()=>{
 let now=Date.parse('2026-10-31T12:00:00Z');const hub=new RaceHub(()=>now),rankings:RaceRankings={};
 function finish(kind:'private'|'ranked',chars:number,winner:string|null){const r=hub.create('one','Player One',kind);hub.join(r.code,'two','Player Two');r.status='finished';r.winner=winner;r.updated=now;for(const [i,p] of r.players.entries()){p.challenge.time=60;p.challenge.engine.start=0;p.challenge.engine.input=p.challenge.engine.target.slice(0,i===0?chars:50);}return r;}
 finish('private',300,'one');recordFinished(hub,rankings);recordFinished(hub,rankings);assert.equal(rankings.one.all.played,1);assert.equal(rankings.one.all.best_wpm,60);
 finish('ranked',100,'two');recordFinished(hub,rankings);assert.equal(rankings.one.all.played,2);assert.equal(rankings.one.all.best_wpm,60);assert.equal(rankings.one.all.wins,1);assert.equal(rankings.two.all.wins,1);
 const cancelled=hub.create('one','Player One');hub.join(cancelled.code,'two','Player Two');hub.leave(cancelled.code,'one');recordFinished(hub,rankings);assert.equal(rankings.one.all.played,2);
 assert.equal(leaderboardRows(rankings,'wpm')[0].user_id,'one');assert.equal(leaderboardRows(rankings,'wins')[0].user_id,'one');assert.equal(leaderboardRows(rankings,'rating')[0].rating,1010);assert.equal(leaderboardRows(rankings,'wpm',true,now).length,2);
 now=Date.parse('2026-11-02T00:00:00Z');assert.equal(weekKey(now),'2026-11-02');assert.equal(leaderboardRows(rankings,'wpm',true,now).length,0);assert.equal(leaderboardRows(rankings,'wpm',false,now)[0].best_wpm,60);
 finish('private',200,'two');recordFinished(hub,rankings);assert.equal(rankings.one.all.best_wpm,60);assert.equal(leaderboardRows(rankings,'wpm',true,now)[0].best_wpm,40);
});
