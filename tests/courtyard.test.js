import {test} from 'node:test';
import assert from 'node:assert/strict';
import {COURTYARD,HALLWAY,LEVELS} from '../src/levels.js';
import {canWalk,POND,PICNIC_TABLES} from '../src/world.js';
import {evaluatePhoto} from '../src/scoring.js';

test('both assignments have a fresh twelve-shot roll and complete event pools',()=>{
 assert.deepEqual(LEVELS.map(l=>l.number),[1,2]);
 for(const level of LEVELS){assert.equal(level.film,12);assert.equal(level.events.length,6);assert.ok(level.events.some(e=>e.id===level.firstEvent.id));assert.ok(level.events.some(e=>e.id===level.secretId));assert.ok(canWalk(level,level.start.x,level.start.y));}
 assert.equal(new Set(LEVELS.flatMap(l=>l.events.map(e=>e.id))).size,12);
});
test('pond water and blue picnic tables are solid, with usable paths around them',()=>{
 assert.equal(canWalk(COURTYARD,POND.x,POND.y),false);
 assert.equal(canWalk(COURTYARD,POND.x,POND.y+POND.ry+15),true);
 for(const table of PICNIC_TABLES){assert.equal(canWalk(COURTYARD,table.x,table.y),false);assert.equal(canWalk(COURTYARD,table.x,table.y+50),true);}
 assert.equal(canWalk(COURTYARD,615,187),false);assert.equal(canWalk(COURTYARD,850,437),false);
 assert.equal(canWalk(COURTYARD,590,310),true);assert.equal(canWalk(HALLWAY,785,280),true);
});
test('outdoor movement stays inside the play area',()=>{
 for(const [x,y] of [[20,300],[970,300],[500,130],[500,490]])assert.equal(canWalk(COURTYARD,x,y),false);
});
test('the Golden Koi counts as a secret only when its action is well framed',()=>{
 const golden={...COURTYARD.events.find(e=>e.id==='goldenkoi'),active:true,bounds:{x:165,y:140,width:54,height:34}};
 const frame={x:100,y:100,width:200,height:133};
 assert.equal(evaluatePhoto(frame,[golden],[]).secret,true);
 assert.equal(evaluatePhoto(frame,[{...golden,active:false}],[]).secret,false);
 assert.equal(evaluatePhoto(frame,[{...golden,bounds:{x:290,y:140,width:54,height:34}}],[]).secret,false);
});
test('ordinary outdoor photos use courtyard captions instead of hallway labels',()=>{
 const frame={x:100,y:100,width:200,height:133},context={portraitName:'Lunch Portrait',emptyName:'Quiet Courtyard'};
 assert.equal(evaluatePhoto(frame,[],[{x:180,y:200}],new Set(),context).event,'Lunch Portrait');
 assert.equal(evaluatePhoto(frame,[],[],new Set(),context).event,'Quiet Courtyard');
});
