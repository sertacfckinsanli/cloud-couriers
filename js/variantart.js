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
  kitchen: {
    dir: 'img/kitchen/', prefix: 'kitchen',
    // fixed helpers first (flour, garland), then 4 choice furniture — layered (runtime composite)
    seq: ['flour', 'garland', 'oven', 'pantry', 'island', 'tea'],
    code: { flour: 'F', garland: 'G', oven: 'O', pantry: 'P', island: 'I', tea: 'T' },
    fixed: { flour: '1', garland: '1' },
    labels: { '1': L('Classic','Klasik'), '2': L('Vintage','Vintage'), '3': L('Celestial','Göksel') },
    pos: { flour: '62% 72%', garland: '50% 20%', oven: '28% 40%', pantry: '47% 34%', island: '48% 58%', tea: '71% 62%' },
    fx: { flour: {x:62,y:72,w:16,h:20}, garland: {x:50,y:20,w:72,h:22}, oven: {x:28,y:40,w:18,h:36}, pantry: {x:47,y:34,w:14,h:42}, island: {x:48,y:58,w:24,h:30}, tea: {x:71,y:62,w:14,h:24} },
    layered: {
      FW: 2424, FH: 1039, base: 'lay_base.jpg', dirty: 'lay_dirty.jpg',
      z: ['garland', 'oven', 'pantry', 'island', 'tea', 'flour'],
      sprites: {
        flour:   { '1': {f:'lay_F1.png',x:1412,y:658,w:259} },
        garland: { '1': {f:'lay_G1.png',x:523,y:53,w:1389} },
        oven:    { '1': {f:'lay_O1.png',x:521,y:252,w:388}, '2': {f:'lay_O2.png',x:552,y:343,w:298}, '3': {f:'lay_O3.png',x:506,y:368,w:325} },
        pantry:  { '1': {f:'lay_P1.png',x:996,y:115,w:267}, '2': {f:'lay_P2.png',x:970,y:129,w:295}, '3': {f:'lay_P3.png',x:1016,y:102,w:278} },
        island:  { '1': {f:'lay_I1.png',x:946,y:447,w:466}, '2': {f:'lay_I2.png',x:914,y:406,w:510}, '3': {f:'lay_I3.png',x:939,y:414,w:474} },
        tea:     { '1': {f:'lay_T1.png',x:1633,y:513,w:211}, '2': {f:'lay_T2.png',x:1621,y:524,w:231}, '3': {f:'lay_T3.png',x:1610,y:522,w:221} },
      },
    },
  },
  hospital: {
    dir: 'img/hospital/', prefix: 'hospital',
    seq: ['cart', 'garland', 'mend', 'cots', 'cabinet', 'rack'],   // fixed first, then 4 choice
    code: { cart: 'C', garland: 'G', mend: 'M', cots: 'B', cabinet: 'K', rack: 'R' },
    fixed: { cart: '1', garland: '1' },
    labels: { '1': L('Classic','Klasik'), '2': L('Steampunk','Steampunk'), '3': L('Celestial','Göksel') },
    pos: { cart: '72% 66%', garland: '50% 18%', mend: '54% 58%', cots: '37% 42%', cabinet: '64% 40%', rack: '20% 74%' },
    fx: { cart: {x:72,y:66,w:12,h:18}, garland: {x:50,y:18,w:66,h:22}, mend: {x:54,y:56,w:16,h:28}, cots: {x:37,y:42,w:40,h:36}, cabinet: {x:64,y:40,w:10,h:40}, rack: {x:20,y:74,w:14,h:24} },
    layered: {
      FW: 2424, FH: 1039, base: 'lay_base.jpg', dirty: 'lay_dirty.jpg',
      z: ['garland', 'cots', 'cabinet', 'mend', 'rack', 'cart'],
      sprites: {
        cart:    { '1': {f:'lay_C1.png',x:1519,y:577,w:458} },
        garland: { '1': {f:'lay_G1.png',x:455,y:80,w:1523} },
        mend:    { '1': {f:'lay_M1.png',x:972,y:491,w:370}, '2': {f:'lay_M2.png',x:859,y:347,w:564}, '3': {f:'lay_M3.png',x:1020,y:444,w:327} },
        cots:    { '1': {f:'lay_B1.png',x:454,y:246,w:907}, '2': {f:'lay_B2.png',x:454,y:245,w:900}, '3': {f:'lay_B3.png',x:452,y:244,w:874} },
        cabinet: { '1': {f:'lay_K1.png',x:1455,y:259,w:194}, '2': {f:'lay_K2.png',x:1302,y:234,w:402}, '3': {f:'lay_K3.png',x:1353,y:180,w:304} },
        rack:    { '1': {f:'lay_R1.png',x:360,y:690,w:225}, '2': {f:'lay_R2.png',x:352,y:672,w:245}, '3': {f:'lay_R3.png',x:366,y:686,w:222} },
      },
    },
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
