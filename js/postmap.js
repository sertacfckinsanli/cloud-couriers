// ---------- Post Office meta-map: house overview + fullscreen room renovation ----------
// Map view: rooms fit the screen WIDTH, stacked vertically (vertical scroll only, no
// horizontal pan), unlocked in sequence. Tap "Renovate" -> the room opens FULLSCREEN,
// orientation-responsive (fills landscape when the phone is rotated) with zoom in/out
// and tappable slot pins. Each finished task softly reveals ONE region of the coherent
// finished render over the "before" image; on completion it settles to the full render.
import { save, persist } from './save.js';
import { sfx } from './audio.js';
import { ROOM_ART } from './roomart.js';

const ROOMS = [
  { id:'garden', name:'Garden', before:ROOM_ART.gardenBefore, after:ROOM_ART.garden,
    pieces:[
      { id:'fountain', title:'Restore the fountain',  cost:5, rect:{cx:31,cy:45,rx:14,ry:15} },
      { id:'arch',     title:'Repair the rose arch',  cost:4, rect:{cx:50,cy:27,rx:12,ry:17} },
      { id:'lamps',    title:'Light the path',        cost:5, rect:{cx:47,cy:52,rx:15,ry:24} },
      { id:'bench',    title:'Add the garden bench',  cost:4, rect:{cx:66,cy:61,rx:12,ry:11} },
      { id:'flowersL', title:'Plant the left beds',   cost:4, rect:{cx:20,cy:60,rx:16,ry:18} },
      { id:'flowersR', title:'Plant the right beds',  cost:4, rect:{cx:82,cy:60,rx:14,ry:16} },
    ] },
  { id:'lobby', name:'Lobby', before:ROOM_ART.lobbyBefore, after:ROOM_ART.lobbyAfter,
    pieces:[
      { id:'floor',    title:'Clear the clutter & polish the floor', cost:4, rect:{cx:48,cy:45,rx:17,ry:16} },
      { id:'windows',  title:'Unboard the windows',        cost:4, rect:{cx:63,cy:28,rx:13,ry:22} },
      { id:'mailwall', title:'Restore the mail-sorting wall', cost:5, rect:{cx:17,cy:44,rx:16,ry:26} },
      { id:'counter',  title:'Rebuild the reception counter', cost:5, rect:{cx:77,cy:52,rx:21,ry:27} },
      { id:'lounge',   title:'Furnish the waiting lounge',  cost:5, rect:{cx:42,cy:70,rx:27,ry:24} },
    ] },
  { id:'sorting', name:'Sorting Room', before:ROOM_ART.lobbyBefore, comingSoon:true },
];
const ORDER = ['garden','lobby','sorting'];

// ---------- state ----------
function stt(){ if(!save.rooms) save.rooms = {}; return save.rooms; }
function roomRec(id){ const s=stt(); const r=(s[id] = s[id] || { done:false, pieces:{} }); if(!r.pieces) r.pieces={}; return r; }
function roomById(id){ return ROOMS.find(r=>r.id===id); }
function pieceDone(rid,pid){ const p=roomRec(rid).pieces; return !!(p && p[pid]); }
function roomComplete(r){ return r.pieces ? r.pieces.every(p => pieceDone(r.id, p.id)) : roomRec(r.id).done; }
function activeIdx(){
  for(let i=0;i<ORDER.length;i++){ const r=roomById(ORDER[i]); if(r.comingSoon) continue; if(!roomComplete(r)) return i; }
  return ORDER.length;
}
function roomState(r){
  if(roomComplete(r)) return 'done';
  if(r.comingSoon){
    const i = ORDER.indexOf(r.id);
    return (i===0 || roomComplete(roomById(ORDER[i-1]))) ? 'soon' : 'locked';
  }
  const i = ORDER.indexOf(r.id);
  return i===activeIdx() ? 'active' : 'locked';
}
function progress(r){ return r.pieces ? r.pieces.filter(p=>pieceDone(r.id,p.id)).length : 0; }

// ---------- DOM ----------
let built = false, els = {}, currentRoomId = null;
function ellipseMask(rect){ return `radial-gradient(ellipse ${rect.rx}% ${rect.ry}% at ${rect.cx}% ${rect.cy}%, #000 62%, rgba(0,0,0,0) 100%)`; }
function paintRoom(elm, r){
  const state = roomState(r);
  const fullyDone = state==='done' && r.after;
  const base = fullyDone ? r.after : (r.before || r.after);
  elm.style.backgroundImage = `url(${base})`;
  elm.querySelectorAll('.pm-piece').forEach(e=>e.remove());
  if(r.pieces && r.after && !fullyDone){
    r.pieces.filter(p=>pieceDone(r.id,p.id)).forEach(p=>{
      const layer=document.createElement('div'); layer.className='pm-piece on';
      layer.style.cssText=`background-image:url(${r.after});-webkit-mask-image:${ellipseMask(p.rect)};mask-image:${ellipseMask(p.rect)};`;
      elm.appendChild(layer);
    });
  }
}

function build(){
  const screen = document.getElementById('screen-postmap');
  screen.innerHTML = `
    <div id="pm-map">
      <div id="pm-viewport"><div id="pm-scene"></div></div>
      <div id="pm-hud">
        <button class="iconbtn" id="pm-back" aria-label="Back"><span data-icon="back" data-size="20"></span></button>
        <div class="pill"><span data-icon="stamp" data-size="20"></span> <span id="pm-stamps">0</span></div>
        <button class="iconbtn" id="pm-settings" aria-label="Settings"><span data-icon="gear" data-size="20"></span></button>
      </div>
      <div id="pm-hint">Swipe up / down · tap the glowing room</div>
    </div>

    <div id="pm-roomview">
      <div id="pm-rv-hud">
        <button class="iconbtn" id="pm-rv-back" aria-label="Back to map"><span data-icon="back" data-size="20"></span></button>
        <div id="pm-rv-title"></div>
        <div class="pill"><span data-icon="stamp" data-size="20"></span> <span id="pm-rv-stamps">0</span></div>
      </div>
      <div id="pm-rv-wrap">
        <div id="pm-rv-stage"><div id="pm-rv-room"></div></div>
        <div id="pm-rv-zoom">
          <button id="pm-rv-zin" aria-label="Zoom in">+</button>
          <button id="pm-rv-zout" aria-label="Zoom out">−</button>
        </div>
      </div>
      <div id="pm-rv-foot"><div id="pm-rv-progress"></div><div id="pm-rv-tip">Tap a ✚ spot to renovate · pinch/buttons to zoom</div></div>
    </div>

    <div id="pm-toast"></div>`;

  els = {
    screen,
    vp: screen.querySelector('#pm-viewport'), scene: screen.querySelector('#pm-scene'),
    stamps: screen.querySelector('#pm-stamps'),
    roomview: screen.querySelector('#pm-roomview'), stage: screen.querySelector('#pm-rv-stage'),
    rvRoom: screen.querySelector('#pm-rv-room'),
    rvTitle: screen.querySelector('#pm-rv-title'), rvStamps: screen.querySelector('#pm-rv-stamps'),
    rvProgress: screen.querySelector('#pm-rv-progress'), toast: screen.querySelector('#pm-toast'),
  };
  if(window.__hydrateIcons) window.__hydrateIcons(screen);

  screen.querySelector('#pm-back').onclick     = ()=> window.ui.back();
  screen.querySelector('#pm-settings').onclick = ()=> window.ui.openSettings();
  screen.querySelector('#pm-rv-back').onclick  = exitRoom;
  screen.querySelector('#pm-rv-zin').onclick   = ()=> setZoom(rvZoom+0.4);
  screen.querySelector('#pm-rv-zout').onclick  = ()=> setZoom(rvZoom-0.4);

  initMapPan();
  initRoomPan();
  window.addEventListener('resize', ()=>{
    if(!els.screen.classList.contains('on')) return;
    if(els.roomview.classList.contains('on')){ fitStage(); clampRv(); applyRv(); }
    else { layout(); buildScene(); centerOn(roomById(ORDER[Math.min(activeIdx(),ORDER.length-1)])); }
  });
  built = true;
}

// ---------- responsive vertical layout (map) ----------
let LAY = { vw:430, m:12, roomW:406, roomH:270, gap:18, top:16, sceneH:0 };
function layout(){
  const vw = els.vp.clientWidth || 430;
  const m = 12, gap = 18, top = 16;
  const roomW = vw - m*2;
  const roomH = Math.round(roomW*2/3);
  LAY = { vw, m, roomW, roomH, gap, top, sceneH: top*2 + ROOMS.length*(roomH+gap) - gap };
  els.scene.style.width = vw+'px';
  els.scene.style.height = LAY.sceneH+'px';
}
function roomXY(r){
  const slotFromTop = (ORDER.length-1) - ORDER.indexOf(r.id);   // ORDER[0] (garden) sits at the bottom
  return { x: LAY.m, y: LAY.top + slotFromTop*(LAY.roomH+LAY.gap) };
}

// ---------- map view ----------
function buildScene(){
  els.scene.querySelectorAll('.pm-room').forEach(e=>e.remove());
  ROOMS.forEach(r=>{
    const state = roomState(r);
    const {x,y} = roomXY(r);
    const room = document.createElement('div');
    room.className = 'pm-room '+state;
    room.dataset.id = r.id;
    room.style.cssText = `left:${x}px;top:${y}px;width:${LAY.roomW}px;height:${LAY.roomH}px;`;
    paintRoom(room, r);
    const veil=document.createElement('div'); veil.className='pm-veil'; room.appendChild(veil);
    if(state==='locked'){ const l=document.createElement('div'); l.className='pm-lock'; l.textContent='🔒'; room.appendChild(l); }
    if(state==='soon'){ const s=document.createElement('div'); s.className='pm-soon'; s.textContent='✨ Coming soon'; room.appendChild(s); }
    if(state==='active'){
      const c=document.createElement('button'); c.className='pm-cta'; c.textContent='Renovate';
      c.onclick=(e)=>{ e.stopPropagation(); if(!mapMoved) enterRoom(r); }; room.appendChild(c);
      const pr=document.createElement('div'); pr.className='pm-progress'; pr.textContent=progress(r)+' / '+r.pieces.length; room.appendChild(pr);
    }
    const lab=document.createElement('div'); lab.className='pm-label';
    lab.textContent=(state==='done'?'✓ ':'')+r.name+(state==='soon'?' · Coming soon':'');
    room.appendChild(lab);
    room.onclick=()=>{ if(mapMoved) return; onRoom(r); };
    els.scene.appendChild(room);
  });
  refreshHud();
}
function refreshHud(){ els.stamps.textContent = save.stamps|0; }
function onRoom(r){
  const state = roomState(r);
  if(state==='soon'){ pmToast('✨ '+r.name+' — coming soon!'); return; }
  if(state==='locked'){ const a=activeIdx(); pmToast('🔒 Finish the '+roomById(ORDER[Math.min(a,ORDER.length-1)]).name+' first'); return; }
  if(state==='done'){ pmToast(r.name+' is all done ✓'); return; }
  enterRoom(r);
}

// ---------- fullscreen room view ----------
function enterRoom(r){
  currentRoomId = r.id;
  rvZoom=1; rvPX=0; rvPY=0; applyRv();
  els.rvStamps.textContent = save.stamps|0;
  renderRoomView();
  els.roomview.classList.add('on');
  requestAnimationFrame(()=>{ fitStage(); applyRv(); });
  sfx.tap();
}
// size the room stage to contain a 3:2 box within the wrap, in any orientation
function fitStage(){
  const wrap = els.stage.parentElement;
  const cs = getComputedStyle(wrap);
  const availW = wrap.clientWidth  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const availH = wrap.clientHeight - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom);
  if(availW<=0 || availH<=0) return;
  let w = availW, h = w*2/3;          // fit to width, unless that overflows height (landscape)
  if(h > availH){ h = availH; w = h*1.5; }
  els.stage.style.width = Math.round(w)+'px';
  els.stage.style.height = Math.round(h)+'px';
}
function exitRoom(){ els.roomview.classList.remove('on'); currentRoomId=null; buildScene(); }
function renderRoomView(){
  const r = roomById(currentRoomId); if(!r) return;
  paintRoom(els.rvRoom, r);
  els.rvRoom.querySelectorAll('.pm-pin').forEach(e=>e.remove());
  els.rvTitle.textContent = r.name;
  if(r.pieces){
    r.pieces.filter(p=>!pieceDone(r.id,p.id)).forEach(p=>{
      const pin=document.createElement('button');
      pin.className='pm-pin'+((save.stamps|0)>=p.cost?'':' poor');
      pin.style.cssText=`left:${p.rect.cx}%;top:${p.rect.cy}%;`;
      pin.innerHTML=`<span class="pm-pin-plus">✚</span><span class="pm-pin-cost">${p.cost} 📮</span><span class="pm-pin-name">${p.title}</span>`;
      pin.onclick=(e)=>{ e.stopPropagation(); startTask(r,p); };
      els.rvRoom.appendChild(pin);
    });
  }
  els.rvStamps.textContent = save.stamps|0;
  els.rvProgress.textContent = r.pieces ? progress(r)+' / '+r.pieces.length+' renovated' : '';
}
function startTask(r,p){
  if((save.stamps|0) < p.cost){ pmToast('Not enough stamps — play levels to earn more!'); return; }
  save.stamps = Math.max(0,(save.stamps|0)-p.cost);
  roomRec(r.id).pieces[p.id] = true;
  persist();
  sfx.stamp && sfx.stamp();
  renderRoomView();
  spawnPoof(p.rect.cx, p.rect.cy);
  pmToast('Renovated! ✨');
  if(roomComplete(r)){
    roomRec(r.id).done = true; persist();
    renderRoomView();
    setTimeout(()=>{
      pmToast('🎉 '+r.name+' renovated!');
      setTimeout(()=>{
        exitRoom();
        const a=activeIdx();
        if(a<ORDER.length){ const nx=roomById(ORDER[a]); setTimeout(()=>{ centerOn(nx); pmToast('✨ '+nx.name+' unlocked!'); },500); }
        else setTimeout(()=>pmToast('🏆 Post Office fully renovated!'),500);
      },1100);
    },500);
  }
}
function spawnPoof(cx, cy){
  const poof=document.createElement('div'); poof.className='pm-poof'; poof.textContent='✨';
  poof.style.cssText=`left:${cx}%;top:${cy}%;`;
  els.rvRoom.appendChild(poof); setTimeout(()=>poof.remove(), 900);
}

// ---------- room zoom + pan ----------
let rvZoom=1, rvPX=0, rvPY=0;
function applyRv(){ if(els.rvRoom) els.rvRoom.style.transform=`translate(${rvPX}px,${rvPY}px) scale(${rvZoom})`; }
function clampRv(){
  const w=els.rvRoom.clientWidth, h=els.rvRoom.clientHeight;
  const mx=(rvZoom-1)*w/2, my=(rvZoom-1)*h/2;
  rvPX=Math.max(-mx,Math.min(mx,rvPX)); rvPY=Math.max(-my,Math.min(my,rvPY));
}
function setZoom(z){
  rvZoom=Math.max(1,Math.min(2.6, Math.round(z*10)/10));
  if(rvZoom===1){ rvPX=0; rvPY=0; } else clampRv();
  applyRv();
}
function initRoomPan(){
  const st=els.stage; let drag=false, moved=false, cap=false, ax,ay,bx,by;
  st.addEventListener('pointerdown',e=>{ if(rvZoom<=1)return; drag=true;moved=false;cap=false;ax=e.clientX;ay=e.clientY;bx=rvPX;by=rvPY; });
  st.addEventListener('pointermove',e=>{
    if(!drag)return; const dx=e.clientX-ax, dy=e.clientY-ay;
    if(!moved && Math.abs(dx)+Math.abs(dy)>6){ moved=true; try{ st.setPointerCapture(e.pointerId); cap=true; }catch(_){} }
    if(moved){ rvPX=bx+dx; rvPY=by+dy; clampRv(); applyRv(); }
  });
  const end=(e)=>{ if(cap){ try{ st.releasePointerCapture(e.pointerId); }catch(_){} } drag=false; cap=false; };
  st.addEventListener('pointerup',end); st.addEventListener('pointercancel',end);
}

// ---------- map pan (vertical only) ----------
let panY=0, mapDrag=false, mapMoved=false, mapCap=false, msy, mspy;
function clamp(){
  const vh=els.vp.clientHeight;
  const minY=Math.min(0, vh-LAY.sceneH);
  panY=Math.max(minY,Math.min(0,panY));
  els.scene.style.transform=`translate(0px,${panY}px)`;
}
function centerOn(r){ const {y}=roomXY(r); const vh=els.vp.clientHeight; panY=-(y+LAY.roomH/2)+vh/2; clamp(); }
function initMapPan(){
  const vp=els.vp;
  vp.addEventListener('pointerdown',e=>{ mapDrag=true;mapMoved=false;mapCap=false;msy=e.clientY;mspy=panY; });
  vp.addEventListener('pointermove',e=>{
    if(!mapDrag)return; const dy=e.clientY-msy;
    if(!mapMoved && Math.abs(dy)>6){ mapMoved=true; try{ vp.setPointerCapture(e.pointerId); mapCap=true; }catch(_){} }
    if(mapMoved){ panY=mspy+dy; clamp(); }
  });
  const end=(e)=>{ if(mapCap){ try{ vp.releasePointerCapture(e.pointerId); }catch(_){} } mapDrag=false; mapCap=false; };
  vp.addEventListener('pointerup',end); vp.addEventListener('pointercancel',end);
}

// ---------- toast ----------
let toastT=null;
function pmToast(m){ els.toast.textContent=m; els.toast.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>els.toast.classList.remove('show'),1800); }

// ---------- entry ----------
export function renderPostMap(){
  if(!built) build();
  if((save.metaWelcome|0) < 2){ save.stamps=Math.max(save.stamps|0, 300); save.metaWelcome=2; persist(); setTimeout(()=>pmToast('Test balance topped up: 300 stamps 📮'),400); }
  els.roomview.classList.remove('on'); currentRoomId=null;
  layout(); buildScene();
  const recenter=()=>{ layout(); centerOn(roomById(ORDER[Math.min(activeIdx(),ORDER.length-1)])); };
  requestAnimationFrame(recenter); setTimeout(recenter,60);
}
