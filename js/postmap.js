// ---------- Post Office meta-map: auto-LANDSCAPE story-driven renovation ----------
// The whole Post Office section renders in landscape: when the phone is portrait, the
// content is rotated 90° (classic HTML5-game orientation trick); when the DEVICE itself
// is landscape (auto-rotate), body.pm-on CSS sizes #phone natively and no CSS rotation
// is applied. Map = horizontal strip of rooms with fling momentum. Rooms renovate via
// pre-rendered stage chains with Homescapes-style character dialogues.
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
  { id:'office', name:L("Postmaster's Study","Müdürün Çalışma Odası"), tasks:[
    { id:'desk',     title:L("Restore Gale's writing desk","Gale'in yazı masasını kur"), icon:'🪶', cost:6 },
    { id:'books',    title:L('Fill the sky-atlas shelves','Gök atlası raflarını doldur'), icon:'📚', cost:5 },
    { id:'orrery',   title:L('Assemble the brass orrery','Pirinç gezegen makinesini kur'), icon:'🪐', cost:5 },
    { id:'stove',    title:L('Warm the reading corner','Okuma köşesini ısıt'),          icon:'🔥', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'kitchen', name:L('Cloud Kitchen','Bulut Mutfağı'), tasks:[
    { id:'oven',     title:L('Relight the great oven','Koca fırını yeniden yak'),      icon:'🥖', cost:6 },
    { id:'pantry',   title:L('Stock the pantry shelves','Kiler raflarını doldur'),     icon:'🍯', cost:5 },
    { id:'table',    title:L('Set the baking table','Hamur tezgahını kur'),            icon:'🥐', cost:5 },
    { id:'tea',      title:L('Build the tea corner','Çay köşesini kur'),               icon:'🫖', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'hospital', name:L('Letter Hospital','Mektup Hastanesi'), tasks:[
    { id:'mend',     title:L('Set up the mending desk','Tamir masasını kur'),          icon:'🪡', cost:6 },
    { id:'lines',    title:L('Hang the drying lines','Kurutma iplerini as'),           icon:'📃', cost:5 },
    { id:'ink',      title:L('Install the ink station','Mürekkep istasyonunu kur'),    icon:'🧪', cost:5 },
    { id:'cots',     title:L('Place the recovery beds','Nekahet yataklarını yerleştir'),icon:'🛏️', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'observatory', name:L('Star Observatory','Yıldız Rasathanesi'), tasks:[
    { id:'telescope',title:L('Raise the great telescope','Büyük teleskobu kur'),       icon:'🔭', cost:6 },
    { id:'charts',   title:L('Set the star-chart table','Yıldız haritası masasını kur'),icon:'🗺️', cost:5 },
    { id:'lanterns', title:L('Hang the star lanterns','Yıldız fenerlerini as'),        icon:'🏮', cost:5 },
    { id:'couch',    title:L('Add the stargazing couch','Yıldız izleme koltuğunu ekle'),icon:'🛋️', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
  { id:'dock', name:L('Balloon Dock','Balon Rıhtımı'), tasks:[
    { id:'balloon',  title:L('Patch the mail balloon','Posta balonunu onar'),          icon:'🎈', cost:6 },
    { id:'winch',    title:L('Fit the mooring winch','Palamar vincini kur'),           icon:'⚓', cost:5 },
    { id:'crane',    title:L('Build the loading crane','Yükleme vincini kur'),         icon:'🏗️', cost:5 },
    { id:'flags',    title:L('Raise flags & lanterns','Bayrakları & fenerleri as'),    icon:'🚩', cost:5 },
    { id:'cleanup',  title:L('Final cleanup','Son temizlik'),                          icon:'✨', cost:4 },
  ] },
];
const ORDER = ['garden','lobby','sorting','office','kitchen','hospital','observatory','dock'];

// ---------- story ----------
const NAMES = {
  poffy:L('Poffy','Poffy'), gale:L('Postmaster Gale','Postane Müdürü Gale'),
  rosie:L('Rosie','Rosie'), zippy:L('Zippy','Zippy'),
  cirrus:L('Chef Cirrus','Şef Cirrus'), drizzle:L('Dr. Drizzle','Dr. Çise'), nini:L('Nini','Nini'),
};
const STORY = {
  garden: {
    intro: [
      ['poffy',L("Whoa... so this is the old Sky Post Office! It looks like the fog moved in and never paid rent.",
                 "Vay be... demek eski Gök Postanesi burası! Sanki sis içeri taşınmış, üstelik kirayı da ödemiyor.")],
      ['gale',L("Ever since the Great Storm scattered our letters, not a single hello has flown, little Poffy.",
                "Büyük Fırtına mektuplarımızı savurduğundan beri gökyüzünde tek bir 'merhaba' bile uçmadı, küçük Poffy.")],
      ['poffy',L("Then we'll fix it — every brick, every bloom! If the letters fly again, so will the smiles!",
                 "O zaman burayı ayağa kaldırırız — tuğla tuğla, çiçek çiçek! Mektuplar yeniden uçarsa gülümsemeler de uçar!")],
      ['gale',L("Heh. Big words for a small cloud. Start with the garden — it greets everyone first.",
                "Heh. Minicik bir buluta göre büyük laflar. Bahçeden başla — misafiri önce o karşılar.")],
    ],
    tasks: {
      fountain: { pre:[['gale',L("Couriers used to fill their flasks — and their courage — at that fountain. It hasn't sung in years.",
                                  "Kuryeler mataralarını da cesaretlerini de o fıskiyeden doldururdu. Yıllardır sesi soluğu çıkmıyor.")]],
                  post:[['poffy',L("It's singing again! Even the water looks happier!","Yeniden şarkı söylüyor! Suyun bile keyfi yerine geldi!")],
                        ['gale',L("...I had forgotten that sound. Well done, little one.","...Bu sesi unutmuşum. Eline sağlık ufaklık.")]] },
      arch:     { pre:[['poffy',L("A post office gate should smell like roses, not rust! Let's fix that arch.",
                                   "Postane kapısı dediğin pas değil, gül kokmalı! Hadi şu kemeri onaralım.")]],
                  post:[['gale',L("Rosie the songbird used to nest up there. Perhaps she'll hear the roses and come home.",
                                  "Ötücü kuş Rosie eskiden oraya yuva yapardı. Belki güllerin kokusunu alır da evine döner.")]] },
      lamps:    { pre:[['gale',L("Night couriers followed these lamps home through the fog. The Storm blew them all out at once.",
                                  "Gece kuryeleri siste evin yolunu bu fenerlerle bulurdu. Fırtına hepsini bir gecede söndürdü.")]],
                  post:[['poffy',L("Lit! Now nobody gets lost on the way to a hello!","Yandılar! Artık kimse bir 'merhaba'ya giderken yolunu kaybetmeyecek!")]] },
      flowers:  { pre:[['poffy',L("Flower beds! And a bench — tired wings need somewhere soft to wait.",
                                   "Çiçek tarhları! Bir de bank — yorgun kanatlara yumuşacık bir mola yeri lazım.")]],
                  post:[['rosie',L("♪ Tweet-tweedle-eet! ♪","♪ Cik-cikcik-cik! ♪")],
                        ['poffy',L("Gale, look! A songbird — on the new bench!","Gale, baksana! Bir ötücü kuş — yeni bankın üstünde!")],
                        ['gale',L("Well, I'll be... Welcome home, Rosie. The roses called, and you answered.",
                                  "Vay canına... Evine hoş geldin Rosie. Güller seslendi, sen de geldin demek.")]] },
      cleanup:  { pre:[['gale',L("One last sweep, Poffy. A post office greets the whole sky with its garden.",
                                  "Son bir el süpürge, Poffy. Postane bütün gökyüzünü önce bahçesiyle selamlar.")]],
                  post:[['poffy',L("Sparkling! Now THAT'S a front yard worthy of the Letter Kingdom!",
                                   "Pırıl pırıl! İşte Mektup Krallığı'na yakışır bir bahçe böyle olur!")],
                        ['gale',L("The garden breathes again. Now... dare we open that door?",
                                  "Bahçe yeniden nefes alıyor. Ee... şu kapıyı açmaya cesaretin var mı?")]] },
    }
  },
  lobby: {
    intro: [
      ['poffy',L("The lobby! I can almost hear the old stamp-thumps and the ding of the counter bell.",
                 "Lobi! Eski damga seslerini, tezgah zilinin çınlamasını duyar gibiyim.")],
      ['gale',L("This is where every journey began. Dust sheets off — let's give it back its heartbeat.",
                "Her yolculuk burada başlardı. Çek şu örtüleri — buranın kalbini geri verelim.")],
    ],
    tasks: {
      mailwall: { pre:[['gale',L("Every pigeonhole on that wall is somebody's address. Empty walls make empty hearts.",
                                  "O duvardaki her göz birinin adresi. Boş duvar, boş kalp demektir.")]],
                  post:[['poffy',L("Look! Slot seven already has mail in it! ...Okay, it's dust. But hopeful dust!",
                                   "Bak! Yedi numaralı gözde şimdiden posta var! ...Tamam, tozmuş. Ama umut dolu bir toz!")],
                        ['rosie',L("♪ Tweet! ♪ (Rosie tucks a tiny green leaf into slot three.)",
                                   "♪ Cik! ♪ (Rosie üç numaralı göze minicik yeşil bir yaprak bırakır.)")]] },
      counter:  { pre:[['poffy',L("A counter with a shiny brass bell! Ding-ding means 'welcome back'!",
                                   "Pırıl pırıl pirinç zilli bir tezgah! 'Çın çın' demek 'yine hoş geldin' demek!")]],
                  post:[['gale',L("Careful with that bell— ...oh, go on then. Ring it. I've missed it too.",
                                  "O zile dokunma— ...Peki, hadi çal. Ben de özlemişim.")]] },
      lounge:   { pre:[['gale',L("Folks used to wait here for letters from far away. Some waited years, and we kept them company.",
                                  "İnsanlar uzaklardan gelecek mektupları burada beklerdi. Kimi yıllarca bekledi; biz de yanlarında olduk.")]],
                  post:[['poffy',L("Now the waiting will feel soft and warm — like sitting on a cloud! Trust me, I'd know.",
                                   "Artık beklemek pamuk gibi olacak — bulutta oturmak gibi! İnan bana, bu işi iyi bilirim.")]] },
      windows:  { pre:[['poffy',L("Boarded windows make sad rooms. Sunlight, you're hired — report to work!",
                                   "Tahtalı pencere odayı üzer. Güneş ışığı, işe alındın — derhal göreve!")]],
                  post:[['gale',L("Ah. There's the sky I used to watch for storm warnings. Much friendlier today.",
                                  "Ah... İşte fırtına habercisi diye gözlediğim gökyüzü. Bugün çok daha cana yakın.")]] },
      cleanup:  { pre:[['gale',L("Sweep the last cobwebs, Poffy. A lobby should shine like a fresh stamp.",
                                  "Son örümcek ağlarını da al, Poffy. Lobi dediğin yeni basılmış pul gibi parlamalı.")]],
                  post:[['poffy',L("Perfect! Even the chandelier is winking at us!","Muhteşem! Avize bile bize göz kırpıyor!")],
                        ['gale',L("Then it's official... the Sky Post is OPEN. Well — almost. The letters still need sorting.",
                                  "O hâlde resmen ilan ediyorum: Gök Postanesi AÇIK. Şey... neredeyse. Mektuplar hâlâ ayrılmayı bekliyor.")]] },
    }
  },
  sorting: {
    intro: [
      ['gale',L("The sorting room — the heart of the post. Here, every letter in the Letter Kingdom found its way.",
                "Ayrım odası — postanenin kalbi. Mektup Krallığı'ndaki her mektup yolunu burada bulurdu.")],
      ['poffy',L("Then let's teach the letters their way home again!","O zaman mektuplara evlerinin yolunu yeniden öğretelim!")],
    ],
    tasks: {
      bureau:   { pre:[['gale',L("The old sorting desk knew every address by heart. Storm or no storm, it never lost a letter.",
                                  "Eski ayrım masası her adresi ezbere bilirdi. Fırtına kopsa da tek mektup kaybetmedi.")]],
                  post:[['poffy',L("I already sorted three letters! ...All addressed to me. But still!",
                                   "Üç mektup ayırdım bile! ...Gerçi üçü de bana. Ama yine de sayılır!")]] },
      shelf:    { pre:[['poffy',L("Parcels need homes too — big shelf, big hugs!","Kolilere de yuva lazım — koca raf, kocaman kucak!")]],
                  post:[['gale',L("Neat rows, proper labels. My mustache approves.","Düzgün sıralar, doğru etiketler... Bıyığım bile onayladı.")]] },
      franking: { pre:[['gale',L("No stamp, no journey. This old franking machine gives letters their wings.",
                                  "Pulsuz mektup yola çıkamaz. Bu eski damga makinesi mektuplara kanat takar.")]],
                  post:[['poffy',L("Ka-CHUNK! I love that sound! Again! Ka-CHUNK!","Kat-ÇUNK! Bayılıyorum bu sese! Bir daha! Kat-ÇUNK!")]] },
      cart:     { pre:[['poffy',L("A mail cart! Can I ride it? For, um... delivery practice?",
                                   "Posta arabası! Binebilir miyim? Şey... teslimat antrenmanı için tabii.")]],
                  post:[['zippy',L("Did somebody say MAIL CART?! Vrrrm — coming through!","Biri POSTA ARABASI mı dedi?! Vrrrm — çekilin, geliyorum!")],
                        ['poffy',L("ZIPPY?! You're back!","ZIPPY?! Döndün mü sen?!")],
                        ['zippy',L("Heard the fountain singing from three clouds away. The Sky Post lives, baby!",
                                   "Fıskiyenin şarkısını üç bulut öteden duydum. Gök Postanesi yaşıyor bebeğim!")]] },
      cleanup:  { pre:[['gale',L("Last task here, little courier. Make the heart of the post gleam.",
                                  "Buradaki son iş, küçük kurye. Postanenin kalbini parlat.")]],
                  post:[['gale',L("The heart of the Sky Post beats again. Thank you, Poffy. Truly.",
                                  "Gök Postanesi'nin kalbi yeniden atıyor. Sağ ol Poffy. Gerçekten.")],
                        ['zippy',L("So... when do we FLY? My scarf doesn't stream itself, old man.",
                                   "Ee... ne zaman UÇUYORUZ? Bu atkı kendi kendine dalgalanmıyor, ihtiyar.")],
                        ['gale',L("Patience, Zippy. Next comes my study. It has waited long enough.",
                                  "Sabır, Zippy. Sırada benim çalışma odam var. Yeterince bekledi zaten.")]] },
    }
  },
  office: {
    intro: [
      ['gale',L("My old study. I haven't opened this door since the night of the Storm.",
                "Eski çalışma odam. Fırtına gecesinden beri bu kapıyı hiç açmadım.")],
      ['poffy',L("Whoa — golden constellations on the walls! Gale, your study is the night sky!",
                 "Vayy — duvarlarda altın takımyıldızlar! Gale, senin oda resmen gece gökyüzü!")],
      ['gale',L("There is a letter in that desk I never finished writing, Poffy. Perhaps... it's finally time.",
                "Şu masada yarım bıraktığım bir mektup var, Poffy. Belki de... vakti nihayet geldi.")],
    ],
    tasks: {
      desk:    { pre:[['gale',L("My desk. Every stamp in the Kingdom passed under that green lamp once.",
                                 "Masam. Krallıktaki her pul, bir zamanlar şu yeşil lambanın altından geçti.")]],
                 post:[['poffy',L("The lamp still works! Green light means the Postmaster is IN!",
                                  "Lamba hâlâ çalışıyor! Yeşil ışık, 'Müdür İÇERİDE' demek!")]] },
      books:   { pre:[['gale',L("Sky-atlases, ledgers, route charts... a postmaster never throws away a route.",
                                 "Gök atlasları, defterler, rota haritaları... Bir postane müdürü hiçbir rotayı çöpe atmaz.")]],
                 post:[['zippy',L("Ooh, route charts! ...For the record, I never crashed into Island Seven. Don't check page twelve.",
                                  "Ooo, rota haritaları! ...Bilgin olsun, Yedinci Ada'ya falan çarpmadım ben. Sakın on ikinci sayfaya bakma.")]] },
      orrery:  { pre:[['gale',L("The old orrery. Watch — the little planets still remember their routes better than some couriers.",
                                 "Eski gezegen makinesi. Bak — minik gezegenler rotalarını hâlâ bazı kuryelerden iyi hatırlıyor.")]],
                 post:[['zippy',L("Hey! ...Okay, fair. But can the planets do THIS? *loop-de-loop*",
                                  "Hop! ...Tamam, haklısın. Ama gezegenler ŞUNU yapabiliyor mu? *taklaaa*")],
                       ['poffy',L("Zippy, NOT indoors!","Zippy, içeride OLMAZ!")]] },
      stove:   { pre:[['poffy',L("A cold study makes cold letters. Let's get that little stove purring!",
                                  "Soğuk odada mektup da üşür. Şu minik sobayı mırıldatalım hadi!")]],
                 post:[['gale',L("Ahh, there's the warmth... and Rosie has claimed the armchair already.",
                                 "Ahh, işte o sıcaklık... Rosie da koltuğu çoktan kapmış bile.")],
                       ['rosie',L("♪ ...tweet... ♪ (She is fast asleep.)","♪ ...cik... ♪ (Mışıl mışıl uyuyor.)")]] },
      cleanup: { pre:[['gale',L("One last thing, little courier. Open the curtains, sweep the dust... I have a letter to finish.",
                                 "Son bir şey kaldı, küçük kurye. Perdeleri aç, tozları al... Bitirmem gereken bir mektup var.")]],
                 post:[['gale',L("...There. 'To every friend of the Sky Post: we are OPEN again. Come home.' — Postmaster Gale.",
                                 "...İşte. 'Gök Postanesi'nin bütün dostlarına: yeniden AÇIĞIZ. Evinize dönün.' — Postane Müdürü Gale.")],
                       ['rosie',L("♪ TWEET! ♪ (Rosie snatches the letter and soars out the window!)",
                                  "♪ CİK! ♪ (Rosie mektubu kaptığı gibi pencereden fırlar!)")],
                       ['zippy',L("First delivery in years — race you, Rosie! VRRRM!","Yıllar sonra ilk teslimat — yarışırız Rosie! VRRRM!")],
                       ['poffy',L("Fly, letters, fly! The Sky Post Office is BACK!","Uçun mektuplar, uçun! Gök Postanesi GERİ DÖNDÜ!")],
                       ['gale',L("Back? Heh. Poffy, we've only woken the ground floor. Do you smell that? The old kitchen is calling.",
                                 "Döndü mü? Heh. Poffy, daha sadece alt katı uyandırdık. Kokuyu alıyor musun? Eski mutfak bizi çağırıyor.")]] },
    }
  },
  kitchen: {
    intro: [
      ['cirrus',L("*CRASH* ...Who dares enter MY kitchen?! Oh— Master Gale? You're ALIVE?!",
                  "*ŞANGUR* ...Kim girer BENİM mutfağıma?! Aa— Gale Usta? Sen YAŞIYOR musun?!")],
      ['gale',L("Cirrus, you old soup-cloud! You never left?","Cirrus, seni yaşlı çorba bulutu! Sen hiç mi gitmedin buradan?")],
      ['cirrus',L("A chef never abandons his kitchen. Though the kitchen... may have abandoned me a little. Help me relight her, and I'll bake clouds you can EAT.",
                  "Şef mutfağını terk etmez. Gerçi mutfak... beni biraz terk etmiş olabilir. Ocağı yakmama yardım edin, size YENEBİLEN bulutlar pişireyim.")],
    ],
    tasks: {
      oven:    { pre:[['cirrus',L("The great oven! She baked star-bread for every courier in the Kingdom. Gently now — she's shy after all these years.",
                                   "Koca fırın! Krallıktaki her kuryeye yıldız ekmeği pişirirdi. Yavaş olun — bunca yıldan sonra biraz utangaç.")]],
                 post:[['cirrus',L("She PURRS! Oh, I could cry. I WILL cry. Nobody look at me.",
                                   "MIRLIYOR! Ah, ağlayabilirim. Hatta AĞLAYACAĞIM. Kimse bana bakmasın.")]] },
      pantry:  { pre:[['poffy',L("Rainbow jam! Starberry preserves! Cirrus, is ANY of this still edible?",
                                  "Gökkuşağı reçeli! Yıldız çileği konservesi! Cirrus, bunların yenilebilir olanı var mı?")]],
                 post:[['cirrus',L("Edible? Little cloud, jam only gets WISER with age.",
                                   "Yenilebilir mi? Küçük bulut, reçel yaşlandıkça sadece OLGUNLAŞIR.")]] },
      table:   { pre:[['cirrus',L("A kitchen without a worktable is a sky without wind. Set it in the middle — copper pots above!",
                                   "Tezgahsız mutfak, rüzgârsız gökyüzü gibidir. Ortaya kurun — bakır tencereler yukarı!")]],
                 post:[['poffy',L("Fresh dough! Can I punch it? Please? Just once?","Taze hamur! Yumruk atabilir miyim? Lütfen? Bir kerecik?")],
                       ['cirrus',L("...Once.","...Bir kere.")]] },
      tea:     { pre:[['gale',L("And a tea corner. Some of my best decisions were brewed right there.",
                                 "Bir de çay köşesi. En iyi kararlarımın çoğu tam orada demlendi.")]],
                 post:[['rosie',L("♪ Tweet! ♪ (Rosie perches on the cup shelf and inspects every single cup.)",
                                  "♪ Cik! ♪ (Rosie fincan rafına konar, fincanları tek tek teftiş eder.)")]] },
      cleanup: { pre:[['cirrus',L("Now we scrub! A kitchen must shine like the top of a fresh meringue!",
                                   "Şimdi ovma vakti! Mutfak dediğin taze beze gibi parlamalı!")]],
                 post:[['cirrus',L("PERFECT. First batch of star-cookies goes to the little letter-menders upstairs. Doctor's orders.",
                                   "MÜKEMMEL. İlk tepsi yıldız kurabiyesi yukarıdaki mektup tamircilerine gidiyor. Doktorun emri.")]] },
    }
  },
  hospital: {
    intro: [
      ['drizzle',L("Shhh... gently, please. The letters here are recovering.",
                   "Şşş... yavaş olun lütfen. Buradaki mektuplar nekahet döneminde.")],
      ['poffy',L("A hospital... for LETTERS?","Mektup... HASTANESİ mi?")],
      ['drizzle',L("Every storm-torn letter still carries somebody's heart. We mend the paper; the words heal themselves. Will you help me reopen the ward?",
                   "Fırtınada yırtılan her mektup hâlâ birinin yüreğini taşır. Biz kâğıdı onarırız; kelimeler kendi kendine iyileşir. Servisi yeniden açmama yardım eder misiniz?")],
    ],
    tasks: {
      mend:    { pre:[['drizzle',L("The mending desk first: golden thread, gentle tape, and a magnifier — some tears are smaller than a sigh.",
                                    "Önce tamir masası: altın iplik, nazik bant, bir de büyüteç — bazı yırtıklar bir iç çekişten bile küçüktür.")]],
                 post:[['poffy',L("Tiny stitches! This letter says 'dear grandma'... we HAVE to save it.",
                                  "Minicik dikişler! Bu mektupta 'canım büyükannem' yazıyor... Bunu kurtarmak ZORUNDAYIZ.")]] },
      lines:   { pre:[['drizzle',L("Rain-soaked letters need to dry slowly, like memories. Hang them softly.",
                                    "Yağmur yemiş mektuplar yavaş kurumalı, tıpkı anılar gibi. Usulca asın.")]],
                 post:[['rosie',L("♪ Tweet-tweet! ♪ (Rosie straightens every letter on the line with her beak.)",
                                  "♪ Cik-cik! ♪ (Rosie ipteki mektupları gagasıyla tek tek düzeltir.)")]] },
      ink:     { pre:[['drizzle',L("Faded words need an ink transfusion. Blue for calm news, gold for good news, pink for love letters — obviously.",
                                    "Solmuş kelimelere mürekkep takviyesi gerekir. Sakin haberlere mavi, müjdelere altın, aşk mektuplarına pembe — tabii ki.")]],
                 post:[['zippy',L("Do you have an ink for 'sorry I'm late'? Asking for... myself.",
                                  "'Geciktim, kusura bakma' mürekkebiniz var mı? Şey... kendim için soruyorum.")]] },
      cots:    { pre:[['drizzle',L("And recovery beds. Healed letters rest one night before flying home.",
                                    "Ve nekahet yatakları. İyileşen mektuplar eve uçmadan önce bir gece dinlenir.")]],
                 post:[['poffy',L("They're TUCKED IN. Gale, look, this one is snoring!","ÜSTLERİ ÖRTÜLÜ resmen! Gale, bak, bu horluyor!")],
                       ['gale',L("Letters do not snore, Poffy.","Mektuplar horlamaz, Poffy.")],
                       ['poffy',L("This one does!","Bu horluyor ama!")]] },
      cleanup: { pre:[['drizzle',L("Last round: fresh air, clean floors. A ward heals faster when it smiles.",
                                    "Son tur: temiz hava, pırıl pırıl zemin. Gülümseyen koğuş daha hızlı iyileştirir.")]],
                 post:[['drizzle',L("Thank you, couriers. Tonight forty-two letters sleep safely... and tomorrow they fly. Nini will guide them — you'll find her upstairs, counting stars.",
                                    "Teşekkürler kuryeler. Bu gece kırk iki mektup güven içinde uyuyor... yarın da uçacaklar. Onlara Nini yol gösterecek — kendisi yukarıda, yıldız sayıyor.")]] },
    }
  },
  observatory: {
    intro: [
      ['nini',L("Mmm... you're late. The stars and I have been expecting you since Tuesday.",
                "Mmm... geciktiniz. Yıldızlarla ben sizi salıdan beri bekliyoruz.")],
      ['poffy',L("NINI! You live up HERE?","NİNİ! Sen BURADA mı yaşıyorsun?")],
      ['nini',L("Somebody has to watch the night routes. Fix my observatory, and no letter will ever be lost in the dark again.",
                "Gece rotalarını birinin gözlemesi lazım. Rasathanemi onarın, bir daha karanlıkta tek mektup bile kaybolmasın.")],
    ],
    tasks: {
      telescope:{ pre:[['nini',L("The great telescope first. She's seen every comet... and one very lost teapot.",
                                  "Önce büyük teleskop. Her kuyruklu yıldızı görmüştür... bir de fena hâlde kaybolmuş bir çaydanlığı.")]],
                  post:[['poffy',L("I can see the WHOLE Kingdom! And... is that Zippy doing loops by the west isles?",
                                   "TÜM Krallığı görebiliyorum! Ve... batı adalarında takla atan Zippy mi o?")],
                        ['zippy',L("...No.","...Hayır.")]] },
      charts:  { pre:[['nini',L("Star charts. The night sky is just a big address book, if you know how to read it.",
                                 "Yıldız haritaları. Gece gökyüzü, okumayı bilene kocaman bir adres defteridir.")]],
                 post:[['gale',L("Her mother drew half of these charts. The other half, Nini drew better.",
                                 "Bu haritaların yarısını annesi çizmişti. Kalan yarısını Nini daha da güzel çizdi.")]] },
      lanterns:{ pre:[['nini',L("Star lanterns, so sleepy couriers can find the window. We've all been that courier.",
                                 "Yıldız fenerleri — uykulu kuryeler pencereyi bulabilsin diye. Hepimiz bir gün o kurye olduk.")]],
                 post:[['rosie',L("♪ Tweet... ♪ (Rosie gazes at the lanterns, completely hypnotized.)",
                                  "♪ Cik... ♪ (Rosie fenerlere bakakalır; resmen büyülenmiştir.)")]] },
      couch:   { pre:[['poffy',L("A stargazing couch?! Best. Room. EVER.","Yıldız izleme koltuğu mu?! En. İyi. Oda. BU.")]],
                 post:[['nini',L("Careful. That couch has ended more night shifts than the sunrise.",
                                 "Dikkat et. O koltuk, gün doğumundan çok gece vardiyası bitirmiştir.")]] },
      cleanup: { pre:[['nini',L("Sweep gently — stardust is shy, and I collect it.","Nazikçe süpürün — yıldız tozu utangaçtır, ben de onu biriktiriyorum.")]],
                 post:[['nini',L("Perfect. The night routes are safe again... but Zippy says the ROOF is still a wreck. Ready for one more climb?",
                                 "Harika. Gece rotaları yeniden güvende... ama Zippy çatının hâlâ harabe olduğunu söylüyor. Bir kat daha tırmanmaya var mısınız?")]] },
    }
  },
  dock: {
    intro: [
      ['zippy',L("Welcome to the ROOF, slowpokes! Behold: the Balloon Dock! ...Okay, behold the SAD BALLOON PANCAKE.",
                 "Çatıya hoş geldiniz ağır çekimler! İşte karşınızda: Balon Rıhtımı! ...Tamam, karşınızda ÜZGÜN BALON KREPİ.")],
      ['gale',L("The old mail balloon... she carried parcels too big for any courier.",
                "Eski posta balonu... Hiçbir kuryenin taşıyamayacağı koca kolileri o taşırdı.")],
      ['poffy',L("Then let's get her flying! The sky isn't full until she's in it!",
                 "O zaman uçuralım onu! O havada olmadan gökyüzü tam sayılmaz!")],
    ],
    tasks: {
      balloon: { pre:[['zippy',L("Patch her gently! Every crease tells a story. That one? Hail storm of '09. THAT one? ...I don't want to talk about it.",
                                  "Yamayı nazik yapın! Her kırışığın bir hikâyesi var. Şu mu? 09 dolu fırtınası. ŞU mu? ...Onu hiç konuşmayalım.")]],
                 post:[['poffy',L("She's FLOATING! She's beautiful!","HAVALANDI! Çok da güzel ya!")],
                       ['cirrus',L("(from downstairs) IS THAT MY TABLECLOTH ON THAT BALLOON?!",
                                   "(alt kattan) O BALONDAKİ BENİM MASA ÖRTÜM MÜ?!")]] },
      winch:   { pre:[['gale',L("The mooring winch. A balloon without a good knot is just an expensive cloud.",
                                 "Palamar vinci. İyi düğümü olmayan balon, pahalı bir buluttan ibarettir.")]],
                 post:[['zippy',L("Knots checked! Double-checked! ...Poffy, stop untying that.",
                                  "Düğümler tamam! Bir daha kontrol, tamam! ...Poffy, çözme şunu.")]] },
      crane:   { pre:[['zippy',L("Loading crane! For the BIG parcels: pianos, statues, grandma's soup pot...",
                                  "Yükleme vinci! BÜYÜK koliler için: piyanolar, heykeller, babaannenin çorba kazanı...")]],
                 post:[['gale',L("That soup pot fed three villages, Zippy. Show respect.",
                                 "O kazan üç köyü doyurdu, Zippy. Saygıda kusur etme.")]] },
      flags:   { pre:[['poffy',L("Signal flags and lanterns — so the whole sky knows we're open!",
                                  "Sinyal bayrakları ve fenerler — bütün gökyüzü açık olduğumuzu bilsin!")]],
                 post:[['rosie',L("♪ TWEET-TWEET! ♪ (Rosie ties a tiny ribbon of her own to the flag line.)",
                                  "♪ CİK-CİK! ♪ (Rosie bayrak ipine kendi minik kurdelesini bağlar.)")]] },
      cleanup: { pre:[['gale',L("One last sweep, all together. The Kingdom is watching this roof tonight.",
                                 "Son bir el, hep beraber. Bu gece bütün Krallık bu çatıyı izliyor.")]],
                 post:[['gale',L("Look at her, Poffy. Lit from garden to rooftop. The Sky Post Office isn't just open... she's ALIVE.",
                                 "Şuna bak, Poffy. Bahçesinden çatısına ışıl ışıl. Gök Postanesi artık sadece açık değil... CANLI.")],
                       ['cirrus',L("Star-cookies for everyone! Chef's orders!","Herkese yıldız kurabiyesi! Şefin emri!")],
                       ['drizzle',L("And forty-two healed letters, cleared to fly.","Ve uçuş izni almış kırk iki iyileşmiş mektup.")],
                       ['nini',L("Night routes are open. Stars are on duty.","Gece rotaları açık. Yıldızlar görev başında.")],
                       ['zippy',L("Then what are we waiting for?! MAIL'S OUT!","O zaman ne bekliyoruz?! POSTA ÇIKIYOR!")],
                       ['poffy',L("To every mailbox in the sky — FLY!","Gökteki her posta kutusuna — UÇUN!")]] },
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
        <button class="iconbtn" id="pm-reset" aria-label="Reset"><span data-icon="restart" data-size="20"></span></button>
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
  screen.querySelector('#pm-reset').onclick    = ()=> resetTestData();
  screen.querySelector('#pm-settings').onclick = ()=> window.ui.openSettings();
  screen.querySelector('#pm-rv-back').onclick  = ()=>{ if(dlgActive) return; exitRoom(); };
  els.build.onclick = openPopup;
  els.popupBack.onclick = e=>{ if(e.target===els.popupBack) closePopup(); };
  els.dialog.addEventListener('pointerdown', e=>{ if(e.target===els.pdSkip) return; advanceDialogue(); });
  els.pdSkip.onclick = skipDialogue;
  initMapPan();
  const onViewportChange=()=>{
    if(!els.screen.classList.contains('on')) return;
    updateRot();
    if(els.roomview.classList.contains('on')) fitRoom();
    else { layout(); buildScene(); centerOn(roomById(ORDER[Math.min(activeIdx(),ORDER.length-1)])); }
  };
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('orientationchange', ()=>setTimeout(onViewportChange,120));
  try{ matchMedia('(orientation: landscape)').addEventListener('change', ()=>setTimeout(onViewportChange,120)); }catch(_){}
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
// TEST-ONLY: wipes all room progress and refills stamps so every upgrade is affordable again.
// Remove the #pm-reset button + its click handler + this function (and resetArmed/resetArmTimer) once testing is done.
let resetArmed=false, resetArmTimer=null;
function resetTestData(){
  if(!resetArmed){
    resetArmed=true; sfx.tap();
    pmToast(pick(L('Tap again to reset & refill stamps','Sıfırlamak ve puanları doldurmak için tekrar dokun')));
    clearTimeout(resetArmTimer);
    resetArmTimer=setTimeout(()=>{ resetArmed=false; },3000);
    return;
  }
  resetArmed=false; clearTimeout(resetArmTimer);
  save.rooms = {};
  save.stamps = ROOMS.reduce((sum,r)=>sum+r.tasks.reduce((s,tk)=>s+tk.cost,0),0);
  persist();
  if(currentRoomId){ closePopup(); endDialogueSilent(); els.roomview.classList.remove('on'); currentRoomId=null; }
  layout(); buildScene(); centerOn(roomById(ORDER[0]));
  pmToast('🔄 Reset!');
}
function onRoom(r){
  const state=roomState(r);
  if(state==='locked'){ const a=activeIdx(); pmToast(t('finishFirst',{room:pick(roomById(ORDER[Math.min(a,ORDER.length-1)]).name)})); return; }
  if(state==='done'){ pmToast(t('roomAllDone',{room:pick(r.name)})); return; }
  enterRoom(r);
}

// ---------- room view (fills the screen; art is 21:9 wide) ----------
function fitRoom(){
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

// ---------- map pan (horizontal, rotation-aware, with fling momentum) ----------
let panX=0, mapDrag=false, mapMoved=false, mapCap=false, msx, msy, mspx;
let flingRaf=null, flingTo=null, flingTok=0, flingSamples=[];
function localDX(e){ return rotated ? (e.clientY-msy) : (e.clientX-msx); }   // screen delta -> strip delta
function clamp(){ const vw=els.vp.clientWidth, minX=Math.min(0,vw-LAY.sceneW); const c=Math.max(minX,Math.min(0,panX)); const hit=c!==panX; panX=c; els.scene.style.transform=`translate(${panX}px,0px)`; return hit; }
function centerOn(r){ stopFling(); const {x}=roomXY(r); const vw=els.vp.clientWidth; panX=-(x+LAY.roomW/2)+vw/2; clamp(); }
function stopFling(){ flingTok++; if(flingRaf){ cancelAnimationFrame(flingRaf); flingRaf=null; } if(flingTo){ clearTimeout(flingTo); flingTo=null; } }
function startFling(v){                       // v in px/ms, decays like the level map's native scroll
  stopFling();
  const tok=flingTok;
  let last=performance.now();
  const step=()=>{
    if(tok!==flingTok) return;
    if(flingRaf){ cancelAnimationFrame(flingRaf); flingRaf=null; }   // whichever of the pair fired
    if(flingTo){ clearTimeout(flingTo); flingTo=null; }              // first cancels its sibling
    const now=performance.now();
    const dt=Math.min(50, Math.max(1, now-last)); last=now;
    panX += v*dt;
    v *= Math.pow(0.994, dt);                 // friction
    const hitEdge=clamp();
    if(hitEdge || Math.abs(v)<0.02) return;
    flingRaf=requestAnimationFrame(step);     // rAF for smoothness, timeout so throttled
    flingTo=setTimeout(step, 33);             // tabs / battery savers still glide
  };
  step();
}
function initMapPan(){
  const vp=els.vp;
  vp.addEventListener('pointerdown',e=>{ stopFling(); mapDrag=true;mapMoved=false;mapCap=false;msx=e.clientX;msy=e.clientY;mspx=panX; flingSamples=[[performance.now(),0]]; });
  vp.addEventListener('pointermove',e=>{ if(!mapDrag)return; const dx=localDX(e);
    if(!mapMoved && Math.abs(dx)>6){ mapMoved=true; try{vp.setPointerCapture(e.pointerId); mapCap=true;}catch(_){} }
    if(mapMoved){ panX=mspx+dx; clamp();
      flingSamples.push([performance.now(),dx]);
      if(flingSamples.length>6) flingSamples.shift(); } });
  const end=(e)=>{ if(mapCap){ try{vp.releasePointerCapture(e.pointerId);}catch(_){} } mapDrag=false; mapCap=false;
    if(mapMoved && flingSamples.length>=2){
      const a=flingSamples[0], b=flingSamples[flingSamples.length-1];
      const dt=b[0]-a[0];
      if(dt>0 && dt<300){ const v=(b[1]-a[1])/dt; if(Math.abs(v)>0.15) startFling(Math.max(-2.5,Math.min(2.5,v))); }
    }
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
