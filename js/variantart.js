// Variant-room art registry: rooms whose renovation is a CHOICE TREE of
// pre-rendered full images under img/<room>/ (runtime URLs, SW runtime-cached,
// intentionally NOT bundled). Key scheme per room: <prefix>_dirty, <prefix>_clean,
// then tree-order segments code+design (1=classic 2=rustic 3=deco/celestial),
// e.g. lobby_M2C1L3, garden_F2A3G1P1. Fixed (no-choice) tasks always use the
// design code given in cfg.fixed.
import { L } from './i18n.js';

export const VARIANTS = {
  lobby: {
    dir: 'img/lobby/', prefix: 'lobby',
    seq: ['mailwall', 'counter', 'lounge'],
    code: { mailwall: 'M', counter: 'C', lounge: 'L' },
    fixed: {},
    labels: { '1': L('Classic','Klasik'), '2': L('Rustic','Rustik'), '3': L('Deco','Deco') },
    pos: { mailwall: '24% 48%', counter: '76% 48%', lounge: '50% 62%' },
    fx: { mailwall: {x:29,y:44,w:26,h:40}, counter: {x:67,y:47,w:30,h:36}, lounge: {x:50,y:63,w:32,h:32} },
    layered: {
      FW: 2424, FH: 1039, base: 'lay_base.jpg', dirty: 'lay_dirty.jpg',
      z: ['mailwall', 'counter', 'lounge'],
      sprites: {
        mailwall: { '1': {f:'lay_M1.png',x:500,y:271,w:378}, '2': {f:'lay_M2.png',x:489,y:232,w:415}, '3': {f:'lay_M3.png',x:444,y:195,w:465} },
        counter:  { '1': {f:'lay_C1.png',x:1250,y:351,w:666}, '2': {f:'lay_C2.png',x:1216,y:312,w:694}, '3': {f:'lay_C3.png',x:1281,y:312,w:596} },
        lounge:   { '1': {f:'lay_L1.png',x:875,y:518,w:566}, '2': {f:'lay_L2.png',x:941,y:513,w:503}, '3': {f:'lay_L3.png',x:905,y:460,w:539} },
      },
    },
  },
  garden: {
    dir: 'img/garden/', prefix: 'garden',
    seq: ['fountain', 'arch', 'flowers', 'dovecote'],
    code: { fountain: 'F', arch: 'A', flowers: 'G', dovecote: 'P' },
    fixed: { flowers: '1', dovecote: '1' },
    labels: { '1': L('Classic','Klasik'), '2': L('Rustic','Rustik'), '3': L('Celestial','Göksel') },
    pos: { fountain: '28% 55%', arch: '49% 22%', flowers: '58% 55%', dovecote: '38% 58%' },
    fx: { fountain: {x:29,y:52,w:22,h:30}, arch: {x:49,y:23,w:17,h:28}, flowers: {x:58,y:56,w:38,h:34}, dovecote: {x:38,y:57,w:13,h:26} },
    // LAYERED: room is composited at runtime from a base + item sprites instead of shipping
    // one full JPEG per state (32 files 14MB -> 10 files 2.2MB). z = back-to-front draw order.
    layered: {
      FW: 2424, FH: 1039, base: 'lay_base.jpg', dirty: 'lay_dirty.jpg',
      z: ['arch', 'flowers', 'fountain', 'dovecote'],
      sprites: {
        fountain: { '1': {f:'lay_F1.png',x:601,y:349,w:374}, '2': {f:'lay_F2.png',x:599,y:390,w:324}, '3': {f:'lay_F3.png',x:564,y:347,w:375} },
        arch:     { '1': {f:'lay_A1.png',x:1073,y:66,w:275}, '2': {f:'lay_A2.png',x:1078,y:76,w:269}, '3': {f:'lay_A3.png',x:1027,y:21,w:348} },
        flowers:  { '1': {f:'lay_G1.png',x:566,y:152,w:1300} },
        dovecote: { '1': {f:'lay_P1.png',x:863,y:466,w:158} },
      },
    },
  },
  sorting: {
    dir: 'img/sorting/', prefix: 'sorting',
    seq: ['bureau', 'shelf', 'franking', 'cart'],
    code: { bureau: 'B', shelf: 'S', franking: 'K', cart: 'C' },
    fixed: { cart: '1' },
    labels: { '1': L('Classic','Klasik'), '2': L('Industrial','Endüstriyel'), '3': L('Celestial','Göksel') },
    pos: { bureau: '22% 52%', shelf: '78% 48%', franking: '50% 32%' },
    fx: { bureau: {x:22,y:52,w:26,h:36}, shelf: {x:78,y:48,w:22,h:36}, franking: {x:50,y:34,w:26,h:32}, cart: {x:50,y:66,w:28,h:26} },
  },
  office: {
    dir: 'img/office/', prefix: 'office',
    // fixed items FIRST (rug, orrery) so the choice tree doesn't multiply; then choice items.
    seq: ['rug', 'orrery', 'desk', 'shelf', 'reading'],
    code: { rug: 'R', orrery: 'O', desk: 'D', shelf: 'K', reading: 'A' },
    fixed: { rug: '1', orrery: '1' },
    labels: { '1': L('Classic','Klasik'), '2': L('Steampunk','Steampunk'), '3': L('Celestial','Göksel') },
    pos: { rug: '50% 60%', orrery: '50% 32%', desk: '63% 44%', shelf: '24% 44%', reading: '42% 64%' },
    fx: { rug: {x:50,y:60,w:30,h:20}, orrery: {x:50,y:32,w:14,h:22}, desk: {x:63,y:44,w:22,h:24}, shelf: {x:24,y:44,w:18,h:32}, reading: {x:42,y:64,w:36,h:28} },
  },
};

export const VARIANT_CHOICES = ['1', '2', '3'];

// room save-record -> image key. rec = { stage, choices:{fountain:'2',...} }
export function variantKey(cfg, rec) {
  if (!rec || !(rec.stage >= 1)) return cfg.prefix + '_dirty';
  let k = cfg.prefix + '_', any = false;
  for (const id of cfg.seq) {
    const v = rec.choices && rec.choices[id];
    if (!v || !'123'.includes(v)) break;   // tree order: stop at first unchosen / legacy value
    k += cfg.code[id] + v; any = true;
  }
  return any ? k : cfg.prefix + '_clean';
}
export function variantImg(cfg, key) { return cfg.dir + key + '.jpg'; }

export function isLayered(cfg) { return !!(cfg && cfg.layered); }

// Ordered draw layers for a room state (base first, then item sprites back-to-front).
// Each layer: { url, x, y, w } in source pixels (x/y/w omitted for the full-frame base).
export function variantLayers(cfg, rec) {
  const M = cfg.layered;
  if (!(rec && rec.stage >= 1)) return [{ url: cfg.dir + M.dirty }];
  const layers = [{ url: cfg.dir + M.base }];
  // present items = seq walk, stopping at first unchosen (matches variantKey)
  const present = {};
  for (const id of cfg.seq) { const v = rec.choices && rec.choices[id]; if (!v || !'123'.includes(v)) break; present[id] = v; }
  for (const id of M.z) {
    const v = present[id]; if (v === undefined) continue;
    const sp = M.sprites[id] && M.sprites[id][v]; if (!sp) continue;
    layers.push({ url: cfg.dir + sp.f, x: sp.x, y: sp.y, w: sp.w });
  }
  return layers;
}
