// Original Web Audio effects; audio starts only after a player gesture.
export class Sound {
 constructor(){this.muted=false;this.ctx=null;}
 unlock(){try{this.ctx ||= new (window.AudioContext||window.webkitAudioContext)();if(this.ctx.state==='suspended')this.ctx.resume();}catch{}}
 tone(freq=440,duration=.1,shape='square',volume=.025,delay=0){if(this.muted||!this.ctx)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=shape;o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(volume,t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g).connect(this.ctx.destination);o.start(t);o.stop(t+duration);}
 shutter(){this.tone(170,.035,'sawtooth',.07);this.tone(75,.07,'square',.05,.04);}
 good(){[523,659,784].forEach((f,i)=>this.tone(f,.15,'triangle',.06,i*.065));}
 event(id){const f=id==='sasquatch'?90:id==='dance'?330:480;this.tone(f,.08);this.tone(f*1.5,.12,'triangle',.04,.11);}
 click(){this.tone(600,.04,'triangle',.04);}
}
