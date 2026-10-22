// Original procedural pixel art. No remote images, sprite services, or art downloads.
const C={outline:'#283f45',wall:'#d5dbc1',dark:'#3c6969',teal:'#70a5a0',light:'#a6c8b5',floor:'#9ebfb1'};
export function makeHallway(){
 const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=520;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const t=(text,x,y,size=10,color=C.outline)=>{c.font=`bold ${size}px monospace`;c.fillStyle=color;c.fillText(text,x,y);};
 r(0,0,1000,520,C.floor);
 // Floor tiles, waxed streaks, and the school's unnecessarily dramatic stripe.
 for(let y=194;y<520;y+=32)for(let x=-32;x<1000;x+=64){r(x+(y%64?0:32),y,63,31,((x/64+y/32)%3===0)?'#a8c5b6':'#a1bfaf');r(x+(y%64?0:32),y,63,1,'#8eafa3');}
 for(let i=0;i<65;i++){const x=(i*157)%1000,y=220+(i*79)%290;r(x,y,14+(i%5)*4,2,'#b5ceba');}
 r(0,386,1000,12,'#c5d4b7');r(0,391,1000,3,'#dce1c2');r(0,408,1000,2,'#8ba99c');
 // Architectural wall layers.
 r(0,0,1000,182,C.wall);r(0,0,1000,12,'#547a74');r(0,12,1000,5,'#afc5ab');r(0,155,1000,35,'#779b8d');r(0,187,1000,8,'#344f4d');r(0,195,1000,7,'#bfd1b5');
 for(let y=26;y<152;y+=24){r(0,y,1000,1,'#c7cfb5');for(let x=(y%48?0:30);x<1000;x+=60)r(x,y,1,24,'#c7cfb5');}
 // Lockers have individual doors, vents, locks, stickers and shadows.
 function lockers(x,count,color){r(x-3,67,count*29+6,123,'#3d6363');for(let i=0;i<count;i++){const lx=x+i*29;r(lx,70,27,114,color);r(lx+2,72,2,110,'#95bbae');r(lx+24,72,2,111,'#3c7171');r(lx+2,181,22,2,'#3c7171');for(let j=0;j<3;j++){r(lx+7,80+j*4,12,1,'#3c7171');r(lx+7,161+j*4,12,1,'#3c7171');}r(lx+19,116,4,9,'#d6d7ae');r(lx+20,117,2,3,'#536d69');if(i%4===1){r(lx+5,109,8,10,'#e9d978');t('★',lx+5,117,8,'#9d7954');}if(i===2)t('404',lx+5,146,6,'#345c60');}}
 lockers(16,6,'#68a3a1');lockers(567,5,'#79a7a0');lockers(839,5,'#75a9a7');
 // Classroom: a real visible interior, windows and absurdly small chairs.
 r(211,50,106,140,'#3b5e5b');r(216,55,96,130,'#b4c6a5');r(222,61,84,57,'#274e4b');r(225,64,78,50,'#547a65');t('TODAY:',230,77,8,'#d5dfba');t('THINK BIG.',230,91,8,'#d5dfba');t('(then nap)',230,104,7,'#bfd3af');
 r(220,122,88,48,'#929e76');for(let i=0;i<3;i++){r(226+i*27,139,20,5,'#bd9560');r(229+i*27,144,3,26,'#606d56');r(240+i*27,144,3,26,'#606d56');r(230+i*27,153,12,4,'#799c8b');}r(211,182,106,8,'#42635c');r(238,33,58,14,'#efe7bf');t('ROOM 104',243,43,8);r(299,118,5,8,'#e1c978');
 // A courtyard window: secret visitors can appear behind this glass.
 r(360,45,164,109,'#365b59');r(365,50,154,99,'#b4d9c7');r(366,109,152,39,'#89ac7b');r(386,72,8,62,'#72866a');r(371,65,38,29,'#658b70');r(377,56,30,34,'#6e9c79');r(477,68,5,74,'#72866a');r(459,66,39,33,'#739d78');r(468,54,26,37,'#7ba680');r(366,129,152,18,'#91b885');r(439,50,5,99,'#e1dfb6');r(365,96,154,5,'#e1dfb6');r(356,151,172,7,'#e6dcaf');r(362,158,160,4,'#b3b294');r(378,168,124,3,'#acb49b');
 // Wall clock, bunting and noticeboards.
 r(326,24,24,24,'#48665b');r(329,27,18,18,'#f0e4b8');r(337,30,2,10,'#48665b');r(338,38,6,2,'#48665b');
 for(let i=0;i<18;i++){const x=6+i*57,y=20+Math.sin(i*.7)*8;r(x,y,55,1,'#737b61');c.fillStyle=['#d9ad69','#72998a','#d6ca7e','#b67f65'][i%4];c.beginPath();c.moveTo(x+9,y+2);c.lineTo(x+26,y+4);c.lineTo(x+17,y+20);c.closePath();c.fill();}
 r(736,43,76,81,'#6c7157');r(740,47,68,73,'#bc9a66');r(747,54,25,29,'#e9dbaf');t('BAND',750,63,6);t('NEEDS',748,72,6);t('A BAND',748,79,5);r(778,62,23,33,'#acc1a7');t('LOST:',779,72,5);t('MY',782,80,5);t('WILL',779,88,5);r(749,91,34,20,'#e4c378');t('PHOTO CLUB',751,100,5);t('BE THERE.',753,107,5);
 // School sign and a questionable motivational poster.
 r(26,34,158,23,'#e9ddb2');r(30,38,150,15,'#3c6661');t('ACE LEADERSHIP HIGH',36,49,10,'#ece5bd');r(544,36,15,24,'#e8cf80');t('BE',546,45,6);t('YOU*',545,54,5);r(848,38,112,18,'#d5cc9b');t('NO HALLWAY ZOOMIES',852,49,7,'#5d715d');
 // Left seating, right water fountain, recycling and leafy plants.
 function plant(x,y){r(x-10,y-17,21,18,'#ad8260');r(x-13,y-20,26,5,'#c09a70');r(x-2,y-61,4,43,'#55775b');for(let i=0;i<8;i++){const side=i%2?1:-1;r(x+(side<0?-18:0),y-54+(i%4)*9,19,7,i%3?'#4e8466':'#639a73');r(x+(side<0?-14:3),y-58+(i%4)*9,11,6,'#649b73');}}
 plant(341,221);plant(820,218);plant(24,452);plant(974,449);
 r(732,150,58,12,'#ced4b9');r(737,162,48,25,'#92b3a7');r(746,155,5,4,'#607f79');r(774,140,4,11,'#5b7f78');r(769,140,7,3,'#dce1bd');r(752,189,20,3,'#4d726c');
 r(59,448,143,8,'#bd9a68');r(63,456,135,8,'#8c7858');r(68,464,5,20,'#3e6059');r(184,464,5,20,'#3e6059');r(61,427,139,5,'#b89565');r(66,432,5,17,'#647c64');r(189,432,5,17,'#647c64');
 r(884,425,30,40,'#4e8684');r(880,422,38,7,'#3d6666');r(891,434,16,3,'#a7c4ae');t('↻',891,454,15,'#c0d4b4');
 // Foreground classroom corners frame the play space.
 r(0,495,1000,25,'#406966');r(0,495,1000,5,'#d3d6b6');r(0,503,1000,2,'#6d9187');for(let i=0;i<9;i++){r(220+i*56,500,1,20,'#305351');}r(385,503,206,17,'#d4c59c');t('ACE MEDIA HQ → DEFINITELY A CLOSET',392,515,8,'#48665e');
 // Little floor details reward close inspection.
 t('DO NOT FEED THE LOCKERS',390,462,7,'#6e9485');r(672,444,12,4,'#ded9b6');r(680,440,9,3,'#ded9b6');r(671,442,2,2,'#587b6d');
 return canvas;
}
const PALETTES=[['#ecb389','#443e45','#dca85a','#334f60'],['#9f7156','#2f3739','#c87972','#3f5364'],['#d7a787','#5a473c','#7daab1','#3a5664'],['#845e4e','#31333d','#a9b67d','#4c5360'],['#e7bd92','#975f42','#ad8dad','#3b4d65'],['#b98561','#28393e','#dfc36e','#46606d'],['#c69877','#4c3e3c','#647f9e','#344852']];
export function characterTexture(palette=0,frame=0,player=false){const canvas=document.createElement('canvas');canvas.width=40;canvas.height=56;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const [skin,hair,shirt,pants]=PALETTES[palette%PALETTES.length];const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};const step=frame===1?3:frame===2?-3:0;
 r(7,49,25,5,'#34564b44');r(12,34,7,15+step,pants);r(22,34,7,15-step,pants);r(10,47+step,10,4,'#283e49');r(21,47-step,11,4,'#283e49');r(10,21,20,17,player?'#e2b947':shirt);r(12,22,3,14,player?'#f2d16c':'#ffffff22');r(6,24,5,13-step,skin);r(30,24,5,13+step,skin);r(11,7,19,17,skin);r(10,7,20,7,hair);r(12,4,15,4,hair);r(9,11,4,7,hair);r(14,16,3,3,'#303c3e');r(24,16,3,3,'#303c3e');r(19,21,4,1,'#966c57');r(17,24,7,2,skin);
 if(player){r(9,6,23,5,'#f1ca4f');r(12,2,15,6,'#f1ca4f');r(28,7,8,3,'#d6a83c');r(24,26,4,11,'#364b4e');r(19,30,15,10,'#34434a');r(24,31,8,8,'#1d2f3b');r(26,33,4,4,'#85c4c4');r(20,28,5,3,'#d5e0c1');}else if(palette===6){r(17,25,3,11,'#c1b58c');r(16,26,5,3,'#dce0c4');r(10,8,21,3,'#d7b791');}
 return canvas;}

// Courtyard at lunch: blue picnic tables, two timber benches, shade trees and a stone koi pond.
export function makeCourtyard(){
 const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=520;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
 const text=(s,x,y,size=9,color='#345448')=>{c.font=`bold ${size}px monospace`;c.fillStyle=color;c.fillText(s,x,y);};
 const oval=(x,y,w,h,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);c.fill();};
 r(0,0,1000,520,'#95b879');
 for(let i=0;i<600;i++){const x=(i*149+23)%1000,y=90+(i*97)%430;r(x,y,2+(i%3)*2,2,i%3?'#85a96d':'#b3c58a');}
 // Warm patio pavers and a curved footpath around the pond.
 r(35,104,515,416,'#d9cba4');r(550,105,450,65,'#d9cba4');r(530,370,470,150,'#d9cba4');r(550,152,85,262,'#d9cba4');
 for(let y=111;y<520;y+=27)for(let x=37;x<1000;x+=52){if(x<550||y>370||y<165||x<630){r(x+(y%54?0:25),y,48,1,'#c6b791');r(x+(y%54?0:25),y,1,26,'#c6b791');}}
 r(30,103,5,417,'#6b8e65');r(35,103,515,5,'#b2b880');r(550,165,450,5,'#b2b880');
 // Low school facade and cafeteria hatch establish the lunch setting.
 r(0,0,1000,91,'#d7d9b7');r(0,0,1000,12,'#54736b');r(0,14,1000,4,'#ede4c1');r(0,79,1000,15,'#718f77');r(0,93,1000,7,'#e9d7a7');
 for(let i=0;i<14;i++){r(12+i*73,23,57,46,'#517c77');r(16+i*73,27,49,37,'#a6d0c0');r(39+i*73,27,4,37,'#d4d6b1');r(16+i*73,43,49,3,'#d4d6b1');}
 r(66,21,143,52,'#395e56');r(70,25,135,40,'#6d947c');r(61,66,153,8,'#b29163');text('CAFETERIA',89,40,12,'#f2e4b7');text('TODAY: MYSTERY + FRIES',77,56,7,'#d9d7a7');
 r(338,28,218,33,'#ede2b4');text('ACE COURTYARD',361,43,13);text('LUNCH 12:15  /  SUNSHINE OPTIONAL',346,55,7);
 // Tree shadows fall over both of the benches beside the water.
 oval(633,209,210,49,'#567f5a32');oval(891,449,204,58,'#567f5a38');
 function tree(x,y,scale=1){
  r(x-9,y-78*scale,18,78*scale,'#7b674b');r(x-5,y-74*scale,4,72*scale,'#ac8857');r(x-18,y-9,38,9,'#668456');r(x-17,y-72*scale,9,20,'#7b674b');
  const clusters=[[-44,-121,55,44],[-13,-148,64,52],[25,-124,60,46],[-60,-101,70,45],[-17,-114,75,60],[32,-92,55,38]];
  for(let i=0;i<clusters.length;i++){const [dx,dy,w,h]=clusters[i];const xx=x+dx*scale,yy=y+dy*scale;r(xx,yy,w*scale,h*scale,['#3d7456','#51865b','#65995f','#4b8056','#679b62','#51855a'][i]);r(xx+7*scale,yy-5*scale,(w-14)*scale,7*scale,'#709e65');}
  for(let i=0;i<55;i++){const dx=((i*31)%125-60)*scale,dy=(-138+(i*19)%80)*scale;r(x+dx,y+dy,6*scale,3*scale,i%3?'#83aa6a':'#3e7855');}
 }
 tree(611,170,1.05);tree(920,405,1.12);tree(15,330,.8);
 // Stone rim: irregular pixels and a layered turquoise water surface.
 oval(785,285,303,188,'#607e61');oval(785,280,293,178,'#b6b89a');oval(785,279,277,159,'#ded6ae');oval(785,280,258,143,'#3d827d');oval(784,277,246,128,'#6baca0');oval(774,265,202,98,'#7cbbab');
 for(let i=0;i<35;i++){const a=i*Math.PI*2/35,x=785+Math.cos(a)*143,y=280+Math.sin(a)*82;r(x-7,y-3,14+(i%3)*2,7,i%2?'#c6c6a0':'#919e82');}
 for(let i=0;i<19;i++){const x=690+(i*47)%180,y=234+(i*23)%87;if(((x-785)/105)**2+((y-280)/53)**2<1)r(x,y,9+(i%4)*3,2,i%2?'#b4d7ba':'#589a92');}
 for(const [x,y] of [[698,261],[854,306],[831,239]]){oval(x,y,26,12,'#4a8c69');r(x,y-1,13,2,'#79aa70');r(x+5,y-9,5,7,'#f2d0aa');r(x+2,y-7,11,3,'#f5dfbc');}
 // Reeds and wildflowers around the pond.
 for(let i=0;i<11;i++){r(889+(i*5)%34,231-i%4*7,3,24+i%3*5,'#6c935e');r(889+(i*5)%34,228-i%4*7,4,6,'#947b4f');}
 for(let i=0;i<30;i++){const x=652+(i*83)%307,y=344+(i*29)%18;r(x,y,2,6,'#6f925b');r(x-2,y-2,6,4,i%3?'#f1dc9b':'#d79b8b');}
 function bench(x,y){oval(x+6,y+11,130,19,'#587b5430');r(x-57,y-27,114,6,'#b18c58');r(x-57,y-18,114,6,'#c49c65');r(x-53,y-30,4,36,'#6d6650');r(x+49,y-30,4,36,'#6d6650');r(x-62,y-5,124,8,'#caa16c');r(x-62,y+3,124,5,'#97744d');r(x-51,y+8,6,12,'#526552');r(x+45,y+8,6,12,'#526552');r(x-54,y-3,109,2,'#e0bd85');}
 bench(615,187);bench(850,437);
 // Four unmistakably blue picnic tables, with lunches and students sitting down.
 function picnic(x,y){
  oval(x+9,y+30,153,27,'#54765630');
  // Seated students are behind the tabletop, with their legs beneath it.
  c.drawImage(characterTexture((x+y)%7,0),x-44,y-39,30,42);c.drawImage(characterTexture((x+y+2)%7,0),x+19,y-39,30,42);
  r(x-53,y+6,6,34,'#3e6669');r(x+47,y+6,6,34,'#3e6669');r(x-64,y+21,128,8,'#327bad');r(x-64,y+19,128,3,'#70b6d5');r(x-55,y+29,6,11,'#41686b');r(x+49,y+29,6,11,'#41686b');
  r(x-70,y-7,140,27,'#2a6b9d');r(x-70,y-11,140,25,'#4c97c3');r(x-70,y-11,140,4,'#85c5df');for(let j=0;j<4;j++)r(x-67,y-3+j*5,134,1,'#377ea9');r(x-70,y+14,140,5,'#285e85');
  oval(x-28,y+1,22,9,'#f0e1b9');r(x-32,y-4,13,6,'#d3a75f');r(x-30,y-6,9,3,'#77a066');r(x+22,y-9,8,14,'#f0dfb7');r(x+22,y-9,8,3,'#c16f5d');r(x+25,y-15,2,8,'#f2e8cd');r(x+40,y-4,13,11,'#b28459');
 }
 picnic(165,235);picnic(405,235);picnic(165,400);picnic(405,400);
 r(688,375,71,20,'#dfd9ac');r(695,395,4,18,'#806b49');r(747,395,4,18,'#806b49');text('KOI QUIET ZONE',691,387,7);text('(THEY CANNOT READ)',688,407,6);
 r(49,451,27,35,'#4b8579');r(46,447,33,7,'#39695f');text('RECYCLE',50,468,5,'#d8deaf');
 text('SAVE A SEAT. FIND A STORY.',330,505,8,'#8f956e');
 return canvas;
}
