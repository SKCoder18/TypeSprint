export type Snapshot = {state:'ready'|'running'|'finished';input:string;elapsed:number;raw:number;correct:number;errors:number;corrected:number;uncorrected:number;accuracy:number;wpm:number;combo:number};
// Net WPM = currently correct characters / 5 / elapsed minutes. Corrections never inflate speed.
// Balanced penalty: record the error, reset combo, allow continued input and correction.
export class TypingEngine {
 input=''; raw=0; correct=0; errors=0; corrected=0; combo=0; start:number|null=null; end:number|null=null;
 penalties:{index:number;kind:'mistake'}[]=[];
 constructor(public target:string,public duration=60,private clock=()=>performance.now()){}
 reset(){this.input='';this.raw=this.correct=this.errors=this.corrected=this.combo=0;this.start=this.end=null;this.penalties=[];}
 tick(){if(this.start!==null&&this.end===null&&this.clock()-this.start>=this.duration*1000)this.end=this.start+this.duration*1000;return this.snapshot();}
 key(key:string){this.tick();if(this.end!==null)return;if(key==='Backspace'){if(this.input.length){if(this.input.at(-1)!==this.target[this.input.length-1])this.corrected++;this.input=this.input.slice(0,-1);}return;}if(key.length!==1||key<' '||key>'~')return;
 if(this.start===null)this.start=this.clock();this.raw++;if(key===this.target[this.input.length]){this.correct++;this.combo++;}else{this.errors++;this.combo=0;this.penalties.push({index:this.input.length,kind:'mistake'});}this.input+=key;if(this.input.length===this.target.length)this.end=this.clock();}
 snapshot():Snapshot{const elapsed=this.start===null?0:Math.max(0,((this.end??this.clock())-this.start)/1000);const uncorrected=[...this.input].filter((c,i)=>c!==this.target[i]).length;return {state:this.end!==null?'finished':this.start===null?'ready':'running',input:this.input,elapsed,raw:this.raw,correct:this.correct,errors:this.errors,corrected:this.corrected,uncorrected,accuracy:this.raw?100*this.correct/this.raw:100,wpm:elapsed?((this.input.length-uncorrected)/5)/(elapsed/60):0,combo:this.combo};}
}
