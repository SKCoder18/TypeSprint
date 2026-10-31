// All tones are original synthesized audio, with no samples or third-party music.
export class Synth {
 context:AudioContext|null=null;volume=.18;step=-1;
 async unlock(){this.context??=new AudioContext();await this.context.resume();}
 tone(frequency=440,length=.12){const c=this.context;if(!c||c.state!=='running')return;const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=frequency;g.gain.setValueAtTime(this.volume,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+length);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+length);o.onended=()=>{o.disconnect();g.disconnect();};}
 beat(time:number){const step=Math.floor(time/.5);if(step===this.step)return;this.step=step;this.tone([220,277.18,329.63,440,329.63,277.18,246.94,329.63][step%8],.3);if(step%2===0)this.tone(65.41,.16);}
 pause(){void this.context?.suspend();}close(){void this.context?.close();this.context=null;}
}
