import {POND} from './world.js';

function fish(g,x,y,color=0xe8a25e,scale=1){
 g.fillStyle(color);g.fillEllipse(x,y,31*scale,12*scale);g.fillTriangle(x-13*scale,y,x-23*scale,y-10*scale,x-23*scale,y+10*scale);
 g.fillStyle(0xf6e4bb);g.fillEllipse(x+1*scale,y-1*scale,11*scale,11*scale);g.fillTriangle(x,y+2*scale,x-7*scale,y+12*scale,x+9*scale,y+4*scale);
 g.fillStyle(0x314e4c);g.fillRect(x+10*scale,y-3*scale,3*scale,3*scale);
}
export function drawPondLife(graphics,time){
 const g=graphics;g.clear();
 // Ambient swimming fish remain inside the pond. The scored leaps are separate events.
 for(let i=0;i<4;i++){
  const angle=time*.3+i*1.7,x=POND.x+Math.cos(angle)*(62+i*8),y=POND.y+Math.sin(angle)*33;
  fish(g,x,y,i%2?0xe3a665:0xe9dcbc,.58);
  g.lineStyle(1,0xd0e8c2,.4);g.strokeEllipse(x-12,y+4,25,8);
 }
 for(let i=0;i<3;i++){const phase=(time*.25+i/3)%1;g.lineStyle(1,0xc6dfbc,(1-phase)*.45);g.strokeEllipse(741+i*33,258+i*17,12+phase*34,4+phase*12);}
}
export function drawLunchEvent(scene,e,g){
 const t=e.age,x=e.x,y=e.y,ready=e.active;
 if(e.id==='koi'||e.id==='goldenkoi'){
  const golden=e.id==='goldenkoi',lift=ready?Math.max(0,Math.sin((t-1.6)*(golden?2.7:3)))*(golden?72:58):0;
  if(ready){fish(g,x,y-lift,golden?0xf4cf54:0xe78b51,golden?1.15:1);g.lineStyle(2,golden?0xf4d154:0xc8e6c9,.8);g.strokeEllipse(x,y+10,37+Math.sin(t*5)*8,12);if(lift>18){g.fillStyle(0xd7ede0);for(let i=0;i<5;i++)g.fillRect(x-26+i*12,y-10-Math.sin(t*5+i)*12,3,5);}}
  else{g.lineStyle(2,0xe9dfae,.8);g.strokeEllipse(x,y,36+Math.sin(t*4)*6,12);}
  e.active=ready&&lift>15;e.bounds={x:x-29,y:y-lift-15,width:54,height:34};
  return !ready?e.cue:golden?'A VERY RARE LUNCH GUEST!':'CATCH THE KOI IN THE AIR!';
 }
 if(e.id==='sandwich'){
  scene.eventPerson(x-35,y,0,t,ready);const progress=ready?Math.min(1,(t-1.6)/5.8):0,fx=x-58+progress*127,fy=y-87-Math.sin(progress*Math.PI)*20;
  g.fillStyle(0x4d6264);g.fillEllipse(fx,fy,27,14);g.fillStyle(0xdedfc8);g.fillEllipse(fx+9,fy-2,12,12);g.fillStyle(0xe3b15e);g.fillTriangle(fx+13,fy-2,fx+24,fy+1,fx+12,fy+3);g.fillStyle(0x334a4b);g.fillRect(fx+11,fy-5,2,2);
  const flap=Math.sin(t*10)*16;g.fillStyle(0x6d8080);g.fillTriangle(fx-5,fy,fx-23,fy-16-flap,fx+5,fy-3);
  if(ready){g.fillStyle(0xeac28b);g.fillTriangle(fx+13,fy+8,fx-1,fy+9,fx+9,fy+18);g.fillStyle(0x6e9961);g.fillRect(fx+2,fy+11,12,3);}
  e.bounds={x:fx-29,y:fy-36,width:60,height:60};return !ready?e.cue:null;
 }
 if(e.id==='toast'){
  scene.eventPerson(x-29,y,2,t,ready);scene.eventPerson(x+29,y,4,t,ready);
  const lift=ready?12+Math.sin(t*5)*3:0;for(const dx of [-13,13]){g.fillStyle(0xf3e6c3);g.fillRect(x+dx-5,y-49-lift,12,19);g.fillStyle(dx<0?0x6596b0:0xca8270);g.fillRect(x+dx-5,y-49-lift,12,5);g.fillStyle(0xe1d8b8);g.fillRect(x+dx,y-55-lift,2,9);}
  if(ready){g.lineStyle(2,0xf4d154);g.lineBetween(x-3,y-71,x,y-77);g.lineBetween(x+7,y-68,x+13,y-72);}
  e.bounds={x:x-49,y:y-79,width:98,height:84};return !ready?e.cue:'LUNCHTIME LEGENDS!';
 }
 if(e.id==='squirrel'){
  scene.eventPerson(x-48,y,5,t);const sx=ready?x-10+Math.sin((t-1.6)*2)*38:x,sy=y-6;
  g.fillStyle(0x946b47);g.fillEllipse(sx-16,sy-18,22,34);g.fillStyle(0xc69a64);g.fillEllipse(sx-17,sy-23,15,23);g.fillStyle(0xa77a4f);g.fillEllipse(sx,sy-5,28,19);g.fillRect(sx+7,sy-21,14,17);g.fillTriangle(sx+7,sy-20,sx+8,sy-29,sx+14,sy-20);g.fillStyle(0x33493c);g.fillRect(sx+17,sy-18,3,3);g.fillStyle(0xeac48c);g.fillEllipse(sx+19,sy-1,14,12);g.fillStyle(0x977343);g.fillRect(sx+18,sy-4,2,2);g.fillRect(sx+22,sy,2,2);g.fillStyle(0x775c43);g.fillRect(sx-7,sy+3,10,4);g.fillRect(sx+8,sy+3,10,4);
  e.bounds={x:sx-29,y:sy-39,width:58,height:49};return !ready?e.cue:null;
 }
 if(e.id==='leaves'){
  scene.eventPerson(x-21,y,1,t,ready);scene.eventPerson(x+24,y,3,t,ready);
  if(ready)for(let i=0;i<14;i++){const angle=t*1.8+i*2.3,lx=x+Math.cos(angle)*(25+i%4*10),ly=y-49+Math.sin(angle*.7)*(23+i%3*10);g.fillStyle([0xd3b85b,0xe8cb78,0x93ac63,0xc68b58][i%4]);g.fillRect(lx,ly,8,4);g.fillRect(lx+2,ly-2,4,8);}
  e.bounds={x:x-60,y:y-103,width:120,height:111};return !ready?e.cue:'NATURE’S PHOTO FILTER!';
 }
 return null;
}
