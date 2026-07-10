// ---------- gameplay controller (board render, flight loop, win/lose) ----------
import { parseLevel, initRun, stepSim, moverPos, moonOpen, zapOn, COLORS } from './engine.js';
import { LEVELS } from './levels.js';
import { $, el, toast } from './dom.js';
import { sfx } from './audio.js';
import { save, persist, dailyKey } from './save.js';
import { COURIER_STATS, COURIER_UNLOCKS } from './data.js';
import { courierSVG, houseSVG } from './svg.js';
import { ui } from './ui.js';
import { sealIcon, sealChip, windArrow, chevronFlow, postOfficeIcon, gateDoors,
         stormCloud, balloonIcon, stampRosette, fogPuff, envelopeIcon,
         sparkStar, crossPuff, uiIcon, ghostArrow, moonGateIcon, lanternIcon, zapIcon } from './icons.js';
import { solveLevel, adviseHint } from './solver.js';
import { L, pick, t } from './i18n.js';
import { playRegion, victory as musicVictory } from './music.js';

const DIR2DEG = { u:0, r:90, d:180, l:270 };
const DIR_KEY = { u:'dirUp', r:'dirRight', d:'dirDown', l:'dirLeft' };
// mail-color names shown in gate/toast messages (engine.js COLORS.name stays English internally)
const COLOR_NAMES = { b:L('blue','mavi'), p:L('pink','pembe'), y:L('yellow','sarı'), g:L('green','yeşil') };
function mulberry32(seed){
  return function(){ seed|=0; seed=seed+0x6D2B79F5|0;
    let t=Math.imul(seed^seed>>>15, 1|seed);
    t=t+Math.imul(t^t>>>7, 61|t)^t;
    return ((t^t>>>14)>>>0)/4294967296; };
}
const dirGlyph = d => `<span style="display:inline-block;line-height:0;vertical-align:-3px;rotate:${DIR2DEG[d]}deg">${windArrow(15)}</span>`;

export const game = {
  L:null, P:null, st:null, TS:48, arrows:{}, gateTimers:{}, gatesOpen:{}, gateCloseAt:{},
  timer:null, stepTimer:null, t0:0, elapsed:0, flying:false, tut:null, tutIdx:0,
  usedHint:false, moverIdleTimer:null, paused:false, pauseStart:0,

  load(id, opts={}){
    this.cleanup();
    this.daily = !!opts.daily;
    this.L = LEVELS[id-1]; this.P = parseLevel(this.L);
    // ghost preview must not leak timing: strip movers AND treat zaps as plain path
    this._ghostTiles = {};
    for(const k in this.P.tiles){
      const t=this.P.tiles[k];
      this._ghostTiles[k] = t.type==='zap' ? {type:'path'} : t;
    }
    // courier: level-forced > explicit choice > last used (if unlocked) > Poffy
    const forced = this.L.courier;
    this.courierId = forced || opts.courier
      || (save.couriers[save.lastCourier] ? save.lastCourier : 'poffy');
    this.stats = COURIER_STATS[this.courierId] || COURIER_STATS.poffy;
    this.st = initRun(this.P, this.L, this.stats);
    this._Pghost = Object.assign({}, this.P, { movers: [], zapCycle: 1, tiles: this._ghostTiles });
    this._solution = null;
    this.arrows = Object.assign({}, this.P.arrowsInit);
    if(this.daily){
      // deterministic scramble of the starting breezes — same puzzle for everyone today
      const rng = mulberry32(opts.seed||1);
      const order=['u','r','d','l'];
      for(const k in this.arrows) this.arrows[k]=order[Math.floor(rng()*4)];
    }
    this.arrowRot = {}; for(const k in this.arrows) this.arrowRot[k] = DIR2DEG[this.arrows[k]];
    this.gatesOpen = {}; this.gateTimers={}; this.gateCloseAt={}; this.usedHint=false;
    this.flying=false; this.paused=false; this.elapsed=0; this.tutIdx=0;
    $('#screen-play').classList.toggle('rainbow', this.L.region===2);
    $('#phone').classList.toggle('rainbow', this.L.region===2);
    $('#screen-play').classList.toggle('night', this.L.region===3);
    $('#phone').classList.toggle('night', this.L.region===3);
    $('#screen-play').classList.toggle('storm', this.L.region===4);
    $('#phone').classList.toggle('storm', this.L.region===4);
    this.seesHidden = !!this.stats.seesHidden;
    $('#hud-level').textContent=t('lvLabel')+id;
    $('#hud-timer').textContent=this.L.timeLimit? this.L.timeLimit+t('secUnit') : '0'+t('secUnit');
    $('#hud-timer').classList.toggle('limit', !!this.L.timeLimit);
    $('#char-chip').innerHTML = courierSVG(this.stats.accent,34)+' '+this.stats.name
      + (this.L.courier ? '' : ' <span class="swapmark">'+uiIcon('restart',11)+'</span>');
    const go=$('#btn-go'); go.textContent=t('readyToFly'); go.classList.remove('flying');
    playRegion(this.L.region);    // region-specific background loop
    this.buildBoard();
    this.renderObjectives();
    this.startMoverIdle();
    this.renderGhost();
    this.showTutorial();
  },

  cleanup(){
    clearInterval(this.timer); clearTimeout(this.stepTimer); clearInterval(this.moverIdleTimer);
    if(this._raf) cancelAnimationFrame(this._raf);
    Object.values(this.gateTimers).forEach(t=>clearTimeout(t));
    document.querySelectorAll('.bubble').forEach(b=>b.remove());
  },

  cellXY(r,c){ return [c*this.TS, r*this.TS]; },

  buildBoard(){
    const board=$('#board'); board.innerHTML='';
    const wrap=$('#board-wrap');
    const availW = wrap.clientWidth-20, availH = wrap.clientHeight-12;
    this.TS = Math.floor(Math.min(58, availW/this.P.cols, availH/this.P.rows));
    board.style.width=(this.P.cols*this.TS)+'px'; board.style.height=(this.P.rows*this.TS)+'px';
    const TS=this.TS, pad=Math.round(TS*0.06);
    for(let r=0;r<this.P.rows;r++) for(let c=0;c<this.P.cols;c++){
      const k=r+','+c, t=this.P.tiles[k]; if(t.type==='sky') continue;
      const d=el('div','tile '+t.type); d.dataset.key=k;
      if(t.hidden){ d.classList.add('hiddenpath'); if(this.seesHidden) d.classList.add('revealed'); }
      d.style.cssText=`left:${c*TS+pad}px;top:${r*TS+pad}px;width:${TS-pad*2}px;height:${TS-pad*2}px;font-size:${TS}px;`;
      if(t.type==='arrow'){
        d.innerHTML='<span class="arr" style="transform:rotate('+this.arrowRot[k]+'deg)">'+windArrow(Math.round(TS*0.62))+'</span>';
        d.onclick=()=>this.rotateArrow(k);
      }
      if(t.type==='current'){
        const ang={r:'90deg',l:'270deg',u:'0deg',d:'180deg'}[t.dir];
        d.innerHTML='<span class="arr" style="transform:rotate('+ang+')">'+chevronFlow(Math.round(TS*0.55))+'</span>';
        d.style.setProperty('--curdir',ang);
      }
      if(t.type==='house'){ d.innerHTML=houseSVG(t.color); }
      if(t.type==='start'){ d.innerHTML=postOfficeIcon(Math.round(TS*0.82)); }
      if(t.type==='gate'){
        if(t.color){ d.classList.add('colorgate');
          d.innerHTML='<span class="gdoor">'+gateDoors(Math.round(TS*0.6))+'</span>'
            +'<span class="gcolor" style="background:'+COLORS[t.color].css+'">'+sealIcon(t.color, 14)+'</span>';
          d.style.outline='3px solid '+COLORS[t.color].css; d.style.outlineOffset='-3px'; }
        else { d.innerHTML='<span class="gdoor">'+gateDoors(Math.round(TS*0.6))+'</span>'; d.onclick=()=>this.tapGate(k); }
      }
      if(t.type==='bridge'){ d.innerHTML='<div class="arc"></div>'; }
      if(t.type==='moongate'){ d.innerHTML='<span class="moonface">'+moonGateIcon(Math.round(TS*0.66), moonOpen(this.L, this.st.mt))+'</span>'; }
      if(t.type==='switch'){ d.innerHTML='<span class="lantern">'+lanternIcon(Math.round(TS*0.62), false)+'</span>'; }
      if(t.type==='zap'){ d.innerHTML='<span class="zapface">'+zapIcon(Math.round(TS*0.62), zapOn(this.L, this.st.mt))+'</span>'; }
      board.appendChild(d);
    }
    // letters + stamps overlays
    for(const k in this.P.letters){
      const [r,c]=k.split(',').map(Number); const col=COLORS[this.P.letters[k]];
      const o=el('div','overlay-item'); o.id='item-'+k;
      o.style.cssText=`left:${c*TS}px;top:${r*TS}px;width:${TS}px;height:${TS}px;`;
      o.innerHTML=`<div class="envelope" style="background:${col.css};--ew:${TS*0.74}px;--eh:${TS*0.58}px;border:2.5px solid ${col.deep};"><span class="sealwrap">${sealIcon(this.P.letters[k], Math.round(TS*0.34))}</span></div>`;
      board.appendChild(o);
    }
    this.P.stamps.forEach(k=>{
      const [r,c]=k.split(',').map(Number);
      const o=el('div','overlay-item'); o.id='item-'+k;
      o.style.cssText=`left:${c*TS}px;top:${r*TS}px;width:${TS}px;height:${TS}px;`;
      o.innerHTML='<span class="stampitem">'+stampRosette(Math.round(TS*0.72))+'</span>';
      board.appendChild(o);
    });
    // movers
    this.P.movers.forEach((m,i)=>{
      const o=el('div','mover'); o.id='mover-'+i;
      const s=m.big?1.08:1;
      o.style.cssText=`width:${TS}px;height:${TS}px;left:0;top:0;`;
      const art = m.type==='balloon' ? balloonIcon(Math.round(TS*0.85*s)) : stormCloud(Math.round(TS*0.95*s), m.face==='😴');
      o.innerHTML='<span class="mbody">'+art+'</span>';
      const p=moverPos(this.P, i, this.st.mt);
      o.style.transform=`translate(${p[1]*TS}px,${p[0]*TS}px)`;
      board.appendChild(o);
    });
    // fog (boss 20)
    if(this.L.fogRows){
      const f=el('div','fog',fogPuff(44)+fogPuff(56)+fogPuff(44)); f.id='fogbox';
      f.style.cssText=`left:0;top:0;width:${this.P.cols*TS}px;height:${(this.L.fogRows.length)*TS}px;`;
      board.appendChild(f);
    }
    // ghost path preview layer (under the courier)
    const gl=el('div',''); gl.id='ghostlayer'; board.appendChild(gl);
    // courier (explicit left/top so a stray in-flow sibling can never shift it)
    const cour=el('div',''); cour.id='courier';
    cour.style.cssText=`width:${TS}px;height:${TS}px;left:0;top:0;`;
    cour.innerHTML='<div class="lean"><div class="cbody">'+courierSVG(this.stats.accent, Math.round(TS*0.95))+'<div id="carrybadges"></div></div></div>';
    board.appendChild(cour);
    this._lastXY=null;
    this.placeCourier();
  },

  placeCourier(){
    const [x,y]=this.cellXY(this.st.r,this.st.c);
    const c=$('#courier'); c.style.transitionDuration=(this.stepMs()*0.93)+'ms';
    c.style.transform=`translate(${x}px,${y}px)`;
    // lean into the wind
    const lean=c.querySelector('.lean');
    if(lean){ const deg={u:-4,r:9,d:4,l:-9}[this.st.dir]||0; lean.style.rotate=(this.flying?deg:0)+'deg'; }
  },
  jolt(cls){
    const lean=document.querySelector('#courier .lean'); if(!lean) return;
    lean.classList.remove('squash','stretch'); void lean.offsetWidth;
    lean.classList.add(cls);
  },
  puff(xy){
    const p=el('div','trailpuff');
    p.style.left=(xy[0]+this.TS*0.36)+'px'; p.style.top=(xy[1]+this.TS*0.55)+'px';
    $('#board').appendChild(p); setTimeout(()=>p.remove(),600);
  },
  shakeBoard(soft){
    const b=$('#board'); b.classList.remove('shake','shake-soft'); void b.offsetWidth;
    b.classList.add(soft?'shake-soft':'shake');
    setTimeout(()=>b.classList.remove('shake','shake-soft'),500);
  },
  deliverHop(key,color){
    const [r,c]=key.split(',').map(Number);
    const f=el('div','flyletter',envelopeIcon(Math.round(this.TS*0.52), COLORS[color].css, COLORS[color].deep));
    f.style.left=(c*this.TS+this.TS*0.24)+'px'; f.style.top=(r*this.TS+this.TS*0.2)+'px';
    f.style.setProperty('--hop',(this.TS*0.95)+'px');
    $('#board').appendChild(f); setTimeout(()=>f.remove(),800);
  },

  // faint dotted preview of where the current breezes will carry the courier
  renderGhost(){
    const layer=document.getElementById('ghostlayer'); if(!layer) return;
    layer.innerHTML='';
    if(this.flying || !this.st || this.st.status!=='ready') return;
    const st=initRun(this._Pghost, this.L); st.status='flying';
    if(this.st && this.st.lit) st.lit=true;
    const steps=[]; let result='loop'; let intoDark=false;
    for(let i=0;i<44 && st.status==='flying' && !intoDark;i++){
      const ev=stepSim(this._Pghost, this.L, st, { arrowDir:k=>this.arrows[k], gateOpen:()=>true });
      for(const e of ev){
        if(e.t==='move'){
          const t=this._Pghost.tiles[e.r+','+e.c];
          // the preview fades into darkness at unrevealed hidden tiles
          if(t && t.hidden && !st.lit && !this.seesHidden){ intoDark=true; break; }
          steps.push({r:e.r, c:e.c, dir:e.dir});
        }
        if(e.t==='win') result='win';
        if(e.t==='lose') result='lose';
      }
    }
    if(intoDark) result='dark';
    if(!steps.length) return;
    const TS=this.TS, W=this.P.cols*TS, H=this.P.rows*TS;
    // one continuous wind stream through the cell centers, drawn UNDER the items
    const cx=c=>c*TS+TS/2, cy=r=>r*TS+TS/2;
    let d=`M ${cx(this.P.start.c)} ${cy(this.P.start.r)}`;
    for(const s of steps.slice(0,44)) d+=` L ${cx(s.c)} ${cy(s.r)}`;
    layer.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="overflow:visible">
      <path d="${d}" fill="none" stroke="#ffffff" stroke-width="${TS*0.18}" stroke-opacity=".35"
        stroke-linecap="round" stroke-linejoin="round"/>
      <path class="ghoststream" d="${d}" fill="none" stroke="#4a3f66" stroke-width="2.5" stroke-opacity=".42"
        stroke-dasharray="7 9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    const last=steps[Math.min(steps.length,44)-1];
    const endIcon = result==='win' ? sparkStar(18,'#ffd34d')
                  : result==='lose' ? crossPuff(15)
                  : result==='dark' ? '<span style="opacity:.7">'+fogPuff(20)+'</span>' : null;
    if(endIcon){
      const e2=el('div','ghostend',endIcon);
      e2.style.left=(cx(last.c)-9)+'px'; e2.style.top=(cy(last.r)-9)+'px';
      layer.appendChild(e2);
    }
  },
  stepMs(){ return this.stats ? this.stats.stepMs : (this.L.stepMs||440); },

  renderObjectives(){
    const box=$('#hud-obj'); box.innerHTML='';
    for(const k in this.P.letters){
      const c=this.P.letters[k];
      const chip=el('div','objchip',sealChip(c,18,COLORS)); chip.dataset.color=c; chip.dataset.key=k; box.appendChild(chip);
    }
    this.P.stamps.forEach(k=>{ const chip=el('div','objchip',stampRosette(18)); chip.dataset.key=k; box.appendChild(chip); });
  },
  tickObjective(key){
    const chip=[...document.querySelectorAll('.objchip')].find(c=>c.dataset.key===key && !c.classList.contains('done'))
      || [...document.querySelectorAll('.objchip')].find(c=>!c.classList.contains('done'));
    if(chip) chip.classList.add('done');
  },
  markDelivered(color){
    const chip=[...document.querySelectorAll('.objchip')].find(c=>c.dataset.color===color && !c.classList.contains('done'));
    if(chip) chip.classList.add('done');
  },

  rotateArrow(k){
    if(this.st.status==='won'||this.st.status==='lost') return;
    const order=['u','r','d','l'];
    this.arrows[k]=order[(order.indexOf(this.arrows[k])+1)%4];
    this.arrowRot[k]=(this.arrowRot[k]||0)+90; // cumulative → always spins clockwise
    const arr=document.querySelector(`.tile[data-key="${k}"] .arr`);
    if(arr) arr.style.transform='rotate('+this.arrowRot[k]+'deg)';
    sfx.rotate();
    this.renderGhost();
    this.dismissTutorialFor(k);
  },
  tapGate(k){
    if(this.paused || this.st.status==='won'||this.st.status==='lost') return;
    const d=document.querySelector(`.tile[data-key="${k}"]`);
    this.gatesOpen[k]=true; d.classList.add('open'); sfx.gate();
    this.spark(k, sparkStar(16,'#9ff0c3'));
    this.gateCloseAt[k]=Date.now()+2600;
    this.armGate(k);
    this.dismissTutorialFor(k);
  },
  armGate(k){
    clearTimeout(this.gateTimers[k]);
    const ms=Math.max(0, this.gateCloseAt[k]-Date.now());
    this.gateTimers[k]=setTimeout(()=>{
      this.gatesOpen[k]=false;
      const d=document.querySelector(`.tile[data-key="${k}"]`); if(d) d.classList.remove('open');
      sfx.gate();
    }, ms);
  },
  setPaused(on){
    if(on){
      if(this.paused || !this.st || this.st.status!=='flying') return;
      this.paused=true; this.pauseStart=Date.now();
      Object.values(this.gateTimers).forEach(t=>clearTimeout(t));
    } else {
      if(!this.paused) return;
      this.paused=false;
      const dur=Date.now()-this.pauseStart;
      this.t0+=dur;
      for(const k in this.gatesOpen){
        if(this.gatesOpen[k]){ this.gateCloseAt[k]+=dur; this.armGate(k); }
      }
    }
  },

  startMoverIdle(){
    // pre-flight: movers and moon gates keep the SAME rhythm as in-flight
    // (one tick per stepMs), so the pattern the player watches is exactly
    // the pattern they'll fly against
    clearInterval(this.moverIdleTimer);
    if(!this.P.movers.length && this.P.moonCycle<=1 && this.P.zapCycle<=1) return;
    this.moverIdleTimer=setInterval(()=>{
      if(this.flying || this.paused) return;
      this.st.mt += this.st.hazardRate;
      this.renderMovers();
    }, this.stepMs());
  },
  renderMovers(){
    this.P.movers.forEach((m,i)=>{
      const p=moverPos(this.P, i, this.st.mt);
      const o=$('#mover-'+i); if(o) o.style.transform=`translate(${p[1]*this.TS}px,${p[0]*this.TS}px)`;
    });
    if(this.P.moonCycle>1){
      const open=moonOpen(this.L, this.st.mt);
      document.querySelectorAll('.tile.moongate').forEach(d=>{
        if(d.classList.contains('open')!==open){
          d.classList.toggle('open', open);
          d.querySelector('.moonface').innerHTML=moonGateIcon(Math.round(this.TS*0.66), open);
        }
      });
    }
    if(this.P.zapCycle>1){
      const on=zapOn(this.L, this.st.mt);
      const warn=!on && zapOn(this.L, this.st.mt+1);
      document.querySelectorAll('.tile.zap').forEach(d=>{
        d.classList.toggle('warn', warn);
        if(d.classList.contains('on')!==on){
          d.classList.toggle('on', on);
          d.querySelector('.zapface').innerHTML=zapIcon(Math.round(this.TS*0.62), on);
        }
      });
    }
  },

  go(){
    if(this.flying || this.st.status!=='ready') return;
    this.flying=true; this.st.status='flying'; sfx.go(); this.jolt('stretch');
    this._lastXY=this.cellXY(this.st.r,this.st.c);
    const gl=document.getElementById('ghostlayer'); if(gl) gl.innerHTML='';
    const goB=$('#btn-go'); goB.textContent=t('flyingNowHud'); goB.classList.add('flying');
    document.querySelectorAll('.bubble').forEach(b=>b.remove());
    this.t0=Date.now();
    this.timer=setInterval(()=>{
      if(this.paused) return;
      this.elapsed=(Date.now()-this.t0)/1000;
      if(this.L.timeLimit){
        const left=Math.max(0,this.L.timeLimit-this.elapsed);
        $('#hud-timer').textContent=Math.ceil(left)+t('secUnit');
        if(left<=0){ this.finishLose('timeup'); }
      } else $('#hud-timer').textContent=Math.floor(this.elapsed)+t('secUnit');
    },200);
    this.loop();
  },

  loop(){
    this._lastTs=0; this._acc=0;
    const tick=(ts)=>{
      if(this.st.status!=='flying') return;
      if(this.paused){ this._lastTs=ts; this._raf=requestAnimationFrame(tick); return; }
      if(!this._lastTs) this._lastTs=ts;
      this._acc += Math.min(200, ts-this._lastTs); // clamp so background tabs don't fast-forward
      this._lastTs=ts;
      while(this._acc >= this.stepMs() && this.st.status==='flying'){
        this._acc -= this.stepMs();
        this.doStep();
      }
      if(this.st.status==='flying') this._raf=requestAnimationFrame(tick);
    };
    this._raf=requestAnimationFrame(tick);
  },
  doStep(){
    const ev=stepSim(this.P,this.L,this.st,{
      arrowDir:k=>this.arrows[k],
      gateOpen:k=>!!this.gatesOpen[k],
    });
    this.renderMovers();
    for(const e of ev) this.handleEvent(e);
  },

  handleEvent(e){
    if(e.t==='move'){
      if(this._lastXY) this.puff(this._lastXY);
      this.placeCourier();
      this._lastXY=this.cellXY(e.r,e.c);
    }
    if(e.t==='pick'){
      sfx.pick(); this.jolt('squash');
      const item=document.getElementById('item-'+e.key); if(item){ item.style.transform='scale(1.5)'; item.style.opacity='0'; setTimeout(()=>item.remove(),300); }
      this.spark(e.key, sparkStar(20)); this.renderCarry();
    }
    if(e.t==='stamp'){
      sfx.stamp(); const item=document.getElementById('item-'+e.key); if(item){ item.style.transform='scale(1.6) rotate(20deg)'; item.style.opacity='0'; setTimeout(()=>item.remove(),300); }
      this.spark(e.key, stampRosette(22)); this.tickObjective(e.key);
    }
    if(e.t==='deliver'){
      sfx.deliver(); this.renderCarry(); this.jolt('squash'); this.deliverHop(e.key, e.color);
      const tile=document.querySelector(`.tile[data-key="${e.key}"]`);
      if(tile){ tile.classList.add('lit'); setTimeout(()=>tile.classList.remove('lit'),700); }
      this.markDelivered(e.color);
      toast(t('mailDeliveredToast')+sealChip(e.color,15,COLORS));
      // fog boss: lift fog when bridge requirement reached
      if(this.L.fogRows && this.st.deliveredCount>=2){ const f=$('#fogbox'); if(f) f.classList.add('gone'); }
      // bridges visual
      document.querySelectorAll('.tile.bridge').forEach(b=>{
        const t=this.P.tiles[b.dataset.key];
        if(this.st.deliveredCount>=t.needs) b.classList.add('active');
      });
    }
    if(e.t==='reject'){ sfx.bump(); this.jolt('squash'); this.spark(e.key, crossPuff(20)); toast(t('wrongMailbox')); }
    if(e.t==='bounceGate'){ sfx.bump(); this.jolt('squash'); this.shakeBoard(true); this.spark(e.key, e.color?sealChip(e.color,18,COLORS):crossPuff(20));
      if(e.moon) toast(t('moonGateClosed'));
      else if(!e.color) toast(t('gateClosedTap'));
      else toast(t('gateOnlyAccepts',{color:pick(COLOR_NAMES[e.color])})); }
    if(e.t==='light'){
      sfx.stamp(); this.spark(this.st.r+','+this.st.c, sparkStar(22,'#ffe9a8'));
      document.querySelectorAll('.tile.hiddenpath').forEach(d=>d.classList.add('revealed'));
      document.querySelectorAll('.tile.switch .lantern').forEach(l=>l.innerHTML=lanternIcon(Math.round(this.TS*0.62), true));
      toast(t('lanternLights'));
    }
    if(e.t==='bump'){ sfx.bump(); this.jolt('squash'); this.shakeBoard(true); this.spark(this.st.r+','+this.st.c, sparkStar(20, e.shield?'#7fe8a8':'#ff8a9e'));
      toast(e.shield ? (e.zap ? t('luluShruggedZap') : t('luluPuffedStorm'))
        : e.zap ? t('zapPushedBack',{name:this.stats.name})
        : e.storm ? t('stormShoved',{name:this.stats.name})
        : t('bumpedBalloon')); }
    if(e.t==='bounceHome'){ sfx.tap(); this.jolt('squash'); }
    if(e.t==='win'){ this.finishWin(); }
    if(e.t==='lose'){ this.finishLose(e.reason); }
  },
  renderCarry(){
    const box=$('#carrybadges'); box.innerHTML='';
    this.st.carrying.forEach(c=>{ const b=el('div','carrybadge'); b.style.background=COLORS[c].css; box.appendChild(b); });
  },
  spark(key,glyph){
    const [r,c]=key.split(',').map(Number);
    const s=el('div','sparkle',glyph);
    s.style.cssText=`left:${c*this.TS+this.TS*0.3}px;top:${r*this.TS}px;`;
    $('#board').appendChild(s); setTimeout(()=>s.remove(),750);
  },

  finishWin(){
    clearInterval(this.timer); clearTimeout(this.stepTimer);
    const L=this.L, id=L.id;
    const time=this.elapsed;
    let stars=1;
    if(time<=L.par) stars=2;
    const wantStamps=(L.stamps||[]).length;
    const gotStamps=Object.keys(this.st.stampsGot).length;
    const perfect=(wantStamps? gotStamps>=wantStamps : true) && this.st.mistakes===0;
    if(stars===2 && perfect) stars=3;
    if(stars===1 && perfect && time<=L.par*1.6) stars=2; // gentle: perfection forgives a slow-ish run
    let reward=0, rewardText;
    if(this.daily){
      const today=dailyKey();
      if(save.daily.last!==today){
        save.daily.streak = (save.daily.last===dailyKey(-1)) ? save.daily.streak+1 : 1;
        save.daily.last=today; reward=2; save.stamps+=reward; persist();
        rewardText=t('dailyReward',{n:reward, streak:save.daily.streak});
      } else rewardText=t('dailyComeBack',{streak:save.daily.streak});
    } else {
      const prev=save.stars[id]||0;
      if(prev===0){ reward+=3; }
      if(stars===3 && prev<3){ reward+=2; }
      if(reward) save.stamps+=reward;
      save.stars[id]=Math.max(prev,stars); persist();
      ui.maybeStory(id);
      rewardText = reward? t('rewardStamps',{n:reward}) : t('stampsAlready');
      const uc=COURIER_UNLOCKS[id];
      if(uc && !save.couriers[uc]){
        save.couriers[uc]=1; persist();
        const s=COURIER_STATS[uc];
        setTimeout(()=>toast(courierSVG(s.accent,20)+' '+t('courierJoined',{name:s.name})), 1400);
      }
    }
    // modal
    $('#win-title').textContent = this.daily?t('dailyDelivered'):(stars===3?t('perfectDelivery'):t('mailDelivered'));
    const mistakesText = this.st.mistakes===0 ? t('noMistakes') : (this.st.mistakes>1 ? t('nBumps',{n:this.st.mistakes}) : t('oneBump'));
    $('#win-msg').textContent = t('finishedIn',{time:time.toFixed(1)}) + ' · ' + mistakesText + (wantStamps? t('stampsCount',{got:gotStamps,want:wantStamps}):'');
    $('#win-stamps').innerHTML = rewardText + stampRosette(16);
    $('#btn-next').style.display = (this.daily || id>=40)?'none':'';
    const row=$('#win-stars'); row.innerHTML='';
    for(let i=0;i<3;i++){ const s=el('span','starslot','★'); row.appendChild(s); }
    sfx.win(); musicVictory();
    setTimeout(()=>{ ui.openModal('modal-win'); this.burst();
      [...row.children].forEach((s,i)=>{ if(i<stars) setTimeout(()=>{s.classList.add('won'); sfx.star();}, 350+i*380); });
      setTimeout(()=>ui.showStoryIfAny(), 1700);
    }, 650);
  },
  burst(){
    const b=$('#winburst'); b.innerHTML='';
    const glyphs=[
      envelopeIcon(22,'#45b4ff','#1b86d9'), sparkStar(20), sealChip('p',20,COLORS),
      sealChip('b',20,COLORS), stampRosette(22), sealChip('y',20,COLORS), sealChip('g',20,COLORS),
    ];
    for(let i=0;i<26;i++){
      const c=el('div','confetti',glyphs[i%glyphs.length]);
      c.style.left=(5+Math.random()*90)+'%'; c.style.top=(Math.random()*30)+'%';
      c.style.animationDelay=(Math.random()*0.5)+'s';
      b.appendChild(c);
    }
    setTimeout(()=>b.innerHTML='',2400);
  },
  finishLose(reason){
    this.st.status='lost';
    clearInterval(this.timer); clearTimeout(this.stepTimer);
    sfx.lose();
    if(reason==='storm'||reason==='drift') this.shakeBoard(false);
    const leanEl=document.querySelector('#courier .lean'); if(leanEl) leanEl.style.rotate='0deg';
    $('#courier').classList.add('dizzy');
    const msgs={
      drift:t('loseDrift'),
      storm:t('loseStorm'),
      bridge:t('loseBridge'),
      tired:t('loseTired'),
      timeup:t('loseTimeup'),
      zap:t('loseZap',{name:this.stats.name}),
    };
    const accent=this.stats.accent;
    const faces={
      storm: stormCloud(84),
      zap: zapIcon(84, true),
      timeup: '<span style="color:#e8559a">'+uiIcon('clock',72)+'</span>',
    };
    $('#lose-face').innerHTML=faces[reason]||courierSVG(accent,96,'dizzy');
    $('#lose-msg').textContent=msgs[reason]||t('loseDefault');
    setTimeout(()=>{ $('#courier').classList.remove('dizzy'); ui.openModal('modal-lose'); },900);
  },

  restart(){ sfx.tap(); this.load(this.L.id); },
  hint(){
    // rewarded-ad gate: watch the (mock) video, then the hint is revealed
    sfx.tap();
    ui.playAd(()=>this._doHint());
  },
  _doHint(){
    this.usedHint=true;
    const bulb='<span style="color:#eda313">'+uiIcon('bulb',14)+'</span> ';
    document.querySelectorAll('.tile.hinted').forEach(t=>t.classList.remove('hinted'));
    // solver-backed hint (computed once per level, reused across taps)
    let advice=null;
    if(!this.flying){
      if(!this._solution) this._solution = solveLevel(this.L, this.P);
      advice = adviseHint(this._solution, this.arrows);
    }
    let key=null, text=null;
    if(advice && advice.fix){ key=advice.fix.key; text=t('hintPointBreeze',{dir:t(DIR_KEY[advice.fix.dir])})+dirGlyph(advice.fix.dir); }
    else if(advice && advice.live){ key=advice.live.key; text=t('hintTurnWhileFlying',{dir:t(DIR_KEY[advice.live.dir])})+dirGlyph(advice.live.dir); }
    else if(advice && advice.ready){ key='go'; text=t('hintReady'); }
    else if(this.L.hint){ key=this.L.hint.cell; text=pick(this.L.hint.text); }
    if(!key) return;
    if(key!=='go'){
      const tile=document.querySelector(`.tile[data-key="${key}"]`);
      if(tile){ tile.classList.add('hinted'); setTimeout(()=>tile.classList.remove('hinted'),4000); }
    }
    this.bubbleAt(key, bulb+text, 4000);
  },

  bubbleAt(key, text, ttl){
    document.querySelectorAll('.bubble').forEach(b=>b.remove());
    const bub=el('div','bubble',text);
    if(key==='go'){
      $('#phone').appendChild(bub);
      const r=$('#btn-go').getBoundingClientRect(), pr=$('#phone').getBoundingClientRect();
      bub.style.left=(r.left-pr.left+r.width/2-100)+'px'; bub.style.top=(r.top-pr.top-70)+'px';
    } else {
      const [r,c]=key.split(',').map(Number);
      $('#board').appendChild(bub);
      const bx=c*this.TS+this.TS/2;
      bub.style.left=Math.max(4, Math.min(this.P.cols*this.TS-208, bx-104))+'px';
      if(r>=2){ bub.style.top=(r*this.TS-64)+'px'; } else { bub.classList.add('below'); bub.style.top=((r+1)*this.TS+12)+'px'; }
    }
    if(ttl) setTimeout(()=>bub.remove(),ttl);
  },
  showTutorial(){
    const tut=this.L.tutorial; if(!tut||!tut.length||save.stars[this.L.id]) { this.tut=null; return; }
    this.tut=tut; this.tutIdx=0; this.showTutStep();
  },
  showTutStep(){
    if(!this.tut||this.tutIdx>=this.tut.length) return;
    const step=this.tut[this.tutIdx];
    if(step.cell!=='go'){
      const tile=document.querySelector(`.tile[data-key="${step.cell}"]`);
      if(tile) tile.classList.add('hinted');
    }
    this.bubbleAt(step.cell, pick(step.text));
  },
  dismissTutorialFor(k){
    if(!this.tut) return;
    const step=this.tut[this.tutIdx];
    if(step && step.cell===k){
      const tile=document.querySelector(`.tile[data-key="${k}"]`); if(tile) tile.classList.remove('hinted');
      this.tutIdx++;
      setTimeout(()=>this.showTutStep(),350);
    }
  },
};
