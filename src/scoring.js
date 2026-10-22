// Score only visible subjects. Every event supplies the bounds of its animated action.
export function insideFraction(frame, box) {
 const w=Math.max(0,Math.min(frame.x+frame.width,box.x+box.width)-Math.max(frame.x,box.x));
 const h=Math.max(0,Math.min(frame.y+frame.height,box.y+box.height)-Math.max(frame.y,box.y));
 return w*h/(box.width*box.height);
}
export function evaluatePhoto(frame, events, people, seen = new Set()) {
 let best=null;
 for(const e of events){
  const visible=insideFraction(frame,e.bounds);
  if(visible<.15) continue;
  const dx=(e.bounds.x+e.bounds.width/2-frame.x-frame.width/2)/(frame.width/2);
  const dy=(e.bounds.y+e.bounds.height/2-frame.y-frame.height/2)/(frame.height/2);
  const centered=Math.max(0,1-Math.hypot(dx,dy)/1.4);
  const timing=e.active?Math.round(e.value*.42):10;
  const framing=Math.round(e.value*.25*visible*(.45+.55*centered));
  const story=e.active?Math.round(e.value*.23):10;
  const creativity=e.active&&!seen.has(e.id)?Math.round(e.value*.1):0;
  // Repeating the exact event instance is allowed, but rewards finding another moment.
  const factor=e.shots?0.4:1;
  const points=visible<.72?25:Math.round((timing+framing+story+creativity)*factor);
  const result={points,event:e.name,eventId:e.id,instance:e.uid,caption:e.caption,secret:e.id==='sasquatch'&&e.active&&visible>=.72,success:e.active&&visible>=.72,feedback:visible<.72?'SUBJECT CUT OFF!':!e.active?'A LITTLE EARLY!':e.shots?'ANOTHER TAKE!':e.id==='bomb'?'AWESOME PHOTOBOMB!':e.id==='sasquatch'?'WAIT. IS THAT SASQUATCH?!':'GREAT SHOT!',breakdown:{timing,framing,story,creativity}};
  if(!best||result.points>best.points)best=result;
 }
 if(best)return best;
 const subject=people.find(p=>insideFraction(frame,{x:p.x-12,y:p.y-44,width:24,height:44})>.85);
 return {points:subject?35:0,event:subject?'Hallway Portrait':'Empty Hallway',eventId:subject?'portrait':'miss',caption:subject?'This was definitely their good side.':'A stunning study of absolutely nothing happening.',success:!!subject,secret:false,feedback:subject?'NICE PORTRAIT!':'YOU MISSED IT!',breakdown:{timing:0,framing:subject?20:0,story:subject?15:0,creativity:0}};
}
export function yearbookBonus(photos, selected){return selected.reduce((total,index)=>total+(photos[index]?.success?Math.min(75,Math.round(photos[index].points*.15)):0),0);}
export function rating(score){return score>=2500?'Yearbook Legend':score>=1500?'Photo Pro':score>=750?'Hallway Reporter':'Rookie Photographer';}
