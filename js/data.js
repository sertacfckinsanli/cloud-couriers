// ---------- static game data (couriers, story letters, shop, regions) ----------
import { L } from './i18n.js';

// gameplay stats — the single source of truth for what each cloud can do
// (courier names are proper names, kept identical in both languages)
export const COURIER_STATS={
 poffy:{name:'Poffy', accent:'#7fc3f7', stepMs:440, cap:1},
 zippy:{name:'Zippy', accent:'#ffd34d', stepMs:330, cap:1},
 mimo: {name:'Mimo',  accent:'#cfc3f5', stepMs:600, cap:2},
 lulu: {name:'Lulu',  accent:'#5bd98f', stepMs:480, cap:1, shield:1},
 nini: {name:'Nini',  accent:'#b18cff', stepMs:440, cap:1, seesHidden:true},
 bibi: {name:'Bibi',  accent:'#ffb3cf', stepMs:440, cap:1},
};
// unlocked by finishing these levels
export const COURIER_UNLOCKS={ 10:'zippy', 18:'mimo', 24:'nini', 28:'lulu' };

export const COURIERS=[
 {id:'poffy', desc:L('Sweet, brave and balanced. Steady wings, one letter.','Tatlı, cesur ve dengeli. Sağlam kanatlar, bir mektup.'), tag:L('Starter — always ready!','Başlangıç — her zaman hazır!')},
 {id:'zippy', desc:L('Zooms 25% faster! Great for the clock, tricky near storms.','%25 daha hızlı uçar! Zamana karşı harika, fırtınalara yakınken riskli.'), tag:L('Unlocks at level 10','Level 10\'da açılır'), unlockAt:10},
 {id:'mimo', desc:L('Calm and sleepy. Carries TWO letters, but drifts slowly.','Sakin ve uykulu. İKİ mektup taşır ama yavaş süzülür.'), tag:L('Unlocks at level 18','Level 18\'de açılır'), unlockAt:18},
 {id:'nini', desc:L('Night courier. Sees every hidden moonlit path.','Gece kuryesi. Ay ışığındaki her gizli yolu görür.'), tag:L('Unlocks at level 24','Level 24\'te açılır'), unlockAt:24},
 {id:'lulu', desc:L('Brave and fluffy. Survives ONE storm hit per flight.','Cesur ve tüylü. Uçuş başına BİR fırtına darbesine dayanır.'), tag:L('Unlocks at level 28','Level 28\'de açılır'), unlockAt:28},
 {id:'bibi', desc:L('Tiny and curious. Fits through cloud tunnels.','Minik ve meraklı. Bulut tünellerine sığar.'), tag:L('Region 5 — coming soon','Bölge 5 — yakında'), unlockAt:99},
];

export const STORY=[
 {lv:3, from:L('To the Star Picnic','Yıldız Pikniğine'), text:L('“Dear Moon, I saved you a seat at the Star Picnic. Bring your softest glow.” — Pip','"Sevgili Ay, Yıldız Pikniği\'nde sana bir yer ayırdım. En yumuşak parıltını getir." — Pip')},
 {lv:7, from:L('To the Bakery Cloud','Fırın Bulutuna'), text:L('“To the little bakery cloud: your cinnamon rolls are missed every single morning.” — The Sparrows','"Küçük fırın bulutuna: tarçınlı çöreklerin her sabah özleniyor." — Serçeler')},
 {lv:10, from:L('To Grandpa Cloud','Dede Buluta'), text:L('“Dear Grandpa Cloud, the village still remembers your wind songs. We hum them when it rains.” — Willa','"Sevgili Dede Bulut, köy hâlâ rüzgâr şarkılarını hatırlıyor. Yağmur yağınca onları mırıldanıyoruz." — Willa')},
 {lv:14, from:L('To the Balloon Seller','Balon Satıcısına'), text:L('“One red balloon, please. It\'s for a snail who has never seen the sky.” — Momo','"Bir kırmızı balon lütfen. Gökyüzünü hiç görmemiş bir salyangoz için." — Momo')},
 {lv:17, from:L('To the Lighthouse Star','Deniz Feneri Yıldızına'), text:L('“Thank you for blinking twice every night. That\'s how I know you\'re still there.” — A small boat','"Her gece iki kez yanıp söndüğün için teşekkürler. Hâlâ orada olduğunu böyle anlıyorum." — Küçük bir tekne')},
 {lv:20, from:L('To Everyone','Herkese'), text:L('“The storm took our letters, but not our words. The kingdom remembers. Love always finds a route.” — The Post Master','"Fırtına mektuplarımızı aldı ama sözlerimizi alamadı. Krallık hatırlıyor. Sevgi her zaman bir yol bulur." — Postane Müdürü')},
 {lv:24, from:L('To the Night Watch','Gece Nöbetçisine'), text:L('“Dear Nini, thank you for reading to the stars until they fall asleep. They snore very softly.” — Mother Moon','"Sevgili Nini, yıldızlara uyuyana kadar kitap okuduğun için teşekkürler. Çok yumuşak horluyorlar." — Ana Ay')},
 {lv:30, from:L('To the Morning','Sabaha'), text:L('“We kept every lantern lit through the long night. Come slowly, dear Morning. Some dreams are still being delivered.” — The Moon Isles','"Uzun gece boyunca her feneri yanık tuttuk. Yavaş gel sevgili Sabah. Bazı rüyalar hâlâ teslim ediliyor." — Ay Adaları')},
 {lv:34, from:L('To Brave Lulu','Cesur Lulu\'ya'), text:L('“Dear Lulu, thank you for flying the storm run when nobody else would. The valley keeps a warm chimney just for you.” — The Weather Station','"Sevgili Lulu, başka kimse uçmazken fırtına rotasını uçtuğun için teşekkürler. Vadi senin için sıcak bir baca tutuyor." — Hava Durumu İstasyonu')},
 {lv:40, from:L('To Old Thunder','Yaşlı Gök Gürültüsüne'), text:L('“You were never angry, were you? Just lonely up there. Come down and sing with the wind chimes sometime.” — A small courier','"Hiç kızgın değildin değil mi? Sadece orada yalnızdın. Bir gün in de rüzgâr çanlarıyla şarkı söyle." — Küçük bir kurye')},
];

export const SHOP=[
 {id:'mailbox', icon:'📮', name:L('Shiny new mailbox','Parlak yeni posta kutusu'), cost:4},
 {id:'plants', icon:'🪴', name:L('Cloud plants','Bulut bitkileri'), cost:5},
 {id:'flag', icon:'🌈', name:L('Rainbow flag','Gökkuşağı bayrağı'), cost:6},
 {id:'chimes', icon:'🎐', name:L('Wind chimes','Rüzgâr çanları'), cost:6},
 {id:'hat', icon:'🎩', name:L('Courier top hat','Kurye silindir şapkası'), cost:8},
];

export const REGIONS=[
 {id:1,name:L('Cotton Village','Pamuk Köyü'), sub:L('Learn the winds · levels 1–10','Rüzgârları öğren · level 1–10'), icon:'cloud', tint:'#45b4ff'},
 {id:2,name:L('Rainbow Market','Gökkuşağı Pazarı'), sub:L('Colors & bridges · levels 11–20','Renkler & köprüler · level 11–20'), icon:'rainbow', tint:'#e8559a'},
 {id:3,name:L('Sleeping Moon Isles','Uyuyan Ay Adaları'), sub:L('Night puzzles · levels 21–30','Gece bulmacaları · level 21–30'), icon:'moon', tint:'#b18cff'},
 {id:4,name:L('Storm Valley','Fırtına Vadisi'), sub:L('Lightning timing · levels 31–40','Şimşek zamanlaması · level 31–40'), icon:'bolt', tint:'#eda313'},
 {id:5,name:L('Lost Post Tower','Kayıp Posta Kulesi'), sub:L('Portals & finale · coming soon','Portallar & final · yakında'), icon:'tower', tint:'#8a90b8', locked:true},
];
