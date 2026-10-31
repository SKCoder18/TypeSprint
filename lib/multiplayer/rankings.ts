import type {RaceHub} from './hub';
export type RaceTotals={wins:number;played:number;best_wpm:number};
export type RaceRankings=Record<string,{display_name:string;all:RaceTotals;weeks:Record<string,RaceTotals>}>;
export function weekKey(timestamp:number){const date=new Date(timestamp);date.setUTCHours(0,0,0,0);date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);return date.toISOString().slice(0,10);}
export function recordFinished(hub:RaceHub,rankings:RaceRankings){for(const room of hub.rooms.values()){
 if(room.status!=='finished'||room.persisted||room.players.length!==2)continue;
 for(const player of room.players){const entry=rankings[player.id]??={display_name:player.name,all:{wins:0,played:0,best_wpm:0},weeks:{}};entry.display_name=player.name;const week=weekKey(room.updated),weekly=entry.weeks[week]??={wins:0,played:0,best_wpm:0};const wpm=Math.round(Math.max(0,Math.min(500,player.challenge.engine.snapshot().wpm)));
 for(const totals of [entry.all,weekly]){totals.played++;if(room.winner===player.id)totals.wins++;totals.best_wpm=Math.max(totals.best_wpm,wpm);}
 for(const stale of Object.keys(entry.weeks).sort().reverse().slice(8))delete entry.weeks[stale];
 }room.persisted=true;
}}
export function leaderboardRows(rankings:RaceRankings,sort:string,weekly=false,now=Date.now()){
 return Object.entries(rankings).flatMap(([user_id,entry])=>{const totals=weekly?entry.weeks[weekKey(now)]:entry.all;if(!totals?.played)return [];return [{user_id,display_name:entry.display_name,...totals,rating:Math.max(0,1000+20*totals.wins-10*(totals.played-totals.wins))}];}).sort((a,b)=>(sort==='wins'?b.wins-a.wins:sort==='rating'?b.rating-a.rating:b.best_wpm-a.best_wpm)||b.best_wpm-a.best_wpm||a.user_id.localeCompare(b.user_id)).slice(0,50);
}
