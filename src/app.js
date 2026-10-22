import {HALLWAY,LEVELS} from './levels.js';
import {HallwayScene} from './game.js';
import {Sound} from './audio.js';
import {rating,yearbookBonus} from './scoring.js';

const $=s=>document.querySelector(s),sound=new Sound(),modal=$('#modal');
let scene,modalKind='',resumeAfter=false,selected=[],published=false,attemptId='',feedbackTimer;
let levelIndex=0,completedLevels=[];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const archivedPhotos=()=>completedLevels.flatMap(level=>level.photos);
const previousScore=()=>completedLevels.reduce((sum,level)=>sum+level.score,0);
const currentBonus=()=>published?yearbookBonus(scene.photos,selected):0;
const totalScore=()=>previousScore()+(scene.score||0)+currentBonus();
const hasNextLevel=()=>levelIndex<LEVELS.length-1;

function readScores(){
 try{const data=JSON.parse(localStorage.getItem('ace-photo-frenzy-scores-v1')||'[]');return Array.isArray(data)?data.filter(x=>Number.isFinite(x.score)&&typeof x.id==='string').slice(0,10):[];}catch{return [];}
}
function saveScore(){
 if(!scene||scene.mode!=='ended')return;
 const total=totalScore(),data=readScores().filter(x=>x.id!==attemptId);
 data.push({id:attemptId,score:total,rating:rating(total),date:new Date().toLocaleDateString(),photos:archivedPhotos().length+scene.photos.length,levelsCompleted:completedLevels.length+1});
 data.sort((a,b)=>b.score-a.score);
 try{localStorage.setItem('ace-photo-frenzy-scores-v1',JSON.stringify(data.slice(0,10)));}catch{/* Restricted storage never prevents play. */}
}
function message(text){
 $('#feedback').textContent=text;$('#feedback').classList.add('show');clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>$('#feedback').classList.remove('show'),2100);
}
function renderLevel(level){
 $('.intro .eyebrow').innerHTML=`<span class="live-dot"></span> ${level.number===2?'LUNCH BREAK. NO BORING SHOTS.':'THE BELL RANG. THE CHAOS DIDN’T.'}`;
 $('.level-tag').textContent=`LVL 0${level.number}`;$('.level-label strong').textContent=level.title;
 $('.edition b').textContent=`0${level.number}`;$('.edition div span').textContent=level.title.toUpperCase();
 $('#stage-label').innerHTML=`<span class="live-dot"></span> ${level.location}`;
 $('#objective-text').textContent=level.opening;
 $('#event-guide').innerHTML=level.events.map((e,i)=>`<div class="event-card" data-event="${e.id}"><span class="event-number">0${i+1}</span><span class="event-symbol" aria-hidden="true">${e.symbol}</span><strong>${e.name}</strong><small>${e.hint}</small></div>`).join('');
 $('.event-section .section-heading p').textContent=level.number===2?'New lunch stories. Keep an eye on your sandwich.':'Six stories. One hallway. Some are harder to believe.';
 document.body.classList.toggle('courtyard',level.number===2);
}
function update(s){
 const level=s.level,seconds=Math.max(0,Math.ceil(level.duration-s.elapsed));
 $('#time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
 $('#time').style.color=seconds<=15?'#ef9380':'';
 $('#film').innerHTML=`${s.film}<span>/${level.film}</span>`;$('#score').textContent=String(s.score).padStart(4,'0');
 const f=s.frame,shell=$('#game-shell'),actual=s.game.canvas.getBoundingClientRect(),bounds=shell.getBoundingClientRect();
 const sx=actual.width/1000,sy=actual.height/520,finder=$('#finder');
 Object.assign(finder.style,{left:`${actual.left-bounds.left+f.x*sx}px`,top:`${actual.top-bounds.top+f.y*sy}px`,width:`${f.width*sx}px`,height:`${f.height*sy}px`});
 const focus=s.eventsLive.find(e=>{const b=e.bounds;return b.x+b.width>f.x&&b.x<f.x+f.width&&b.y+b.height>f.y&&b.y<f.y+f.height;});
 finder.classList.toggle('focus',!!focus?.active);$('#focus-label').textContent=focus?(focus.active?'MOMENT IN FOCUS':'WAIT FOR IT…'):'LOOKING FOR A STORY';
 const near=s.nearby(),hint=$('#interact-hint');hint.hidden=!near;
 hint.textContent=near==='window'?'E · Investigate the suspicious window':near==='pond'?'E · Investigate the koi pond':near==='bench'?'E · Enjoy the shade':'E · Interact';
 if(focus)$('#objective-text').textContent=focus.active?`${focus.name}: frame the action and hit the shutter.`:`${focus.name}: something’s about to happen. Get ready.`;
 else if(s.elapsed<6)$('#objective-text').textContent=level.objective;
 else $('#objective-text').textContent=s.score>=level.target?'Assignment nailed. Now find your yearbook cover.':'Chase the yellow cues. Capture a new story for a bigger score.';
}
function updatePhotos(){
 if(!scene)return;
 const photos=scene.photos||[],recent=photos.slice(-3);$('#album-count').textContent=archivedPhotos().length+photos.length;
 $('#recent-photos').innerHTML=recent.length?recent.map(p=>`<button class="mini-photo" data-photo="${p.index}" aria-label="View ${escapeHTML(p.event)}, ${p.points} points"><img src="${p.image}" alt="Captured ${escapeHTML(p.event)} scene"><span>LVL ${scene.level.number} / NO. ${String(p.index+1).padStart(2,'0')} / +${p.points}</span></button>`).join(''):[1,2,3].map(i=>`<div class="empty-photo">0${i}<span>${['THE NEXT GREAT SHOT','COULD BE ANYTHING','KEEP YOUR EYES OPEN'][i-1]}</span></div>`).join('');
 $('#strip-note').innerHTML=photos.length?`${photos.length} shots. ${photos.filter(p=>p.success).length} keepers.<br>${completedLevels.length?'Lunch is looking good.':'Looking good, reporter.'}`:completedLevels.length?'Fresh roll.<br>Time to head outside.':'Big yearbook energy.<br>Zero photos. Yet.';
 for(const e of scene.level.events){const card=$(`[data-event="${e.id}"]`);if(!card)continue;const captured=photos.some(p=>p.eventId===e.id&&p.success);card.classList.toggle('captured',captured);card.querySelector('.event-number').textContent=captured?'✓':String(scene.level.events.indexOf(e)+1).padStart(2,'0');}
}
function openModal(kind,html,kicker='ACE MEDIA / FIELD NOTES'){
 if(!modal.open){resumeAfter=scene?.mode==='playing';if(resumeAfter)scene.pause();}
 if(scene)scene.input.keyboard.enabled=false;
 modalKind=kind;$('#modal-content').innerHTML=html;$('#modal-kicker').textContent=kicker;
 if(!modal.open)modal.showModal();$('#finder').hidden=true;
}
function closeModal(){
 if(!modal.open)return;modal.close();
 if(resumeAfter){scene.resume();scene.input.keyboard.enabled=true;$('#finder').hidden=false;$('#status-label').textContent=`LEVEL ${levelIndex+1} OF ${LEVELS.length}`;$('#game-shell').focus();}
 resumeAfter=false;modalKind='';
}
function startLevel(index){
 if(modal.open)modal.close();resumeAfter=false;modalKind='';levelIndex=index;selected=[];published=false;
 renderLevel(LEVELS[index]);scene.start(LEVELS[index]);document.body.classList.add('in-round');scene.input.keyboard.enabled=true;
 $('#opening').hidden=true;$('#finder').hidden=false;$('#status-label').textContent=`LEVEL ${index+1} OF ${LEVELS.length}`;$('#stage-label').hidden=true;$('#game-shell').focus();updatePhotos();
 requestAnimationFrame(()=>$('.arcade').scrollIntoView({block:'start',behavior:'instant'}));
 message(index===0?'YOU’RE ON THE CLOCK. MAKE IT COUNT.':'LUNCHTIME! FRESH FILM. NEW STORIES.');
}
function play(){sound.unlock();sound.click();completedLevels=[];attemptId=`${Date.now()}-${Math.random()}`;startLevel(0);}
function nextLevel(){
 if(scene.mode!=='ended'||!hasNextLevel())return;
 // Seal the first roll before replacing the scene: its photos and editor bonus survive.
 published=true;saveScore();completedLevels.push({level:scene.level,photos:scene.photos.map((p,i)=>({...p,yearbookPicked:selected.includes(i)})),score:scene.score+currentBonus(),picks:[...selected]});
 startLevel(levelIndex+1);
}
function menu(){
 saveScore();if(modal.open)modal.close();resumeAfter=false;modalKind='';scene.menu();scene.photos=[];completedLevels=[];levelIndex=0;selected=[];published=false;
 renderLevel(HALLWAY);updatePhotos();document.body.classList.remove('in-round');scene.input.keyboard.enabled=false;
 $('#opening').hidden=false;$('#finder').hidden=true;$('#interact-hint').hidden=true;$('#status-label').textContent='OFF THE CLOCK';$('#stage-label').hidden=false;
 $('#time').textContent='01:30';$('#film').innerHTML='12<span>/12</span>';$('#score').textContent='0000';$('#opening [data-action="play"]').focus();
}
function help(){
 openModal('help',`<h2 id="modal-title">Your field guide.</h2><p>Two assignments. One school day. Get the shots people will talk about.</p><div class="help-grid"><section><h3>Work the camera</h3><dl><dt>WASD / arrows</dt><dd>Move your photographer</dd><dt>Mouse</dt><dd>Aim the viewfinder</dd><dt>Click / Space</dt><dd>Take one photograph</dd><dt>I J K L</dt><dd>Aim with the keyboard</dd><dt>Shift + arrows</dt><dd>Also aims the camera</dd><dt>E</dt><dd>Talk or investigate nearby</dd><dt>Tab</dt><dd>Open / close the photo album</dd><dt>Escape</dt><dd>Pause / resume / close</dd></dl></section><section><h3>From passing period to lunchtime</h3><p>Start in <strong>Hallway Havoc</strong>. After your first 12 photos (or 90 seconds), review the roll and choose <strong>NEXT: LUNCHTIME LENS</strong> to head outside. You don’t need to beat the target to continue.</p><p>Each level gives you <strong>90 seconds, 12 photos, and a 1,500-point target</strong>. Your first roll stays in the album, and scores add across both levels.</p><p>Yellow cues announce action. Center the whole subject and wait for the moment. New stories earn more; repeats earn less. Pick three photos per level for an editor’s bonus, or head straight to the next assignment.</p><p>Investigate the window indoors and the koi pond outdoors. The courtyard’s blue picnic tables, shady benches, and pond each have a story. Walk around the tables and water!</p><p>Photos stay in this session. High scores save on this browser.</p></section></div><div class="button-row"><button class="primary" data-action="close">GOT IT <span>↗</span></button></div>`);
}
function scores(){
 const data=readScores();openModal('scores',`<h2 id="modal-title">The school-day hall of fame.</h2><p>Personal bests, saved on this browser. Two assignments contribute to one score.</p>${data.length?`<ol class="score-list">${data.map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><span>${escapeHTML(x.rating)} <small>${escapeHTML(x.date)} · ${x.levelsCompleted||1} level${x.levelsCompleted===2?'s':''}</small></span><b>${x.score.toLocaleString()}</b></li>`).join('')}</ol>`:'<div class="album-empty">No legends yet. Your camera is waiting.</div>'}<div class="button-row"><button class="primary" data-action="${scene?.mode==='paused'?'close':'play'}">${scene?.mode==='paused'?'BACK TO IT':'START A SCHOOL DAY'} <span>↗</span></button></div>`);
}
function pause(){
 if(!scene||scene.mode!=='playing')return;
 openModal('pause',`<h2 id="modal-title">Hold that thought.</h2><p>${escapeHTML(scene.level.title)} can wait. Your timer and film are safe.</p><div class="button-row"><button class="primary" data-action="close">RESUME <span>↗</span></button><button class="secondary" data-action="restart">RESTART THIS LEVEL</button><button class="secondary" data-action="menu">MAIN MENU</button></div>`,'ACE MEDIA / ON A QUICK BREAK');$('#status-label').textContent='PAUSED';
}
function photoCards(photos,{archive=false,selectable=false}={}){
 return photos.map((p,i)=>`<button class="photo-card ${!archive&&selected.includes(i)?'selected':''}" ${archive?`data-archive-photo="${i}"`:`data-select="${i}"`} ${selectable?`aria-pressed="${selected.includes(i)}"`:''} aria-label="${selectable?'Select':'View'} photo ${i+1}: ${escapeHTML(p.event)}, ${p.points} points"><img src="${p.image}" alt="Your captured ${escapeHTML(p.event)} game scene">${(archive?p.yearbookPicked:selected.includes(i))?'<span class="selected-label">YEARBOOK PICK ★</span>':''}<strong>${escapeHTML(p.event)}<span>+${p.points}</span></strong><p>${escapeHTML(p.caption)}</p><small>${escapeHTML(p.levelTitle||'Hallway Havoc')} / #${String(i+1).padStart(2,'0')} · ${Math.floor(p.time)}s<br>TIMING ${p.breakdown.timing} / FRAME ${p.breakdown.framing} / STORY ${p.breakdown.story} / DISCOVERY ${p.breakdown.creativity}</small></button>`).join('');
}
function album(end=false){
 if(!scene)return;
 const photos=scene.photos||[],bonus=published?currentBonus():0,total=totalScore(),successful=photos.filter(p=>p.success),unique=new Set(successful.filter(p=>p.eventId!=='portrait').map(p=>p.eventId));
 const best=photos.reduce((a,p)=>p.points>(a?.points??-1)?p:a,null),next=hasNextLevel();
 const summary=end?`<p class="rating">LEVEL ${levelIndex+1} / ${escapeHTML(scene.level.title).toUpperCase()} · ${rating(total).toUpperCase()}</p><div class="summary-grid"><div><span>SCHOOL-DAY SCORE</span><b>${total.toLocaleString()}</b></div><div><span>THIS ROLL</span><b>${photos.length}/${scene.level.film}</b></div><div><span>KEEPERS</span><b>${successful.length}</b></div><div><span>BEST PHOTO</span><b>${best?.points||0}</b></div><div><span>EVENTS CAPTURED</span><b>${unique.size}/${scene.level.events.length}</b></div><div><span>SECRETS FOUND</span><b>${photos.some(p=>p.secret)?1:0}</b></div></div><p>Level score: <strong>${scene.score.toLocaleString()}</strong>${completedLevels.length?` · Earlier assignment: <strong>${previousScore().toLocaleString()}</strong>`:''}${published?` · Yearbook bonus: <strong>+${bonus}</strong>`:''}.</p>${published?'<p>Your yearbook picks are filed and your score is saved.</p>':`<p>Choose three strong photos for a bonus.${next?' Or head straight outside with a fresh roll—your hallway photos come with you.':''}</p>`}`:'<p>The clock is paused. Your current roll and earlier assignment photos are all here.</p>';
 const cards=photos.length?`<div class="album-grid">${photoCards(photos,{selectable:end&&!published})}</div>`:'<div class="album-empty">Your roll is empty. The next great shot is waiting.</div>';
 const archive=archivedPhotos();
 const earlier=archive.length?`<section class="archived-roll"><h3>Earlier assignment · Hallway Havoc</h3><p>${archive.length} photos preserved from your first roll. Click any to look closer.</p><div class="album-grid">${photoCards(archive,{archive:true})}</div></section>`:'';
 const bottom=end?`<div class="yearbook-bar"><p><strong>${selected.length}/3</strong> yearbook picks${published?` · +${bonus} bonus`:' · Select photos above'}</p><div class="button-row">${next?'<button class="primary" data-action="next">NEXT: LUNCHTIME LENS ↗</button>':''}${!published&&photos.length?`<button class="${next?'secondary':'primary'}" data-action="submit">SUBMIT PICKS ↗</button>`:''}<button class="secondary" data-action="play">PLAY FROM LEVEL 1</button><button class="secondary" data-action="menu">MAIN MENU</button></div></div>`:'<div class="button-row"><button class="primary" data-action="close">BACK TO THE ACTION <span>↗</span></button></div>';
 openModal(end?'end':'album',`<h2 id="modal-title">${end?(next?'First roll in. Lunch is next.':'School day: captured.'):'Your photo album.'}</h2>${summary}${cards}${earlier}${bottom}`,end?'ACE MEDIA / THE EDITOR’S DESK':'ACE MEDIA / CONTACT SHEET');
}
function photoDetail(index,archive=false){
 const p=(archive?archivedPhotos():scene.photos)[index];if(!p)return;
 const back=scene.mode==='ended'?'end':'album';
 openModal('photo',`<h2 id="modal-title">${escapeHTML(p.event)} <span style="color:var(--yellow)">+${p.points}</span></h2><img class="photo-detail" src="${p.image}" alt="Actual captured ${escapeHTML(p.event)} scene"><p>${escapeHTML(p.levelTitle||'Hallway Havoc')} · ${escapeHTML(p.caption)}</p><p>Timing ${p.breakdown.timing} · Framing ${p.breakdown.framing} · Story ${p.breakdown.story} · Discovery ${p.breakdown.creativity}${p.points===25?' · Subject was cut off.':p.feedback==='ANOTHER TAKE!'?' · Repeat-shot reward: 40%.':''}</p><button class="primary" data-action="${back}">BACK TO ALBUM ↗</button>`);
}
const bridge={
 sound,message,
 onReady(s){scene=s;s.input.keyboard.enabled=false;renderLevel(HALLWAY);$('#opening [data-action="play"]').disabled=false;},
 onUpdate:update,onPhoto(){updatePhotos();},
 onFlash(){const f=$('#flash');f.classList.remove('fire');void f.offsetWidth;f.classList.add('fire');},
 onEnd(s){saveScore();$('#status-label').textContent='ASSIGNMENT FILED';$('#finder').hidden=true;$('#interact-hint').hidden=true;update(s);album(true);},
 onKey(key){if(key==='Escape'){if(modal.open)closeModal();else pause();}else if(key==='Tab'){if(modal.open&&modalKind==='album')closeModal();else if(scene.mode==='playing')album();}}
};
$('#opening [data-action="play"]').disabled=true;
const game=new Phaser.Game({type:Phaser.CANVAS,parent:'game',width:HALLWAY.width,height:HALLWAY.height,pixelArt:true,roundPixels:true,backgroundColor:'#9ebfb1',banner:false,audio:{noAudio:true},fps:{target:60,forceSetTimeOut:false},scene:[new HallwayScene(bridge)]});
window.PhotoFrenzy={game,get scene(){return scene;},get completedLevels(){return completedLevels;}};

document.addEventListener('click',event=>{
 const action=event.target.closest('[data-action]')?.dataset.action;
 if(action){
  sound.unlock();sound.click();
  if(action==='play'&&scene)play();
  if(action==='restart'&&scene)startLevel(levelIndex);
  if(action==='next')nextLevel();
  if(action==='help')help();if(action==='scores')scores();if(action==='pause')pause();if(action==='close')closeModal();if(action==='menu')menu();
  if(action==='album')album(scene?.mode==='ended');if(action==='end')album(true);
  if(action==='submit'){
   const required=Math.min(3,scene.photos.length);
   if(selected.length!==required){$('.yearbook-bar p').innerHTML=`<strong>Pick ${required} photos first.</strong> You have ${selected.length} selected.`;return;}
   published=true;saveScore();sound.good();album(true);
  }
 }
 const mini=event.target.closest('[data-photo]');if(mini&&scene)photoDetail(+mini.dataset.photo);
 const archive=event.target.closest('[data-archive-photo]');if(archive&&scene)photoDetail(+archive.dataset.archivePhoto,true);
 const pick=event.target.closest('[data-select]');
 if(pick){
  const i=+pick.dataset.select;
  if(modalKind==='end'&&!published){
   if(selected.includes(i))selected=selected.filter(n=>n!==i);else if(selected.length<3)selected.push(i);else{$('.yearbook-bar p').innerHTML='<strong>Three is the magic number.</strong> Deselect a photo to swap.';return;}
   album(true);$(`[data-select="${i}"]`)?.focus({preventScroll:true});
  }else photoDetail(i);
 }
});
$('#mute').addEventListener('click',()=>{
 sound.unlock();sound.muted=!sound.muted;$('#mute').innerHTML=sound.muted?'♩ <span>Sound off</span>':'♫ <span>Sound on</span>';
 $('#mute').setAttribute('aria-label',sound.muted?'Unmute sound':'Mute sound');$('#mute').setAttribute('aria-pressed',String(sound.muted));
});
$('#brand').addEventListener('click',e=>{e.preventDefault();if(scene)menu();});$('#close-modal').addEventListener('click',closeModal);
modal.addEventListener('cancel',e=>{e.preventDefault();closeModal();});
document.addEventListener('keydown',e=>{
 if(modal.open){if(e.key==='Tab'&&modalKind==='album'&&!e.shiftKey){e.preventDefault();closeModal();}return;}
 if((e.key==='Escape'||e.key==='Tab')&&scene?.mode==='playing'&&!e.repeat){e.preventDefault();bridge.onKey(e.key);return;}
 if(e.key==='Enter'&&scene?.mode==='menu'&&e.target===$('#game-shell'))play();
});
window.addEventListener('blur',()=>{if(scene?.mode==='playing')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&scene?.mode==='playing')pause();});
window.addEventListener('resize',()=>{if(scene?.mode==='playing')update(scene);});
