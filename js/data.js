// ---------- static game data (couriers, story letters, shop, regions) ----------
export const COURIERS=[
 {id:'poffy', name:'Poffy', emoji:'☁️', accent:'#7fc3f7', desc:'Sweet, brave and balanced. Carries one letter.', tag:'Starter — unlocked!', locked:false},
 {id:'zippy', name:'Zippy', emoji:'💨', accent:'#ffd977', desc:'Zooms fast! Tricky timing near hazards.', tag:'Unlocks at level 10', locked:true},
 {id:'mimo', name:'Mimo', emoji:'😴', accent:'#cfc3f5', desc:'Calm and sleepy. Carries TWO letters, but slowly.', tag:'Trial at level 18', locked:true},
 {id:'lulu', name:'Lulu', emoji:'⛈️', accent:'#9fdf9f', desc:'Can puff through one storm cloud per level.', tag:'Unlocks at level 28', locked:true},
 {id:'nini', name:'Nini', emoji:'🌙', accent:'#8d86a3', desc:'Night courier. Reveals hidden moonlit paths.', tag:'Region 3 — Sleeping Moon Isles', locked:true},
 {id:'bibi', name:'Bibi', emoji:'🐣', accent:'#ffb3cf', desc:'Tiny and curious. Fits through cloud tunnels.', tag:'Coming soon', locked:true},
];

export const STORY=[
 {lv:3, from:'To the Star Picnic', text:'“Dear Moon, I saved you a seat at the Star Picnic. Bring your softest glow.” — Pip'},
 {lv:7, from:'To the Bakery Cloud', text:'“To the little bakery cloud: your cinnamon rolls are missed every single morning.” — The Sparrows'},
 {lv:10, from:'To Grandpa Cloud', text:'“Dear Grandpa Cloud, the village still remembers your wind songs. We hum them when it rains.” — Willa'},
 {lv:14, from:'To the Balloon Seller', text:'“One red balloon, please. It\'s for a snail who has never seen the sky.” — Momo'},
 {lv:17, from:'To the Lighthouse Star', text:'“Thank you for blinking twice every night. That\'s how I know you\'re still there.” — A small boat'},
 {lv:20, from:'To Everyone', text:'“The storm took our letters, but not our words. The kingdom remembers. Love always finds a route.” — The Post Master'},
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
 {id:3,name:'Sleeping Moon Isles', sub:'Night puzzles · coming soon', icon:'moon', tint:'#b18cff', locked:true},
 {id:4,name:'Storm Valley', sub:'Lightning timing · coming soon', icon:'bolt', tint:'#eda313', locked:true},
 {id:5,name:'Lost Post Tower', sub:'Portals & finale · coming soon', icon:'tower', tint:'#8a90b8', locked:true},
];
