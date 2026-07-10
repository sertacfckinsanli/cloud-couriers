// ---------- persistence ----------
const SAVE_KEY = 'cloudCouriers_v1';

const detectLang = () => (typeof navigator!=='undefined' && /^tr/i.test(navigator.language||'')) ? 'tr' : 'en';

export const save = { stars:{}, stamps:0, bought:{}, letters:{}, sfx:true,
  daily:{ last:'', streak:0 }, couriers:{ poffy:1 }, lastCourier:'poffy',
  rooms:{}, metaWelcome:0, lang: detectLang() };
try{ const s = localStorage.getItem(SAVE_KEY); if(s) Object.assign(save, JSON.parse(s)); }catch(e){}
if(save.lang!=='en' && save.lang!=='tr') save.lang = detectLang();
if(!save.daily) save.daily = { last:'', streak:0 };
if(!save.couriers) save.couriers = { poffy:1 };
if(!save.lastCourier) save.lastCourier = 'poffy';
// retroactive unlocks for saves from before the courier system existed
for(const [lv, cid] of [[10,'zippy'],[18,'mimo'],[24,'nini'],[28,'lulu']]){
  if(save.stars[lv] > 0) save.couriers[cid] = 1;
}

// local calendar day, e.g. "2026-07-08"; offsetDays shifts it (-1 = yesterday)
export function dailyKey(offsetDays = 0){
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
export function dailyDone(){ return save.daily.last === dailyKey(); }

export function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){} }

export function maxUnlocked(){
  let m=1;
  for(let i=1;i<=40;i++){ if(save.stars[i]>0) m=Math.max(m,i+1); }
  return Math.min(m,40);
}

export function resetSave(){
  save.stars={}; save.stamps=0; save.bought={}; save.letters={};
  save.rooms={}; save.metaWelcome=0;
  persist();
}
