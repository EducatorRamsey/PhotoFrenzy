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
