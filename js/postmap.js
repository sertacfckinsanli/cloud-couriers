// ---------- Post Office meta-map: auto-LANDSCAPE story-driven renovation ----------
// The whole Post Office section renders in landscape: when the phone is portrait, the
// content is rotated 90° (classic HTML5-game orientation trick) so the map and rooms
// use the wide axis. Map = horizontal strip of rooms (swipe sideways). Rooms renovate
// via pre-rendered stage chains with Homescapes-style character dialogues.
import { save, persist } from './save.js';
import { sfx } from './audio.js';
import { ROOM_STAGES } from './roomart.js';
import { CHARS } from './characters.js';
import { L, pick, t } from './i18n.js';

const ROOMS = [
  { id:'garden', name:L('Garden','Bahçe'), tasks:[
    { id:'fountain', title:L('Restore the fountain','Fıskiyeyi onar'),                 icon:'⛲', cost:5 },
    { id:'arch',     title:L('Repair the rose arch','Gül kemerini onar'),              icon:'🌹', cost:4 },
    { id:'lamps',    title:L('Light the path','Yolu aydınlat'),                        icon:'💡', cost:5 },
    { id:'flowers',  title:L('Plant the beds & add a bench','Çiçekleri dik & bank ekle'), icon:'🌷', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'lobby', name:L('Lobby','Lobi'), tasks:[
    { id:'mailwall', title:L('Restore the mail wall','Mektup duvarını onar'),          icon:'📬', cost:5 },
    { id:'counter',  title:L('Build the reception counter','Resepsiyon tezgahını kur'),icon:'🗄️', cost:5 },
    { id:'lounge',   title:L('Furnish the waiting lounge','Bekleme köşesini döşe'),     icon:'🛋️', cost:5 },
    { id:'windows',  title:L('Fix the windows & lighting','Pencere & aydınlatmayı düzelt'), icon:'🪟', cost:4 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'sorting', name:L('Sorting Room','Ayrım Odası'), tasks:[
    { id:'bureau',   title:L('Set up the sorting desk','Ayrım masasını kur'),          icon:'🗂️', cost:6 },
    { id:'shelf',    title:L('Stock the parcel shelf','Koli rafını doldur'),           icon:'📦', cost:5 },
    { id:'franking', title:L('Franking machine & board','Damga makinesi & pano'),       icon:'⚙️', cost:4 },
    { id:'cart',     title:L('Bring in the mail cart','Posta arabasını getir'),        icon:'🛒', cost:4 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'office', name:L("Postmaster's Office","Postane Müdürünün Odası"), tasks:[
    { id:'desk',     title:L("Restore Gale's writing desk","Gale'in yazı masasını onar"), icon:'🪶', cost:6 },
    { id:'books',    title:L('Refill the bookshelves','Kitaplıkları doldur'),           icon:'📚', cost:5 },
    { id:'fire',     title:L('Relight the fireplace','Şömineyi yak'),                  icon:'🔥', cost:5 },
    { id:'skymap',   title:L('Hang the Kingdom sky-map','Krallık gök haritasını as'),   icon:'🗺️', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
];
const ORDER = ['garden','lobby','sorting','office'];

// ---------- story ----------
const NAMES = { poffy:L('Poffy','Poffy'), gale:L('Postmaster Gale','Postane Müdürü Gale'), rosie:L('Rosie','Rosie'), zippy:L('Zippy','Zippy') };
const STORY = {
  garden: {
    intro: [
      ['poffy',L("Whoa... so this is the old Sky Post Office! It looks like the fog moved in and never paid rent.",
                 "Vay canına... demek eski Gök Postanesi burasıymış! Sis buraya taşınmış da kirasını hiç ödememiş gibi.")],
      ['gale',L("Ever since the Great Storm scattered our letters, not a single hello has flown, little Poffy.",
                "Büyük Fırtına mektuplarımızı dağıttığından beri tek bir 'merhaba' bile uçmadı, küçük Poffy.")],
      ['poffy',L("Then we'll fix it — every brick, every bloom! If the letters fly again, so will the smiles!",
                 "O zaman düzeltiriz — her tuğlayı, her çiçeği! Mektuplar yeniden uçarsa, gülümsemeler de uçar!")],
      ['gale',L("Heh. Big words for a small cloud. Start with the garden — it greets everyone first.",
                "Hoh. Küçük bir bulut için büyük laflar. Bahçeden başla — herkesi ilk o karşılar.")],
    ],
    tasks: {
      fountain: { pre:[['gale',L("Couriers used to fill their flasks — and their courage — at that fountain. It hasn't sung in years.",
                                  "Kuryeler matralarını — ve cesaretlerini — o fıskiyeden doldururdu. Yıllardır şarkı söylemiyor.")]],
                  post:[['poffy',L("It's singing again! Even the water looks happier!","Yeniden şarkı söylüyor! Su bile daha mutlu görünüyor!")],
                        ['gale',L("...I had forgotten that sound. Well done, little one.","...O sesi unutmuşum. Aferin sana küçük dostum.")]] },
      arch:     { pre:[['poffy',L("A post office gate should smell like roses, not rust! Let's fix that arch.",
                                   "Bir postane kapısı pastan değil güllerden kokmalı! Şu kemeri düzeltelim.")]],
                  post:[['gale',L("Rosie the songbird used to nest up there. Perhaps she'll hear the roses and come home.",
                                  "Ötücü kuş Rosie oraya yuva yapardı. Belki gülleri duyar da eve döner.")]] },
      lamps:    { pre:[['gale',L("Night couriers followed these lamps home through the fog. The Storm blew them all out at once.",
                                  "Gece kuryeleri sisin içinde bu fenerleri takip ederek eve dönerdi. Fırtına hepsini bir anda söndürdü.")]],
                  post:[['poffy',L("Lit! Now nobody gets lost on the way to a hello!","Yandılar! Artık kimse bir 'merhaba'ya giden yolda kaybolmaz!")]] },
      flowers:  { pre:[['poffy',L("Flower beds! And a bench — tired wings need somewhere soft to wait.",
                                   "Çiçek tarhları! Bir de bank — yorgun kanatların bekleyecek yumuşak bir yeri olmalı.")]],
                  post:[['rosie',L("♪ Tweet-tweedle-eet! ♪","♪ Cik-cikcik-cik! ♪")],
                        ['poffy',L("Gale, look! A songbird — on the new bench!","Gale, bak! Bir ötücü kuş — yeni bankın üstünde!")],
                        ['gale',L("Well, I'll be... Welcome home, Rosie. The roses called, and you answered.",
                                  "Vay canına... Hoş geldin Rosie. Güller seni çağırdı, sen de geldin.")]] },
      cleanup:  { pre:[['gale',L("One last sweep, Poffy. A post office greets the whole sky with its garden.",
                                  "Son bir süpürme daha Poffy. Bir postane tüm gökyüzünü bahçesiyle karşılar.")]],
                  post:[['poffy',L("Sparkling! Now THAT'S a front yard worthy of the Letter Kingdom!",
                                   "Pırıl pırıl! İşte bu, Mektup Krallığı'na yakışır bir ön bahçe!")],
                        ['gale',L("The garden breathes again. Now... dare we open that door?",
                                  "Bahçe yeniden nefes alıyor. Şimdi... o kapıyı açmaya cesaret edebilir miyiz?")]] },
    }
  },
  lobby: {
    intro: [
      ['poffy',L("The lobby! I can almost hear the old stamp-thumps and the ding of the counter bell.",
                 "Lobi! Eski pul damgalarının sesini ve tezgahtaki zilin çınlamasını neredeyse duyar gibiyim.")],
      ['gale',L("This is where every journey began. Dust sheets off — let's give it back its heartbeat.",
                "Her yolculuk burada başlardı. Tozlu örtüleri kaldıralım — kalp atışını geri verelim.")],
    ],
    tasks: {
      mailwall: { pre:[['gale',L("Every pigeonhole on that wall is somebody's address. Empty walls make empty hearts.",
                                  "O duvardaki her göz birinin adresi. Boş duvarlar boş kalpler yaratır.")]],
                  post:[['poffy',L("Look! Slot seven already has mail in it! ...Okay, it's dust. But hopeful dust!",
                                   "Bak! Yedi numaralı gözde bile mektup var! ...Tamam, toz o. Ama umutlu bir toz!")],
                        ['rosie',L("♪ Tweet! ♪ (Rosie tucks a tiny green leaf into slot three.)",
                                   "♪ Cik! ♪ (Rosie üçüncü göze küçük yeşil bir yaprak sıkıştırır.)")]] },
      counter:  { pre:[['poffy',L("A counter with a shiny brass bell! Ding-ding means 'welcome back'!",
                                   "Parlak pirinç ziliyle bir tezgah! Ding-ding demek 'tekrar hoş geldin' demek!")]],
                  post:[['gale',L("Careful with that bell— ...oh, go on then. Ring it. I've missed it too.",
                                  "O zile dikkat et— ...ah, tamam çal bakalım. Ben de özlemişim onu.")]] },
      lounge:   { pre:[['gale',L("Folks used to wait here for letters from far away. Some waited years, and we kept them company.",
                                  "İnsanlar uzaklardan gelecek mektupları burada beklerdi. Kimileri yıllarca bekledi, biz de onlara eşlik ettik.")]],
                  post:[['poffy',L("Now the waiting will feel soft and warm — like sitting on a cloud! Trust me, I'd know.",
                                   "Artık beklemek yumuşak ve sıcak hissettirecek — bir bulutun üstünde oturmak gibi! Güven bana, bilirim.")]] },
      windows:  { pre:[['poffy',L("Boarded windows make sad rooms. Sunlight, you're hired — report to work!",
                                   "Tahtalanmış pencereler odaları hüzünlendirir. Güneş ışığı, işe alındın — göreve başla!")]],
                  post:[['gale',L("Ah. There's the sky I used to watch for storm warnings. Much friendlier today.",
                                  "Ah. İşte fırtına uyarıları için izlediğim gökyüzü. Bugün çok daha dost canlısı.")]] },
      cleanup:  { pre:[['gale',L("Sweep the last cobwebs, Poffy. A lobby should shine like a fresh stamp.",
                                  "Son örümcek ağlarını da süpür Poffy. Bir lobi taze bir pul gibi parlamalı.")]],
                  post:[['poffy',L("Perfect! Even the chandelier is winking at us!","Mükemmel! Avize bile bize göz kırpıyor!")],
                        ['gale',L("Then it's official... the Sky Post is OPEN. Well — almost. The letters still need sorting.",
                                  "O zaman resmî oldu... Gök Postanesi AÇIK. Peki — neredeyse. Mektupların hâlâ ayrılması gerekiyor.")]] },
    }
  },
  sorting: {
    intro: [
      ['gale',L("The sorting room — the heart of the post. Here, every letter in the Letter Kingdom found its way.",
                "Ayrım odası — postanenin kalbi. Burada, Mektup Krallığı'ndaki her mektup yolunu bulurdu.")],
      ['poffy',L("Then let's teach the letters their way home again!","O zaman mektuplara yollarını yeniden öğretelim!")],
    ],
    tasks: {
      bureau:   { pre:[['gale',L("The old sorting desk knew every address by heart. Storm or no storm, it never lost a letter.",
                                  "Eski ayrım masası her adresi ezbere bilirdi. Fırtına olsun olmasın, hiç mektup kaybetmedi.")]],
                  post:[['poffy',L("I already sorted three letters! ...All addressed to me. But still!",
                                   "Şimdiden üç mektup ayırdım! ...Hepsi bana gelmiş ama olsun!")]] },
      shelf:    { pre:[['poffy',L("Parcels need homes too — big shelf, big hugs!","Kolilerin de bir evi olmalı — büyük raf, büyük kucaklaşmalar!")]],
                  post:[['gale',L("Neat rows, proper labels. My mustache approves.","Düzgün sıralar, doğru etiketler. Bıyığım onayladı.")]] },
      franking: { pre:[['gale',L("No stamp, no journey. This old franking machine gives letters their wings.",
                                  "Pul yoksa yolculuk yok. Bu eski damga makinesi mektuplara kanat verir.")]],
                  post:[['poffy',L("Ka-CHUNK! I love that sound! Again! Ka-CHUNK!","Kat-ÇUNK! Bu sesi çok seviyorum! Bir daha! Kat-ÇUNK!")]] },
      cart:     { pre:[['poffy',L("A mail cart! Can I ride it? For, um... delivery practice?",
                                   "Bir posta arabası! Üstüne binebilir miyim? Şey... teslimat pratiği için?")]],
                  post:[['zippy',L("Did somebody say MAIL CART?! Vrrrm — coming through!","POSTA ARABASI mı dedi biri?! Vrrrm — geliyorum!")],
                        ['poffy',L("ZIPPY?! You're back!","ZIPPY?! Geri döndün!")],
                        ['zippy',L("Heard the fountain singing from three clouds away. The Sky Post lives, baby!",
                                   "Fıskiyenin şarkısını üç bulut öteden duydum. Gök Postanesi yaşıyor bebeğim!")]] },
      cleanup:  { pre:[['gale',L("Last task here, little courier. Make the heart of the post gleam.",
                                  "Burada son görev küçük kurye. Postanenin kalbini parlat.")]],
                  post:[['gale',L("The heart of the Sky Post beats again. Thank you, Poffy. Truly.",
                                  "Gök Postanesi'nin kalbi yeniden atıyor. Teşekkür ederim Poffy. Gerçekten.")],
                        ['zippy',L("So... when do we FLY? My scarf doesn't stream itself, old man.",
                                   "Peki... ne zaman UÇUYORUZ? Atkım kendi kendine dalgalanmıyor ihtiyar.")],
                        ['gale',L("Patience, Zippy. There is one room left... mine.","Sabret Zippy. Tek bir oda kaldı... benimki.")]] },
    }
  },
  office: {
    intro: [
      ['gale',L("My old office. I haven't opened this door since the night of the Storm.",
                "Eski odam. Fırtına gecesinden beri bu kapıyı açmamıştım.")],
      ['poffy',L("Wood walls! Fancy! ...And is that a FIREPLACE? Gale, you had a fireplace and never told me?",
                 "Ahşap duvarlar! Şık! ...Ve bu bir ŞÖMİNE mi? Gale, bir şöminen vardı ve bana hiç söylemedin mi?")],
      ['gale',L("There is a letter in that desk I never finished writing, Poffy. Perhaps... it's finally time.",
                "O masada hiç bitiremediğim bir mektup var Poffy. Belki de... artık zamanı gelmiştir.")],
    ],
    tasks: {
      desk:    { pre:[['gale',L("My desk. Every stamp in the Kingdom passed under that green lamp once.",
                                 "Masam. Krallıktaki her pul bir zamanlar o yeşil lambanın altından geçti.")]],
                 post:[['poffy',L("The lamp still works! Green light means the Postmaster is IN!",
                                  "Lamba hâlâ çalışıyor! Yeşil ışık, Postane Müdürü BURADA demek!")]] },
      books:   { pre:[['gale',L("Ledgers, atlases, sky-charts... a postmaster never throws away a route.",
                                 "Defterler, atlaslar, gök haritaları... bir postane müdürü hiçbir rotayı atmaz.")]],
                 post:[['zippy',L("Ooh, route charts! ...For the record, I never crashed into Island Seven. Don't check page twelve.",
                                  "Ooh, rota haritaları! ...Kayıtlara geçsin, Yedinci Ada'ya hiç çarpmadım. On ikinci sayfaya bakma sakın.")]] },
      fire:    { pre:[['poffy',L("A cold fireplace makes a cold postmaster. Let's warm those old bones!",
                                  "Soğuk bir şömine soğuk bir postane müdürü yapar. Şu yaşlı kemikleri ısıtalım!")]],
                 post:[['gale',L("Ahh, there's the crackle... and I see Rosie has already claimed the armchair.",
                                 "Ahh, işte o çıtırtı sesi... görüyorum ki Rosie koltuğu çoktan sahiplenmiş.")],
                       ['rosie',L("♪ ...tweet... ♪ (She is fast asleep.)","♪ ...cik... ♪ (Derin bir uykuya dalmış.)")]] },
      skymap:  { pre:[['gale',L("The map of the Letter Kingdom. Every island, every route... every friend I ever wrote to.",
                                 "Mektup Krallığı'nın haritası. Her ada, her rota... yazdığım her dostum.")]],
                 post:[['poffy',L("One day I'll fly ALL of them. Even the squiggly ones!","Bir gün hepsini uçacağım. Şu çizik çizik olanları bile!")]] },
      cleanup: { pre:[['gale',L("One last thing, little courier. Open the curtains, sweep the dust... I have a letter to finish.",
                                 "Son bir şey kaldı küçük kurye. Perdeleri aç, tozu süpür... bitirmem gereken bir mektup var.")]],
                 post:[['gale',L("...There. 'To every friend of the Sky Post: we are OPEN again. Come home.' — Postmaster Gale.",
                                 "...İşte. 'Gök Postanesi'nin her dostuna: yeniden AÇIĞIZ. Eve dönün.' — Postane Müdürü Gale.")],
                       ['rosie',L("♪ TWEET! ♪ (Rosie snatches the letter and soars out the window!)",
                                  "♪ CİK! ♪ (Rosie mektubu kapıp pencereden fırlar!)")],
                       ['zippy',L("First delivery in years — race you, Rosie! VRRRM!","Yıllardır ilk teslimat — yarışalım Rosie! VRRRM!")],
                       ['poffy',L("Fly, letters, fly! The Sky Post Office is BACK!","Uçun mektuplar, uçun! Gök Postanesi GERİ DÖNDÜ!")]] },
    }
  },
};

// ---------- state ----------
function stt(){ if(!save.rooms) save.rooms = {}; return save.rooms; }
function roomById(id){ return ROOMS.find(r=>r.id===id); }
function roomRec(id){
  const s=stt(); let r=s[id];
  if(!r) r=s[id]={stage:0,seen:{}};
  if(typeof r.stage!=='number') r.stage = r.done ? 99 : 0;
  if(!r.seen) r.seen={};
  return r;
}
function doneCount(r){ return Math.min(roomRec(r.id).stage, r.tasks.length); }
function roomComplete(r){ return doneCount(r) >= r.tasks.length; }
function nextTask(r){ const d=doneCount(r); return d<r.tasks.length ? r.tasks[d] : null; }
function stageImg(r,k){ const a=ROOM_STAGES[r.id]; return a[Math.max(0,Math.min(k===undefined?doneCount(r):k, a.length-1))]; }
function activeIdx(){ for(let i=0;i<ORDER.length;i++){ if(!roomComplete(roomById(ORDER[i]))) return i; } return ORDER.length; }
function roomState(r){ if(roomComplete(r)) return 'done'; return ORDER.indexOf(r.id)===activeIdx()?'active':'locked'; }

// ---------- DOM ----------
let built=false, els={}, currentRoomId=null, rotated=false;
function paintRoom(elm,r){ elm.style.backgroundImage=`url(${stageImg(r)})`; }

function build(){
  const screen = document.getElementById('screen-postmap');
  screen.innerHTML = `<div id="pm-rot">
    <div id="pm-map">
      <div id="pm-viewport"><div id="pm-scene"></div></div>
      <div id="pm-hud">
        <button class="iconbtn" id="pm-back" aria-label="Back"><span data-icon="back" data-size="20"></span></button>
        <div class="pill"><span data-icon="stamp" data-size="20"></span> <span id="pm-stamps">0</span></div>
        <button class="iconbtn" id="pm-settings" aria-label="Settings"><span data-icon="gear" data-size="20"></span></button>
      </div>
      <div id="pm-hint"></div>
    </div>

    <div id="pm-roomview">
      <div id="pm-rv-hud">
        <button class="iconbtn" id="pm-rv-back" aria-label="Back to map"><span data-icon="back" data-size="20"></span></button>
        <div id="pm-rv-title"></div>
        <div class="pill"><span data-icon="stamp" data-size="20"></span> <span id="pm-rv-stamps">0</span></div>
      </div>
      <div id="pm-rv-stage"><div id="pm-rv-bg"></div><div id="pm-rv-room"></div></div>
      <button id="pm-rv-build" aria-label="Renovate">🔨<span id="pm-rv-badge">0</span></button>
      <div id="pm-dialog">
        <div class="pd-shade"></div>
        <img class="pd-portrait" alt="">
        <div class="pd-box">
          <div class="pd-name"></div>
          <div class="pd-text"></div>
          <div class="pd-next">▼</div>
          <button class="pd-skip"></button>
        </div>
      </div>
    </div>

    <div id="pm-popup-back"><div id="pm-popup"></div></div>
    <div id="pm-toast"></div>
  </div>`;

  els = {
    screen, rot:screen.querySelector('#pm-rot'),
    vp:screen.querySelector('#pm-viewport'), scene:screen.querySelector('#pm-scene'),
    stamps:screen.querySelector('#pm-stamps'), hint:screen.querySelector('#pm-hint'),
    roomview:screen.querySelector('#pm-roomview'), stage:screen.querySelector('#pm-rv-stage'),
    room:screen.querySelector('#pm-rv-room'), rvBg:screen.querySelector('#pm-rv-bg'),
    rvTitle:screen.querySelector('#pm-rv-title'), rvStamps:screen.querySelector('#pm-rv-stamps'),
    build:screen.querySelector('#pm-rv-build'), badge:screen.querySelector('#pm-rv-badge'),
    popupBack:screen.querySelector('#pm-popup-back'), popup:screen.querySelector('#pm-popup'),
    toast:screen.querySelector('#pm-toast'),
    dialog:screen.querySelector('#pm-dialog'), pdPortrait:screen.querySelector('.pd-portrait'),
    pdName:screen.querySelector('.pd-name'), pdText:screen.querySelector('.pd-text'),
    pdSkip:screen.querySelector('.pd-skip'),
  };
  applyStaticI18n();
  if(window.__hydrateIcons) window.__hydrateIcons(screen);
  screen.querySelector('#pm-back').onclick     = ()=> window.ui.back();
  screen.querySelector('#pm-settings').onclick = ()=> window.ui.openSettings();
  screen.querySelector('#pm-rv-back').onclick  = ()=>{ if(dlgActive) return; exitRoom(); };
  els.build.onclick = openPopup;
  els.popupBack.onclick = e=>{ if(e.target===els.popupBack) closePopup(); };
  els.dialog.addEventListener('pointerdown', e=>{ if(e.target===els.pdSkip) return; advanceDialogue(); });
  els.pdSkip.onclick = skipDialogue;
  initMapPan();
  window.addEventListener('resize', ()=>{
    if(!els.screen.classList.contains('on')) return;
    updateRot();
    if(els.roomview.classList.contains('on')) fitRoom();
    else { layout(); buildScene(); centerOn(roomById(ORDER[Math.min(activeIdx(),ORDER.length-1)])); }
  });
  document.addEventListener('langchange', ()=>{
    if(!built) return;
    applyStaticI18n();
    if(els.roomview.classList.contains('on')){ els.rvTitle.textContent=pick(roomById(currentRoomId)?.name); }
    else buildScene();
  });
  built = true;
}
function applyStaticI18n(){
  els.hint.textContent = t('swipeHint');
  els.pdSkip.textContent = t('skip') || 'SKIP ≫';
}

// ---------- auto-landscape rotation ----------
function updateRot(){
  const w=els.screen.clientWidth, h=els.screen.clientHeight;
  rotated = h > w;
  if(rotated){
    els.rot.style.width=h+'px'; els.rot.style.height=w+'px';
    els.rot.style.transformOrigin='top left';
    els.rot.style.transform='rotate(90deg) translate(0,-100%)';
  } else {
    els.rot.style.width=w+'px'; els.rot.style.height=h+'px';
    els.rot.style.transform='';
  }
}

// ---------- dialogue engine ----------
let dlgQueue=[], dlgDone=null, dlgActive=false, typeT=null, typing=false;
function playDialogue(lines, onDone){
  if(!lines || !lines.length){ if(onDone) onDone(); return; }
  dlgQueue = lines.slice(); dlgDone = onDone || null; dlgActive = true;
  els.dialog.classList.add('on');
  showLine(dlgQueue.shift());
}
function showLine(line){
  const [who, text] = line;
  els.pdPortrait.src = CHARS[who]; els.pdPortrait.className = 'pd-portrait '+who;
  els.pdName.textContent = pick(NAMES[who]);
  const full = pick(text);
  els.pdText.textContent = '';
  let i = 0; typing = true;
  clearInterval(typeT);
  typeT = setInterval(()=>{
    i += 2;
    els.pdText.textContent = full.slice(0, i);
    if(i >= full.length){ clearInterval(typeT); typing = false; }
  }, 16);
  els.pdText.dataset.full = full;
  sfx.tap();
}
function advanceDialogue(){
  if(!dlgActive) return;
  if(typing){ clearInterval(typeT); typing=false; els.pdText.textContent = els.pdText.dataset.full; return; }
  if(dlgQueue.length) showLine(dlgQueue.shift());
  else endDialogue();
}
function skipDialogue(){ if(dlgActive) endDialogue(); }
function endDialogue(){
  clearInterval(typeT); typing=false; dlgActive=false; dlgQueue=[];
  els.dialog.classList.remove('on');
  const cb=dlgDone; dlgDone=null; if(cb) cb();
}
function endDialogueSilent(){ clearInterval(typeT); typing=false; dlgActive=false; dlgQueue=[]; dlgDone=null; els.dialog.classList.remove('on'); }

// ---------- map: horizontal strip of rooms ----------
let LAY={vw:900,vh:430,m:16,gap:20,ty:86,roomW:480,roomH:320,sceneW:0};
function layout(){
  const vw=els.vp.clientWidth||900, vh=els.vp.clientHeight||430;
  const m=16, gap=20, ty=86;
  const roomH=Math.max(200, vh-ty-26), roomW=Math.round(roomH*1.5);
  const sceneW=m*2 + ROOMS.length*(roomW+gap) - gap;
  LAY={vw,vh,m,gap,ty,roomW,roomH,sceneW};
  els.scene.style.width=sceneW+'px'; els.scene.style.height=vh+'px';
}
function roomXY(r){ const i=ORDER.indexOf(r.id); return {x:LAY.m+i*(LAY.roomW+LAY.gap), y:LAY.ty}; }
function buildScene(){
  els.scene.querySelectorAll('.pm-room').forEach(e=>e.remove());
  ROOMS.forEach(r=>{
    const state=roomState(r), {x,y}=roomXY(r);
    const room=document.createElement('div');
    room.className='pm-room '+state; room.dataset.id=r.id;
    room.style.cssText=`left:${x}px;top:${y}px;width:${LAY.roomW}px;height:${LAY.roomH}px;`;
    paintRoom(room,r);
    const veil=document.createElement('div'); veil.className='pm-veil'; room.appendChild(veil);
    if(state==='locked'){ const l=document.createElement('div'); l.className='pm-lock'; l.textContent='🔒'; room.appendChild(l); }
    if(state==='active'){
      const c=document.createElement('button'); c.className='pm-cta'; c.textContent=t('renovate');
      c.onclick=(e)=>{ e.stopPropagation(); if(!mapMoved) enterRoom(r); }; room.appendChild(c);
      const pr=document.createElement('div'); pr.className='pm-progress'; pr.textContent=doneCount(r)+' / '+r.tasks.length; room.appendChild(pr);
    }
    const lab=document.createElement('div'); lab.className='pm-label';
    lab.textContent=(state==='done'?'✓ ':'')+pick(r.name);
    room.appendChild(lab);
    room.onclick=()=>{ if(mapMoved) return; onRoom(r); };
    els.scene.appendChild(room);
  });
  els.stamps.textContent=save.stamps|0;
}
function onRoom(r){
  const state=roomState(r);
  if(state==='locked'){ const a=activeIdx(); pmToast(t('finishFirst',{room:pick(roomById(ORDER[Math.min(a,ORDER.length-1)]).name)})); return; }
  if(state==='done'){ pmToast(t('roomAllDone',{room:pick(r.name)})); return; }
  enterRoom(r);
}

// ---------- room view (FIXED contain-fit) ----------
function fitRoom(){
  // stage art is 21:9 wide (room centered on extended backdrop) -> cover the whole screen
  els.room.style.width=els.stage.clientWidth+'px'; els.room.style.height=els.stage.clientHeight+'px';
  els.room.style.left='0px'; els.room.style.top='0px';
}
function enterRoom(r){
  currentRoomId=r.id;
  paintRoom(els.room,r); els.rvBg.style.backgroundImage=`url(${stageImg(r)})`;
  els.rvTitle.textContent=pick(r.name);
  els.roomview.classList.add('on');
  const fit=()=>{ fitRoom(); updateRvUI(); };
  requestAnimationFrame(fit); setTimeout(fit,60);
  sfx.tap();
  const rec=roomRec(r.id);
  if(doneCount(r)===0 && !rec.seen.intro){
    rec.seen.intro=1; persist();
    setTimeout(()=>playDialogue(STORY[r.id]?.intro), 350);
  }
}
function exitRoom(){ closePopup(); endDialogueSilent(); els.roomview.classList.remove('on'); currentRoomId=null; buildScene(); }
function updateRvUI(){
  const r=roomById(currentRoomId); if(!r) return;
  const rem=r.tasks.length-doneCount(r);
  els.badge.textContent=rem; els.badge.style.display=rem?'grid':'none';
  els.build.style.display=rem?'grid':'none';
  els.rvStamps.textContent=save.stamps|0;
}

// ---------- progressive popup (with pre-lore) ----------
function openPopup(){
  if(dlgActive) return;
  const r=roomById(currentRoomId); if(!r) return;
  const tk=nextTask(r);
  if(!tk){ pmToast(t('fullyRenovated')); return; }
  const rec=roomRec(r.id), story=STORY[r.id]?.tasks?.[tk.id];
  if(story?.pre && !rec.seen['pre_'+tk.id]){
    rec.seen['pre_'+tk.id]=1; persist();
    playDialogue(story.pre, ()=>showPopup(r,tk));
    return;
  }
  showPopup(r,tk);
}
function showPopup(r,tk){
  const idx=doneCount(r)+1, afford=(save.stamps|0)>=tk.cost;
  const preview=stageImg(r, doneCount(r)+1);
  els.popup.innerHTML=`
    <div class="pm-pop-head">${t('nextRenovation')} <span class="pm-pop-step">${idx} / ${r.tasks.length}</span></div>
    <div class="pm-pop-item">
      <div class="pm-pop-thumb" style="background-image:url(${preview})"></div>
      <div class="pm-pop-info"><div class="pm-pop-name">${tk.icon} ${pick(tk.title)}</div>
        <div class="pm-pop-cost"><span data-icon="stamp" data-size="16"></span> ${tk.cost} stamps</div></div>
    </div>
    <button class="btn small green" id="pm-pop-buy"${afford?'':' disabled'}>${afford?t('addIt'):t('notEnoughStamps')}</button>
    <button id="pm-pop-cancel">${t('later')}</button>`;
  if(window.__hydrateIcons) window.__hydrateIcons(els.popup);
  if(afford) els.popup.querySelector('#pm-pop-buy').onclick=()=>buyNext(r,tk);
  els.popup.querySelector('#pm-pop-cancel').onclick=closePopup;
  els.popupBack.classList.add('on');
  sfx.tap();
}
function closePopup(){ els.popupBack.classList.remove('on'); els.popup.innerHTML=''; }
function buyNext(r,tk){
  if((save.stamps|0) < tk.cost){ pmToast(t('needMoreStamps')); return; }
  save.stamps=Math.max(0,(save.stamps|0)-tk.cost);
  roomRec(r.id).stage = doneCount(r)+1;
  persist();
  sfx.stamp && sfx.stamp();
  closePopup();
  crossfadeRoom(r);
  updateRvUI();
  const story=STORY[r.id]?.tasks?.[tk.id];
  setTimeout(()=>{
    playDialogue(story?.post, ()=>{
      if(roomComplete(r)){
        pmToast(t('roomRenovated',{room:pick(r.name)})+' 🎉');
        setTimeout(()=>{ exitRoom(); const a=activeIdx();
          if(a<ORDER.length){ const nx=roomById(ORDER[a]); setTimeout(()=>{ centerOn(nx); pmToast('✨ '+t('roomUnlocked',{room:pick(nx.name)})); },500); }
          else setTimeout(()=>pmToast('🏆 '+t('officeFullyDone')),500);
        },1200);
      }
    });
  }, 800);
}
function crossfadeRoom(r){
  const next=stageImg(r);
  const ov=document.createElement('div'); ov.className='pm-xfade';
  ov.style.backgroundImage=`url(${next})`;
  els.room.appendChild(ov);
  requestAnimationFrame(()=>ov.classList.add('on'));
  const poof=document.createElement('div'); poof.className='pm-poof'; poof.textContent='✨';
  poof.style.cssText='left:50%;top:46%;';
  els.room.appendChild(poof); setTimeout(()=>poof.remove(),900);
  setTimeout(()=>{ els.room.style.backgroundImage=`url(${next})`; els.rvBg.style.backgroundImage=`url(${next})`; ov.remove(); }, 640);
}

// ---------- map pan (horizontal, rotation-aware) ----------
let panX=0, mapDrag=false, mapMoved=false, mapCap=false, msx, msy, mspx;
function localDX(e){ return rotated ? (e.clientY-msy) : (e.clientX-msx); }   // screen delta -> strip delta
function clamp(){ const vw=els.vp.clientWidth, minX=Math.min(0,vw-LAY.sceneW); panX=Math.max(minX,Math.min(0,panX)); els.scene.style.transform=`translate(${panX}px,0px)`; }
function centerOn(r){ const {x}=roomXY(r); const vw=els.vp.clientWidth; panX=-(x+LAY.roomW/2)+vw/2; clamp(); }
function initMapPan(){
  const vp=els.vp;
  vp.addEventListener('pointerdown',e=>{ mapDrag=true;mapMoved=false;mapCap=false;msx=e.clientX;msy=e.clientY;mspx=panX; });
  vp.addEventListener('pointermove',e=>{ if(!mapDrag)return; const dx=localDX(e);
    if(!mapMoved && Math.abs(dx)>6){ mapMoved=true; try{vp.setPointerCapture(e.pointerId); mapCap=true;}catch(_){} }
    if(mapMoved){ panX=mspx+dx; clamp(); } });
  const end=(e)=>{ if(mapCap){ try{vp.releasePointerCapture(e.pointerId);}catch(_){} } mapDrag=false; mapCap=false;
    setTimeout(()=>{ mapMoved=false; },0);   // keep the guard for this drag's own click, clear it after
  };
  vp.addEventListener('pointerup',end); vp.addEventListener('pointercancel',end);
}

// ---------- toast ----------
let toastT=null;
function pmToast(m){ els.toast.textContent=m; els.toast.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>els.toast.classList.remove('show'),1800); }

// ---------- entry ----------
export function renderPostMap(){
  if(!built) build();
  if(!save.metaWelcome){ save.stamps=(save.stamps|0)+40; save.metaWelcome=1; persist(); setTimeout(()=>pmToast(t('welcomeStamps')),400); }
  els.roomview.classList.remove('on'); els.popupBack.classList.remove('on'); endDialogueSilent(); currentRoomId=null;
  updateRot(); layout(); buildScene();
  const rc=()=>{ updateRot(); layout(); buildScene(); centerOn(roomById(ORDER[Math.min(activeIdx(),ORDER.length-1)])); };
  requestAnimationFrame(rc); setTimeout(rc,60);
}
