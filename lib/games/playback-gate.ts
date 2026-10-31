// One animation loop calls sync; no per-keystroke playback timers.
export class PlaybackGate {
 until=0;generation=0;pending=false;
 constructor(public windowMs=300){}
 stop(video:HTMLMediaElement){this.until=0;this.generation++;video.pause();}
 correct(now:number){this.until=now+this.windowMs;}
 sync(video:HTMLMediaElement,now:number,running:boolean,seeking:boolean,onError:(message:string)=>void){
  if(!running||seeking||now>=this.until){if(!video.paused||this.pending){this.generation++;video.pause();}return;}
  if(!video.paused||this.pending)return;
  const generation=++this.generation;this.pending=true;
  void video.play().then(()=>{if(generation!==this.generation||!running||performance.now()>=this.until)video.pause();}).catch(()=>{if(generation===this.generation){this.until=0;onError('Playback blocked or unavailable. Try another correct key, or check this video format.');}}).finally(()=>{this.pending=false;});
 }
}
