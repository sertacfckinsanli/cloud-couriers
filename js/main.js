// ---------- bootstrap ----------
import { ui } from './ui.js';
import { game } from './game.js';
import { courierSVG } from './svg.js';
import { $ } from './dom.js';
import { uiIcon, stampRosette, envelopeIcon, postOfficeIcon } from './icons.js';
import { initAmbient } from './ambient.js';

// expose for inline onclick handlers in index.html
window.ui = ui;
window.game = game;

// fill static chrome icons declared as <span data-icon="name" data-size="20">
document.querySelectorAll('[data-icon]').forEach(elm => {
  const n = elm.dataset.icon, s = parseInt(elm.dataset.size || '20', 10);
  if (n === 'stamp') elm.innerHTML = stampRosette(s);
  else if (n === 'envelope') elm.innerHTML = envelopeIcon(s);
  else if (n === 'postoffice') elm.innerHTML = postOfficeIcon(s);
  else elm.innerHTML = uiIcon(n, s);
});

// title screen poffy
$('#title-poffy').innerHTML = courierSVG('#7fc3f7', 120);

// drifting parallax clouds behind every screen
initAmbient($('#phone'));

// tap anywhere to dismiss tutorial / hint bubbles
document.addEventListener('pointerdown', (e) => {
  if (e.target.closest && e.target.closest('.bubble')) return;
  document.querySelectorAll('.bubble').forEach(b => {
    b.style.transition = 'opacity .18s'; b.style.opacity = '0';
    setTimeout(() => b.remove(), 180);
  });
}, { capture: true });

// re-render board on resize while planning (not mid-flight)
window.addEventListener('resize', ()=>{
  if($('#screen-play').classList.contains('on') && game.L && !game.flying) game.buildBoard();
});

// PWA: offline cache + installability. Skipped on localhost so dev edits are
// never shadowed by the service worker; no-op in the single-file artifact.
const isLocalDev = location.hostname==='localhost' || location.hostname==='127.0.0.1';
if('serviceWorker' in navigator && location.protocol.startsWith('http') && !isLocalDev){
  // when a freshly-installed worker takes control, reload once so a phone can
  // never get stuck showing stale cached CSS/JS from an older version
  let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{
    if(reloaded) return; reloaded=true; location.reload();
  });
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').then(reg=>{ reg.update(); }).catch(()=>{});
  });
}
