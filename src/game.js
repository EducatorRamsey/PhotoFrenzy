import {HALLWAY,COURTYARD} from './levels.js';
import {makeHallway,makeCourtyard,characterTexture} from './art.js';
import {evaluatePhoto} from './scoring.js';
import {canWalk} from './world.js';
import {drawPondLife,drawLunchEvent} from './courtyard.js';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rand=(min,max)=>min+Math.random()*(max-min);
export class HallwayScene extends Phaser.Scene {
 constructor(bridge){super('hallway');this.bridge=bridge;this.level=HALLWAY;this.ambientTime=0;this.mode='menu';this.elapsed=0;this.eventsLive=[];this.people=[];this.round=0;this.aim={x:330,y:310};this.aimMode='keyboard';this.moveFacing={x:0,y:-1};this.lastShot=-1;}
 create(){
  this.textures.addCanvas('hallway',makeHallway());this.textures.addCanvas('courtyard',makeCourtyard());this.background=this.add.image(0,0,'hallway').setOrigin(0);this.ambient=this.add.graphics().setDepth(1);
  for(let p=0;p<7;p++)for(let f=0;f<3;f++)this.textures.addCanvas(`person-${p}-${f}`,characterTexture(p,f));
  for(let f=0;f<3;f++)this.textures.addCanvas(`player-${f}`,characterTexture(0,f,true));
  this.eventGraphics=this.add.graphics().setDepth(210);this.particles=this.add.graphics().setDepth(800);
  for(let i=0;i<16;i++){const person={x:rand(70,930),y:rand(250,445),vx:rand(16,35)*(i%2?1:-1),palette:i%7};person.sprite=this.add.image(person.x,person.y,`person-${person.palette}-0`).setOrigin(.5,1).setDepth(person.y);this.people.push(person);}
  this.player={x:500,y:397};this.playerSprite=this.add.image(500,397,'player-0').setOrigin(.5,1).setDepth(397);
  this.playerLabel=this.add.text(0,0,'YOU',{fontFamily:'monospace',fontSize:'8px',color:'#263f42',backgroundColor:'#f4d154',padding:{x:4,y:2}}).setOrigin(.5,1).setDepth(900);
  this.halo=this.add.graphics().setDepth(204);this.bubble=this.add.text(0,0,'',{fontFamily:'monospace',fontSize:'9px',color:'#263f42',backgroundColor:'#f5ebc7',padding:{x:7,y:5}}).setDepth(700).setOrigin(.5,1).setVisible(false);
  this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,SPACE,E,I,J,K,L,SHIFT');
  this.input.keyboard.addCapture(['SPACE','UP','DOWN','LEFT','RIGHT']);
  this.input.on('pointermove',p=>{if(this.mode==='playing'){this.aim={x:p.x,y:p.y};this.aimMode='mouse';}});
  this.input.on('pointerdown',p=>{if(this.mode==='playing'&&p.leftButtonDown()){this.aim={x:p.x,y:p.y};this.aimMode='mouse';this.requestShot();}});
  this.input.keyboard.on('keydown-SPACE',e=>{if(this.mode==='playing'&&!e.repeat)this.requestShot();});
  this.input.keyboard.on('keydown-E',e=>{if(this.mode==='playing'&&!e.repeat)this.interact();});
  
  this.bridge.onReady(this);this.spawnEvent('plane',300,315);this.nextEvent=4;this.nextQuip=6;
 }
 // The same movement/capture systems serve both locations; level data supplies the event pool.
 setLevel(level){
  this.level=level;this.background.setTexture(level.texture);this.ambient.clear();
  for(let i=0;i<this.people.length;i++){const p=this.people[i];p.x=level===COURTYARD?70+(i*127)%450:rand(70,930);p.y=level===COURTYARD?[180,315,475][i%3]:rand(250,445);p.sprite.setPosition(p.x,p.y).setDepth(p.y);}
 }
 start(level=HALLWAY){
  this.round++;this.setLevel(level);this.mode='playing';this.elapsed=0;this.ambientTime=0;this.photos=[];this.score=0;this.film=level.film;
  this.lastShot=-1;this.pendingShot=false;this.capturing=false;this.ending=false;this.seen=new Set();
  Object.assign(this.player,level.start);this.aim={...level.aim};this.aimMode='mouse';this.eventsLive=[];this.eventGraphics.clear();this.bubble.setVisible(false);
  this.secretScheduled=false;this.secretAt=null;this.bubbleUntil=0;
  this.eventQueue=Phaser.Utils.Array.Shuffle(level.events.filter(e=>e.id!==level.firstEvent.id&&e.id!==level.secretId).map(e=>e.id));
  this.spawnEvent(level.firstEvent.id,level.firstEvent.x,level.firstEvent.y);this.nextEvent=5;this.nextQuip=8;this.input.keyboard.resetKeys();this.bridge.onUpdate(this);
 }
 pause(){if(this.mode==='playing'){this.mode='paused';this.input.keyboard.resetKeys();}}
 resume(){if(this.mode==='paused'){this.mode='playing';this.input.keyboard.resetKeys();}}
 menu(){this.mode='menu';this.setLevel(HALLWAY);this.eventsLive=[];this.eventGraphics.clear();this.bubble.setVisible(false);this.input.keyboard.resetKeys();}
 get frame(){return {x:clamp(this.aim.x-this.level.frame.width/2,0,1000-this.level.frame.width),y:clamp(this.aim.y-this.level.frame.height/2,15,490-this.level.frame.height),...this.level.frame};}
 requestShot(){if(this.mode!=='playing'||this.film<=0||this.elapsed-this.lastShot<.4||this.pendingShot)return;this.pendingShot=true;}
 spawnEvent(id,x,y){const def=this.level.events.find(e=>e.id===id);if(!def)return;const e={...def,uid:`${this.round}-${this.elapsed}-${Math.random()}`,x:x??rand(140,840),y:y??rand(275,430),age:0,active:false,shots:0,bounds:{x:0,y:0,width:1,height:1}};if(id==='sasquatch'){e.x=440;e.y=140;}if(this.level===COURTYARD){if(id==='koi'||id==='goldenkoi'){e.x=id==='koi'?775:805;e.y=275;}else if(x===undefined){e.x=['sandwich','toast'].includes(id)?(Math.random()<.5?165:405):590;e.y=['sandwich','toast'].includes(id)?(Math.random()<.5?315:470):335;}}this.eventsLive.push(e);if(this.mode==='playing')this.bridge.sound.event(id);return e;}
 interact(){const near=this.nearby();if(this.level===COURTYARD){if(near==='pond'){this.bridge.message('The koi are accepting compliments. The golden one is shy.');if(!this.secretScheduled){this.secretScheduled=true;this.secretAt=this.elapsed+rand(3,5);}}else if(near==='bench')this.bridge.message('The best seat in school. Please do not interview the tree.');else if(near==='table')this.bridge.message('Reserved for sandwiches and highly questionable journalism.');else this.bridge.message(this.level.quips[Math.floor(rand(0,this.level.quips.length))]);return;}if(near==='window'){this.bridge.message('The trees are… suspiciously hairy.');if(!this.secretScheduled&&!this.eventsLive.some(e=>e.id==='sasquatch')){this.secretScheduled=true;this.secretAt=this.elapsed+rand(3,5);}}else if(near==='fountain')this.bridge.message('Hydrated. Still underpaid. +0');else if(near==='classroom')this.bridge.message('TODAY’S LESSON: Think big. Then nap.');else{const person=this.people.find(p=>Math.hypot(p.x-this.player.x,p.y-this.player.y)<65);this.bridge.message(person?this.level.quips[Math.floor(rand(0,this.level.quips.length))]:'Get close to a student, classroom, fountain, or window.');}}
 nearby(){const p=this.player;if(this.level===COURTYARD){if([{x:615,y:187},{x:850,y:437}].some(b=>Math.hypot(p.x-b.x,p.y-b.y)<70))return 'bench';if(Math.hypot(p.x-785,p.y-280)<200)return 'pond';if([{x:165,y:235},{x:405,y:235},{x:165,y:400},{x:405,y:400}].some(b=>Math.hypot(p.x-b.x,p.y-b.y)<100))return 'table';if(this.people.some(n=>Math.hypot(n.x-p.x,n.y-p.y)<55))return 'student';return null;}if(Math.hypot(p.x-440,p.y-220)<95)return 'window';if(Math.hypot(p.x-760,p.y-220)<75)return 'fountain';if(Math.hypot(p.x-265,p.y-220)<80)return 'classroom';if(this.people.some(n=>Math.hypot(n.x-p.x,n.y-p.y)<55))return 'student';return null;}
 update(_time,rawDelta){if(!this.playerSprite)return;const dt=Math.min(rawDelta/1000,.05);const moving=this.mode==='playing'||this.mode==='menu';
  if(moving){this.ambientTime+=dt;
   if(this.mode==='playing')this.elapsed+=dt;
   const k=this.keys;let dx=0,dy=0;
   if(this.mode==='playing'){
    if(!k.SHIFT.isDown){dx=Number(k.D.isDown||k.RIGHT.isDown)-Number(k.A.isDown||k.LEFT.isDown);dy=Number(k.S.isDown||k.DOWN.isDown)-Number(k.W.isDown||k.UP.isDown);}
    if(dx||dy){const length=Math.hypot(dx,dy);const nx=clamp(this.player.x+dx/length*this.level.speed*dt,40,960),ny=clamp(this.player.y+dy/length*this.level.speed*dt,this.level.minY,478);if(canWalk(this.level,nx,this.player.y))this.player.x=nx;if(canWalk(this.level,this.player.x,ny))this.player.y=ny;this.moveFacing={x:dx/length,y:dy/length};}
    const ax=Number(k.L.isDown||(k.SHIFT.isDown&&k.RIGHT.isDown))-Number(k.J.isDown||(k.SHIFT.isDown&&k.LEFT.isDown));
    const ay=Number(k.K.isDown||(k.SHIFT.isDown&&k.DOWN.isDown))-Number(k.I.isDown||(k.SHIFT.isDown&&k.UP.isDown));
    if(ax||ay){this.aim.x+=ax*220*dt;this.aim.y+=ay*220*dt;this.aimMode='keys';}
    if(this.aimMode==='keyboard'){this.aim={x:this.player.x+this.moveFacing.x*105,y:this.player.y-22+this.moveFacing.y*105};}
    this.aim.x=clamp(this.aim.x,100,900);this.aim.y=clamp(this.aim.y,82,423);
    const vx=this.aim.x-this.player.x,vy=this.aim.y-(this.player.y-22),distance=Math.hypot(vx,vy);if(distance>this.level.range){this.aim.x=this.player.x+vx/distance*this.level.range;this.aim.y=this.player.y-22+vy/distance*this.level.range;}
   }
   const anim=Math.floor(this.time.now/160)%4;const frame=anim===1?1:anim===3?2:0;
   for(const p of this.people){p.x+=p.vx*dt;if(p.x<48||p.x>(this.level===COURTYARD?535:952))p.vx*=-1;p.sprite.setPosition(p.x,p.y).setDepth(p.y).setTexture(`person-${p.palette}-${frame}`);}
   this.playerSprite.setPosition(this.player.x,this.player.y).setDepth(this.player.y).setTexture(`player-${dx||dy?frame:0}`);
   for(const e of this.eventsLive)e.age+=dt;
   this.eventsLive=this.eventsLive.filter(e=>e.age<e.duration);
   if(this.mode==='playing'){
    if(this.elapsed>=this.nextEvent){let id=this.eventQueue.length?this.eventQueue.shift():this.level.events.filter(e=>e.id!==this.level.secretId)[Math.floor(rand(0,5))].id;if(this.elapsed>20&&Math.random()<.12&&!this.secretScheduled){id=this.level.secretId;this.secretScheduled=true;}this.spawnEvent(id);this.nextEvent=this.elapsed+rand(4.8,6.2);}
    if(this.secretAt&&this.elapsed>=this.secretAt){this.spawnEvent(this.level.secretId);this.secretAt=null;}
    if(this.elapsed>=this.nextQuip){const p=this.people[Math.floor(rand(0,this.people.length))];this.bubble.setText(this.level.quips[Math.floor(rand(0,this.level.quips.length))]).setPosition(clamp(p.x,130,870),p.y-59).setVisible(true);this.bubbleUntil=this.elapsed+2.8;this.nextQuip=this.elapsed+rand(9,13);}
    if(this.elapsed>this.bubbleUntil)this.bubble.setVisible(false);
   }
  }
  if(this.level===COURTYARD)drawPondLife(this.ambient,this.ambientTime);
  this.drawEvents();this.playerLabel.setPosition(this.player.x,this.player.y-60);this.halo.clear();this.halo.lineStyle(2,0xf4d154,.8);this.halo.strokeEllipse(this.player.x,this.player.y-1,38,13);
  if(this.mode==='playing'){
   this.bridge.onUpdate(this);
   if(this.pendingShot){this.pendingShot=false;this.takeShot();}
   if((this.elapsed>=this.level.duration||this.film===0)&&!this.ending){this.ending=true;this.mode='finishing';if(!this.capturing)this.finish();}
  }
 }
 drawEvents(){const g=this.eventGraphics;g.clear();for(const e of this.eventsLive){const t=e.age; e.active=t>=1.6&&t<e.duration-.5;const ready=e.active;const x=e.x,y=e.y;
  // All drawings and hit bounds use the same animation coordinates.
  let lunchCue=null;
  if(this.level===COURTYARD){lunchCue=drawLunchEvent(this,e,g);}
  else if(e.id==='sasquatch'){
   if(ready){const sx=440+Math.sin(t*1.7)*37;g.fillStyle(0x695641);g.fillRect(sx-15,89,30,52);g.fillRect(sx-21,103,8,31);g.fillRect(sx+13,103,8,31);g.fillStyle(0x8f7754);g.fillRect(sx-11,78,22,27);g.fillStyle(0xc5b88c);g.fillRect(sx-8,87,17,12);g.fillStyle(0x2b3a35);g.fillRect(sx-6,87,3,3);g.fillRect(sx+4,87,3,3);g.fillRect(sx-2,95,7,2);g.fillStyle(0xe1dfb6);g.fillRect(439,50,5,99);g.fillRect(365,96,154,5);e.bounds={x:sx-24,y:76,width:48,height:68};}else e.bounds={x:411,y:77,width:54,height:65};
  }else if(e.id==='plane'){
   this.eventPerson(x-45,y,0,t);const px=ready?x-55+((t-1.6)/(e.duration-2.1))*125:x-34,py=ready?y-65-Math.sin((t-1.6)*1.2)*17:y-35;
   g.fillStyle(0x3a5c60,.18);g.fillEllipse(px,y,22,6);g.fillStyle(0xfff3cc);g.fillTriangle(px-14,py+3,px+17,py-6,px-4,py+13);g.lineStyle(2,0xa7b6a3);g.lineBetween(px-4,py+13,px,py+1);g.lineStyle(1,0xeff0c9,.7);g.lineBetween(px-30,py+6,px-20,py+4);g.lineBetween(px-40,py+10,px-29,py+8);e.bounds={x:px-18,y:py-9,width:40,height:28};
  }else if(e.id==='jump'){
   const lift=ready?Math.max(0,Math.sin((t-1.6)*3.6))*44:0;this.eventPerson(x-25,y-lift,2,t,lift>10);this.eventPerson(x+25,y-lift,4,t,lift>10);e.active=ready&&lift>18;e.bounds={x:x-43,y:y-lift-53,width:86,height:55};if(lift>15){g.lineStyle(2,0xf0df9b,.6);g.lineBetween(x-43,y-8,x-43,y-18);g.lineBetween(x+43,y-8,x+43,y-18);}
  }else if(e.id==='bomb'){
   this.eventPerson(x-25,y,1,t);const lift=ready?18+Math.sin(t*5)*10:0;this.eventPerson(x+25,y-lift,5,t,ready);if(ready){g.fillStyle(0xf5e4ac);g.fillTriangle(x+34,y-70-lift,x+39,y-82-lift,x+43,y-71-lift);}e.bounds={x:x-44,y:y-lift-62,width:89,height:70+lift};
  }else if(e.id==='bag'){
   this.eventPerson(x-32,y,3,t);g.fillStyle(0xb2685f);g.fillRoundedRect(x-3,y-20,24,24,3);g.fillStyle(0xdeb78a);g.fillRect(x+2,y-14,14,3);if(ready){for(let i=0;i<9;i++){const spread=Math.min(1,(t-1.6)*2),px=x+12+Math.cos(i*2.4)*spread*47,py=y+Math.sin(i*2.4)*spread*18;g.fillStyle([0xeedb9b,0x66899a,0xd18976][i%3]);g.fillRect(px,py,9,i%2?4:8);}}e.bounds={x:x-45,y:y-55,width:105,height:80};
  }else if(e.id==='dance'){
   for(let i=0;i<3;i++){const lift=ready?Math.sin(t*8+i)*9:0;this.eventPerson(x+(i-1)*34+(ready?Math.sin(t*6+i)*5:0),y-lift,i+2,t,ready);if(ready){const nx=x+(i-1)*37,ny=y-70+Math.sin(t*4+i)*8;g.fillStyle([0xf5d35a,0xd2837c,0x547c82][i]);g.fillCircle(nx,ny,3);g.fillRect(nx+2,ny-12,2,12);g.fillRect(nx+3,ny-12,6,3);}}e.bounds={x:x-58,y:y-84,width:116,height:100};
  }
  // Preparatory cues stay visible long enough to approach and frame the action.
  const cue=this.level===COURTYARD?lunchCue:!ready?e.cue:e.id==='jump'?'GET BOTH IN THE AIR!':e.id==='sasquatch'?'…DEFINITELY NOT A TREE.':e.id==='dance'?'UNSCHEDULED CHOREOGRAPHY':null;
  e.cueText ||= this.add.text(0,0,'',{fontFamily:'monospace',fontSize:'8px',color:'#2a4545',backgroundColor:'#f1d472',padding:{x:5,y:4}}).setOrigin(.5,1).setDepth(750);
  e.cueText.setText(cue||'').setPosition(clamp(x,100,900),e.id==='sasquatch'?66:y-100).setVisible(!!cue);
 }
 // Clean text objects for events that expired or were cleared by restart.
 const live=new Set(this.eventsLive.map(e=>e.cueText));for(const text of this.children.list.filter(o=>o.type==='Text'&&o!==this.playerLabel&&o!==this.bubble)){if(!live.has(text))text.destroy();}
 }
 eventPerson(x,y,palette,t,arms=false){const g=this.eventGraphics;const skins=[0xecb389,0x9f7156,0xd7a787,0x845e4e,0xe7bd92,0xb98561];const shirts=[0xdca85a,0xc87972,0x7daab1,0xa9b67d,0xad8dad,0xdfc36e];g.fillStyle(0x3b6150,.2);g.fillEllipse(x,y+1,30,8);g.fillStyle(0x3b5161);g.fillRect(x-9,y-18,7,18);g.fillRect(x+3,y-18,7,18);g.fillStyle(0x283e49);g.fillRect(x-11,y-3,10,4);g.fillRect(x+3,y-3,10,4);g.fillStyle(shirts[palette%6]);g.fillRect(x-12,y-36,24,21);g.fillStyle(skins[palette%6]);if(arms){g.fillRect(x-18,y-49,6,24);g.fillRect(x+12,y-49,6,24);}else{g.fillRect(x-17,y-34,5,17);g.fillRect(x+12,y-34,5,17);}g.fillRect(x-10,y-54,21,20);g.fillStyle(0x3e3c3d);g.fillRect(x-11,y-55,22,7);g.fillRect(x-11,y-49,4,8);g.fillStyle(0x2b3b3d);g.fillRect(x-6,y-44,3,3);g.fillRect(x+5,y-44,3,3);g.fillStyle(0xf2d3a0);g.fillRect(x-1,y-37,5,2);}
 takeShot(){this.lastShot=this.elapsed;this.film--;const result=evaluatePhoto(this.frame,this.eventsLive,this.people,this.seen,{portraitName:this.level===COURTYARD?'Lunch Portrait':'Hallway Portrait',emptyName:this.level===COURTYARD?'Quiet Courtyard':'Empty Hallway'});const event=this.eventsLive.find(e=>e.uid===result.instance);if(event)event.shots++;if(result.success)this.seen.add(result.eventId);this.score+=result.points;const frame={...this.frame},round=this.round;this.capturing=true;
  this.bridge.sound.shutter();if(result.points>=100)this.bridge.sound.good();this.bridge.onFlash();
  // Crop the actual Phaser canvas only after its current frame has finished rendering.
  this.game.events.once(Phaser.Core.Events.POST_RENDER,()=>{if(round!==this.round)return;try{const canvas=document.createElement('canvas');canvas.width=400;canvas.height=266;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(this.game.canvas,frame.x,frame.y,frame.width,frame.height,0,0,400,266);const photo={...result,levelId:this.level.id,levelTitle:this.level.title,image:canvas.toDataURL('image/png'),time:this.elapsed,index:this.photos.length};this.photos.push(photo);this.bridge.onPhoto(photo,this);}catch(error){console.error('Photo capture failed',error);this.bridge.message('Photo capture failed. Please reload the game.');}this.capturing=false;if(this.ending)this.finish();});
  this.bridge.message(`${result.feedback} +${result.points}`);
 }
 finish(){if(this.mode==='ended')return;this.mode='ended';this.input.keyboard.resetKeys();this.bridge.onEnd(this);}
}
