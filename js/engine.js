// ---------- Cloud Couriers pure engine (no DOM) ----------
export const DIRV = { u:[-1,0], r:[0,1], d:[1,0], l:[0,-1] };
export const OPP  = { u:'d', d:'u', l:'r', r:'l' };
export const ARROWCH = { '^':'u', '>':'r', 'v':'d', '<':'l' };
export const CURRCH  = { 'u':'u', 'r':'r', 'd':'d', 'l':'l' };
export const HOUSECH = { 'B':'b', 'P':'p', 'Y':'y', 'G':'g' };
export const MAX_STEPS = 90;
export const COLORS = {
  b:{name:'blue',  sym:'💙', css:'#45b4ff', deep:'#1b86d9'},
  p:{name:'pink',  sym:'🌸', css:'#ff85bd', deep:'#e8559a'},
  y:{name:'yellow',sym:'⭐', css:'#ffc93c', deep:'#eda313'},
  g:{name:'green', sym:'🍀', css:'#5bd98f', deep:'#2fb567'},
};

export function parseLevel(L){
  const rows = L.rows, R = rows.length, C = rows[0].length;
  const tiles = {}; let start = null; const arrows = {};
  for(let r=0;r<R;r++) for(let c=0;c<C;c++){
    const ch = rows[r][c], k = r+','+c;
    if(ch==='.'){ tiles[k]={type:'sky'}; continue; }
    if(ch==='-'){ tiles[k]={type:'path'}; continue; }
    if(ch==='S'){ tiles[k]={type:'start'}; start={r,c}; continue; }
    if(ARROWCH[ch]){ tiles[k]={type:'arrow'}; arrows[k]=ARROWCH[ch]; continue; }
    if(CURRCH[ch]){ tiles[k]={type:'current', dir:CURRCH[ch]}; continue; }
    if(HOUSECH[ch]){ tiles[k]={type:'house', color:HOUSECH[ch]}; continue; }
    if(ch==='%'){ tiles[k]={type:'gate', color:(L.gates&&L.gates[k]&&L.gates[k].color)||null}; continue; }
    if(ch==='='){ tiles[k]={type:'bridge', needs:(L.bridges&&L.bridges[k])||1}; continue; }
    if(ch==='M'){ tiles[k]={type:'moongate'}; continue; }
    if(ch==='h'){ tiles[k]={type:'path', hidden:true}; continue; }
    if(ch==='s'){ tiles[k]={type:'switch'}; continue; }
    if(ch==='Z'){ tiles[k]={type:'zap'}; continue; }
    tiles[k]={type:'sky'};
  }
  const letters = Object.assign({}, L.letters||{});
  const stamps = new Set(L.stamps||[]);
  // mover expanded ping-pong sequences
  const movers = (L.movers||[]).map(m=>{
    const seq = m.cells.length>1 ? m.cells.concat(m.cells.slice(1,-1).reverse()) : m.cells;
    return { type:m.type||'storm', seq, every:m.every||1, face:m.face||null, big:m.big||false };
  });
  const hasMoon = Object.values(tiles).some(t=>t.type==='moongate');
  const hasZap = Object.values(tiles).some(t=>t.type==='zap');
  return { rows:R, cols:C, tiles, start, arrowsInit:arrows, letters, stamps, movers,
           moonCycle: hasMoon ? 2*(L.moonPeriod||3) : 1,
           zapCycle: hasZap ? 2*(L.zapPeriod||3) : 1,
           totalLetters:Object.keys(letters).length };
}

// moon gates open and close together on a fixed, fully deterministic cycle
export function moonOpen(L, mt){
  const p = L.moonPeriod||3;
  return (mt % (2*p)) < p;
}
// lightning zones rest for p ticks, then strike for p ticks — same shared clock
export function zapOn(L, mt){
  const p = L.zapPeriod||3;
  return (mt % (2*p)) >= p;
}

export function initRun(P, L, stats){
  stats = stats || {};
  return {
    r:P.start.r, c:P.start.c, dir:L.startDir||'u',
    carrying:[], cap:stats.cap||L.carryCap||1, shield:stats.shield||L.shield||0,
    lettersLeft:Object.assign({}, P.letters),
    housesDone:{}, deliveredCount:0,
    stampsGot:{}, mistakes:0, steps:0, mt:(L.moverOffset||0),
    lit:false,
    status:'ready',
  };
}

export function moverPos(P, i, mt){ const m=P.movers[i]; return m.seq[Math.floor(mt/m.every) % m.seq.length]; }
export function moverAtCell(P, mt, r, c){
  for(let i=0;i<P.movers.length;i++){ const p=moverPos(P,i,mt); if(p[0]===r&&p[1]===c) return P.movers[i]; }
  return null;
}

// One simulation step. io = { arrowDir(key)->'u|r|d|l', gateOpen(key)->bool }
// Returns array of events; mutates st.
export function stepSim(P, L, st, io){
  const ev = [];
  if(st.status!=='flying') return ev;
  // 1) movers advance. A storm drifting onto the courier is never lethal
  //    (the player can't dodge that) — it shoves the courier back instead.
  //    Balloons simply float past.
  st.mt++;
  const mHere = moverAtCell(P, st.mt, st.r, st.c);
  if(mHere && mHere.type==='storm'){
    st.dir = OPP[st.dir]; st.mistakes++; st.steps++;
    ev.push({t:'bump', key:st.r+','+st.c, storm:true});
    return ev;
  }
  // lightning striking the tile the courier stands on
  const hk0 = st.r+','+st.c;
  if(P.tiles[hk0].type==='zap' && zapOn(L, st.mt)){
    if(st.shield>0){ st.shield--; st.dir=OPP[st.dir]; st.mistakes++; st.steps++; ev.push({t:'bump',key:hk0,zap:true,shield:true}); return ev; }
    if(L.gentleStorm){ st.dir=OPP[st.dir]; st.mistakes++; st.steps++; ev.push({t:'bump',key:hk0,zap:true}); return ev; }
    st.status='lost'; st.reason='zap'; ev.push({t:'lose',reason:'zap'}); return ev;
  }
  // 2) direction from tile under courier
  const hk = st.r+','+st.c, ht = P.tiles[hk];
  let d = st.dir;
  if(ht.type==='arrow') d = io.arrowDir(hk);
  else if(ht.type==='current') d = ht.dir;
  st.dir = d;
  const nr = st.r + DIRV[d][0], nc = st.c + DIRV[d][1];
  const nk = nr+','+nc;
  const nt = (nr>=0&&nr<P.rows&&nc>=0&&nc<P.cols) ? P.tiles[nk] : null;
  st.steps++;
  if(st.steps > MAX_STEPS){ st.status='lost'; st.reason='tired'; ev.push({t:'lose',reason:'tired'}); return ev; }
  // 3) walkability of target
  if(!nt || nt.type==='sky'){ st.status='lost'; st.reason='drift'; ev.push({t:'lose',reason:'drift'}); return ev; }
  if(nt.type==='bridge' && st.deliveredCount < nt.needs){ st.status='lost'; st.reason='bridge'; ev.push({t:'lose',reason:'bridge'}); return ev; }
  if(nt.type==='gate'){
    if(nt.color){
      if(st.carrying.indexOf(nt.color)===-1){ st.dir=OPP[d]; st.mistakes++; ev.push({t:'bounceGate',key:nk,color:nt.color}); return ev; }
    } else if(!io.gateOpen(nk)){ st.dir=OPP[d]; st.mistakes++; ev.push({t:'bounceGate',key:nk,color:null}); return ev; }
  }
  if(nt.type==='moongate' && !moonOpen(L, st.mt)){
    st.dir=OPP[d]; st.mistakes++; ev.push({t:'bounceGate',key:nk,color:null,moon:true}); return ev;
  }
  // stepping INTO an active lightning zone
  if(nt.type==='zap' && zapOn(L, st.mt)){
    if(st.shield>0){ st.shield--; st.dir=OPP[d]; st.mistakes++; ev.push({t:'bump',key:nk,zap:true,shield:true}); return ev; }
    if(L.gentleStorm){ st.dir=OPP[d]; st.mistakes++; ev.push({t:'bump',key:nk,zap:true}); return ev; }
    st.status='lost'; st.reason='zap'; ev.push({t:'lose',reason:'zap'}); return ev;
  }
  const mv = moverAtCell(P, st.mt, nr, nc);
  if(mv){
    if(mv.type==='balloon' || L.gentleStorm){ st.dir=OPP[d]; st.mistakes++; ev.push({t:'bump',key:nk,storm:mv.type==='storm'}); return ev; }
    if(st.shield>0){ st.shield--; st.dir=OPP[d]; st.mistakes++; ev.push({t:'bump',key:nk,storm:true,shield:true}); return ev; }
    st.status='lost'; st.reason='storm'; ev.push({t:'lose',reason:'storm'}); return ev;
  }
  // 4) enter
  st.r=nr; st.c=nc;
  ev.push({t:'move', r:nr, c:nc, dir:d});
  if(st.lettersLeft[nk]!==undefined && st.carrying.length < st.cap){
    const col = st.lettersLeft[nk]; delete st.lettersLeft[nk];
    st.carrying.push(col); ev.push({t:'pick', key:nk, color:col});
  }
  if(P.stamps.has(nk) && !st.stampsGot[nk]){ st.stampsGot[nk]=1; ev.push({t:'stamp', key:nk}); }
  if(nt.type==='house'){
    if(!st.housesDone[nk]){
      const idx = st.carrying.indexOf(nt.color);
      if(idx>=0){
        st.carrying.splice(idx,1); st.housesDone[nk]=1; st.deliveredCount++;
        ev.push({t:'deliver', key:nk, color:nt.color});
        if(st.deliveredCount >= P.totalLetters){ st.status='won'; ev.push({t:'win'}); return ev; }
      } else if(st.carrying.length){
        st.mistakes++; ev.push({t:'reject', key:nk, color:nt.color});
      }
    }
  }
  if(nt.type==='switch' && !st.lit){ st.lit=true; ev.push({t:'light'}); }
  if(nt.type==='start'){ st.dir = OPP[st.dir]; ev.push({t:'bounceHome'}); }
  return ev;
}
