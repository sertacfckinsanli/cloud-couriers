// ---------- background music manager (looping tracks + one-shot stingers) ----------
// HTMLAudio-based (mp3 loops in /audio). Music is optional and gated behind save.music.
// Browsers block autoplay until a user gesture, so the first requested track is stored
// as `desired` and started on the first pointer/key interaction.
import { save, persist } from './save.js';

const BASE = 'audio/';
const TRACKS = {
  main:       'main-theme.mp3',
  renovation: 'renovation-theme.mp3',
  cotton:     'cotton-village.mp3',
  rainbow:    'rainbow-market.mp3',
  moon:       'sleeping-moon-isles.mp3',
  storm:      'storm-valley.mp3',
};
const REGION_TRACK = { 1:'cotton', 2:'rainbow', 3:'moon', 4:'storm' };
const LOOP_VOL = 0.4;

let unlocked = false;      // a user gesture has happened → autoplay allowed
let desired = null;        // the loop that SHOULD be playing right now
let curKey = null;         // the loop actually playing
let el = null;             // current HTMLAudioElement
let duckedByAd = false;

export function musicEnabled(){ return save.music !== false; }

function fadeTo(a, target, ms, done){
  if(!a) { if(done) done(); return; }
  clearInterval(a._fade);
  const start = a.volume, t0 = performance.now();
  a._fade = setInterval(()=>{
    const k = ms<=0 ? 1 : Math.min(1, (performance.now()-t0)/ms);
    a.volume = Math.max(0, Math.min(1, start + (target-start)*k));
    if(k>=1){ clearInterval(a._fade); if(done) done(); }
  }, 40);
}

function startLoop(key){
  curKey = key;
  const old = el;
  if(old){ fadeTo(old, 0, 450, ()=>{ try{ old.pause(); }catch(e){} }); }
  const a = new Audio(BASE + TRACKS[key]);
  a.loop = true; a.preload = 'auto'; a.volume = 0;
  el = a;
  const p = a.play();
  if(p && p.catch) p.catch(()=>{});     // if blocked, stays silent until next request
  fadeTo(a, LOOP_VOL, 600);
}

export function playTrack(key){
  if(!TRACKS[key]) return;
  desired = key;
  if(!unlocked || !musicEnabled() || duckedByAd) return;
  if(curKey === key && el && !el.paused) return;
  startLoop(key);
}
export function playRegion(region){ playTrack(REGION_TRACK[region] || 'main'); }

export function victory(){
  if(!musicEnabled() || !unlocked) return;
  const loop = el;
  if(loop) fadeTo(loop, LOOP_VOL*0.22, 200);         // duck the loop
  const v = new Audio(BASE + 'victory-sparkle.mp3'); v.volume = 0.85;
  const p = v.play(); if(p && p.catch) p.catch(()=>{});
  const restore = ()=>{ if(loop && el===loop && musicEnabled()) fadeTo(loop, LOOP_VOL, 700); };
  v.onended = restore;
  setTimeout(restore, 4500);                          // safety if onended never fires
}

// pause/resume around the rewarded-ad video (which has its own audio)
export function duckForAd(){ duckedByAd = true; if(el) fadeTo(el, 0, 250, ()=>{ try{ el.pause(); }catch(e){} }); }
export function unduckAfterAd(){ duckedByAd = false; if(musicEnabled() && unlocked && desired){ if(el && curKey===desired){ const p=el.play(); if(p&&p.catch)p.catch(()=>{}); fadeTo(el, LOOP_VOL, 500); } else playTrack(desired); } }

export function setMusicEnabled(on){
  save.music = on; persist();
  if(!on){ if(el) fadeTo(el, 0, 300, ()=>{ try{ el.pause(); }catch(e){} }); }
  else { if(desired) playTrack(desired); }
}

export function initMusic(){
  const kick = ()=>{
    if(unlocked) return;
    unlocked = true;
    if(desired && musicEnabled()) playTrack(desired);
  };
  window.addEventListener('pointerdown', kick, { passive:true });
  window.addEventListener('keydown', kick);
  // page hidden → pause; visible → resume (saves battery, avoids double audio)
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){ if(el) try{ el.pause(); }catch(e){} }
    else if(musicEnabled() && unlocked && el && curKey===desired && !duckedByAd){ const p=el.play(); if(p&&p.catch)p.catch(()=>{}); }
  });
}
