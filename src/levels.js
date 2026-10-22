// A level is data: future environments can supply another layout and event pool.
export const HALLWAY = { id: 'hallway-havoc', title: 'Hallway Havoc', duration: 90, film: 12, target: 1500, speed: 164, width: 1000, height: 520, frame: { width: 200, height: 520 * .25641 }, range: 315 };
export const EVENTS = [
 {id:'plane',name:'Paper Airplane',symbol:'➤',hint:'Catch some air.',cue:'INCOMING: AIRPLANE!',value:250,caption:'School-approved aviation? Absolutely not.',duration:7},
 {id:'jump',name:'Synchronized Jump',symbol:'↑↑',hint:'Two feet? Try four.',cue:'3, 2, 1… JUMP!',value:300,caption:'Gravity has left the group chat.',duration:7},
 {id:'bomb',name:'Photobomb',symbol:'☺',hint:'An uninvited icon.',cue:'WAIT… WHO IS THAT?',value:350,caption:'The main character was not consulted.',duration:7},
 {id:'bag',name:'Spilled Backpack',symbol:'▧',hint:'An academic explosion.',cue:'ZIPPER FAILURE IN 3…',value:280,caption:'Contents: three pencils and an entire personality.',duration:7},
 {id:'dance',name:'Dance Break',symbol:'♫',hint:'Passing period. With rhythm.',cue:'THE BEAT HAS DROPPED.',value:320,caption:'The principal definitely didn’t approve this.',duration:8},
 {id:'sasquatch',name:'Mysterious Sasquatch',symbol:'?',hint:'Probably just a substitute.',cue:'DID THAT TREE JUST MOVE?',value:650,caption:'Sasquatch has requested anonymity.',duration:6}
];
export const QUIPS = ['That belongs in the yearbook!', 'Why is everyone running?', 'My homework is in witness protection.', 'No running. Interpretive dance is fine.', 'This hallway has lore.', 'I’m late for being early.', 'That’s either a photo or evidence.'];

export const LUNCH_EVENTS = [
 {id:'koi',name:'Koi Cannonball',symbol:'≈',hint:'Wait for the splash.',cue:'THE KOI ARE SHOWING OFF…',value:320,caption:'A very small fish. A very big entrance.',duration:8},
 {id:'sandwich',name:'Sandwich Snatch',symbol:'➤',hint:'Lunch has taken flight.',cue:'BIRD AT TWELVE O’CLOCK!',value:300,caption:'The sandwich has transferred to another school.',duration:8},
 {id:'toast',name:'Lunch Tray Toast',symbol:'↑↑',hint:'Cheers to passing math.',cue:'CARTONS UP IN 3… 2…',value:300,caption:'To friendship, and whatever is in this carton.',duration:8},
 {id:'squirrel',name:'Snack Bandit',symbol:'☺',hint:'Small paws. Big plans.',cue:'GUARD YOUR COOKIE!',value:350,caption:'The squirrel insists this is a meal plan.',duration:8},
 {id:'leaves',name:'Leaf Confetti',symbol:'✳',hint:'Nature brought the drama.',cue:'HERE COMES A GUST…',value:300,caption:'The trees were hired as the special effects team.',duration:8},
 {id:'goldenkoi',name:'The Golden Koi',symbol:'?',hint:'The pond has a secret.',cue:'SOMETHING GOLD IS SHIMMERING…',value:650,caption:'The koi declined our request for an interview.',duration:7,secret:true,feedback:'THE GOLDEN KOI!'}
];
Object.assign(HALLWAY, {
 number:1,texture:'hallway',events:EVENTS,quips:QUIPS,firstEvent:{id:'plane',x:300,y:315},
 start:{x:500,y:397},aim:{x:320,y:296},minY:232,secretId:'sasquatch',
 location:'ACE LEADERSHIP HIGH / PASSING PERIOD',
 objective:'Airplane incoming on your left. Frame it and press Space!',
 opening:'Find the extraordinary in a very ordinary school day.'
});
export const COURTYARD = {
 ...HALLWAY,id:'lunchtime-lens',number:2,title:'Lunchtime Lens',texture:'courtyard',events:LUNCH_EVENTS,
 quips:['The koi have better lunches than us.', 'That bird does not go here.', 'Reserved for very important sandwiches.', 'This bench is my entire lunch plan.', 'No homework. Only pond thoughts.', 'The squirrel has a five-star meal plan.'],
 firstEvent:{id:'koi',x:775,y:275},start:{x:560,y:370},aim:{x:775,y:260},minY:165,secretId:'goldenkoi',
 location:'ACE COURTYARD / LUNCHTIME / 12:15 PM',
 objective:'The koi are getting restless. Aim at the pond and wait for a leap!',
 opening:'Blue tables. Shady benches. A pond full of front-page potential.'
};
export const LEVELS = [HALLWAY,COURTYARD];
