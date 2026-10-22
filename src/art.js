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
