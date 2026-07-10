// ---------- lightweight i18n (EN default, TR supported) ----------
import { save, persist } from './save.js';

export function lang(){ return save.lang === 'tr' ? 'tr' : 'en'; }
export function setLang(code){
  save.lang = (code === 'tr') ? 'tr' : 'en';
  persist();
  document.documentElement.lang = save.lang;
  applyI18n();
  document.dispatchEvent(new CustomEvent('langchange'));
}
if (typeof document !== 'undefined') document.documentElement.lang = lang();
// wrap any bilingual pair: L('English','Türkçe') -> {en,tr}
export const L = (en, tr) => ({ en, tr });
// resolve a bilingual pair (or pass through plain strings/undefined untouched)
export function pick(pair){
  if (pair && typeof pair === 'object' && ('en' in pair || 'tr' in pair)) {
    return pair[lang()] ?? pair.en ?? pair.tr ?? '';
  }
  return pair;
}

// Shared UI-chrome strings (buttons, headings, toasts, settings) used across screens.
// Keyed by id; hydrated into `[data-i18n]` elements via applyI18n(), and used via
// t(key, vars) in JS templates — {placeholder} tokens are substituted from vars.
export const STR = {
  // ---- title / nav ----
  subtitle:        L('The Lost Letter Kingdom','Kayıp Mektuplar Krallığı'),
  play:            L('Play','Oyna'),
  navCouriers:     L('Couriers','Kuryeler'),
  navCollection:   L('Collection','Koleksiyon'),
  navSettings:     L('Settings','Ayarlar'),
  navMap:          L('Map','Harita'),
  navLetters:      L('Letters','Mektuplar'),
  navPostOffice:   L('Post Office','Postane'),
  couriersHeading: L('Cloud Couriers','Bulut Kuryeler'),
  collectionHeading:L('Lost Letter Book','Kayıp Mektup Defteri'),
  postHeading:     L('Post Office','Postane'),
  poffyCozyPost:   L("Poffy's cozy post office","Poffy'nin sevimli postanesi"),
  footPrototype:   L('♪ cozy ukulele music placeholder ♪<br>prototype v1','♪ ukulele müziği (yer tutucu) ♪<br>prototip v1'),

  // ---- level intro / win / lose modals ----
  letsFly:         L("Let's fly! ",'Uçalım! '),
  backToMap:       L('Back to map','Haritaya dön'),
  mailDelivered:   L('Mail Delivered!','Mektup Teslim Edildi!'),
  nextLevelBtn:    L('Next Level ','Sıradaki Level '),
  replayBtn:       L('Replay','Tekrar Oyna'),
  mapBtn:          L('Map','Harita'),
  windTricky:      L('The wind got tricky!','Rüzgâr işi zorlaştırdı!'),
  tryAgain:        L('Try Again','Tekrar Dene'),
  retryWithHint:   L('Retry with Hint','İpucuyla Tekrar Dene'),

  // ---- settings modal ----
  settingsTitle:   L('Settings','Ayarlar'),
  soundEffects:    L('Sound effects','Ses efektleri'),
  musicLabel:      L('Music','Müzik'),
  comingSoon:      L('coming soon','yakında'),
  resetProgressLabel: L('Reset progress','İlerlemeyi sıfırla'),
  resetBtn:        L('Reset','Sıfırla'),
  keepPlaying:     L('Keep playing','Oyuna devam et'),
  language:        L('Language','Dil'),

  // ---- ad modal ----
  adCaption:       L('Rewarded Ad · watch to earn your hint','Ödüllü Reklam · ipucu için izle'),
  adYourAdHere:    L('Your Ad Here','Reklamınız Burada'),
  adDropVideo:     L('Drop a video in the <code>ads/</code> folder<br>as <code>ad.mp4</code> to play it here','Buraya oynatmak için <code>ads/</code> klasörüne<br><code>ad.mp4</code> adıyla bir video koy'),

  // ---- courier picker ----
  pickCourier:     L('Pick your courier','Kuryeni seç'),
  eachCloud:       L('Each cloud flies its own way','Her bulut kendi yolunda uçar'),
  close:           L('Close','Kapat'),

  // ---- story letter modal ----
  lostLetterFound: L('Lost letter found!','Kayıp mektup bulundu!'),
  keepItSafe:      L('Keep it safe','Güvende sakla'),

  // ---- gameplay HUD ----
  readyToFly:      L('Ready to fly?','Uçmaya hazır mısın?'),
  flyingNowHud:    L('Flying! ☁️','Uçuyor! ☁️'),
  lvLabel:         L('Lv ','Lv '),
  secUnit:         L('s','sn'),

  // ---- goals / level intro ----
  deliverEveryLetter: L('Deliver every letter','Her mektubu teslim et'),
  finishWithinTime:   L('Finish within {n}s time limit','{n}sn süre sınırında bitir'),
  finishWithinPar:    L('Finish within {n}s','{n}sn içinde bitir'),
  collectGoldenStamp: L('Collect the golden stamp','Altın pulu topla'),
  perfectRunDesc:     L('A perfect run: no bumps or wrong mail','Kusursuz uçuş: çarpma veya yanlış teslimat yok'),
  courierLabel:       L('Courier: ','Kurye: '),
  mimoTrial:          L('Mimo (trial!)','Mimo (deneme!)'),
  levelLabel:         L('Level ','Level '),

  // ---- daily delivery ----
  dailyDeliveryTitle: L('Daily Delivery · {key}','Günlük Teslimat · {key}'),
  dailyLevelName:     L('Daily: {name}','Günlük: {name}'),
  todaysBreezes:      L("Today's breezes are scrambled — find the route!",'Bugünün rüzgârları karıştı — yolu bul!'),
  doneTodayStreak:    L('Done today · streak {n}','Bugün tamam · seri {n}'),
  keepStreakGoing:    L('+2 stamps · keep your streak going!','+2 pul · serini sürdür!'),
  dailyDeliveryCard:  L('Daily Delivery','Günlük Teslimat'),
  doneStreak:         L('✓ done · streak {n}','✓ tamam · seri {n}'),
  playStreak:         L('play! · streak {n}','oyna! · seri {n}'),
  playToday:          L("play today's route!",'bugünün rotasını oyna!'),

  // ---- map screen ----
  lostLetterBook:  L('Lost Letter Book','Kayıp Mektup Defteri'),
  foundOf:         L('{found}/{total} found','{found}/{total} bulundu'),
  skyFestival:     L('Sky Festival','Gök Festivali'),
  seasonalSoon:    L('seasonal · soon','sezonluk · yakında'),
  coveredInFog:    L('covered in soft cloud fog','yumuşak bulut sisiyle kaplı'),

  // ---- couriers screen ----
  inYourPostOffice: L('In your post office!','Postanende!'),
  flyingNow:       L('Flying now','Şu an uçuyor'),
  tapToFly:        L('Tap to fly','Uçmak için dokun'),

  // ---- collection screen ----
  lostLettersFound: L('{found} / {total} lost letters found','{found} / {total} kayıp mektup bulundu'),
  specialLettersUnlock: L('Special letters unlock tiny stories','Özel mektuplar küçük hikâyeler açar'),
  foundAtLevel:    L(' · found at level {lv}',' · level {lv}\'de bulundu'),
  waitsAtLevel:    L('A lost letter waits at level {lv}…','Level {lv}\'de kayıp bir mektup bekliyor…'),

  // ---- post office (cosmetic shop) ----
  cosmeticNoPayToWin: L('cosmetic · no pay-to-win, ever','kozmetik · asla parayla avantaj değil'),
  owned:           L('Owned ✓','Sahip olundu ✓'),
  addedToPostOffice: L('Added to your post office!','Postanene eklendi!'),
  earnMoreStamps:  L('Earn more stamps by delivering mail!','Mektup teslim ederek daha fazla pul kazan!'),

  // ---- toasts: navigation / courier swap ----
  moreRegionsSoon: L('More regions coming soon!','Yeni bölgeler yakında!'),
  noSwapMidFlight: L('No swapping mid-flight!','Uçuş sırasında değiştirilemez!'),
  levelFliesWith:  L('This level flies with {name}!','Bu level {name} ile uçuyor!'),
  readyToFlyToast: L('{name} is ready to fly!','{name} uçmaya hazır!'),
  progressReset:   L('Progress reset. Fresh skies!','İlerleme sıfırlandı. Temiz gökyüzü!'),

  // ---- in-flight toasts ----
  mailDeliveredToast: L('Mail delivered! ','Mektup teslim edildi! '),
  wrongMailbox:    L('Oops, wrong mailbox!','Hop, yanlış posta kutusu!'),
  moonGateClosed:  L('The moon gate is closed — wait for the glow!','Ay kapısı kapalı — parlamayı bekle!'),
  gateClosedTap:   L('The gate was closed! Tap it!','Kapı kapalıydı! Dokun ona!'),
  gateOnlyAccepts: L('This gate only accepts {color} mail!','Bu kapı sadece {color} mektup kabul eder!'),
  lanternLights:   L('The lantern lights the hidden paths!','Fener gizli yolları aydınlatıyor!'),
  luluShruggedZap: L('Lulu shrugged off the lightning!','Lulu şimşeği umursamadı!'),
  luluPuffedStorm: L('Lulu puffed right through the storm!','Lulu fırtınanın içinden tüylenerek geçti!'),
  zapPushedBack:   L('Zap! The lightning pushed {name} back!','Zap! Şimşek {name}\'yi geri itti!'),
  stormShoved:     L('The grumpy cloud shoved {name} back!','Huysuz bulut {name}\'yi geri itti!'),
  bumpedBalloon:   L('Bumped by a balloon!','Bir balona çarptı!'),

  // ---- win modal ----
  dailyDelivered:  L('Daily Delivered!','Günlük Teslim Edildi!'),
  perfectDelivery: L('Perfect Delivery!','Kusursuz Teslimat!'),
  finishedIn:      L('Finished in {time}s','{time}sn\'de bitti'),
  noMistakes:      L('no mistakes!','hiç hata yok!'),
  oneBump:         L('1 little bump','1 küçük çarpma'),
  nBumps:          L('{n} little bumps','{n} küçük çarpma'),
  stampsCount:     L(' · stamps {got}/{want}',' · pul {got}/{want}'),
  dailyReward:     L('+{n} stamps · daily streak {streak} ','+{n} pul · günlük seri {streak} '),
  dailyComeBack:   L('Daily streak {streak} · come back tomorrow ','Günlük seri {streak} · yarın tekrar gel '),
  rewardStamps:    L('+{n} postal stamps ','+{n} posta pulu '),
  stampsAlready:   L('Stamps already earned ','Pullar zaten kazanıldı '),
  courierJoined:   L('{name} joined your post office!','{name} postanene katıldı!'),

  // ---- lose modal ----
  loseDrift:  L('Poffy drifted into open sky! Check where each breeze points.','Poffy açık gökyüzüne sürüklendi! Her rüzgârın yönüne bak.'),
  loseStorm:  L('A grumpy storm cloud caught Poffy! Try different timing.','Huysuz bir fırtına bulutu Poffy\'yi yakaladı! Farklı bir zamanlama dene.'),
  loseBridge: L("The rainbow bridge wasn't there yet. Deliver a letter first!",'Gökkuşağı köprüsü henüz yoktu. Önce bir mektup teslim et!'),
  loseTired:  L('Poffy flew in circles and got sleepy. Turn a breeze to break the loop!','Poffy daireler çizip uykusu geldi. Döngüyü kırmak için bir rüzgârı çevir!'),
  loseTimeup: L("Time's up! The mail was urgent. Try a faster route.",'Süre doldu! Mektup acildi. Daha hızlı bir rota dene.'),
  loseZap:    L('Lightning caught {name}! Watch the rhythm — cross while it rests.','Şimşek {name}\'yi yakaladı! Ritmi izle — dinlenirken geç.'),
  loseDefault:L('One more breeze?','Bir rüzgâr daha?'),

  // ---- hints ----
  hintPointBreeze: L('Point this breeze {dir} ','Bu rüzgârı {dir} yönlendir '),
  hintTurnWhileFlying: L('While flying, turn this breeze {dir} ','Uçarken, bu rüzgârı {dir} çevir '),
  hintReady:       L('The breezes look ready. Press Start!','Rüzgârlar hazır görünüyor. Başlat\'a bas!'),
  dirUp:    L('up','yukarı'),
  dirRight: L('right','sağa'),
  dirDown:  L('down','aşağı'),
  dirLeft:  L('left','sola'),

  // ---- post office / meta-map ----
  swipeHint:       L('Swipe sideways · tap the glowing room','Yana kaydır · parlayan odaya dokun'),
  nextRenovation:  L('Next renovation','Sıradaki yenileme'),
  addIt:           L('Add it! ✨','Ekle! ✨'),
  notEnoughStamps: L('Not enough stamps','Yetersiz pul'),
  later:           L('later','sonra'),
  renovate:        L('Renovate','Yenile'),
  fullyRenovated:  L('This room is fully renovated!','Bu oda tamamen yenilendi!'),
  needMoreStamps:  L('Not enough stamps — play levels to earn more!','Yetersiz pul — daha fazla kazanmak için level oyna!'),
  finishFirst:     L('Finish the {room} first','Önce {room} odasını bitir'),
  roomAllDone:     L('{room} is all done ✓','{room} tamamen bitti ✓'),
  roomRenovated:   L('{room} renovated!','{room} yenilendi!'),
  roomUnlocked:    L('{room} unlocked!','{room} açıldı!'),
  officeFullyDone: L('The Sky Post Office is fully renovated!','Gök Postanesi tamamen yenilendi!'),
  welcomeStamps:   L('Welcome! +40 stamps to start 📮','Hoş geldin! Başlamak için +40 pul 📮'),
  skip:            L('SKIP ≫','GEÇ ≫'),
};

export function t(key, vars){
  const entry = STR[key];
  let s = entry ? (entry[lang()] || entry.en) : key;
  if (vars) for (const k in vars) s = s.split('{'+k+'}').join(vars[k]);
  return s;
}

// hydrate every [data-i18n="key"] element's innerHTML within root (default: whole doc)
// (innerHTML so keys carrying <br> or other inline markup render correctly)
export function applyI18n(root = document){
  root.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
}
