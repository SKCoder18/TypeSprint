import {TypingEngine} from '../engine';
export class VideoSession {
 elapsed=0;timeline=0;idle=0;penalties=0;state:'ready'|'running'|'paused'|'finished'='ready';reason='';engine:TypingEngine;
 constructor(public text:string,public duration:number,public skipPenalties=true,public mediaDriven=false){this.engine=new TypingEngine(text,3600,()=>this.elapsed*1000);}
 start(){if(this.state==='finished')return;this.state='running';this.idle=0;this.reason='';}
 pause(reason='Paused'){if(this.state==='running'){this.state='paused';this.reason=reason;}}
 finish(){this.state='finished';this.engine.end=this.elapsed*1000;}
 reset(){this.elapsed=this.timeline=this.idle=this.penalties=0;this.state='ready';this.reason='';this.engine.reset();}
 advance(dt:number,mediaTime?:number){if(this.state!=='running')return;const active=Math.min(Math.max(0,dt),15-this.idle,this.mediaDriven?Infinity:this.duration-this.timeline);this.elapsed+=active;this.idle+=active;this.timeline=this.mediaDriven?(mediaTime??this.timeline):this.timeline+active;if(this.timeline>=this.duration)this.finish();else if(this.idle>=15)this.pause('15 seconds without typing — Resume when ready');}
 key(key:string){if(this.state!=='running'||!(key==='Backspace'||key.length===1&&key>=' '&&key<='~'))return false;this.idle=0;const errors=this.engine.errors;this.engine.key(key);const mistake=this.engine.errors>errors;if(mistake&&this.skipPenalties){this.penalties++;if(!this.mediaDriven)this.timeline=Math.min(this.duration,this.timeline+1);}if(this.engine.snapshot().state==='finished'||this.timeline>=this.duration)this.finish();return mistake;}
}
// Single-flight seek queue. Every error adds exactly one second to the latest
// requested destination, even while the browser is still seeking there.
export class SeekQueue {
 target:number|null=null;pending=false;
 add(current:number,duration:number){this.target=Math.min(duration,Math.max(current,this.target??current)+1);if(this.pending)return null;this.pending=true;return this.target;}
 settled(current:number){if(this.target!==null&&Math.abs(current-this.target)>.08)return this.target;this.pending=false;this.target=null;return null;}
 reset(){this.target=null;this.pending=false;}
}

// Apply a queued penalty to the actual media element, not just the score.
export function seekMistake(video:{currentTime:number;duration:number},queue:SeekQueue){
 if(!Number.isFinite(video.duration)||video.duration<=0)return;
 const target=queue.add(video.currentTime,video.duration);
 if(target!==null)video.currentTime=target;
}
