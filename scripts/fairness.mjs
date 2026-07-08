// Per-offset fairness report for mover levels: a level is human-fair when a win
// exists at EVERY storm phase (the player can't control the phase precisely).
import { parseLevel, initRun, stepSim } from '../js/engine.js';
import { LEVELS } from '../js/levels.js';

function lcm(a, b){ const g = (x, y) => y ? g(y, x % y) : x; return a / g(a, b) * b; }

function fullCycle(P){
  const moverCycle = P.movers.reduce((a, m) => lcm(a, m.seq.length * m.every), 1);
  return lcm(moverCycle, P.moonCycle || 1);
}

function solveAtOffset(L, P, offset, perfectOnly){
  const cycle = fullCycle(P);
  const keyOf = st => [st.r, st.c, st.dir, st.carrying.slice().sort().join(''),
    Object.keys(st.lettersLeft).sort().join('|'), Object.keys(st.housesDone).sort().join('|'),
    st.mt % cycle].join('#');
  const clone = st => ({ ...st, carrying: st.carrying.slice(), lettersLeft: { ...st.lettersLeft },
    housesDone: { ...st.housesDone }, stampsGot: { ...st.stampsGot } });
  const maxSteps = L.timeLimit ? Math.floor(L.timeLimit * 1000 / (L.stepMs || 440)) - 1 : 88;
  const st0 = initRun(P, L); st0.mt = offset; st0.status = 'flying';
  const seen = new Set([keyOf(st0)]);
  let frontier = [st0];
  for(let depth = 0; depth < maxSteps && frontier.length; depth++){
    const next = [];
    for(const st of frontier){
      const tile = P.tiles[st.r + ',' + st.c];
      const dirs = tile.type === 'arrow' ? ['u','r','d','l'] : [st.dir];
      for(const d of dirs){
        const s2 = clone(st);
        stepSim(P, L, s2, { arrowDir: () => d, gateOpen: () => true });
        if(perfectOnly && s2.mistakes > 0) continue;
        if(s2.status === 'won') return s2.steps;
        if(s2.status !== 'flying') continue;
        const k = keyOf(s2);
        if(!seen.has(k)){ seen.add(k); next.push(s2); }
      }
    }
    frontier = next;
  }
  return null;
}

for(const L of LEVELS){
  const P = parseLevel(L);
  const cycle = fullCycle(P);
  if(cycle === 1) continue; // no movers, no moon gates — timing-free level
  const wins = [], perfects = [];
  for(let o = 0; o < cycle; o++){
    wins.push(solveAtOffset(L, P, o, false) !== null ? '✓' : '✗');
    perfects.push(solveAtOffset(L, P, o, true) !== null ? '✓' : '·');
  }
  console.log(`L${L.id} ${L.name}  (cycle ${cycle})`);
  console.log(`  win at offset:     ${wins.join(' ')}`);
  console.log(`  perfect at offset: ${perfects.join(' ')}`);
}
