// ---------- persistence ----------
const SAVE_KEY = 'cloudCouriers_v1';

export const save = { stars:{}, stamps:0, bought:{}, letters:{}, sfx:true, daily:{ last:'', streak:0 } };
try{ const s = localStorage.getItem(SAVE_KEY); if(s) Object.assign(save, JSON.parse(s)); }catch(e){}
if(!save.daily) save.daily = { last:'', streak:0 };

// local calendar day, e.g. "2026-07-08"; offsetDays shifts it (-1 = yesterday)
export function dailyKey(offsetDays = 0){
  const d = new Date(); d.setDate(d.getDate() + offsetDays);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
export function dailyDone(){ return save.daily.last === dailyKey(); }

export function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){} }

export function maxUnlocked(){
  let m=1;
  for(let i=1;i<=20;i++){ if(save.stars[i]>0) m=Math.max(m,i+1); }
  return Math.min(m,20);
}

export function resetSave(){
  save.stars={}; save.stamps=0; save.bought={}; save.letters={};
  persist();
}
