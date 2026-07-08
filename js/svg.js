// ---------- inline SVG characters & tile glyphs ----------
import { COLORS } from './engine.js';

export function courierSVG(accent='#7fc3f7', size=64, face='happy'){
  const eyes = face==='dizzy' ? '<text x="24" y="34" font-size="10">✕</text><text x="38" y="34" font-size="10">✕</text>'
    : '<circle cx="27" cy="31" r="3.4" fill="#4b4560"/><circle cx="41" cy="31" r="3.4" fill="#4b4560"/><circle cx="28.2" cy="29.8" r="1.1" fill="#fff"/><circle cx="42.2" cy="29.8" r="1.1" fill="#fff"/>';
  return `<svg width="${size}" height="${size}" viewBox="0 0 68 68">
    <ellipse cx="34" cy="60" rx="16" ry="4" fill="rgba(70,100,170,.2)"/>
    <g>
      <circle cx="22" cy="36" r="14" fill="#fff" stroke="#c4d8f2" stroke-width="2"/><circle cx="46" cy="36" r="14" fill="#fff" stroke="#c4d8f2" stroke-width="2"/>
      <circle cx="34" cy="28" r="16" fill="#fff" stroke="#c4d8f2" stroke-width="2"/>
      <rect x="14" y="34" width="40" height="14" rx="7" fill="#fff"/>
      <circle cx="22" cy="36" r="14" fill="${accent}" opacity=".14"/>
      ${eyes}
      <path d="M30 39 q4 4 8 0" stroke="#4b4560" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="21" cy="38" r="2.8" fill="#ffb3cf" opacity=".7"/><circle cx="47" cy="38" r="2.8" fill="#ffb3cf" opacity=".7"/>
      <rect x="40" y="42" width="13" height="10" rx="3" fill="${accent}" stroke="#fff" stroke-width="1.6"/>
      <path d="M40 44 l6.5 4 6.5 -4" stroke="#fff" stroke-width="1.4" fill="none"/>
    </g></svg>`;
}

export function houseSVG(color){
  const c=COLORS[color];
  return `<svg class="house-svg" viewBox="0 0 60 60">
    <ellipse cx="30" cy="54" rx="22" ry="5" fill="#fff"/>
    <ellipse cx="14" cy="52" rx="9" ry="4" fill="#fff"/><ellipse cx="47" cy="52" rx="9" ry="4" fill="#fff"/>
    <rect x="16" y="26" width="28" height="26" rx="4" fill="#fff8ec" stroke="${c.deep}" stroke-width="2"/>
    <path d="M12 30 L30 12 L48 30 Z" fill="${c.css}" stroke="${c.deep}" stroke-width="2" stroke-linejoin="round"/>
    <rect x="25" y="38" width="10" height="14" rx="3" fill="${c.css}"/>
    <circle cx="30" cy="31" r="3.5" fill="${c.css}" stroke="${c.deep}" stroke-width="1.5"/>
    <g class="house-flag" style="transform-origin:50px 34px;">
      <rect x="49" y="24" width="2.5" height="12" fill="${c.deep}"/>
      <path d="M51.5 24 l8 3 -8 3 Z" fill="${c.css}" stroke="${c.deep}" stroke-width="1"/>
    </g></svg>`;
}

export const ARROWGLYPH={u:'⬆',r:'➡',d:'⬇',l:'⬅'};
export const CURRGLYPH={u:'˄˄',r:'»»',d:'˅˅',l:'««'};
