// Every unlockable courier must be able to WIN every hazard-timing level at
// some start phase — the hazard clock now runs at courier-relative rate, so a
// fast/slow courier changes the timing and could in theory break a level.
import { parseLevel, initRun, stepSim } from '../js/engine.js';
import { LEVELS } from '../js/levels.js';
import { COURIER_STATS } from '../js/data.js';

function lcm(a,b){ const g=(x,y)=>y?g(y,x%y):x; return a/g(a,b)*b; }
function fullCycle(P){
  const mc=P.movers.reduce((a,m)=>lcm(a,m.seq.length*m.every),1);
  return lcm(lcm(mc,P.moonCycle||1),P.zapCycle||1);
}

// BFS over arrow choices at a fixed start phase, for a given courier's rate.
function winsAtPhase(L,P,stats,offset,perfectOnly){
  const rate = stats.stepMs/440;
  const cyc = fullCycle(P);
  // with a fractional rate the mt state space is larger; bound the search by
  // quantizing mt to the tick it represents (floor) for the visited-key
  const keyOf=st=>[st.r,st.c,st.dir,st.carrying.slice().sort().join(''),
    Object.keys(st.lettersLeft).sort().join('|'),Object.keys(st.housesDone).sort().join('|'),
    Math.floor(st.mt)%cyc].join('#');
  const clone=st=>({...st,carrying:st.carrying.slice(),lettersLeft:{...st.lettersLeft},
    housesDone:{...st.housesDone},stampsGot:{...st.stampsGot}});
  const maxSteps=L.timeLimit?Math.floor(L.timeLimit*1000/stats.stepMs)-1:88;
  const st0=initRun(P,L,stats); st0.mt=offset; st0.status='flying';
  const seen=new Set([keyOf(st0)]); let frontier=[st0];
  for(let d=0; d<maxSteps && frontier.length; d++){
    const next=[];
    for(const st of frontier){
      const tile=P.tiles[st.r+','+st.c];
      const dirs=tile.type==='arrow'?['u','r','d','l']:[st.dir];
      for(const dd of dirs){
        const s2=clone(st);
        stepSim(P,L,s2,{arrowDir:()=>dd,gateOpen:()=>true});
        if(perfectOnly && s2.mistakes>0) continue;
        if(s2.status==='won') return true;
        if(s2.status!=='flying') continue;
        const k=keyOf(s2);
        if(!seen.has(k)){ seen.add(k); next.push(s2); }
      }
    }
    frontier=next;
  }
  return false;
}

const couriers = Object.entries(COURIER_STATS);
let problems=0;
for(const L of LEVELS){
  const P=parseLevel(L);
  const cyc=fullCycle(P);
  if(cyc===1) continue;                 // no timed hazards
  // a level can force a courier; otherwise any unlocked courier may fly it
  const testers = L.courier ? [[L.courier,COURIER_STATS[L.courier]]] : couriers;
  const line=[];
  for(const [cid,stats] of testers){
    // does SOME phase win? and how many phases perfect?
    let anyWin=false, perfCount=0;
    for(let o=0;o<cyc;o++){
      if(winsAtPhase(L,P,stats,o,false)) anyWin=true;
      if(winsAtPhase(L,P,stats,o,true)) perfCount++;
    }
    const tag = !anyWin ? cid.toUpperCase()+'!!UNWINNABLE' : cid+'('+perfCount+'/'+cyc+'★)';
    if(!anyWin) problems++;
    line.push(tag);
  }
  console.log(`L${L.id} ${L.name}: ${line.join('  ')}`);
}
console.log(problems? `\n${problems} courier/level combo(s) unwinnable` : '\nEvery courier can win every hazard level 🎉');
process.exit(problems?1:0);
