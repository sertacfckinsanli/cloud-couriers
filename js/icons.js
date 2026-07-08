// ---------- Cloud Couriers icon library ----------
// One drawing language everywhere: fat rounded shapes, deep plum outlines,
// candy fills, soft white gloss. All vector, no emoji, no PNGs.
const INK = '#3f3560';

function svg(size, body, vb = 64) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${vb} ${vb}" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

/* ============ letter seals (heart / flower / star / clover) ============ */
const SEAL_PATHS = {
  b: `<path d="M32 52 C18 42 10 33 10 23 a11 11 0 0 1 22-1 a11 11 0 0 1 22 1 c0 10-8 19-22 29Z"/>`,
  p: `<g><circle cx="32" cy="18" r="9"/><circle cx="45" cy="27" r="9"/><circle cx="40" cy="42" r="9"/><circle cx="24" cy="42" r="9"/><circle cx="19" cy="27" r="9"/><circle cx="32" cy="31" r="7.5" fill="#fff" stroke="none" opacity=".85"/></g>`,
  y: `<path d="M32 8 l7 15 16 2 -12 11 3 16 -14-8 -14 8 3-16 -12-11 16-2Z" stroke-linejoin="round"/>`,
  g: `<g><circle cx="32" cy="20" r="10"/><circle cx="44" cy="34" r="10"/><circle cx="20" cy="34" r="10"/><path d="M32 34 l4 20" stroke-width="5" stroke-linecap="round" fill="none"/></g>`,
};
export function sealIcon(color, size = 20, fill = '#ffffff', stroke = 'rgba(0,0,0,.14)') {
  const p = SEAL_PATHS[color] || SEAL_PATHS.b;
  return svg(size, `<g fill="${fill}" stroke="${stroke}" stroke-width="3">${p}</g>`);
}
export function sealChip(color, size = 20, colors) {
  const c = colors[color];
  return svg(size, `<g fill="${c.css}" stroke="${c.deep}" stroke-width="3.5">${SEAL_PATHS[color]}</g>`);
}

/* ============ board tiles ============ */
export function windArrow(size = 32) {
  return svg(size, `
    <path d="M32 7 L52 30 H41 V52 a4 4 0 0 1-4 4 H27 a4 4 0 0 1-4-4 V30 H12 Z"
      fill="#ffffff" stroke="#1b86d9" stroke-width="4.5" stroke-linejoin="round"/>
    <path d="M32 14 L44 27.5 H36.5" stroke="#bfe6ff" stroke-width="4" stroke-linecap="round" fill="none"/>`);
}
export function chevronFlow(size = 30) {
  return svg(size, `
    <g stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".95">
      <path d="M16 34 L32 20 L48 34"/><path d="M16 50 L32 36 L48 50"/>
    </g>`);
}
export function postOfficeIcon(size = 40) {
  return svg(size, `
    <ellipse cx="32" cy="57" rx="24" ry="5" fill="rgba(120,90,20,.18)"/>
    <rect x="12" y="26" width="40" height="28" rx="6" fill="#fff6e0" stroke="#d9964a" stroke-width="3.5"/>
    <path d="M8 27 q24 -18 48 0 l-4 7 q-20 -13 -40 0Z" fill="#ff85bd" stroke="#e8559a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M12 30 h40" stroke="#fff" stroke-width="2" opacity=".6"/>
    <rect x="24" y="36" width="16" height="11" rx="3" fill="#ffffff" stroke="#d9964a" stroke-width="2.5"/>
    <path d="M24 38 l8 5 8 -5" stroke="#d9964a" stroke-width="2.2" fill="none"/>
    <circle cx="32" cy="22" r="3" fill="#ffc93c" stroke="#eda313" stroke-width="2"/>`);
}
export function gateDoors(size = 34) {
  return svg(size, `
    <rect x="10" y="12" width="21" height="42" rx="9" fill="#e8ecfa" stroke="${INK}" stroke-width="3.5"/>
    <rect x="33" y="12" width="21" height="42" rx="9" fill="#dde2f5" stroke="${INK}" stroke-width="3.5"/>
    <path d="M17 22 q4 6 0 12" stroke="#b8c0e0" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M47 22 q-4 6 0 12" stroke="#aab3d6" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="27" cy="34" r="2.6" fill="${INK}"/><circle cx="37" cy="34" r="2.6" fill="${INK}"/>`);
}
export function stormCloud(size = 40, sleepy = false) {
  const face = sleepy
    ? `<path d="M22 33 q3 3 6 0 M36 33 q3 3 6 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>
       <ellipse cx="32" cy="41" rx="3" ry="3.6" fill="${INK}" opacity=".85"/>
       <text x="46" y="26" font-size="11" fill="#8a90b8" font-family="sans-serif">z</text>`
    : `<circle cx="25" cy="32" r="3" fill="${INK}"/><circle cx="39" cy="32" r="3" fill="${INK}"/>
       <path d="M20 26 l7 3 M44 26 l-7 3" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>
       <path d="M27 41 q5 -4 10 0" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
  return svg(size, `
    <g stroke="#69719c" stroke-width="3.2">
      <circle cx="20" cy="32" r="12" fill="#aab3cf"/>
      <circle cx="44" cy="32" r="12" fill="#aab3cf"/>
      <circle cx="32" cy="25" r="14" fill="#b8c0d9"/>
      <rect x="13" y="30" width="38" height="13" rx="6.5" fill="#aab3cf" stroke="none"/>
    </g>
    <path d="M30 46 l6 0 -4 7 6 0 -9 11 2 -8 -6 0Z" fill="#ffd34d" stroke="#eda313" stroke-width="2" stroke-linejoin="round"/>
    ${face}`);
}
export function balloonIcon(size = 36) {
  return svg(size, `
    <path d="M32 46 q-2 6 0 10" stroke="#c94f66" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="32" cy="26" rx="16" ry="19" fill="#ff6b81" stroke="#d94860" stroke-width="3.5"/>
    <path d="M28 44 l4 4 4 -4Z" fill="#d94860"/>
    <ellipse cx="26" cy="18" rx="4.5" ry="7" fill="#ffffff" opacity=".55" transform="rotate(-18 26 18)"/>`);
}
export function stampRosette(size = 32) {
  return svg(size, `
    <path d="M26 40 l-6 17 8-5 6 8 4-18Z" fill="#ff85bd" stroke="#e8559a" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M32 4 l5 6 8-2 1 8 8 3-4 7 4 7-8 3-1 8-8-2-5 6-5-6-8 2-1-8-8-3 4-7-4-7 8-3 1-8 8 2Z"
      fill="#ffc93c" stroke="#eda313" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="26" r="9" fill="#fff3cd" stroke="#eda313" stroke-width="2.5"/>
    <path d="M32 21 l1.8 3.6 4 .6 -2.9 2.8 .7 4 -3.6-1.9 -3.6 1.9 .7-4 -2.9-2.8 4-.6Z" fill="#eda313"/>`);
}
export function moonGateIcon(size = 34, open = false) {
  return open
    ? svg(size, `<circle cx="32" cy="32" r="20" fill="#fff6d0" stroke="#eda313" stroke-width="3.5"/>
        <circle cx="26" cy="26" r="4" fill="#f5d98a"/><circle cx="38" cy="36" r="3" fill="#f5d98a"/>
        <g stroke="#ffd34d" stroke-width="3" stroke-linecap="round" opacity=".9">
          <path d="M32 4 v6 M32 54 v6 M4 32 h6 M54 32 h6 M12 12 l4 4 M48 48 l4 4 M52 12 l-4 4 M16 48 l-4 4"/></g>`)
    : svg(size, `<path d="M40 8 a26 26 0 1 0 14 36 a20 20 0 0 1 -14-36Z" fill="#8d86c9" stroke="#5b5080" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M28 26 q3 3 6 0 M40 30 q3 3 6 0" stroke="#4a4470" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
}
export function lanternIcon(size = 30, lit = false) {
  const glow = lit ? `<circle cx="32" cy="34" r="26" fill="#ffd34d" opacity=".25"/>` : '';
  return svg(size, `${glow}
    <path d="M26 10 h12 M32 10 v6" stroke="#8a90b8" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M22 22 q10 -8 20 0 l-2 24 q-8 6 -16 0Z" fill="${lit?'#ffe9a8':'#d9ddef'}" stroke="${lit?'#eda313':'#8a90b8'}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M32 28 l3 6 -3 8 -3 -8Z" fill="${lit?'#f5a623':'#a9b0c9'}"/>
    <path d="M26 50 h12" stroke="${lit?'#eda313':'#8a90b8'}" stroke-width="3.5" stroke-linecap="round"/>`);
}
export function fogPuff(size = 40) {
  return svg(size, `
    <g fill="#ffffff" opacity=".9" stroke="#d8c7ee" stroke-width="2.5">
      <circle cx="20" cy="36" r="11"/><circle cx="42" cy="36" r="12"/><circle cx="31" cy="27" r="12"/>
    </g>
    <text x="26" y="40" font-size="16" fill="#a88fc9" font-family="sans-serif" font-weight="bold">?</text>`);
}
export function envelopeIcon(size = 40, fill = '#45b4ff', deep = '#1b86d9') {
  return svg(size, `
    <rect x="8" y="16" width="48" height="34" rx="6" fill="${fill}" stroke="${deep}" stroke-width="3.5"/>
    <path d="M10 20 L32 37 L54 20" stroke="${deep}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M11 19 L32 35 L53 19 L53 18 L11 18Z" fill="#ffffff" opacity=".4"/>`);
}

/* ============ chrome / UI ============ */
const UI = {
  play: `<path d="M22 14 L50 32 L22 50Z" fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>`,
  home: `<path d="M10 32 L32 12 L54 32" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 30 V52 a2 2 0 0 0 2 2 H45 a2 2 0 0 0 2-2 V30" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="27" y="38" width="10" height="16" rx="3" fill="currentColor"/>`,
  gear: `<circle cx="32" cy="32" r="9" stroke="currentColor" stroke-width="6" fill="none"/><g stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M32 10 v7 M32 47 v7 M10 32 h7 M47 32 h7 M17 17 l5 5 M42 42 l5 5 M47 17 l-5 5 M22 42 l-5 5"/></g>`,
  map: `<path d="M12 16 L24 11 L40 17 L52 12 V48 L40 53 L24 47 L12 52Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M24 11 V47 M40 17 V53" stroke="currentColor" stroke-width="4" opacity=".5"/>`,
  cloud: `<g fill="none" stroke="currentColor" stroke-width="5.5"><path d="M20 46 a10 10 0 0 1 -1 -20 a13 13 0 0 1 25 -3 a10 10 0 0 1 2 23Z" stroke-linejoin="round"/></g><circle cx="26" cy="34" r="2.6" fill="currentColor"/><circle cx="37" cy="34" r="2.6" fill="currentColor"/><path d="M28 40 q3.5 3 7 0" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  mail: `<rect x="9" y="16" width="46" height="32" rx="6" fill="none" stroke="currentColor" stroke-width="5.5"/><path d="M12 21 L32 36 L52 21" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  post: `<rect x="14" y="24" width="36" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="5.5"/><path d="M10 25 q22 -16 44 0" stroke="currentColor" stroke-width="5.5" fill="none" stroke-linecap="round"/><rect x="26" y="34" width="12" height="9" rx="2.5" fill="currentColor"/>`,
  bulb: `<path d="M32 8 a15 15 0 0 1 8 27 c-2 2-3 4-3 7 H27 c0-3-1-5-3-7 a15 15 0 0 1 8-27Z" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linejoin="round"/><path d="M26 49 h12 M28 55 h8" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
  restart: `<path d="M50 32 a18 18 0 1 1 -6 -13" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M46 8 L46 20 L34 19" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
  pause: `<rect x="18" y="14" width="9" height="36" rx="4" fill="currentColor"/><rect x="37" y="14" width="9" height="36" rx="4" fill="currentColor"/>`,
  back: `<path d="M38 12 L18 32 L38 52" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  lock: `<rect x="14" y="28" width="36" height="26" rx="7" fill="currentColor"/><path d="M21 28 v-6 a11 11 0 0 1 22 0 v6" fill="none" stroke="currentColor" stroke-width="6"/>`,
  star: `<path d="M32 6 l8 17 18 2.5 -13 12.5 3 18 -16-9 -16 9 3-18 -13-12.5 18-2.5Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
  gift: `<rect x="12" y="26" width="40" height="28" rx="4" fill="none" stroke="currentColor" stroke-width="5"/><path d="M12 26 h40 M32 26 v28 M32 26 c-12 0 -14 -14 -6 -14 c5 0 6 8 6 14 c0 -6 1 -14 6 -14 c8 0 6 14 -6 14Z" stroke="currentColor" stroke-width="5" fill="none" stroke-linejoin="round"/>`,
  book: `<path d="M32 14 q-9 -6 -20 -4 V50 q11 -2 20 4 q9 -6 20 -4 V10 q-11 -2 -20 4Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M32 14 V54" stroke="currentColor" stroke-width="4"/>`,
  tent: `<path d="M32 10 L8 52 H56Z" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linejoin="round"/><path d="M32 10 V52 M32 30 L20 52 M32 30 L44 52" stroke="currentColor" stroke-width="4" opacity=".6"/><path d="M32 10 q8 -2 10 3 l-10 3Z" fill="currentColor"/>`,
  bell: `<path d="M32 8 a14 14 0 0 1 14 14 c0 10 3 14 6 17 H12 c3-3 6-7 6-17 a14 14 0 0 1 14-14Z" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linejoin="round"/><path d="M26 46 a6 6 0 0 0 12 0" fill="currentColor"/>`,
  trash: `<path d="M14 18 h36 M26 18 v-4 a3 3 0 0 1 3-3 h6 a3 3 0 0 1 3 3 v4 M19 18 l2 34 a3 3 0 0 0 3 3 h16 a3 3 0 0 0 3-3 l2-34" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
  next: `<path d="M14 32 h30 M32 16 L48 32 L32 48" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
  music: `<path d="M24 48 V14 l26 -6 V42" fill="none" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="17" cy="48" rx="7" ry="6" fill="currentColor"/><ellipse cx="43" cy="42" rx="7" ry="6" fill="currentColor"/>`,
  clock: `<circle cx="32" cy="34" r="22" fill="none" stroke="currentColor" stroke-width="5.5"/><path d="M32 22 v12 l9 6" stroke="currentColor" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M14 12 l-6 6 M50 12 l6 6" stroke="currentColor" stroke-width="5.5" stroke-linecap="round"/>`,
  rainbow: `<path d="M10 48 a22 22 0 0 1 44 0" fill="none" stroke="#ff6b81" stroke-width="6"/><path d="M18 48 a14 14 0 0 1 28 0" fill="none" stroke="#ffc93c" stroke-width="6"/><path d="M26 48 a6 6 0 0 1 12 0" fill="none" stroke="#45b4ff" stroke-width="6"/>`,
  moon: `<path d="M42 10 a24 24 0 1 0 12 32 a19 19 0 0 1-12-32Z" fill="currentColor"/><circle cx="46" cy="16" r="2.5" fill="currentColor"/><circle cx="54" cy="26" r="1.8" fill="currentColor"/>`,
  bolt: `<path d="M34 6 L16 36 h12 L26 58 L48 26 H34Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`,
  tower: `<path d="M24 56 L26 20 h12 L40 56Z" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M22 20 h20 M26 12 h12 v8" stroke="currentColor" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M32 4 v8" stroke="currentColor" stroke-width="4"/><circle cx="32" cy="38" r="4" fill="currentColor"/>`,
};
export function uiIcon(name, size = 20) {
  return svg(size, `<g color="currentColor">${UI[name] || UI.star}</g>`);
}

/* ============ shop & post-office decorations ============ */
const DECO = {
  mailbox: `<rect x="16" y="20" width="30" height="22" rx="11" fill="#ff6b81" stroke="#d94860" stroke-width="3.5"/><path d="M30 42 h6 v14 h-6Z" fill="#a8764a" stroke="#8a5c33" stroke-width="2.5"/><rect x="21" y="26" width="14" height="10" rx="3" fill="#fff" stroke="#d94860" stroke-width="2.5"/><path d="M44 12 v10 M44 12 h9 l-3 4 3 4 h-9" fill="#ffc93c" stroke="#eda313" stroke-width="2.5" stroke-linejoin="round"/>`,
  plants: `<path d="M22 40 h20 l-3 16 h-14Z" fill="#e8935a" stroke="#c26e35" stroke-width="3" stroke-linejoin="round"/><path d="M32 40 V24 M32 30 q-9 -2 -12 -12 q10 0 12 8 M32 26 q9 -4 10 -14 q-10 2 -10 10" stroke="#2fb567" stroke-width="3.5" fill="#5bd98f" stroke-linecap="round" stroke-linejoin="round"/>`,
  flag: `<path d="M20 10 V56" stroke="#8a90b8" stroke-width="4" stroke-linecap="round"/><path d="M20 12 h28 l-6 8 6 8 h-28Z" fill="url(#rbf)" stroke="#e8559a" stroke-width="2.5" stroke-linejoin="round"/><defs><linearGradient id="rbf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff85bd"/><stop offset=".5" stop-color="#ffc93c"/><stop offset="1" stop-color="#45b4ff"/></linearGradient></defs>`,
  chimes: `<path d="M18 14 h28" stroke="#8a90b8" stroke-width="4" stroke-linecap="round"/><g stroke-width="2.5"><path d="M22 14 v10" stroke="#8a90b8"/><rect x="19" y="24" width="6" height="16" rx="3" fill="#45b4ff" stroke="#1b86d9"/><path d="M32 14 v14" stroke="#8a90b8"/><rect x="29" y="28" width="6" height="18" rx="3" fill="#ffc93c" stroke="#eda313"/><path d="M42 14 v8" stroke="#8a90b8"/><rect x="39" y="22" width="6" height="14" rx="3" fill="#ff85bd" stroke="#e8559a"/></g>`,
  hat: `<ellipse cx="32" cy="46" rx="24" ry="7" fill="#4a3f66" stroke="#3f3560" stroke-width="3"/><path d="M18 46 v-22 a14 10 0 0 1 28 0 v22" fill="#5b5080" stroke="#3f3560" stroke-width="3.5"/><path d="M18 36 h28" stroke="#ff85bd" stroke-width="6"/>`,
};
export function decoIcon(name, size = 30) {
  return svg(size, DECO[name] || DECO.mailbox);
}

/* ============ tiny effect glyphs ============ */
export function ghostArrow(size = 16) {
  return svg(size, `<path d="M15 42 L32 23 L49 42" stroke="#ffffff" stroke-width="10"
    stroke-linecap="round" stroke-linejoin="round" fill="none"/>`);
}

export function sparkStar(size = 18, color = '#ffd34d') {
  return svg(size, `<path d="M32 4 Q36 26 60 32 Q36 38 32 60 Q28 38 4 32 Q28 26 32 4Z" fill="${color}" stroke="#fff" stroke-width="2.5"/>`);
}
export function crossPuff(size = 18) {
  return svg(size, `<circle cx="32" cy="32" r="24" fill="#fff" stroke="#ffb3c4" stroke-width="3"/><path d="M22 22 L42 42 M42 22 L22 42" stroke="#f0567c" stroke-width="7" stroke-linecap="round"/>`);
}

/* ============ map node stars ============ */
export function starRow(count, size = 11) {
  let out = '';
  for (let i = 0; i < 3; i++) {
    const on = i < count;
    out += svg(size, `<path d="M32 6 l8 17 18 2.5 -13 12.5 3 18 -16-9 -16 9 3-18 -13-12.5 18-2.5Z"
      fill="${on ? '#ffc93c' : 'rgba(255,255,255,.35)'}" stroke="${on ? '#c98a12' : 'rgba(0,0,0,.15)'}" stroke-width="4" stroke-linejoin="round"/>`);
  }
  return out;
}
