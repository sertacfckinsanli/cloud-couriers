// ---------- tiny DOM helpers ----------
export const $ = s => document.querySelector(s);

export function el(tag, cls, html){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html !== undefined) e.innerHTML = html;
  return e;
}

export function toast(msg){
  const t = el('div','toast',msg);
  $('#phone').appendChild(t);
  setTimeout(()=>t.remove(), 2300);
}
