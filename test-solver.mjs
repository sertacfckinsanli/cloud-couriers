// Verifies every level of Cloud Couriers is solvable using the game's own engine.
import { parseLevel, initRun, stepSim } from './js/engine.js';
import { LEVELS } from './js/levels.js';

function lcm(a, b) { const g = (x, y) => y ? g(y, x % y) : x; return a / g(a, b) * b; }

function solve(L) {
  const P = parseLevel(L);
  const cycle = P.movers.length ? P.movers.reduce((acc, m) => lcm(acc, m.seq.length * m.every), 1) : 1;
  const stepMs = L.stepMs || 440;
  const maxSteps = L.timeLimit ? Math.floor((L.timeLimit * 1000) / stepMs) - 1 : 88;

  const keyOf = (st) => [
    st.r, st.c, st.dir,
    st.carrying.slice().sort().join(''),
    Object.keys(st.lettersLeft).sort().join('|'),
    Object.keys(st.housesDone).sort().join('|'),
    Object.keys(st.stampsGot).sort().join('|'),
    st.mt % cycle,
  ].join('#');

  const clone = (st) => ({
    ...st,
    carrying: st.carrying.slice(),
    lettersLeft: { ...st.lettersLeft },
    housesDone: { ...st.housesDone },
    stampsGot: { ...st.stampsGot },
  });

  let best = null; // {steps, mistakes, stamps}
  for (let offset = 0; offset < cycle; offset++) {
    const st0 = initRun(P, L);
    st0.mt = offset;
    st0.status = 'flying';
    const seen = new Set([keyOf(st0)]);
    let frontier = [st0];
    for (let depth = 0; depth < maxSteps && frontier.length; depth++) {
      const next = [];
      for (const st of frontier) {
        const hk = st.r + ',' + st.c;
        const tile = P.tiles[hk];
        const dirChoices = tile.type === 'arrow' ? ['u', 'r', 'd', 'l'] : [st.dir];
        for (const d of dirChoices) {
          const s2 = clone(st);
          const io = { arrowDir: () => d, gateOpen: () => true };
          stepSim(P, L, s2, io);
          if (s2.status === 'won') {
            const cand = { steps: s2.steps, mistakes: s2.mistakes, stamps: Object.keys(s2.stampsGot).length, offset };
            if (!best || cand.steps < best.steps ||
                (cand.steps === best.steps && (cand.mistakes < best.mistakes || cand.stamps > best.stamps))) best = cand;
            continue;
          }
          if (s2.status !== 'flying') continue;
          const k = keyOf(s2);
          if (!seen.has(k)) { seen.add(k); next.push(s2); }
        }
      }
      frontier = next;
    }
  }
  // separate pass: best FULL run (all stamps + zero mistakes) for 3-star feasibility
  let perfect = null;
  const wantStamps = (L.stamps || []).length;
  for (let offset = 0; offset < cycle; offset++) {
    const st0 = initRun(P, L); st0.mt = offset; st0.status = 'flying';
    const seen = new Set([keyOf(st0)]);
    let frontier = [st0];
    for (let depth = 0; depth < maxSteps && frontier.length; depth++) {
      const next = [];
      for (const st of frontier) {
        const hk = st.r + ',' + st.c;
        const tile = P.tiles[hk];
        const dirChoices = tile.type === 'arrow' ? ['u', 'r', 'd', 'l'] : [st.dir];
        for (const d of dirChoices) {
          const s2 = clone(st);
          stepSim(P, L, s2, { arrowDir: () => d, gateOpen: () => true });
          if (s2.mistakes > 0) continue; // perfect runs only
          if (s2.status === 'won') {
            if (Object.keys(s2.stampsGot).length >= wantStamps) {
              if (!perfect || s2.steps < perfect.steps) perfect = { steps: s2.steps };
            }
            continue;
          }
          if (s2.status !== 'flying') continue;
          const k = keyOf(s2);
          if (!seen.has(k)) { seen.add(k); next.push(s2); }
        }
      }
      frontier = next;
    }
  }
  return { best, perfect, stepMs };
}

let fail = 0;
for (const L of LEVELS) {
  const { best, perfect, stepMs } = solve(L);
  if (!best) { console.log(`L${L.id} ${L.name}: ❌ UNSOLVABLE`); fail++; continue; }
  const t = (best.steps * stepMs / 1000).toFixed(1);
  const pt = perfect ? (perfect.steps * stepMs / 1000).toFixed(1) : null;
  const parOk = perfect ? (perfect.steps * stepMs / 1000) <= L.par : (best.steps * stepMs / 1000) <= L.par;
  const limitOk = !L.timeLimit || (best.steps * stepMs / 1000) < L.timeLimit;
  console.log(
    `L${L.id} ${L.name}: ✓ min ${best.steps} steps (~${t}s)` +
    (perfect ? ` | perfect(3★) ~${pt}s` : ' | ⚠️ NO PERFECT RUN') +
    ` | par ${L.par}s ${parOk ? 'ok' : '⚠️ TOO TIGHT'}` +
    (L.timeLimit ? ` | limit ${L.timeLimit}s ${limitOk ? 'ok' : '❌'}` : '')
  );
  if (!perfect || !parOk || !limitOk) fail++;
}
console.log(fail ? `\n${fail} level(s) need fixes` : '\nAll 20 levels solvable with 3-star runs 🎉');
process.exit(fail ? 1 : 0);
