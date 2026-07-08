// ---------- 20 hand-designed levels (all solver-verified: npm test) ----------
export const LEVELS = [
{ id:1, region:1, name:'First Flight', obj:'Deliver the blue letter 💙',
  rows:['.......','...B...','...-...','...<...','...-...','...-...','...S...'],
  letters:{'4,3':'b'}, par:10, hint:{cell:'3,3',text:'Try turning this breeze first.'},
  tutorial:[{cell:'3,3',text:'Tap the wind arrow to turn it! ↺'},{cell:'go',text:'Great! Now press Start to send Poffy.'}] },

{ id:2, region:1, name:'Turn the Breeze', obj:'Deliver the pink letter 🌸',
  rows:['.......','.....P.','.....^.','.>---v.','.-.....','.-.....','.-.....','.S.....'],
  letters:{'5,1':'p'}, par:12, hint:{cell:'3,5',text:'One breeze is facing the wrong way…'} },

{ id:3, region:1, name:'Stamp on the Side', obj:'Deliver 💛 and grab the golden stamp',
  rows:['.......','...Y...','...-...','.>-^...','.-.-...','.^-^...','...-...','...S...'],
  letters:{'6,3':'y'}, stamps:['4,1'], par:14, hint:{cell:'5,3',text:'The side road hides a golden stamp!'},
  tutorial:[{cell:'4,1',text:'Golden stamps are optional treasure!'}] },

{ id:4, region:1, name:'Two Homes', obj:'Deliver 2 letters, one after another',
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'4,2':'b','4,4':'p'}, par:16, hint:{cell:'4,3',text:'Turn the middle breeze WHILE Poffy flies!'},
  tutorial:[{cell:'4,3',text:'New! You can turn breezes while Poffy is flying.'}] },

{ id:5, region:1, name:'One-Way Wind', obj:'Ride the air current across the gap',
  rows:['.......','.....G.','.....-.','.rrrru.','.>.....','.-.....','.-.....','.S.....'],
  letters:{'5,1':'g'}, par:12, hint:{cell:'4,1',text:'Point this breeze up into the current.'},
  tutorial:[{cell:'3,2',text:'Air currents can\'t be turned — they push Poffy!'}] },

{ id:6, region:1, name:'Closed Cloud Gate', obj:'Open the sleepy gate in time',
  rows:['.......','...B...','...-...','...%...','...-...','...<...','...-...','...S...'],
  letters:{'4,3':'b'}, gates:{'3,3':{}}, par:12, hint:{cell:'3,3',text:'Tap the gate just before Poffy arrives — it\'s sleepy and closes again!'},
  tutorial:[{cell:'3,3',text:'Sleepy gates close after a moment. Tap to open!'}] },

{ id:7, region:1, name:'The Loop', obj:'Escape the wind loop and deliver 💛',
  rows:['.......','...Y...','...-...','.d-<-l.','.-...-.','.r---u.','.....-.','.....S.'],
  letters:{'5,3':'y'}, par:12, hint:{cell:'3,3',text:'Grab the letter first, THEN turn this breeze up.'} },

{ id:8, region:1, name:'Double Delivery', obj:'Two letters — but Poffy carries one at a time',
  rows:['.......','.......','.r-d-l.','.P.-.B.','.u-^-u.','...-...','...S...'],
  letters:{'2,2':'b','2,4':'p'}, par:22, hint:{cell:'4,3',text:'You\'ll pass the middle three times. Plan each turn!'} },

{ id:9, region:1, name:'Wind Timing', obj:'Avoid the grumpy cloud crossing',
  rows:['.......','...B...','...-...','.-----.','...-...','...>...','...-...','...S...'],
  letters:{'4,3':'b'}, movers:[{cells:[[3,1],[3,2],[3,3],[3,4],[3,5]],type:'storm'}],
  par:12, hint:{cell:'5,3',text:'Watch the grey cloud — press Start when it drifts away.'},
  tutorial:[{cell:'3,3',text:'Storm clouds are grumpy. Avoid them!'}] },

{ id:10, region:1, name:'Cotton Village Finale', obj:'Boss: sneak past Grumble Puff! 3 letters + stamp',
  rows:['...Y...','...%...','.r-v-l.','.B.-.P.','.u-^-u.','...-...','...>...','...-...','...S...'],
  letters:{'5,3':'b','4,4':'p','2,4':'y'}, stamps:['2,2'], gates:{'1,3':{}},
  movers:[{cells:[[3,3],[3,4]],type:'storm',every:2,face:'😴',big:true}],
  gentleStorm:true,
  par:26, hint:{cell:'4,3',text:'Blue first (left), then pink (right), then up to Yumi\'s house.'},
  boss:'Grumble Puff' },

{ id:11, region:2, name:'Welcome to Rainbow Market', obj:'Match letters to their colors!',
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'5,3':'p','2,2':'b'}, par:20, hint:{cell:'4,3',text:'Pink goes RIGHT to the pink house. Wrong homes say no-thank-you!'},
  tutorial:[{cell:'3,5',text:'Blue letters go to blue mailboxes. Pink to pink!'}] },

{ id:12, region:2, name:'Rainbow Bridge', obj:'First delivery builds the bridge',
  rows:['.......','.....G.','.r-d.-.','.Y.-.-.','.u-^=u.','...-...','...S...'],
  letters:{'5,3':'y','3,5':'g'}, bridges:{'4,4':1}, par:18, hint:{cell:'4,3',text:'Deliver ⭐ left first — the bridge will shimmer to life!'} },

{ id:13, region:2, name:'Color Gate', obj:'Only matching letters may pass the gates',
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u%^%u.','...-...','...-...','...S...'],
  letters:{'6,3':'p','5,3':'b'}, gates:{'4,2':{color:'b'},'4,4':{color:'p'}},
  par:24, hint:{cell:'4,3',text:'After pink is delivered, send Poffy DOWN for the blue letter.'} },

{ id:14, region:2, name:'Market Rush', obj:'Beat the clock! (and maybe the stamp…)',
  rows:['.......','.>---v.','.-...-.','.G...-.','.-...-.','.^-<-<.','...-...','...S...'],
  letters:{'6,3':'g'}, stamps:['2,5'], timeLimit:20, par:9,
  hint:{cell:'5,3',text:'Left is fast. The long way round earns the stamp — if you\'re quick!'} },

{ id:15, region:2, name:'Switchy Winds', obj:'Turn breezes mid-flight — mind the storm!',
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'2,2':'p','2,4':'b'}, movers:[{cells:[[3,3],[3,2]],type:'storm',every:2}],
  gentleStorm:true,
  par:24, hint:{cell:'4,3',text:'Three passes: gather pink, deliver it right, gather blue, deliver left.'} },

{ id:16, region:2, name:'Bridge Bazaar', obj:'Two bridges, correct order',
  rows:['...P...','...=...','.r-v-l.','.Y.-.G.','.u-^=u.','...-...','...S...'],
  letters:{'5,3':'y','4,5':'g','2,4':'p'}, bridges:{'4,4':1,'1,3':2},
  par:24, hint:{cell:'4,3',text:'Yellow left → bridge 1 → green right → bridge 2 opens the top.'} },

{ id:17, region:2, name:'Busy Sky', obj:'Balloons bump Poffy off course!',
  rows:['.......','...G...','.-----.','...-...','.-----.','...-...','...>...','...S...'],
  letters:{'5,3':'g'},
  movers:[{cells:[[2,1],[2,2],[2,3],[2,4],[2,5]],type:'balloon'},{cells:[[4,5],[4,4],[4,3],[4,2],[4,1]],type:'balloon'}],
  par:14, hint:{cell:'6,3',text:'Balloons only bump — but each bump costs the perfect run.'} },

{ id:18, region:2, name:'Mimo Preview', obj:'Trial courier Mimo carries TWO letters!',
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...-...','...S...'],
  letters:{'6,3':'p','5,3':'b'}, movers:[{cells:[[2,2],[2,3],[2,4]],type:'storm',every:2}],
  courier:'mimo', carryCap:2, stepMs:600, par:26,
  hint:{cell:'4,3',text:'Mimo scoops up both letters — deliver left, then right.'} },

{ id:19, region:2, name:'Mixed Mail', obj:'Three letters, three gates — order matters!',
  rows:['...Y...','...%...','.r-v-l.','.B.-.P.','.u%^%u.','...-...','...S...'],
  letters:{'5,3':'p','2,4':'b','2,2':'y'},
  gates:{'4,2':{color:'b'},'4,4':{color:'p'},'1,3':{color:'y'}},
  par:26, hint:{cell:'4,3',text:'Pink right → blue left → yellow up. Gates refuse the wrong mail!'} },

{ id:20, region:2, name:'Rainbow Market Finale', obj:'Boss: clear the Color Fog! 3 letters + stamp',
  rows:['...Y...','...=...','.r-v-l.','.B.-.P.','.u%^%u.','...-...','...-...','...S...'],
  letters:{'5,3':'p','2,4':'b','2,2':'y'}, stamps:['2,1'],
  gates:{'4,2':{color:'b'},'4,4':{color:'p'}}, bridges:{'1,3':2},
  movers:[{cells:[[3,3],[3,4]],type:'storm',every:2}],
  gentleStorm:true,
  fogRows:[0,1], par:30, boss:'Color Fog',
  hint:{cell:'4,3',text:'Two deliveries lift the fog. Pink right, blue left, then rise!'} },
];
