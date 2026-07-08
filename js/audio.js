// ---------- sound (WebAudio placeholders) ----------
import { save } from './save.js';

let AC = null;
function ac(){ if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return AC; }

function tone(f, t, dur, type='sine', vol=0.12, slide=0){
  if(!save.sfx) return; const a=ac(); if(!a) return;
  const o=a.createOscillator(), g=a.createGain();
  o.type=type; o.frequency.setValueAtTime(f, a.currentTime+t);
  if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide), a.currentTime+t+dur);
  g.gain.setValueAtTime(0, a.currentTime+t);
  g.gain.linearRampToValueAtTime(vol, a.currentTime+t+0.015);
  g.gain.exponentialRampToValueAtTime(0.001, a.currentTime+t+dur);
  o.connect(g).connect(a.destination); o.start(a.currentTime+t); o.stop(a.currentTime+t+dur+0.05);
}

export const sfx = {
  tap(){ tone(520,0,.08,'sine',.08); },
  rotate(){ tone(300,0,.14,'sine',.09,260); },
  pick(){ tone(880,0,.09,'sine',.1); tone(1320,.07,.12,'sine',.08); },
  deliver(){ tone(660,0,.12,'sine',.11); tone(880,.1,.12,'sine',.11); tone(1100,.2,.2,'sine',.1); },
  stamp(){ tone(1200,0,.07,'square',.05); tone(1600,.06,.1,'sine',.09); },
  gate(){ tone(420,0,.12,'triangle',.09,120); },
  bump(){ tone(220,0,.15,'triangle',.1,-60); },
  lose(){ tone(360,0,.2,'sine',.1,-140); tone(240,.18,.3,'sine',.1,-80); },
  win(){ [523,659,784,1047].forEach((f,i)=>tone(f,i*.11,.22,'sine',.11)); },
  star(){ tone(1400,0,.12,'sine',.1); },
  go(){ tone(440,0,.1,'sine',.1,220); },
};
