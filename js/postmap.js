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
import { VARIANTS, VARIANT_CHOICES, variantKey, variantImg } from './variantart.js';

const ROOMS = [
  { id:'garden', name:L('Garden','Bahçe'), variant:true, tasks:[
    { id:'cleanup',  title:L('Big cleanup','Büyük temizlik'),                          icon:'✨', cost:4 },
    { id:'fountain', title:L('Build the fountain','Fıskiyeyi kur'),                    icon:'⛲', cost:5 },
    { id:'arch',     title:L('Raise the entrance arch','Giriş kemerini kur'),          icon:'🌹', cost:4 },
    { id:'flowers',  title:L('Plant the garden','Bahçeyi çiçeklendir'),                icon:'🌷', cost:5 },
    { id:'dovecote', title:L('Set up the mail dovecote','Posta güvercinliğini kur'),   icon:'🕊️', cost:5 },
  ] },
  { id:'lobby', name:L('Lobby','Lobi'), variant:true, tasks:[
    { id:'cleanup',  title:L('Big cleanup','Büyük temizlik'),                          icon:'✨', cost:4 },
    { id:'mailwall', title:L('Restore the mail wall','Mektup duvarını onar'),          icon:'📬', cost:5 },
    { id:'counter',  title:L('Build the reception counter','Resepsiyon tezgahını kur'),icon:'🗄️', cost:5 },
    { id:'lounge',   title:L('Furnish the waiting lounge','Bekleme köşesini döşe'),     icon:'🛋️', cost:5 },
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
      cleanup:  { pre:[['gale',L("Start with a good sweep, Poffy. A post office greets the whole sky with its garden.",
                                  "Önce şöyle bir el süpürge çek, Poffy. Postane bütün gökyüzünü önce bahçesiyle selamlar.")]],
                  post:[['poffy',L("Sparkling! Now we can actually see what we're rebuilding!",
                                   "Pırıl pırıl! Artık neyi yeniden kurduğumuzu görebiliyoruz bari!")]] },
      fountain: { pre:[['gale',L("A fountain stood right on that empty ring. Couriers filled their flasks — and their courage — there.",
                                  "Şu boş kaidede bir fıskiye dururdu. Kuryeler matarayı da cesareti de oradan doldururdu.")]],
                  post:[['poffy',L("It's singing! Even the water looks happy!","Şarkı söylüyor! Suyun bile keyfi yerinde!")],
                        ['gale',L("...I had forgotten that sound. Well done, little one.","...Bu sesi unutmuşum. Eline sağlık ufaklık.")]] },
      arch:     { pre:[['poffy',L("A post office gate should smell like roses, not rust! Let's raise a proper arch.",
                                   "Postane kapısı dediğin pas değil, gül kokmalı! Hadi buraya adam gibi bir kemer dikelim.")]],
                  post:[['gale',L("Rosie the songbird used to nest by that gate. Perhaps she'll smell the flowers and come home.",
                                  "Ötücü kuş Rosie eskiden o kapının başında yuva yapardı. Belki çiçeklerin kokusunu alır da evine döner.")]] },
      flowers:  { pre:[['poffy',L("Flower beds! And a bench — tired wings need somewhere soft to wait.",
                                   "Çiçek tarhları! Bir de bank — yorgun kanatlara yumuşacık bir mola yeri lazım.")]],
                  post:[['rosie',L("♪ Tweet-tweedle-eet! ♪","♪ Cik-cikcik-cik! ♪")],
                        ['poffy',L("Gale, look! A songbird — on the new bench!","Gale, baksana! Bir ötücü kuş — yeni bankın üstünde!")],
                        ['gale',L("Well, I'll be... Welcome home, Rosie. The roses called, and you answered.",
                                  "Vay canına... Evine hoş geldin Rosie. Güller seslendi, sen de geldin demek.")]] },
      dovecote: { pre:[['rosie',L("♪ Tweet? Tweet-tweet! ♪ (Rosie circles the front lawn, looking for somewhere to roost.)",
                                   "♪ Cik? Cik-cik! ♪ (Rosie ön çimenin üstünde tur atıyor, tüneyecek yer arıyor.)")],
                       ['gale',L("Mail-doves carried our letters long before balloons. Build them a home, and they'll come back too.",
                                 "Balonlardan çok önce mektuplarımızı posta güvercinleri taşırdı. Onlara bir yuva kur, bak onlar da geri gelir.")]],
                  post:[['rosie',L("♪ TWEET-TWEET-TWEEEET! ♪ (Rosie lands on the perch like she owns it. Two doves coo approvingly.)",
                                   "♪ CİK-CİK-CİİİK! ♪ (Rosie tüneğe sanki tapusu varmış gibi konuyor. İki güvercin onaylarcasına guruluyor.)")],
                        ['poffy',L("Full house! The garden's got its wings back!","Ev doldu! Bahçe kanatlarına yeniden kavuştu!")],
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
  if(!r.choices) r.choices={};
  return r;
}
function vcfg(r){ return VARIANTS[r.id]; }
function isFixedTask(r,tk){ const c=vcfg(r); return !!(c && c.fixed[tk.id]); }
function doneCount(r){
  if(r.variant){ const rec=roomRec(r.id), c=vcfg(r); return (rec.stage>=1?1:0) + c.seq.filter(id=>rec.choices[id]).length; }
  return Math.min(roomRec(r.id).stage, r.tasks.length);
}
function roomComplete(r){ return doneCount(r) >= r.tasks.length; }
function nextTask(r){
  if(r.variant){ const rec=roomRec(r.id), c=vcfg(r);
    if(!(rec.stage>=1)) return r.tasks[0];                                   // cleanup first
    const id=c.seq.find(k=>!rec.choices[k]); return id?r.tasks.find(tk=>tk.id===id):null; }
  const d=doneCount(r); return d<r.tasks.length ? r.tasks[d] : null;
}
function stageImg(r,k){ const a=ROOM_STAGES[r.id]; return a[Math.max(0,Math.min(k===undefined?doneCount(r):k, a.length-1))]; }
function activeIdx(){ for(let i=0;i<ORDER.length;i++){ if(!roomComplete(roomById(ORDER[i]))) return i; } return ORDER.length; }
function roomState(r){ if(roomComplete(r)) return 'done'; return ORDER.indexOf(r.id)===activeIdx()?'active':'locked'; }

// ---------- DOM ----------
let built=false, els={}, currentRoomId=null, rotated=false;

// ---------- variant rooms: every choice combo is a pre-rendered full image ----------
function childKey(r, taskId, v){                 // image key if `v` were chosen for taskId
  const c=vcfg(r), rec=roomRec(r.id);
  return variantKey(c, { stage:Math.max(1,rec.stage|0), choices:{...rec.choices, [taskId]:v} });
}
function preloadVariantNext(r){                  // warm the browser cache for the upcoming options
  const c=vcfg(r); const tk=nextTask(r); if(!c||!tk) return;
  if(tk.id==='cleanup'){ new Image().src=variantImg(c, c.prefix+'_clean'); return; }
  if(c.fixed[tk.id]){ new Image().src=variantImg(c, childKey(r,tk.id,c.fixed[tk.id])); return; }
  for(const v of VARIANT_CHOICES) new Image().src=variantImg(c, childKey(r,tk.id,v));
}
function roomBG(r){ return r.variant ? variantImg(vcfg(r), variantKey(vcfg(r), roomRec(r.id))) : stageImg(r); }

function paintRoom(elm,r){ elm.style.backgroundImage=`url(${roomBG(r)})`; }

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
      <div id="pm-rv-stage"><div id="pm-rv-bg"></div><div id="pm-rv-room"><div id="pm-item-glow"></div></div></div>
      <button id="pm-rv-build" aria-label="Renovate">🔨<span id="pm-rv-badge">0</span></button>
      <div id="pm-choicebar">
        <div class="pm-cb-title"></div>
        <div class="pm-cb-opts"></div>
        <button class="pm-cb-x" aria-label="Cancel">✕</button>
      </div>
      <button id="pm-cb-ok" aria-label="Confirm">✓</button>
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
    choicebar:screen.querySelector('#pm-choicebar'), cbTitle:screen.querySelector('.pm-cb-title'),
    cbOpts:screen.querySelector('.pm-cb-opts'), cbOk:screen.querySelector('#pm-cb-ok'),
    cbX:screen.querySelector('.pm-cb-x'), glow:screen.querySelector('#pm-item-glow'),
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
  els.cbX.onclick  = ()=> closeChoiceBar(true);
  els.cbOk.onclick = ()=>{ const r=roomById(currentRoomId); if(!r||!cbState) return;
    const tk=r.tasks.find(x=>x.id===cbState.taskId); if(tk) confirmChoice(r,tk); };
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
  if(currentRoomId){ closeChoiceBar(true); closePopup(); endDialogueSilent(); els.roomview.classList.remove('on'); currentRoomId=null; }
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
  paintRoom(els.room,r); els.rvBg.style.backgroundImage=`url(${roomBG(r)})`;
  if(r.variant) preloadVariantNext(r);
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
function exitRoom(){ closeChoiceBar(true); closePopup(); endDialogueSilent(); els.roomview.classList.remove('on'); currentRoomId=null; buildScene(); }
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
  if(r.variant && tk.id!=='cleanup' && !isFixedTask(r,tk)) return openChoiceBar(r,tk);
  const idx=doneCount(r)+1, afford=(save.stamps|0)>=tk.cost;
  const preview = r.variant
    ? variantImg(vcfg(r), tk.id==='cleanup' ? vcfg(r).prefix+'_clean' : childKey(r,tk.id,vcfg(r).fixed[tk.id]))
    : stageImg(r, doneCount(r)+1);
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
function afterBuy(r,tk){
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
function buyNext(r,tk){
  if((save.stamps|0) < tk.cost){ pmToast(t('needMoreStamps')); return; }
  save.stamps=Math.max(0,(save.stamps|0)-tk.cost);
  const rec=roomRec(r.id);
  if(r.variant){
    if(tk.id==='cleanup') rec.stage=1;
    else rec.choices[tk.id]=vcfg(r).fixed[tk.id];      // fixed single-design task
  } else {
    rec.stage = doneCount(r)+1;
  }
  persist();
  sfx.stamp && sfx.stamp();
  closePopup();
  crossfadeRoom(r);
  if(r.variant){
    const fx=vcfg(r).fx[tk.id];
    if(fx) setTimeout(()=>burstParticles(fx.x,fx.y), 300);
    preloadVariantNext(r);
  }
  updateRvUI();
  afterBuy(r,tk);
}
// ---------- variant choice bar: bottom swatches + LIVE in-room preview ----------
// Selecting a design paints the child render straight into the room; the selected
// swatch breathes (glow), the green ✓ confirms. Used by every variant room.
let cbState=null;                                   // {taskId, sel}
function burstParticles(cx,cy){                     // sparkle burst over the placed item
  for(let i=0;i<22;i++){
    const star=i%4===0;
    const el=document.createElement('div');
    el.className='pm-spark'+(star?' star':'');
    if(star) el.textContent='✦';
    const ang=Math.random()*Math.PI*2, dist=26+Math.random()*95;
    el.style.setProperty('--dx',(Math.cos(ang)*dist).toFixed(1)+'px');
    el.style.setProperty('--dy',(Math.sin(ang)*dist-24).toFixed(1)+'px');
    el.style.setProperty('--s',(star?13+Math.random()*6:5+Math.random()*7).toFixed(1)+'px');
    el.style.setProperty('--d',(0.7+Math.random()*0.5).toFixed(2)+'s');
    el.style.setProperty('--dl',(Math.random()*0.18).toFixed(2)+'s');
    el.style.setProperty('--c',['#ffd968','#fff3c4','#ffe9a8','#ffffff'][i%4]);
    el.style.left=cx+'%'; el.style.top=cy+'%';
    els.room.appendChild(el);
    setTimeout(()=>el.remove(),1700);
  }
}
function showItemGlow(r,taskId){
  const fx=vcfg(r) && vcfg(r).fx[taskId]; if(!fx){ hideItemGlow(); return; }
  els.glow.style.left=fx.x+'%'; els.glow.style.top=fx.y+'%';
  els.glow.style.width=fx.w+'%'; els.glow.style.height=fx.h+'%';
  els.glow.classList.add('on');
}
function hideItemGlow(){ els.glow.classList.remove('on'); }
function openChoiceBar(r,tk){
  cbState={taskId:tk.id, sel:null};
  const c=vcfg(r);
  els.cbTitle.innerHTML=`${tk.icon} ${pick(tk.title)} · <span class="pm-cb-cost"><span data-icon="stamp" data-size="14"></span> ${tk.cost} ${pick(L('stamps','pul'))}</span>`;
  els.cbOpts.innerHTML=VARIANT_CHOICES.map(v=>
    `<button class="pm-cb-opt" data-v="${v}">
       <div class="pm-cb-thumb" style="background-image:url(${variantImg(c, childKey(r,tk.id,v))}); background-position:${c.pos[tk.id]||'50% 50%'};"></div>
       <div class="pm-cb-lbl">${pick(c.labels[v])}</div>
     </button>`).join('');
  if(window.__hydrateIcons) window.__hydrateIcons(els.cbTitle);
  els.cbOpts.querySelectorAll('.pm-cb-opt').forEach(b=>{ b.onclick=()=>selectVariant(r,tk,b.dataset.v); });
  const afford=(save.stamps|0)>=tk.cost;
  els.cbOk.disabled=!afford; els.cbOk.classList.toggle('cant',!afford);
  els.build.style.display='none';
  els.choicebar.classList.add('on'); els.cbOk.classList.add('on');
  showItemGlow(r,tk.id);                            // the item itself breathes white while previewing
  selectVariant(r,tk,'1');                          // preselect first design -> instant preview
}
function selectVariant(r,tk,v){
  if(!cbState) return;
  cbState.sel=v;
  els.cbOpts.querySelectorAll('.pm-cb-opt').forEach(b=>b.classList.toggle('sel',b.dataset.v===v));
  const url=variantImg(vcfg(r), childKey(r,tk.id,v));
  els.room.style.backgroundImage=`url(${url})`;     // live preview: item shown in place
  els.rvBg.style.backgroundImage=`url(${url})`;
  sfx.tap();
}
function closeChoiceBar(revert){
  if(!cbState) return;
  cbState=null;
  hideItemGlow();
  els.choicebar.classList.remove('on'); els.cbOk.classList.remove('on');
  const r=roomById(currentRoomId);
  if(r){
    if(revert){ paintRoom(els.room,r); els.rvBg.style.backgroundImage=`url(${roomBG(r)})`; }
    updateRvUI();                                   // restores the 🔨 button visibility
  }
}
function confirmChoice(r,tk){
  if((save.stamps|0) < tk.cost){ pmToast(t('needMoreStamps')); return; }
  const v=cbState&&cbState.sel; if(!v) return;
  const rec=roomRec(r.id);
  const parentUrl=variantImg(vcfg(r), variantKey(vcfg(r), rec));   // state BEFORE this item, for the fade-in
  save.stamps=Math.max(0,(save.stamps|0)-tk.cost);
  rec.choices[tk.id]=v;
  persist();
  sfx.stamp && sfx.stamp();
  closeChoiceBar(false);
  // settle ritual: drop back to the pre-item image, fade the item in, sparkle burst
  els.room.style.backgroundImage=`url(${parentUrl})`;
  els.rvBg.style.backgroundImage=`url(${parentUrl})`;
  crossfadeRoom(r);
  const fx=vcfg(r).fx[tk.id]||{x:50,y:50};
  setTimeout(()=>burstParticles(fx.x,fx.y), 300);
  preloadVariantNext(r);
  afterBuy(r,tk);
}
function crossfadeRoom(r){
  const next=roomBG(r);
  const ov=document.createElement('div'); ov.className='pm-xfade';
  ov.style.backgroundImage=`url(${next})`;
  els.room.appendChild(ov);
  requestAnimationFrame(()=>ov.classList.add('on'));
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
// legacy migration: stage-chain era records (stage up to 5) for rooms that are now
// variant trees -> mark done steps as classic ('1') designs so old saves stay complete.
function migrateVariantSaves(){
  let changed=false;
  for(const r of ROOMS){
    if(!r.variant) continue;
    const c=vcfg(r), rec=stt()[r.id];
    if(!rec || rec.choices && Object.keys(rec.choices).length) continue;
    const legacy=rec.stage|0;
    if(legacy>=2){                       // stage 1 was just the first old task; >=2 means real progress
      rec.choices={};
      c.seq.slice(0, Math.min(legacy-1, c.seq.length)).forEach(id=>{ rec.choices[id]=c.fixed[id]||'1'; });
      rec.stage=1; changed=true;
    }
  }
  if(changed) persist();
}

export function renderPostMap(){
  if(!built) build();
  migrateVariantSaves();
  if(!save.metaWelcome){ save.stamps=(save.stamps|0)+40; save.metaWelcome=1; persist(); setTimeout(()=>pmToast(t('welcomeStamps')),400); }
  els.roomview.classList.remove('on'); els.popupBack.classList.remove('on'); endDialogueSilent(); currentRoomId=null;
  updateRot(); layout(); buildScene();
  const rc=()=>{ updateRot(); layout(); buildScene(); centerOn(roomById(ORDER[Math.min(activeIdx(),ORDER.length-1)])); };
  requestAnimationFrame(rc); setTimeout(rc,60);
}
