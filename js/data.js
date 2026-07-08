// ---------- static game data (couriers, story letters, shop, regions) ----------
// gameplay stats — the single source of truth for what each cloud can do
export const COURIER_STATS={
 poffy:{name:'Poffy', accent:'#7fc3f7', stepMs:440, cap:1},
 zippy:{name:'Zippy', accent:'#ffd34d', stepMs:330, cap:1},
 mimo: {name:'Mimo',  accent:'#cfc3f5', stepMs:600, cap:2},
 lulu: {name:'Lulu',  accent:'#5bd98f', stepMs:480, cap:1, shield:1},
 nini: {name:'Nini',  accent:'#b18cff', stepMs:440, cap:1, seesHidden:true},
 bibi: {name:'Bibi',  accent:'#ffb3cf', stepMs:440, cap:1},
};
// unlocked by finishing these levels
export const COURIER_UNLOCKS={ 10:'zippy', 18:'mimo', 24:'nini', 28:'lulu' };

export const COURIERS=[
 {id:'poffy', desc:'Sweet, brave and balanced. Steady wings, one letter.', tag:'Starter — always ready!'},
 {id:'zippy', desc:'Zooms 25% faster! Great for the clock, tricky near storms.', tag:'Unlocks at level 10', unlockAt:10},
 {id:'mimo', desc:'Calm and sleepy. Carries TWO letters, but drifts slowly.', tag:'Unlocks at level 18', unlockAt:18},
 {id:'nini', desc:'Night courier. Sees every hidden moonlit path.', tag:'Unlocks at level 24', unlockAt:24},
 {id:'lulu', desc:'Brave and fluffy. Survives ONE storm hit per flight.', tag:'Unlocks at level 28', unlockAt:28},
 {id:'bibi', desc:'Tiny and curious. Fits through cloud tunnels.', tag:'Region 5 — coming soon', unlockAt:99},
];

export const STORY=[
 {lv:3, from:'To the Star Picnic', text:'“Dear Moon, I saved you a seat at the Star Picnic. Bring your softest glow.” — Pip'},
 {lv:7, from:'To the Bakery Cloud', text:'“To the little bakery cloud: your cinnamon rolls are missed every single morning.” — The Sparrows'},
 {lv:10, from:'To Grandpa Cloud', text:'“Dear Grandpa Cloud, the village still remembers your wind songs. We hum them when it rains.” — Willa'},
 {lv:14, from:'To the Balloon Seller', text:'“One red balloon, please. It\'s for a snail who has never seen the sky.” — Momo'},
 {lv:17, from:'To the Lighthouse Star', text:'“Thank you for blinking twice every night. That\'s how I know you\'re still there.” — A small boat'},
 {lv:20, from:'To Everyone', text:'“The storm took our letters, but not our words. The kingdom remembers. Love always finds a route.” — The Post Master'},
 {lv:24, from:'To the Night Watch', text:'“Dear Nini, thank you for reading to the stars until they fall asleep. They snore very softly.” — Mother Moon'},
 {lv:30, from:'To the Morning', text:'“We kept every lantern lit through the long night. Come slowly, dear Morning. Some dreams are still being delivered.” — The Moon Isles'},
];

export const SHOP=[
 {id:'mailbox', icon:'📮', name:'Shiny new mailbox', cost:4},
 {id:'plants', icon:'🪴', name:'Cloud plants', cost:5},
 {id:'flag', icon:'🌈', name:'Rainbow flag', cost:6},
 {id:'chimes', icon:'🎐', name:'Wind chimes', cost:6},
 {id:'hat', icon:'🎩', name:'Courier top hat', cost:8},
];

export const REGIONS=[
 {id:1,name:'Cotton Village', sub:'Learn the winds · levels 1–10', icon:'cloud', tint:'#45b4ff'},
 {id:2,name:'Rainbow Market', sub:'Colors & bridges · levels 11–20', icon:'rainbow', tint:'#e8559a'},
 {id:3,name:'Sleeping Moon Isles', sub:'Night puzzles · levels 21–30', icon:'moon', tint:'#b18cff'},
 {id:4,name:'Storm Valley', sub:'Lightning timing · coming soon', icon:'bolt', tint:'#eda313', locked:true},
 {id:5,name:'Lost Post Tower', sub:'Portals & finale · coming soon', icon:'tower', tint:'#8a90b8', locked:true},
];
