// ---------- screens, map, meta (couriers / collection / post office) ----------
import { LEVELS } from './levels.js';
import { $, el, toast } from './dom.js';
import { sfx } from './audio.js';
import { save, persist, maxUnlocked, resetSave, dailyKey, dailyDone } from './save.js';
import { courierSVG } from './svg.js';
import { COURIERS, COURIER_STATS, STORY, SHOP, REGIONS } from './data.js';
import { game } from './game.js';
import { uiIcon, starRow, decoIcon, stampRosette } from './icons.js';

const goldStars = n => `<span style="color:#eda313;display:inline-flex;gap:1px;">${uiIcon('star',13).repeat(n)}</span>`;

function hashStr(s){ let h=0; for(let i=0;i<s.length;i++){ h=Math.imul(31,h)+s.charCodeAt(i)|0; } return Math.abs(h); }

export const ui = {
  stack:['title'], currentLevel:1, pendingOpts:null,
  show(name){
    if(name!=='play') $('#phone').classList.remove('rainbow','night');
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
    const sc=$('#screen-'+name); sc.classList.add('on'); sc.classList.add('fadein');
    setTimeout(()=>sc.classList.remove('fadein'),400);
    if(name!=='title' && this.stack[this.stack.length-1]!==name) this.stack.push(name);
    if(name==='map') renderMap();
    if(name==='couriers') renderCouriers();
    if(name==='collection') renderCollection();
    if(name==='post') renderPost();
    sfx.tap();
  },
  back(){ this.stack.pop(); const prev=this.stack[this.stack.length-1]||'title'; this.show(prev); },
  play(){ this.show('map'); },
  openDaily(){
    const key=dailyKey(), seed=hashStr(key);
    const id=(seed % 27)+4;                       // one of levels 4..30, rotates daily
    this.currentLevel=id; this.pendingOpts={daily:true, seed};
    const L=LEVELS[id-1];
    $('#intro-region').textContent='Daily Delivery · '+key;
    $('#intro-name').textContent='Daily: '+L.name;
    $('#intro-obj').textContent='Today\'s breezes are scrambled — find the route!';
    const g=$('#intro-goals'); g.innerHTML='';
    g.appendChild(el('div','goalrow','<span class="gicon">'+goldStars(1)+'</span> Deliver every letter'));
    g.appendChild(el('div','goalrow','<span class="gicon" style="color:#e8559a">'+uiIcon('gift',16)+'</span> '+(dailyDone()?'Done today · streak '+save.daily.streak:'+2 stamps · keep your streak going!')));
    this.openModal('modal-intro');
  },
  openLevel(id){
    this.currentLevel=id; this.pendingOpts=null; const L=LEVELS[id-1];
    const regionName = {1:'Cotton Village',2:'Rainbow Market',3:'Sleeping Moon Isles'}[L.region];
    $('#intro-region').textContent = regionName + ' · Level '+id;
    $('#intro-name').textContent = L.name + (L.boss? ' 👑':'');
    $('#intro-obj').textContent = L.obj;
    const g=$('#intro-goals'); g.innerHTML='';
    g.appendChild(el('div','goalrow','<span class="gicon">'+goldStars(1)+'</span> Deliver every letter'));
    g.appendChild(el('div','goalrow','<span class="gicon">'+goldStars(2)+'</span> Finish within '+(L.timeLimit?L.timeLimit+'s time limit':L.par+'s')));
    g.appendChild(el('div','goalrow','<span class="gicon">'+goldStars(3)+'</span> '+((L.stamps&&L.stamps.length)?'Collect the golden stamp':'A perfect run: no bumps or wrong mail')));
    const cn = L.courier==='mimo'?'Mimo (trial!)':'Poffy';
    g.appendChild(el('div','goalrow','<span class="gicon" style="color:#45b4ff">'+uiIcon('cloud',16)+'</span> Courier: <b>'+cn+'</b>'));
    this.openModal('modal-intro');
  },
  startLevel(){ this.closeModal('modal-intro'); this.show('play'); game.load(this.currentLevel, this.pendingOpts||{}); },
  nextLevel(){ this.closeModal('modal-win'); const n=this.currentLevel+1;
    if(n>30){ this.show('map'); toast('More regions coming soon!'); return; }
    this.openLevel(n); },
  replay(withHint){ this.closeModal('modal-win'); this.closeModal('modal-lose'); this.show('play'); game.load(this.currentLevel, this.pendingOpts||{}); if(withHint) setTimeout(()=>game.hint(),400); },
  openModal(id){ $('#'+id).classList.add('on'); },
  closeModal(id){
    $('#'+id).classList.remove('on');
    if(id==='modal-settings') game.setPaused(false);
  },
  openSettings(){
    $('#sw-sfx').classList.toggle('on',save.sfx);
    const inGame=$('#screen-play').classList.contains('on');
    $('#btn-quit').style.display = inGame ? '' : 'none';
    if(inGame) game.setPaused(true);
    this.openModal('modal-settings');
  },
  quitLevel(){
    this.closeModal('modal-settings');
    game.cleanup();
    if(game.st) game.st.status='quit';
    game.flying=false; game.paused=false;
    this.show('map');
  },
  openCourierPicker(){
    if(game.flying){ toast('No swapping mid-flight!'); return; }
    if(game.L && game.L.courier){
      toast('This level flies with '+COURIER_STATS[game.L.courier].name+'!'); return;
    }
    const list=$('#courier-pick-list'); list.innerHTML='';
    COURIERS.forEach(c=>{
      const s=COURIER_STATS[c.id];
      const owned=!!save.couriers[c.id];
      const active=game.courierId===c.id;
      const row=el('div','courier-card'+(owned?'':' locked'));
      row.style.cursor=owned?'pointer':'default';
      row.innerHTML=`<div>${courierSVG(s.accent,54)}</div>
        <div class="cinfo"><div class="cname">${s.name}${active?' ✓':''}</div>
        <div class="cdesc">${c.desc}</div>
        <span class="badge ${owned?'':'lock'}">${owned?(active?'Flying now':'Tap to fly'):c.tag}</span></div>`;
      if(owned && !active) row.onclick=()=>{
        save.lastCourier=c.id; persist(); sfx.tap();
        this.closeModal('modal-courier');
        game.load(this.currentLevel, Object.assign({}, this.pendingOpts||{}, {courier:c.id}));
        toast(s.name+' is ready to fly!');
      };
      list.appendChild(row);
    });
    this.openModal('modal-courier');
  },
  toggleSfx(){ save.sfx=!save.sfx; persist(); $('#sw-sfx').classList.toggle('on',save.sfx); sfx.tap(); },
  resetProgress(){ resetSave(); this.closeModal('modal-settings'); this.show('title'); toast('Progress reset. Fresh skies!'); },
  pendingStory:null,
  maybeStory(lv){
    const s=STORY.find(s=>s.lv===lv);
    if(s && !save.letters[lv]){ save.letters[lv]=1; persist(); this.pendingStory=s; }
  },
  showStoryIfAny(){
    if(this.pendingStory){ const s=this.pendingStory; this.pendingStory=null;
      $('#story-content').innerHTML='<div class="from">'+s.from+'</div>'+s.text;
      this.openModal('modal-story'); return true; }
    return false;
  },
  closeStory(){ this.closeModal('modal-story'); },
};

function renderMap(){
  $('#stamp-count').textContent=save.stamps;
  const inner=$('#map-inner'); inner.innerHTML='';
  const W = $('#map-scroll').clientWidth || 400;
  let y=8;
  // retention mock cards
  const ret=el('div','retention');
  const dStatus = dailyDone() ? '✓ done · streak '+save.daily.streak
                : (save.daily.streak ? 'play! · streak '+save.daily.streak : 'play today\'s route!');
  const daily=el('button','ret-card',`<div class="big" style="color:#e8559a">${uiIcon('gift',26)}</div>Daily Delivery<div class="soon">${dStatus}</div>`);
  daily.onclick=()=>ui.openDaily();
  ret.appendChild(daily);
  ret.appendChild(el('div','ret-card',`<div class="big" style="color:#1b86d9">${uiIcon('book',26)}</div>Lost Letter Book<div class="soon">${Object.keys(save.letters).length}/${STORY.length} found</div>`));
  ret.appendChild(el('div','ret-card',`<div class="big" style="color:#eda313">${uiIcon('tent',26)}</div>Sky Festival<div class="soon">seasonal · soon</div>`));
  inner.appendChild(ret); y+=104;
  const unlockedMax = maxUnlocked();
  for(const reg of REGIONS){
    const b=el('div','region-banner'+(reg.locked?' locked':''),
      `<div class="rname"><span style="color:${reg.tint};vertical-align:-3px;display:inline-block;">${uiIcon(reg.icon,20)}</span> ${reg.name}</div><div class="rsub">${reg.sub}</div>`);
    b.style.cssText=`position:absolute; left:11%; width:78%; margin:0; top:${y}px;`;
    inner.appendChild(b); y+=84;
    if(reg.locked){
      const fog=el('div','lockfog',`<span style="vertical-align:-2px;display:inline-block;color:#8d97ad;">${uiIcon('lock',14)}</span> covered in soft cloud fog`);
      fog.style.top=y+'px'; inner.appendChild(fog); y+=86; continue;
    }
    const ids = Array.from({length:10},(_,i)=>(reg.id-1)*10+i+1);
    ids.forEach((id,i)=>{
      const x = W/2 + Math.sin(i*1.05)* (W*0.26) - 32;
      const node=el('button','node'+(reg.id===2?' rainbow':reg.id===3?' nightnode':''));
      const st=save.stars[id]||0;
      if(st>0){ node.classList.add('done'); node.innerHTML=id+'<span class="stars">'+starRow(st,13)+'</span>'; }
      else if(id===unlockedMax){ node.classList.add('current'); node.textContent=id; }
      else if(id<unlockedMax){ node.textContent=id; }
      else { node.classList.add('locked'); node.innerHTML=uiIcon('lock',22); }
      node.style.left=x+'px'; node.style.top=y+'px';
      node.onclick=()=>ui.openLevel(id);
      // path dots to next
      if(i<ids.length-1){
        const nx = W/2 + Math.sin((i+1)*1.05)*(W*0.26) - 32;
        for(let dt=1;dt<4;dt++){
          const dot=el('div','mapdot'); dot.style.left=(x+32+(nx-x)*dt/4)+'px'; dot.style.top=(y+64+ (88-64)*dt/4 )+'px';
          inner.appendChild(dot);
        }
      }
      inner.appendChild(node); y+=92;
    });
    y+=30;
  }
  inner.style.height=(y+140)+'px';
  // scroll to current
  setTimeout(()=>{ const cur=inner.querySelector('.node.current')||inner.querySelector('.node:not(.locked)');
    if(cur) $('#map-scroll').scrollTop = Math.max(0, cur.offsetTop-260); },30);
}

function renderCouriers(){
  const list=$('#courier-list'); list.innerHTML='';
  COURIERS.forEach(c=>{
    const s=COURIER_STATS[c.id];
    const owned=!!save.couriers[c.id];
    const card=el('div','courier-card'+(owned?'':' locked'));
    card.innerHTML=`<div>${courierSVG(s.accent,72)}</div>
      <div class="cinfo"><div class="cname">${s.name}</div>
      <div class="cdesc">${c.desc}</div>
      <span class="badge ${owned?'':'lock'}">${owned?'In your post office!':c.tag}</span></div>`;
    list.appendChild(card);
  });
}

function renderCollection(){
  const list=$('#collection-list'); list.innerHTML='';
  const found=Object.keys(save.letters).length;
  list.appendChild(el('div','region-banner',`<div class="rname"><span style="color:#e8559a;vertical-align:-3px;display:inline-block;">${uiIcon('mail',18)}</span> ${found} / ${STORY.length} lost letters found</div><div class="rsub">Special letters unlock tiny stories</div>`));
  STORY.forEach(s=>{
    if(save.letters[s.lv]) list.appendChild(el('div','storyletter',`<div class="from">${s.from} · found at level ${s.lv}</div>${s.text}`));
    else list.appendChild(el('div','storyletter locked',`<span style="vertical-align:-2px;display:inline-block;">${uiIcon('lock',13)}</span> A lost letter waits at level ${s.lv}…`));
  });
}

function renderPost(){
  $('#stamp-count2').textContent=save.stamps;
  const art=$('#postoffice-art');
  art.querySelectorAll('.po-deco').forEach(d=>d.remove());
  const pos={mailbox:'left:12%;bottom:14%;',plants:'right:12%;bottom:14%;',flag:'right:18%;top:8%;',chimes:'left:18%;top:8%;',hat:'left:50%;top:2%;transform:translateX(-50%);'};
  SHOP.forEach(it=>{ if(save.bought[it.id]){ const d=el('div','po-deco',decoIcon(it.id,30)); d.style.cssText+=pos[it.id]; art.appendChild(d);} });
  const list=$('#shop-list'); list.innerHTML='';
  SHOP.forEach(it=>{
    const row=el('div','shopitem');
    const owned=save.bought[it.id];
    row.innerHTML=`<div class="icon">${decoIcon(it.id,34)}</div><div class="name">${it.name}<small>cosmetic · no pay-to-win, ever</small></div>`;
    const b=el('button','btn small '+(owned?'ghost':(save.stamps>=it.cost?'':'ghost')), owned?'Owned ✓':(stampRosette(15)+' '+it.cost));
    b.onclick=()=>{ if(owned) return;
      if(save.stamps>=it.cost){ save.stamps-=it.cost; save.bought[it.id]=1; persist(); sfx.stamp(); renderPost(); toast('Added to your post office!'); }
      else toast('Earn more stamps by delivering mail!'); };
    row.appendChild(b); list.appendChild(row);
  });
}
