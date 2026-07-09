// ---------- in-browser BFS solver (powers the smart hint) ----------
// Same engine as the game; explores every arrow choice and returns the
// chronological list of arrow decisions of a shortest winning run.
import { initRun, stepSim } from './engine.js';

function lcm(a, b){ const g = (x, y) => y ? g(y, x % y) : x; return a / g(a, b) * b; }

export function solveLevel(L, P){
  const moverCycle = P.movers.length ? P.movers.reduce((a, m) => lcm(a, m.seq.length * m.every), 1) : 1;
  const cycle = lcm(lcm(moverCycle, P.moonCycle || 1), P.zapCycle || 1);
  const keyOf = st => [
    st.r, st.c, st.dir,
    st.carrying.slice().sort().join(''),
    Object.keys(st.lettersLeft).sort().join('|'),
    Object.keys(st.housesDone).sort().join('|'),
    st.mt % cycle,
  ].join('#');
  const clone = st => ({ ...st,
    carrying: st.carrying.slice(), lettersLeft: { ...st.lettersLeft },
    housesDone: { ...st.housesDone }, stampsGot: { ...st.stampsGot } });

  for(let offset = 0; offset < cycle; offset++){
    const st0 = initRun(P, L); st0.mt = offset; st0.status = 'flying';
    const nodes = [{ st: st0, parent: -1, act: null }];
    const seen = new Set([keyOf(st0)]);
    for(let i = 0; i < nodes.length && nodes.length < 20000; i++){
      const { st } = nodes[i];
      const hk = st.r + ',' + st.c;
      const tile = P.tiles[hk];
      const dirs = tile.type === 'arrow' ? ['u', 'r', 'd', 'l'] : [st.dir];
      for(const d of dirs){
        const s2 = clone(st);
        stepSim(P, L, s2, { arrowDir: () => d, gateOpen: () => true });
        const act = tile.type === 'arrow' ? { key: hk, dir: d } : null;
        if(s2.status === 'won'){
          const acts = [];
          if(act) acts.push(act);
          let p = i;
          while(p >= 0){ const n = nodes[p]; if(n.act) acts.push(n.act); p = n.parent; }
          acts.reverse();
          return { found: true, acts };
        }
        if(s2.status !== 'flying') continue;
        const k = keyOf(s2);
        if(!seen.has(k)){ seen.add(k); nodes.push({ st: s2, parent: i, act }); }
      }
    }
  }
  return { found: false, acts: [] };
}

// Compare the solution against the player's current arrow settings.
// Returns { fix } (first pre-flight arrow to correct), { live } (an arrow that
// must be re-turned mid-flight), or { ready } when the plan already works.
export function adviseHint(solution, arrowsNow){
  if(!solution.found) return { none: true };
  const firstDir = {};
  let fix = null, live = null;
  for(const a of solution.acts){
    if(!(a.key in firstDir)){
      firstDir[a.key] = a.dir;
      if(!fix && arrowsNow[a.key] !== a.dir) fix = { key: a.key, dir: a.dir };
    } else if(!live && a.dir !== firstDir[a.key]){
      live = { key: a.key, dir: a.dir };
    }
  }
  if(fix) return { fix };
  if(live) return { live };
  return { ready: true };
}
