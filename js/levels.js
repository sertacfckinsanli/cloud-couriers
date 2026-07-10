// ---------- 20 hand-designed levels (all solver-verified: npm test) ----------
import { L } from './i18n.js';
export const LEVELS = [
{ id:1, region:1, name:L('First Flight','İlk Uçuş'), obj:L('Deliver the blue letter 💙','Mavi mektubu teslim et 💙'),
  rows:['.......','...B...','...-...','...<...','...-...','...-...','...S...'],
  letters:{'4,3':'b'}, par:10, hint:{cell:'3,3',text:L('Try turning this breeze first.','Önce bu rüzgârı çevirmeyi dene.')},
  tutorial:[{cell:'3,3',text:L('Tap the wind arrow to turn it! ↺','Çevirmek için rüzgâr okuna dokun! ↺')},{cell:'go',text:L('Great! Now press Start to send Poffy.','Harika! Şimdi Poffy\'yi göndermek için Başlat\'a bas.')}] },

{ id:2, region:1, name:L('Turn the Breeze','Rüzgârı Çevir'), obj:L('Deliver the pink letter 🌸','Pembe mektubu teslim et 🌸'),
  rows:['.......','.....P.','.....^.','.>---v.','.-.....','.-.....','.-.....','.S.....'],
  letters:{'5,1':'p'}, par:12, hint:{cell:'3,5',text:L('One breeze is facing the wrong way…','Bir rüzgâr yanlış yöne bakıyor…')} },

{ id:3, region:1, name:L('Stamp on the Side','Kenardaki Pul'), obj:L('Deliver 💛 and grab the golden stamp','💛 teslim et ve altın pulu al'),
  rows:['.......','...Y...','...-...','.>-^...','.-.-...','.^-^...','...-...','...S...'],
  letters:{'6,3':'y'}, stamps:['4,1'], par:14, hint:{cell:'5,3',text:L('The side road hides a golden stamp!','Yan yol bir altın pul saklıyor!')},
  tutorial:[{cell:'4,1',text:L('Golden stamps are optional treasure!','Altın pullar isteğe bağlı hazinelerdir!')}] },

{ id:4, region:1, name:L('Two Homes','İki Ev'), obj:L('Deliver 2 letters, one after another','2 mektubu art arda teslim et'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'4,2':'b','4,4':'p'}, par:16, hint:{cell:'4,3',text:L('Turn the middle breeze WHILE Poffy flies!','Poffy uçarken ORTADAKİ rüzgârı çevir!')},
  tutorial:[{cell:'4,3',text:L('New! You can turn breezes while Poffy is flying.','Yeni! Poffy uçarken rüzgârları çevirebilirsin.')}] },

{ id:5, region:1, name:L('One-Way Wind','Tek Yönlü Rüzgâr'), obj:L('Ride the air current across the gap','Boşluğu hava akımıyla geç'),
  rows:['.......','.....G.','.....-.','.rrrru.','.>.....','.-.....','.-.....','.S.....'],
  letters:{'5,1':'g'}, par:12, hint:{cell:'4,1',text:L('Point this breeze up into the current.','Bu rüzgârı akıma doğru yukarı yönlendir.')},
  tutorial:[{cell:'3,2',text:L('Air currents can\'t be turned — they push Poffy!','Hava akımları çevrilemez — Poffy\'yi iterler!')}] },

{ id:6, region:1, name:L('Closed Cloud Gate','Kapalı Bulut Kapısı'), obj:L('Open the sleepy gate in time','Uykulu kapıyı zamanında aç'),
  rows:['.......','...B...','...-...','...%...','...-...','...<...','...-...','...S...'],
  letters:{'4,3':'b'}, gates:{'3,3':{}}, par:12, hint:{cell:'3,3',text:L('Tap the gate just before Poffy arrives — it\'s sleepy and closes again!','Poffy varmadan hemen önce kapıya dokun — uykulu ve tekrar kapanıyor!')},
  tutorial:[{cell:'3,3',text:L('Sleepy gates close after a moment. Tap to open!','Uykulu kapılar bir süre sonra kapanır. Açmak için dokun!')}] },

{ id:7, region:1, name:L('The Loop','Döngü'), obj:L('Escape the wind loop and deliver 💛','Rüzgâr döngüsünden kaç ve 💛 teslim et'),
  rows:['.......','...Y...','...-...','.d-<-l.','.-...-.','.r---u.','.....-.','.....S.'],
  letters:{'5,3':'y'}, par:12, hint:{cell:'3,3',text:L('Grab the letter first, THEN turn this breeze up.','Önce mektubu al, SONRA bu rüzgârı yukarı çevir.')} },

{ id:8, region:1, name:L('Double Delivery','Çifte Teslimat'), obj:L('Two letters — but Poffy carries one at a time','İki mektup — ama Poffy bir seferde bir tane taşır'),
  rows:['.......','.......','.r-d-l.','.P.-.B.','.u-^-u.','...-...','...S...'],
  letters:{'2,2':'b','2,4':'p'}, par:22, hint:{cell:'4,3',text:L('You\'ll pass the middle three times. Plan each turn!','Ortadan üç kez geçeceksin. Her dönüşü planla!')} },

{ id:9, region:1, name:L('Wind Timing','Rüzgâr Zamanlaması'), obj:L('Avoid the grumpy cloud crossing','Huysuz bulutun geçtiği yerden kaçın'),
  rows:['.......','...B...','...-...','.-----.','...-...','...>...','...-...','...S...'],
  letters:{'4,3':'b'}, movers:[{cells:[[3,1],[3,2],[3,3],[3,4],[3,5]],type:'storm'}],
  par:12, hint:{cell:'5,3',text:L('Watch the grey cloud — press Start when it drifts away.','Gri bulutu izle — uzaklaşınca Başlat\'a bas.')},
  tutorial:[{cell:'3,3',text:L('Storm clouds are grumpy. Avoid them!','Fırtına bulutları huysuzdur. Onlardan kaçın!')}] },

{ id:10, region:1, name:L('Cotton Village Finale','Pamuk Köyü Finali'), obj:L('Boss: sneak past Grumble Puff! 3 letters + stamp','Boss: Homurdanan Puf\'un yanından sıvış! 3 mektup + pul'),
  rows:['...Y...','...%...','.r-v-l.','.B.-.P.','.u-^-u.','...-...','...>...','...-...','...S...'],
  letters:{'5,3':'b','4,4':'p','2,4':'y'}, stamps:['2,2'], gates:{'1,3':{}},
  movers:[{cells:[[3,3],[3,4]],type:'storm',every:2,face:'😴',big:true}],
  gentleStorm:true,
  par:26, hint:{cell:'4,3',text:L('Blue first (left), then pink (right), then up to Yumi\'s house.','Önce mavi (sol), sonra pembe (sağ), sonra yukarı Yumi\'nin evine.')},
  boss:L('Grumble Puff','Homurdanan Puf') },

{ id:11, region:2, name:L('Welcome to Rainbow Market','Gökkuşağı Pazarı\'na Hoş Geldin'), obj:L('Match letters to their colors!','Mektupları renklerine göre eşleştir!'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'5,3':'p','2,2':'b'}, par:20, hint:{cell:'4,3',text:L('Pink goes RIGHT to the pink house. Wrong homes say no-thank-you!','Pembe SAĞA, pembe eve gider. Yanlış evler hayır-teşekkürler der!')},
  tutorial:[{cell:'3,5',text:L('Blue letters go to blue mailboxes. Pink to pink!','Mavi mektuplar mavi kutulara gider. Pembe pembeye!')}] },

{ id:12, region:2, name:L('Rainbow Bridge','Gökkuşağı Köprüsü'), obj:L('First delivery builds the bridge','İlk teslimat köprüyü kurar'),
  rows:['.......','.....G.','.r-d.-.','.Y.-.-.','.u-^=u.','...-...','...S...'],
  letters:{'5,3':'y','3,5':'g'}, bridges:{'4,4':1}, par:18, hint:{cell:'4,3',text:L('Deliver ⭐ left first — the bridge will shimmer to life!','Önce ⭐ sola teslim et — köprü parlayarak canlanacak!')} },

{ id:13, region:2, name:L('Color Gate','Renk Kapısı'), obj:L('Only matching letters may pass the gates','Kapılardan sadece eşleşen mektuplar geçebilir'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u%^%u.','...-...','...-...','...S...'],
  letters:{'6,3':'p','5,3':'b'}, gates:{'4,2':{color:'b'},'4,4':{color:'p'}},
  par:24, hint:{cell:'4,3',text:L('After pink is delivered, send Poffy DOWN for the blue letter.','Pembe teslim edildikten sonra Poffy\'yi mavi mektup için AŞAĞI gönder.')} },

{ id:14, region:2, name:L('Market Rush','Pazar Telaşı'), obj:L('Beat the clock! (and maybe the stamp…)','Saate karşı yarış! (belki pulu da alırsın…)'),
  rows:['.......','.>---v.','.-...-.','.G...-.','.-...-.','.^-<-<.','...-...','...S...'],
  letters:{'6,3':'g'}, stamps:['2,5'], timeLimit:20, par:9,
  hint:{cell:'5,3',text:L('Left is fast. The long way round earns the stamp — if you\'re quick!','Sol hızlıdır. Uzun yol pulu kazandırır — çabuksan!')} },

{ id:15, region:2, name:L('Switchy Winds','Değişken Rüzgârlar'), obj:L('Turn breezes mid-flight — mind the storm!','Uçuş sırasında rüzgârları çevir — fırtınaya dikkat!'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'2,2':'p','2,4':'b'}, movers:[{cells:[[3,3],[3,2]],type:'storm',every:2}],
  gentleStorm:true,
  par:24, hint:{cell:'4,3',text:L('Three passes: gather pink, deliver it right, gather blue, deliver left.','Üç geçiş: pembeyi al, sağa teslim et, maviyi al, sola teslim et.')} },

{ id:16, region:2, name:L('Bridge Bazaar','Köprü Çarşısı'), obj:L('Two bridges, correct order','İki köprü, doğru sıra'),
  rows:['...P...','...=...','.r-v-l.','.Y.-.G.','.u-^=u.','...-...','...S...'],
  letters:{'5,3':'y','4,5':'g','2,4':'p'}, bridges:{'4,4':1,'1,3':2},
  par:24, hint:{cell:'4,3',text:L('Yellow left → bridge 1 → green right → bridge 2 opens the top.','Sarı sola → köprü 1 → yeşil sağa → köprü 2 yukarıyı açar.')} },

{ id:17, region:2, name:L('Busy Sky','Kalabalık Gökyüzü'), obj:L('Balloons bump Poffy off course!','Balonlar Poffy\'yi rotasından çıkarır!'),
  rows:['.......','...G...','.-----.','...-...','.-----.','...-...','...>...','...S...'],
  letters:{'5,3':'g'},
  movers:[{cells:[[2,1],[2,2],[2,3],[2,4],[2,5]],type:'balloon'},{cells:[[4,5],[4,4],[4,3],[4,2],[4,1]],type:'balloon'}],
  par:14, hint:{cell:'6,3',text:L('Balloons only bump — but each bump costs the perfect run.','Balonlar sadece çarpar — ama her çarpma kusursuz koşuya mal olur.')} },

{ id:18, region:2, name:L('Mimo Preview','Mimo Önizlemesi'), obj:L('Trial courier Mimo carries TWO letters!','Deneme kurye Mimo İKİ mektup taşır!'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.u-^-u.','...-...','...-...','...S...'],
  letters:{'6,3':'p','5,3':'b'}, movers:[{cells:[[2,2],[2,3],[2,4]],type:'storm',every:2}],
  courier:'mimo', carryCap:2, stepMs:600, par:26,
  hint:{cell:'4,3',text:L('Mimo scoops up both letters — deliver left, then right.','Mimo iki mektubu da toplar — sola, sonra sağa teslim et.')} },

{ id:19, region:2, name:L('Mixed Mail','Karışık Posta'), obj:L('Three letters, three gates — order matters!','Üç mektup, üç kapı — sıra önemli!'),
  rows:['...Y...','...%...','.r-v-l.','.B.-.P.','.u%^%u.','...-...','...-...','...S...'],
  letters:{'5,3':'p','2,4':'b','2,2':'y'},
  gates:{'4,2':{color:'b'},'4,4':{color:'p'},'1,3':{color:'y'}},
  par:26, hint:{cell:'4,3',text:L('Pink right → blue left → yellow up. Gates refuse the wrong mail!','Pembe sağa → mavi sola → sarı yukarı. Kapılar yanlış postayı reddeder!')} },

{ id:20, region:2, name:L('Rainbow Market Finale','Gökkuşağı Pazarı Finali'), obj:L('Boss: clear the Color Fog! 3 letters + stamp','Boss: Renk Sisini dağıt! 3 mektup + pul'),
  rows:['...Y...','...=...','.r-v-l.','.B.-.P.','.u%^%u.','...-...','...-...','...S...'],
  letters:{'5,3':'p','2,4':'b','2,2':'y'}, stamps:['2,1'],
  gates:{'4,2':{color:'b'},'4,4':{color:'p'}}, bridges:{'1,3':2},
  movers:[{cells:[[3,3],[3,4]],type:'storm',every:2}],
  gentleStorm:true,
  fogRows:[0,1], par:30, boss:L('Color Fog','Renk Sisi'),
  hint:{cell:'4,3',text:L('Two deliveries lift the fog. Pink right, blue left, then rise!','İki teslimat sisi kaldırır. Pembe sağa, mavi sola, sonra yüksel!')} },

/* ============ Region 3: Sleeping Moon Isles ============ */
{ id:21, region:3, name:L('Moonrise','Ay Doğuşu'), obj:L('First delivery under the moonlight','Ay ışığı altında ilk teslimat'),
  rows:['.......','...P...','...-...','.^-^...','.-.....','.-.....','.-.....','.S.....'],
  letters:{'5,1':'p'}, par:12, hint:{cell:'3,1',text:L('Turn this breeze toward the moonpath.','Bu rüzgârı ay yoluna doğru çevir.')},
  tutorial:[{cell:'3,1',text:L('Welcome to the Moon Isles! Same winds, sleepier skies.','Ay Adaları\'na hoş geldin! Aynı rüzgârlar, daha uykulu gökyüzü.')}] },

{ id:22, region:3, name:L('Moon Gate','Ay Kapısı'), obj:L('Pass while the moon gate is open','Ay kapısı açıkken geç'),
  rows:['.......','...B...','...-...','...M...','...-...','...<...','...-...','...S...'],
  letters:{'4,3':'b'}, moonPeriod:3, par:14, hint:{cell:'3,3',text:L('Moon gates open and close on their own — watch the glow, then fly.','Ay kapıları kendi kendine açılıp kapanır — parlamayı izle, sonra uç.')},
  tutorial:[{cell:'3,3',text:L('Moon gates breathe with the moon. Time your start!','Ay kapıları ayla birlikte nefes alır. Başlangıcını zamanla!')}] },

{ id:23, region:3, name:L('Lantern Light','Fener Işığı'), obj:L('Light the lantern to reveal the path','Yolu ortaya çıkarmak için feneri yak'),
  rows:['.......','...Y...','...h...','...h...','...>...','...s...','...-...','...S...'],
  letters:{'6,3':'y'}, par:12, hint:{cell:'4,3',text:L('The lantern below lights the hidden sky-path above.','Aşağıdaki fener yukarıdaki gizli gök-yolunu aydınlatır.')},
  tutorial:[{cell:'5,3',text:L('Lanterns reveal hidden paths as Poffy passes!','Fenerler Poffy geçerken gizli yolları ortaya çıkarır!')}] },

{ id:24, region:3, name:L('Nini\'s Sight','Nini\'nin Görüşü'), obj:L('Trial courier Nini sees hidden paths!','Deneme kurye Nini gizli yolları görür!'),
  rows:['.......','.......','.rhdhl.','.B.h.P.','.uh^hu.','...-...','...S...'],
  letters:{'4,2':'b','4,4':'p'}, courier:'nini', par:18,
  hint:{cell:'4,3',text:L('Nini glows — every hidden path is visible to her.','Nini parlar — her gizli yol ona görünür.')},
  tutorial:[{cell:'4,3',text:L('Nini the night courier sees what others can\'t.','Gece kuryesi Nini başkalarının göremediğini görür.')}] },

{ id:25, region:3, name:L('Two Moons','İki Ay'), obj:L('Both moon gates share one rhythm','Her iki ay kapısı tek ritmi paylaşır'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.uM^Mu.','...-...','...-...','...S...'],
  letters:{'6,3':'p','5,3':'b'}, moonPeriod:3, par:26,
  hint:{cell:'4,3',text:L('Deliver pink right, dive back for blue, then left — mind the moon.','Pembeyi sağa teslim et, maviye geri dal, sonra sola — aya dikkat et.')} },

{ id:26, region:3, name:L('Secret Stamp','Gizli Pul'), obj:L('A hidden detour hides a golden stamp','Gizli bir sapak altın bir pul saklıyor'),
  rows:['.......','...G...','...-...','.>h^...','.h.-...','.^h^...','...s...','...S...'],
  letters:{'6,3':'g'}, stamps:['4,1'], par:16,
  hint:{cell:'5,3',text:L('The lantern reveals a side road — treasure waits in the dark.','Fener bir yan yolu ortaya çıkarır — hazine karanlıkta bekliyor.')} },

{ id:27, region:3, name:L('Moonlit Circuits','Ay Işığında Turlar'), obj:L('Two deliveries between moon blinks','Ay parlamaları arasında iki teslimat'),
  rows:['.......','.......','.rMdMl.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'4,2':'b','4,4':'p'}, moonPeriod:3, par:24,
  hint:{cell:'4,3',text:L('The top corridor closes with the moon. Turn the middle breeze in flight!','Üst koridor ayla birlikte kapanır. Uçuşta ortadaki rüzgârı çevir!')} },

{ id:28, region:3, name:L('Sleeping Grump','Uyuyan Huysuz'), obj:L('Shhh — deliver without waking the cloud','Şşşt — bulutu uyandırmadan teslim et'),
  rows:['.......','...B...','...-...','.>hu...','.h.-...','.^h<...','...-...','...s...','...S...'],
  letters:{'6,3':'b'}, movers:[{cells:[[4,3]],type:'storm',face:'😴',big:true}],
  par:16, hint:{cell:'5,3',text:L('The grump sleeps on the straight road. Sneak around the hidden left.','Huysuz düz yolda uyuyor. Gizli soldan sıvış.')},
  tutorial:[{cell:'4,3',text:L('This cloud is asleep. Do NOT bump into it!','Bu bulut uyuyor. Ona ÇARPMA!')}] },

{ id:29, region:3, name:L('Night Rush','Gece Telaşı'), obj:L('Fast lane or hidden treasure lane?','Hızlı şerit mi, gizli hazine şeridi mi?'),
  rows:['.......','.>---v.','.-...h.','.G...-.','.-...h.','.^-<s<.','...M...','...-...','...S...'],
  letters:{'7,3':'g'}, stamps:['2,5'], moonPeriod:3, par:14,
  hint:{cell:'5,3',text:L('Left is quick. The lantern route climbs through hidden sky to the stamp.','Sol hızlıdır. Fener rotası gizli gökyüzünden pula tırmanır.')} },

{ id:30, region:3, name:L('Sleeping Moon Finale','Uyuyan Ay Finali'), obj:L('Boss: the Drowsy Moon! 3 letters in the dark','Boss: Uykulu Ay! Karanlıkta 3 mektup'),
  rows:['...Y...','...M...','.rhvhl.','.B.-.P.','.uM^Mu.','...s...','...-...','...S...'],
  letters:{'6,3':'p','2,4':'b','2,2':'y'}, moonPeriod:3,
  par:34, boss:L('The Drowsy Moon','Uykulu Ay'),
  hint:{cell:'4,3',text:L('Light the lantern, ride the moon: pink right, blue left, then rise at moonrise.','Feneri yak, ayla süzül: pembe sağa, mavi sola, sonra ay doğarken yüksel.')} },

/* ============ Region 4: Storm Valley ============ */
{ id:31, region:4, name:L('Welcome to Storm Valley','Fırtına Vadisi\'ne Hoş Geldin'), obj:L('Cross while the lightning rests','Şimşek dinlenirken geç'),
  rows:['.......','...B...','...-...','...Z...','...-...','...<...','...-...','...S...'],
  letters:{'4,3':'b'}, zapPeriod:3, par:14,
  hint:{cell:'3,3',text:L('Lightning strikes on a rhythm — cross while the tile rests.','Şimşek bir ritimle çarpar — kare dinlenirken geç.')},
  tutorial:[{cell:'3,3',text:L('Lightning zones flash on a beat. Time your start!','Şimşek bölgeleri bir ritimle çakar. Başlangıcını zamanla!')}] },

{ id:32, region:4, name:L('Double Flash','Çifte Çakış'), obj:L('Two zones, one safe window','İki bölge, bir güvenli an'),
  rows:['.......','...P...','...-...','...Z...','...Z...','...-...','...^...','...S...'],
  letters:{'5,3':'p'}, zapPeriod:4, par:14,
  hint:{cell:'6,3',text:L('Both zones share one clock. Enter early in the calm.','Her iki bölge tek saati paylaşır. Sakinken erken gir.')} },

{ id:33, region:4, name:L('Rush Hour','Yoğun Saat'), obj:L('Emergency mail — beat the clock!','Acil posta — saate karşı yarış!'),
  rows:['.......','.>---v.','.-...-.','.G...-.','.-...-.','.^Z<-<.','...-...','...S...'],
  letters:{'6,3':'g'}, stamps:['2,5'], timeLimit:25, zapPeriod:3, par:10,
  hint:{cell:'5,3',text:L('Left is fast but flashes. The long lap is calm — if the clock allows.','Sol hızlı ama çakıyor. Uzun tur sakin — saat izin verirse.')} },

{ id:34, region:4, name:L('Lulu\'s Debut','Lulu\'nun İlk Uçuşu'), obj:L('Lulu tanks one storm hit — use it!','Lulu bir fırtına darbesini kaldırır — kullan!'),
  rows:['.......','...Y...','...-...','...-...','...-...','...-...','...>...','...S...'],
  letters:{'2,3':'y'}, courier:'lulu', shield:1,
  movers:[{cells:[[3,2],[3,3],[3,4]],type:'storm',every:2}],
  par:16, hint:{cell:'6,3',text:L('Start when the storm drifts aside — or let Lulu shrug off one bump.','Fırtına kenara kayınca başla — ya da Lulu bir çarpmayı savuştursun.')},
  tutorial:[{cell:'6,3',text:L('Lulu\'s fluff absorbs ONE storm hit per flight!','Lulu\'nun tüyleri uçuş başına BİR fırtına darbesini emer!')}] },

{ id:35, region:4, name:L('Chime Path','Çan Yolu'), obj:L('Two deliveries between the flashes','Çakışlar arasında iki teslimat'),
  rows:['.......','.......','.rZdZl.','.B.-.P.','.u-^-u.','...-...','...S...'],
  letters:{'4,2':'b','4,4':'p'}, zapPeriod:3, par:24,
  hint:{cell:'4,3',text:L('Each corridor flashes on the same beat. Turn the middle breeze in flight.','Her koridor aynı ritimle çakar. Uçuşta ortadaki rüzgârı çevir.')} },

{ id:36, region:4, name:L('Storm Bridge','Fırtına Köprüsü'), obj:L('Build the bridge, then thread the lightning','Köprüyü kur, sonra şimşeğin arasından geç'),
  rows:['.......','.....G.','.r-d.Z.','.Y.-.-.','.u-^=u.','...-...','...S...'],
  letters:{'5,3':'y','3,5':'g'}, bridges:{'4,4':1}, zapPeriod:3, par:22,
  hint:{cell:'4,3',text:L('Yellow left builds the bridge. The last hop waits for calm skies.','Sarı sola köprüyü kurar. Son sıçrama sakin gökyüzünü bekler.')} },

{ id:37, region:4, name:L('Twin Tempest','İkiz Fırtına'), obj:L('The spine crackles on every pass','Orta hat her geçişte çatırdar'),
  rows:['.......','.......','.r-d-l.','.P.Z.B.','.u-^-u.','...-...','...-...','...S...'],
  letters:{'2,2':'b','2,4':'p'}, zapPeriod:4, par:26,
  hint:{cell:'4,3',text:L('One lap = one lightning cycle. Catch the beat once and every pass is safe.','Bir tur = bir şimşek döngüsü. Ritmi bir kez yakala, her geçiş güvenli olsun.')} },

{ id:38, region:4, name:L('Emergency Mail','Acil Posta'), obj:L('Two urgent letters, thirty seconds','İki acil mektup, otuz saniye'),
  rows:['.......','.......','.r-d-l.','.B.-.P.','.uZ^Zu.','...-...','...-...','...S...'],
  letters:{'6,3':'p','5,3':'b'}, timeLimit:30, zapPeriod:3, par:24,
  hint:{cell:'4,3',text:L('Pink right, dive back for blue, then left — the clock is ticking.','Pembe sağa, maviye geri dal, sonra sola — saat işliyor.')} },

{ id:39, region:4, name:L('The Gauntlet','Zorlu Geçit'), obj:L('Gate, lightning and a storm in one lane','Bir şeritte kapı, şimşek ve fırtına'),
  rows:['...G...','...%...','...Z...','...-...','...-...','...-...','...<...','...-...','...S...'],
  letters:{'5,3':'g'}, gates:{'1,3':{}}, zapPeriod:3,
  movers:[{cells:[[4,3],[4,4]],type:'storm',every:3}],
  par:18, hint:{cell:'6,3',text:L('Storm, lightning, sleepy gate — one calm beat threads all three.','Fırtına, şimşek, uykulu kapı — tek bir sakin an üçünü de aşar.')} },

{ id:40, region:4, name:L('Storm Valley Finale','Fırtına Vadisi Finali'), obj:L('Boss: Old Thunder! 3 letters in the tempest','Boss: Yaşlı Gök Gürültüsü! Fırtınada 3 mektup'),
  rows:['...Y...','...Z...','.r-v-l.','.B.-.P.','.uZ^Zu.','...-...','...-...','...S...'],
  letters:{'5,3':'p','2,4':'b','2,2':'y'}, stamps:['2,1'], zapPeriod:3,
  gentleStorm:true, par:36, boss:L('Old Thunder','Yaşlı Gök Gürültüsü'),
  hint:{cell:'4,3',text:L('Pink right, blue left, then rise through the thunder\'s rest.','Pembe sağa, mavi sola, sonra gök gürültüsü dinlenirken yüksel.')} },
];
