'use strict';

/* =========================================================================
   Laiko žemėlapis — see your own place across all of history.
   Left of the divider: the past (historical borders, an old regional map,
   or an old satellite photo). Right of it: today's map, same place.
   ========================================================================= */

// ---------- Data -----------------------------------------------------------

// Years available in data/world_*.geojson (historical-basemaps).
const HIST_YEARS = [
  -123000, -10000, -8000, -5000, -4000, -3000, -2000, -1500, -1000, -700, -500,
  -400, -323, -300, -200, -100, -1,
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1279, 1300,
  1400, 1492, 1500, 1530, 1600, 1650, 1700, 1715, 1783, 1800, 1815, 1878, 1880,
  1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994, 2000, 2010,
];
const histFile = (y) => `data/world_${y < 0 ? 'bc' + -y : y}.geojson`;

const DEFAULT_LOC = { lat: 54.6872, lng: 25.2797, name: 'Vilnius', example: true };
const START_YEAR = 1300;
const MOBILE_MQ = '(max-width: 1040px), (max-height: 520px)';

// Lithuanian names for polities and cultures. Keys are the exact NAME values in the data.
const LT = {
  // Lithuania and neighbours
  'Lithuania': (y) => (y < 1795 ? 'Lietuvos Didžioji Kunigaikštystė' : y < 1945 ? 'Lietuvos Respublika' : 'Lietuva'),
  'Poland-Lithuania': (y) => (y < 1569 ? 'Lenkija ir Lietuva (unija)' : 'Abiejų Tautų Respublika'),
  'Polish–Lithuanian Commonwealth': 'Abiejų Tautų Respublika',
  'Poland': (y, c) => (y >= 1569 && y < 1795 ? 'Abiejų Tautų Respublika'
    : y >= 1920 && y < 1939 && c && c.now === 'Lithuania' ? 'Lenkijos okupuotas Vilniaus kraštas' : 'Lenkija'),
  'Russian Empire': 'Rusijos imperija', 'Russia': 'Rusija',
  // The Baltic states were occupied, not ordinary Soviet republics (c.now = the present-day country).
  'USSR': (y, c) => {
    const occ = { Lithuania: 'Lietuvos', Latvia: 'Latvijos', Estonia: 'Estijos' }[c && c.now];
    return occ && y < 1991 ? `${occ} TSR (sovietinė okupacija)` : 'Sovietų Sąjunga (SSRS)';
  },
  'Germany': 'Vokietija', 'German Empire': 'Vokietijos imperija', 'Prussia': 'Prūsija', 'East Prussia': 'Rytų Prūsija',
  'Teutonic Knights': 'Kryžiuočių ordinas', 'Latvia': 'Latvija', 'Estonia': 'Estija',
  'Byelarus': 'Baltarusija', 'White Russia': (y) => (y === 1930 ? 'Sovietų Sąjunga (SSRS)' : 'Baltarusijos SSR'),
  'Ukraine': 'Ukraina', 'Kyivan Rus': 'Kijevo Rusia', 'Kievan Rus': 'Kijevo Rusia', "Rus' Khaganate": 'Rusios kaganatas',
  'Other Rus Principalities': 'Kitos Rusios kunigaikštystės', 'Principality of Polotsk': 'Polocko kunigaikštystė',
  'Principality of Kyiv': 'Kijevo kunigaikštystė', 'Principality of Novgorod': 'Naugardo kunigaikštystė',
  'Principality of Galicia-Volhynia': 'Haličo-Voluinės kunigaikštystė', 'Ryazan': 'Riazanės kunigaikštystė',
  'Pskov': 'Pskovo respublika', 'Novgorod': 'Naugardo respublika', 'Tsardom of Muscovy': 'Maskvos carystė',
  'Grand Duchy of Moscow': 'Maskvos didžioji kunigaikštystė', 'Danzig': 'Dancigo laisvasis miestas', 'Pomerania': 'Pomeranija',
  'Khanate of the Golden Horde': 'Aukso Orda', 'Golden Horde': 'Aukso Orda', 'Blue Horde': 'Mėlynoji Orda',
  'White Horde': 'Baltoji Orda', 'Nogai Horde': 'Nogajų Orda',
  // Peoples and archaeological cultures
  'Prussians': 'Prūsai', 'Baltic tribes': 'Baltų gentys', 'Balts': 'Baltai', 'Slavonic tribes': 'Slavų gentys',
  'Slavic tribes': 'Slavų gentys', 'Curonians': 'Kuršiai', 'Kurs': 'Kuršiai', 'Ests': 'Estai', 'Chuds': 'Čiudai',
  'Kryvichs': 'Krivičiai', 'Polanes': 'Polianai', 'Proto-Slavs': 'Protoslavai',
  'Brushed Pottery culture': 'Brūkšniuotosios keramikos kultūra', 'Milograd culture': 'Milogrado kultūra',
  'N. European Bronze Age cultures': 'Šiaurės Europos bronzos amžiaus kultūros', 'Nemay': 'Nemuno kultūra',
  'Narva': 'Narvos kultūra', 'Plain-Pottery culture': 'Dniepro-Dauguvos kultūra', 'Pomeranian culture': 'Pamario kultūra',
  'Sambian-Nothangian culture': 'Sembos ir Notangos kultūra', 'Western Masurian culture': 'Vakarų Mozūrų kultūra',
  'Eastern Masurian culture': 'Rytų Mozūrų kultūra', 'Bell-shaped burials culture': 'Varpo formos kapų kultūra',
  'Lusatian culture': 'Lužicų kultūra', 'Funnel-Beaker': 'Piltuvėlinių taurių kultūra',
  'Finno-Ugric taiga hunter-gatherers': 'Finougrų taigos medžiotojai-rinkėjai', 'Saami': 'Samiai', 'Sámi': 'Samiai',
  'Māori': 'Maoriai',
  // Europe and the world
  'Roman Empire': 'Romos imperija', 'Western Roman Empire': 'Vakarų Romos imperija', 'Eastern Roman Empire': 'Rytų Romos imperija',
  'Byzantine Empire': 'Bizantijos imperija', 'Holy Roman Empire': 'Šventoji Romos imperija', 'Ottoman Empire': 'Osmanų imperija',
  'Mongol Empire': 'Mongolų imperija', 'Empire of Alexander': 'Aleksandro Makedoniečio imperija',
  'Achaemenid Empire': 'Achemenidų imperija', 'Seleucid Kingdom': 'Seleukidų valstybė', 'Carthage': 'Kartagina',
  'Frankish Kingdom': 'Frankų karalystė', 'Franks': 'Frankai', 'Manchu Empire': 'Mandžiūrų (Čing) imperija',
  'Sweden': 'Švedija', 'Denmark': 'Danija', 'Norway': 'Norvegija', 'Finland': 'Suomija', 'Denmark-Norway': 'Danija-Norvegija',
  'Kalmar Union': 'Kalmaro unija', 'France': 'Prancūzija', 'Spain': 'Ispanija', 'Portugal': 'Portugalija',
  'Italy': 'Italija', 'Papal States': 'Popiežiaus valstybė', 'Venice': 'Venecija', 'Sicily': 'Sicilija', 'Sardinia': 'Sardinija',
  'Austria': 'Austrija', 'Austria Hungary': 'Austrija-Vengrija', 'Austrian Empire': (y) => (y < 1804 ? 'Habsburgų monarchija' : 'Austrijos imperija'),
  'Hungary': 'Vengrija', 'Czechoslovakia': 'Čekoslovakija', 'Czech Republic': 'Čekija', 'Slovakia': 'Slovakija',
  'Romania': 'Rumunija', 'Bulgaria': 'Bulgarija', 'Greece': 'Graikija', 'Greek city-states': 'Graikų miestai-valstybės',
  'Yugoslavia': 'Jugoslavija', 'Serbia': 'Serbija', 'Croatia': 'Kroatija', 'Albania': 'Albanija', 'Montenegro': 'Juodkalnija',
  'Netherlands': 'Nyderlandai', 'Belgium': 'Belgija', 'Luxembourg': 'Liuksemburgas', 'Switzerland': 'Šveicarija',
  'Swiss Confederation': 'Šveicarijos konfederacija', 'Moldova': 'Moldova', 'Georgia': 'Sakartvelas', 'Armenia': 'Armėnija',
  'Azerbaijan': 'Azerbaidžanas', 'Turkey': 'Turkija', 'Cyprus': 'Kipras', 'Egypt': 'Egiptas', 'Persia': 'Persija', 'Iran': 'Iranas',
  'Iraq': 'Irakas', 'Syria': 'Sirija', 'Israel': 'Izraelis', 'Saudi Arabia': 'Saudo Arabija', 'China': 'Kinija', 'Japan': 'Japonija',
  'Korea': 'Korėja', 'India': 'Indija', 'Mongolia': 'Mongolija', 'Kazakhstan': 'Kazachstanas', 'Tibet': 'Tibetas',
  'United States': 'Jungtinės Amerikos Valstijos', 'United States of America': 'Jungtinės Amerikos Valstijos',
  'Canada': 'Kanada', 'Mexico': 'Meksika', 'Brazil': 'Brazilija', 'Argentina': 'Argentina', 'Chile': 'Čilė', 'Peru': 'Peru',
  'Australia': 'Australija', 'New Zealand': 'Naujoji Zelandija', 'Morocco': 'Marokas', 'Algeria': 'Alžyras',
  'Tunisia': 'Tunisas', 'Ethiopia': 'Etiopija',
  'Iceland': 'Islandija', 'Kingdom of France': 'Prancūzijos karalystė', 'Carolingian Empire': 'Karolingų imperija',
  'West Francia': 'Vakarų Frankų karalystė', 'Neustria': 'Neustrija', 'Habsburg Netherlands': 'Habsburgų Nyderlandai',
  'Hallstatt culture': 'Halštato kultūra', 'La Tène culture': 'La Teno kultūra', 'Britany': 'Bretanė', 'Urnfield cultures': (y, c) => (c && c.bi ? 'Bronzos amžiaus kultūros' : 'Urnų laukų kultūros'),
  'Beaker': 'Varpinių taurių kultūra', 'Neanderthal': 'Neandertaliečiai',
  // The data's Urnfield polygon also covers the British Isles, which had their own Bronze Age cultures.
  // Britain and Ireland. The data draws Ireland as one polygon, often inside a British one, so some
  // labels depend on where on the island you are (c.ie = in Ireland, c.fs = in the later Free State).
  'Irlanda': 'Airija (gėlų karalystės)',
  'Celts': (y, c) => (c && c.ie ? 'Keltai (gėlai)' : 'Keltai'),
  'Celtic kingdoms': (y, c) => (c && c.ie ? (y >= 1171 ? 'Airija (gėlų karalystės ir anglonormanų Airijos lordystė)' : 'Airijos gėlų karalystės') : 'Keltų karalystės'),
  'English territory': (y, c) => (c && c.ie ? 'Airijos lordystė (Anglijos karaliaus valdos)' : 'Anglijos karaliaus valdos'),
  'England': (y, c) => (c && c.ie ? 'Airijos lordystė (Anglijos karūna)' : 'Anglijos karalystė'),
  'England and Ireland': (y, c) => {
    const cw = y >= 1649 && y < 1660; // the Commonwealth: no crown between 1649 and 1660
    if (c && c.ie) return y < 1542 ? 'Airijos lordystė' : cw ? 'Airija (Anglijos Respublikos užkariaujama)' : 'Airijos karalystė (Anglijos karūna)';
    return cw ? 'Anglijos Respublika (Sandrauga)' : 'Anglijos karalystė';
  },
  'Kingdom of Ireland': 'Airijos karalystė',
  'United Kingdom of Great Britain and Ireland': (y, c) => {
    if (y < 1922) return 'Jungtinė Didžiosios Britanijos ir Airijos Karalystė';
    if (c && c.ie && c.fs === true) return 'Airijos laisvoji valstybė';
    if (c && c.ie && c.fs === false) return 'Jungtinė Karalystė (Šiaurės Airija)';
    return 'Jungtinė Karalystė';
  },
  'United Kingdom': (y, c) => (y < 1801 ? 'Didžiosios Britanijos karalystė' : c && c.ie ? 'Jungtinė Karalystė (Šiaurės Airija)' : 'Jungtinė Karalystė'),
  'Ireland': (y) => (y < 1949 ? 'Airija (Éire)' : 'Airijos Respublika'),
  'Scotland': 'Škotijos karalystė', 'Angevin Empire': 'Anžu imperija', 'Wessex': 'Veseksas', 'Mercia': 'Mersija',
  'Northumbria': 'Nortumbrija', 'Kent': 'Kentas', 'Essex': 'Eseksas', 'Cantia': 'Kentas', 'Welsh': 'Velsiečių karalystės',
  'Picts': 'Piktai', 'Scots': 'Škotai (Dal Riata)', 'Anglo-Saxons': 'Anglosaksai', 'Dumnonia': 'Dumnonija',
  'Dumonii': 'Dumnonai', 'Rome (Constantinus)': 'Romos imperija (Konstancijaus Chloro valdos)', // the data's 'Constantinus' is Constantius I
};

// Corrupted names in the source data.
const NAME_FIX = { 'M?ori': 'Māori' };

// Famous maps. ll = where it was made, found or kept. img = Wikimedia Commons file of the map itself.
// noThumb = the Wikipedia article's lead picture is not the map, and no free image of the map exists.
const FAMOUS = [
  { y: -23000, when: '~25 000 pr. Kr.', t: 'Pavlovo mamuto ilties raižinys', ll: [48.874, 16.672], d: 'Mamuto iltyje išraižytos linijos, kurias dalis tyrinėtojų laiko upės ir kalvų žemėlapiu. Tai viena seniausių galimų žemėlapio užuominų, tačiau aiškinimas ginčijamas.' },
  { y: -11700, when: '~11 700 pr. Kr.', t: 'Abauntzo akmuo', ll: [42.95, -1.63], d: 'Akmens plokštė iš Abauntzo olos Navaroje, datuojama apie 13 660 metų prieš dabartį. Manoma, kad joje pavaizduoti aplinkiniai kalnai, upės ir gyvūnų bandos. Jei aiškinimas teisingas, tai seniausias žinomas vietovės žemėlapis Vakarų Europoje.' },
  { y: -6600, when: '~6600 pr. Kr.', t: 'Çatalhöyüko freska', ll: [37.667, 32.828], d: 'Sienos tapyba neolito mieste Anatolijoje. Dažnai aiškinama kaip namų planas su dviviršūniu Hasan Dağ ugnikalniu fone.', w: 'Çatalhöyük', noThumb: true },
  { y: -2300, when: '~2300 pr. Kr.', t: 'Ga-Sur molinė lentelė', ll: [35.38, 44.3], d: 'Nedidelė molinė lentelė iš Nuzi (dab. Irakas): upės slėnis tarp kalvų ir pasaulio kryptys. Dažnai vadinama seniausiu neginčijamu žemėlapiu.', w: 'Nuzi', img: 'CD-001a-Tablette de Ga-Sur.jpg' },
  { y: -1800, when: '~1900–1640 pr. Kr.', t: 'Saint-Bélec plokštė', ll: [48.08, -3.8], d: 'Bronzos amžiaus akmens plokštė iš Bretanės su iškaltu reljefu, upėmis ir gyvenvietėmis. Seniausias žinomas trimatis Europos teritorijos žemėlapis.', w: 'Saint-Bélec slab' },
  { y: -1300, when: '~1300 pr. Kr.', t: 'Nipuro miesto planas', ll: [32.13, 45.23], d: 'Molinė lentelė su Mesopotamijos miesto Nipuro šventyklomis, sienomis, vartais ir kanalais. Vienas seniausių masteliu braižytų miesto planų.', w: 'Nippur', img: 'Clay tablet containing plan of Nippur (Hilprecht EBL 1903).jpg' },
  { y: -1160, when: '~1160 pr. Kr.', t: 'Turino papiruso žemėlapis', ll: [25.73, 32.6], d: 'Egipto žemėlapis, sudarytas Ramzio IV laikais Wadi Hammamat ekspedicijai. Jame parodytos kasyklos, keliai ir uolienų spalvos, todėl jis laikomas pirmuoju geologiniu žemėlapiu.', w: 'Turin Papyrus Map', img: 'Turin Papyrus map part.jpg' },
  { y: -600, when: '~600 pr. Kr.', t: 'Babiloniečių pasaulio žemėlapis', ll: [33.06, 44.25], d: 'Molinė lentelė, kurioje pasaulis pavaizduotas kaip skritulys, apsuptas „karčiosios upės“, t. y. vandenyno. Babilonas pažymėtas prie Eufrato, kiek į šiaurę nuo centro. Seniausias žinomas pasaulio žemėlapis, rastas Sipare ir saugomas Britų muziejuje.', w: 'Babylonian Map of the World' },
  { y: -550, when: '~550 pr. Kr.', t: 'Anaksimandro pasaulio žemėlapis', ll: [37.53, 27.28], d: 'Graikų filosofas iš Mileto pirmasis nubraižė viso žinomo pasaulio žemėlapį. Žemėlapis neišliko, jis žinomas tik iš vėlesnių aprašymų. Paveiksle – šiuolaikinė rekonstrukcija.', w: 'Anaximander', img: 'Anaximander world map (mul).svg' },
  { y: -500, when: '~500 pr. Kr.', t: 'Hekatajo žemėlapis', ll: [37.45, 27.35], d: 'Hekatajas iš Mileto patobulino Anaksimandro žemėlapį ir parašė prie jo pridedamą pasaulio aprašymą. Pats žemėlapis rekonstruotas iš tekstų. Paveiksle – šiuolaikinė rekonstrukcija.', w: 'Hecataeus of Miletus', img: 'Hecataeus world map-en.svg' },
  { y: -500, when: 'VI–IV a. pr. Kr.', t: 'Bedolinos petroglifas', ll: [46.03, 10.33], d: 'Geležies amžiaus uolos raižinys Val Kamonikos slėnyje Italijoje: laukai, takai ir namai, matomi tarsi iš viršaus. Uola raižyta keliais etapais (apie 1000–200 m. pr. Kr.), o pati žemėlapio dalis datuojama VI–IV a. pr. Kr.', w: 'Bedolina Map' },
  { y: -239, when: '~239 pr. Kr.', t: 'Fangmatano žemėlapiai', ll: [34.58, 105.72], d: 'Ant medinių lentelių nupiešti Činų karalystės žemėlapiai iš kapo Gansu provincijoje. Seniausi žinomi Kinijos žemėlapiai.', w: 'Fangmatan', noThumb: true },
  { y: -220, when: '~220 pr. Kr.', t: 'Eratosteno pasaulio žemėlapis', ll: [31.2, 29.92], d: 'Aleksandrijos bibliotekos vedėjas apskaičiavo Žemės apimtį ir pirmasis žemėlapyje panaudojo lygiagretes bei dienovidinius. Paveiksle – XIX a. rekonstrukcija.', w: 'Eratosthenes', img: 'Mappa di Eratostene.jpg' },
  { y: -168, when: '~168 pr. Kr.', t: 'Mawangdui šilko žemėlapiai', ll: [28.2, 113.0], d: 'Hanų dinastijos topografinis ir karinis žemėlapiai, nupiešti ant šilko. Rasti kape Čangšoje.', w: 'Mawangdui Silk Texts', img: 'Mawangdui Topographic Map.jpg' },
  { y: 150, when: '~150 m.', t: 'Ptolemėjo „Geografija“', ll: [31.21, 29.96], d: 'Klaudijus Ptolemėjas surašė apie 8000 vietovių koordinates. IX a. veikalą perėmė arabų mokslininkai, o apie 1295 m. Bizantijoje Maksimo Planudo vadovaujami vienuoliai iš koordinačių atkūrė žemėlapius. Išvertus veikalą į lotynų kalbą (1406–1407 m., Florencija), Ptolemėjo žemėlapiai XV–XVI a. tapo Vakarų Europos kartografijos pagrindu.', w: "Ptolemy's world map" },
  { y: 205, when: '203–211 m.', t: 'Forma Urbis Romae', ll: [41.892, 12.487], d: 'Milžiniškas marmurinis Romos planas, iškaltas ant sienos. Išliko tik fragmentai, bet juose matyti kiekvienas pastatas.', w: 'Forma Urbis Romae' },
  { y: 250, when: '~230–260 m.', t: 'Dura-Europos skydo žemėlapis', ll: [34.75, 40.73], d: 'Romėnų kareivio skydas su nupieštu maršrutu palei Juodosios jūros krantą. Vienas seniausių išlikusių Europos dalies žemėlapių originalų.', w: 'Dura-Europos route map' },
  { y: 400, when: 'IV–V a. (XIII a. kopija)', t: 'Tabula Peutingeriana', ll: [48.206, 16.366], d: 'Beveik 7 metrų ilgio Romos imperijos kelių žemėlapis nuo Britanijos iki Indijos. Išliko XIII a. kopija, saugoma Vienoje.', w: 'Tabula Peutingeriana' },
  { y: 560, when: '~560 m.', t: 'Madabos mozaika', ll: [31.717, 35.794], d: 'Jordanijos bažnyčios grindų mozaika, vaizduojanti Jeruzalę ir Šventąją Žemę. Seniausias išlikęs šio regiono žemėlapis.', w: 'Madaba Map' },
  { y: 630, when: 'VII a.', t: 'T-O žemėlapiai (Izidorius Sevilietis)', ll: [37.389, -5.984], d: 'Schema, kurioje pasaulis padalytas į Aziją, Europą ir Afriką, atskirtas T formos vandenimis. Toks pasaulio vaizdas vyravo visus viduramžius.', w: 'T and O map' },
  { y: 700, when: '~700 m.', t: 'Dunhuango žvaigždėlapis', ll: [40.14, 94.66], d: 'Seniausias išlikęs viso dangaus žvaigždžių žemėlapis su daugiau nei 1300 žvaigždžių. Rastas Mogao olose Kinijoje.', w: 'Dunhuang Star Chart' },
  { y: 776, when: 'nuo 776 m.', t: 'Beato žemėlapiai', ll: [43.15, -4.62], d: 'Pasaulio žemėlapiai iš vienuolio Beato Apokalipsės komentarų, kelis šimtmečius perpiešinėti ispanų vienuolynuose.', w: 'Beatus map' },
  { y: 833, when: '~833 m.', t: 'al-Chorezmio „Žemės vaizdas“', ll: [33.315, 44.366], d: 'Bagdado Išminties namų mokslininkas patikslino Ptolemėjo koordinates ir sudarė naują pasaulio aprašą. Paveiksle – seniausias išlikęs Nilo žemėlapis iš jo veikalo.', w: 'Al-Khwarizmi', img: 'Earliest extant map of the Nile, in al-Khwārazmī’s Kitāb ṣūrat al- arḍ.jpg' },
  { y: 1072, when: '1072–1074 m.', t: 'Mahmudo al-Kašgario žemėlapis', ll: [41.02, 28.94], d: 'Apskritas pasaulio žemėlapis tiurkų kalbų žodyne „Dīwān Lughāt al-Turk“, kurį Mahmudas al-Kašgaris parašė Bagdade. Jo centre yra Balasagunas Vidurinėje Azijoje. Vienintelis išlikęs rankraštis saugomas Stambule.', w: 'Mahmud al-Kashgari', img: 'Mahmud al-Kashgari map.jpg' },
  { y: 1136, when: '1136 m.', t: 'Yu Ji Tu', ll: [34.26, 108.95], d: 'Kinijos žemėlapis, iškaltas akmens steloje, su tinkleliu, kurio vienas langelis atitinka 100 li. Upių ir krantų tikslumas stebina ir šiandien.', img: 'Yu Chi Thu.jpg' },
  { y: 1154, when: '1154 m.', t: 'al-Idrisio „Tabula Rogeriana“', ll: [38.116, 13.361], d: 'Arabų geografas sudarė jį Sicilijos karaliui Rogeriui II. Tai tiksliausias to meto pasaulio žemėlapis, kuriame pietūs nukreipti į viršų.', w: 'Tabula Rogeriana' },
  { y: 1275, when: '~1275 m.', t: 'Carta Pisana', ll: [43.716, 10.401], d: 'Seniausias išlikęs portolanas, t. y. jūrininkų žemėlapis (jūrlapis) su kompaso krypčių tinklu, vaizduojantis Viduržemio jūrą.', w: 'Carta Pisana' },
  { y: 1290, when: '~1234–1300 m.', t: 'Ebstorfo žemėlapis', ll: [53.03, 10.41], d: 'Didžiausias viduramžių pasaulio žemėlapis (3,6 × 3,6 m), kuriame Kristus apglėbia pasaulį. Originalas sudegė 1943 m., išliko kopijos.', w: 'Ebstorf Map' },
  { y: 1300, when: '~1300 m.', t: 'Herefordo Mappa Mundi', ll: [52.054, -2.716], d: 'Didžiausias išlikęs viduramžių pasaulio žemėlapis. Centre Jeruzalė, aplink ją Biblijos istorijos, pabaisos ir miestai.', w: 'Hereford Mappa Mundi' },
  { y: 1360, when: '~1360 m.', t: 'Gougho žemėlapis', ll: [51.754, -1.254], d: 'Seniausias išlikęs Didžiosios Britanijos kelių ir miestų žemėlapis, stebėtinai tikslus savo laikui.', w: 'Gough Map' },
  { y: 1375, when: '1375 m.', t: 'Katalonų atlasas', ll: [39.57, 2.65], d: 'Abraomo Kreskeso Majorkoje sukurtas pasaulio žemėlapis su Marko Polo kelionėmis ir Malio valdovu Musa, laikančiu aukso luitą.', w: 'Catalan Atlas', img: 'Atlas Catalan BnF btv1b52509636n Sheet 3.jpg' },
  { y: 1389, when: '1389 m.', t: 'Da Ming Hunyi Tu', ll: [32.06, 118.79], d: 'Mingų dinastijos pasaulio žemėlapis ant šilko, apimantis Kiniją, Aziją, Europą ir Afriką.', w: 'Da Ming Hunyi Tu' },
  { y: 1402, when: '1402 m.', t: 'Kangnido', ll: [37.57, 126.98], d: 'Korėjos pasaulio žemėlapis, kuriame parodyta ir Europa bei Afrika, likus 90 metų iki Kolumbo kelionės.', w: 'Gangnido' },
  { y: 1459, when: '~1450–1459 m.', t: 'Fra Mauro pasaulio žemėlapis', ll: [45.44, 12.33], d: 'Venecijos vienuolio žemėlapis, apibendrinęs viduramžių žinias. Jame jau matyti galimybė apiplaukti Afriką.', w: 'Fra Mauro map' },
  { y: 1472, when: '1472 m.', t: 'Pirmasis Europoje spausdintas žemėlapis', ll: [48.37, 10.9], d: 'Augsburge Güntherio Zainerio išspausdintoje Izidoriaus Seviliečio „Etimologijų“ laidoje buvo T-O schema. Tai pirmasis Europoje spausdintas žemėlapis. Kinijoje žemėlapiai buvo spausdinami jau XII a.', w: 'T and O map' },
  { y: 1492, when: '1492 m.', t: 'Behaimo gaublys „Erdapfel“', ll: [49.453, 11.077], d: 'Seniausias išlikęs Žemės gaublys, pagamintas Niurnberge. Amerikos jame dar nėra.', w: 'Behaim Globe' },
  { y: 1500, when: '1500 m.', t: 'Chuano de la Kosos žemėlapis', ll: [36.6, -6.23], d: 'Nubraižė Chuanas de la Kosa, Kolumbo flagmano „Santa Marija“ savininkas. Seniausias žinomas žemėlapis, kuriame pavaizduota Amerika.', w: 'Map of Juan de la Cosa' },
  { y: 1502, when: '1502 m.', t: 'Cantino planisfera', ll: [38.72, -9.14], d: 'Portugalų pasaulio žemėlapis, slapta išvežtas į Italiją. Jame pažymėta Tordesiljo linija, padalijusi pasaulį tarp Ispanijos ir Portugalijos.', w: 'Cantino planisphere' },
  { y: 1507, when: '1507 m.', t: 'Waldseemüllerio žemėlapis', ll: [48.28, 6.95], d: 'Žemėlapis, kuriame pirmą kartą užrašytas vardas „America“. 2003 m. JAV Kongreso biblioteka jį įsigijo už 10 mln. dolerių.', w: 'Waldseemüller map' },
  { y: 1513, when: '1513 m.', t: 'Piri Reiso žemėlapis', ll: [40.41, 26.67], d: 'Osmanų admirolas sudarė jį iš maždaug 20 šaltinių, tarp jų ir iš prarasto Kolumbo žemėlapio.', w: 'Piri Reis map' },
  { y: 1529, when: '1529 m.', t: 'Padrón Real (Diogo Ribeiro)', ll: [37.38, -5.99], d: 'Ispanijos karališkasis pagrindinis žemėlapis, į kurį buvo įrašomi visi nauji atradimai. Vienas pirmųjų mokslinių pasaulio žemėlapių.', w: 'Padrón Real' },
  { y: 1569, when: '1569 m.', t: 'Merkatoriaus pasaulio žemėlapis', ll: [51.43, 6.76], d: 'Gerardas Merkatorius sukūrė projekciją, kurioje pastovaus kurso linija yra tiesė. Ji iki šiol naudojama jūrų navigacijai ir internetiniams žemėlapiams.', w: 'Mercator 1569 world map', img: 'Mercator 1569.png' },
  { y: 1570, when: '1570 m.', t: 'Ortelijaus „Theatrum Orbis Terrarum“', ll: [51.22, 4.4], d: 'Pirmasis modernus atlasas: vienodo stiliaus žemėlapiai, surinkti į vieną knygą.', w: 'Theatrum Orbis Terrarum' },
  { y: 1602, when: '1602 m.', t: 'Matteo Ricci „Kunyu Wanguo Quantu“', ll: [39.9, 116.4], d: 'Jėzuito misionieriaus pasaulio žemėlapis kinų kalba, pirmą kartą Kinijai parodęs Ameriką.', w: 'Kunyu Wanguo Quantu', img: 'Kunyu Wanguo Quantu by Matteo Ricci All panels.jpg' },
  { y: 1609, when: '1609 m.', t: 'Pirmieji teleskopiniai Mėnulio piešiniai', ll: [45.407, 11.877], d: 'Thomas Harriotas Anglijoje ir Galilėjus Padujoje pirmieji nupiešė Mėnulio paviršių, matytą pro teleskopą. Paveiksle – Galilėjaus piešiniai.', w: 'Selenography', img: "Galileo's sketches of the moon.png" },
  { y: 1613, when: '1613 m.', t: 'Radvilų (Makovskio) LDK žemėlapis', ll: [53.22, 26.68], d: 'Mikalojaus Kristupo Radvilos Našlaitėlio užsakytas, Tomo Makovskio parengtas ir Amsterdame išspausdintas Lietuvos Didžiosios Kunigaikštystės žemėlapis. Pirmasis išsamus Lietuvos žemėlapis, perspausdinamas dar daugiau nei šimtmetį.', w: 'Radziwiłł map' },
  { y: 1620, when: '~1620 m.', t: 'Seldeno žemėlapis', ll: [24.87, 118.59], d: 'Kiniškas Rytų Azijos jūrų prekybos kelių žemėlapis, dabar saugomas Oksforde.', w: 'Selden Map' },
  { y: 1647, when: '1647 m.', t: 'Hevelijaus „Selenographia“', ll: [54.35, 18.65], d: 'Gdansko astronomas Johannesas Hevelijus išleido pirmąjį išsamų Mėnulio atlasą.', w: 'Selenographia, sive Lunae descriptio' },
  { y: 1662, when: '1662–1665 m.', t: 'Blaeu „Atlas Maior“', ll: [52.37, 4.89], d: 'Didžiausia ir brangiausia XVII a. knyga: 11 tomų ir apie 600 žemėlapių.', w: 'Atlas Maior' },
  { y: 1750, when: '1750–1815 m.', t: 'Cassini žemėlapis', ll: [48.853, 2.349], d: 'Keturių Cassini kartų sudarytas Prancūzijos žemėlapis. Pirmasis visos šalies žemėlapis, paremtas trianguliacija.', w: 'Cassini map' },
  { y: 1815, when: '1815 m.', t: 'Williamo Smitho geologinis žemėlapis', ll: [51.5, -0.13], d: 'Pirmasis visos šalies (Anglijos ir Velso) geologinis žemėlapis, parodęs uolienų sluoksnius.', w: 'William Smith (geologist)', img: 'Geological map Britain William Smith 1815.jpg' },
  { y: 1854, when: '1854 m.', t: 'Johno Snow choleros žemėlapis', ll: [51.513, -0.137], d: 'Snow pažymėjo mirties atvejus Londono Soho rajone ir parodė, kad jų šaltinis yra Broad Street vandens pompa. Taip gimė epidemiologija.', w: '1854 Broad Street cholera outbreak', img: 'Snow-cholera-map-1.jpg' },
  { y: 1869, when: '1869 m.', t: 'Minardo Napoleono žygio žemėlapis', ll: [54.9, 23.9], d: 'Charleso Minardo diagrama apie 1812 m. Napoleono žygį į Maskvą. Ji prasideda prie Kauno ir ten pat baigiasi: iš 422 000 karių grįžo apie 10 000. Laikoma vienu geriausių kada nors nubraižytų duomenų grafikų.', w: 'Charles Joseph Minard', img: 'Minard.png' },
  { y: 1877, when: '1877 m.', t: 'Schiaparellio Marso žemėlapis', ll: [45.472, 9.188], d: 'Milano astronomas nubraižė Marsą su „kanalais“. Šis žodis sukėlė ilgametę Marso gyventojų maniją.', w: 'Martian canals', img: 'Karte Mars Schiaparelli MKL1888.png' },
  { y: 1933, when: '1933 m.', t: 'Harry Becko Londono metro schema', ll: [51.507, -0.128], d: 'Schema, kurioje svarbūs ne atstumai, o jungtys. Ji tapo pavyzdžiu viso pasaulio transporto schemoms.', w: 'Tube map', noThumb: true },
  { y: 1972, when: '1972 m.', t: '„Blue Marble“ ir Landsat', ll: [29.56, -95.09], d: '„Apollo 17“ įgula nufotografavo visą Žemę. Tais pačiais metais paleistas Landsat palydovas pradėjo sistemingai kartografuoti planetą iš kosmoso.', w: 'The Blue Marble' },
  { y: 1977, when: '1957–1977 m.', t: 'Marie Tharp vandenyno dugno žemėlapiai', ll: [41.004, -73.908], d: 'Tharp iš echolotų duomenų nubraižė Atlanto vandenyno dugno kalnagūbrį ir padėjo įrodyti žemynų dreifą.', w: 'Marie Tharp', img: 'Heezen and Tharp Bathymetric Map of the World, 1977.jpg' },
  { y: 2004, when: '2004 m.', t: 'OpenStreetMap', ll: [51.52, -0.1], d: 'Laisvas pasaulio žemėlapis, kurį kuria milijonai savanorių. Šios programėlės gatvių sluoksnis taip pat iš jo.', w: 'OpenStreetMap', img: 'OpenStreetMap homepage.png' },
  { y: 2005, when: '2005 m.', t: 'Google Maps ir Google Earth', ll: [37.422, -122.084], d: 'Interaktyvūs žemėlapiai ir palydovų nuotraukos tapo prieinami kiekvienam naršyklėje, o vėliau ir telefone.', w: 'Google Maps', noThumb: true },
];

FAMOUS.push(...(window.EXTRA_FAMOUS || []));
FAMOUS.sort((a, b) => a.y - b.y);

// Georeferenced historical maps of particular regions (regional.js). Maps whose providers allow only
// personal or local use appear only when the app runs on this computer.
const IS_LOCAL = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname);
const REGIONAL = (window.REGIONAL_MAPS || []).filter((r) => IS_LOCAL || r.license === 'open');

// Historical events (events.js). scope: 'lt' present-day Lithuania, 'ie' island of Ireland,
// 'ni' Northern Ireland, 'roi' Republic of Ireland, 'near' within near[2] km of [near[0], near[1]].
const EVENTS = (window.EVENTS || []).map((e, i) => ({ ...e, i }));
const EVENT_KIND = {
  state: 'Valstybė', war: 'Karas', occupation: 'Okupacija', repression: 'Represijos',
  culture: 'Kultūra', disaster: 'Nelaimė', peace: 'Taika', other: 'Įvykis',
};

// ---------- Helpers --------------------------------------------------------

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
// Lithuanian style: 4-digit years stay unspaced (8000), 5+ digits get a space (123 000).
const fmtNum = (n) => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : String(n));
const fmtYear = (y) => (y < 0 ? `${fmtNum(-y)} m. pr. Kr.` : `${y} m.`);
const fmtYearShort = (y) => (y < 0 ? `${fmtNum(-y)} pr. Kr.` : `${y}`);
function fmtSpan(a, b) {
  if (a === b) return fmtYearShort(a);
  const sep = Math.abs(a) >= 10000 || Math.abs(b) >= 10000 ? ' – ' : '–';
  if (a >= 0) return `${a}${sep}${b}`;
  if (b < 0) return `${fmtNum(-a)}${sep}${fmtNum(-b)} pr. Kr.`;
  return `${fmtNum(-a)} pr. Kr. – ${b} po Kr.`;
}
const fmtCoord = (v, pos, neg) => `${Math.abs(v).toFixed(4).replace('.', ',')}° ${v >= 0 ? pos : neg}`;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
};
const mobile = () => window.matchMedia(MOBILE_MQ).matches;

function era(y, kind) {
  if (kind === 'sat') return 'palydovų archyvas';
  if (kind === 'map') return `${era(y, 'hist')} · senasis žemėlapis`;
  if (y < -100000) return 'paleolitas · tarpledynmetis';
  if (y < -10000) return 'paleolitas · ledynmetis';
  if (y < -3000) return 'mezolitas ir neolitas';
  if (y < -800) return 'bronzos amžius';
  if (y < 0) return 'geležies amžius · antika';
  if (y < 476) return 'antika';
  if (y < 1492) return 'viduramžiai';
  if (y < 1789) return 'naujieji laikai';
  if (y < 1914) return 'imperijų amžius';
  if (y < 1991) return 'XX amžius';
  return 'šiuolaikinis pasaulis';
}

function cleanName(s) {
  if (!s) return null;
  const t = String(s).replace(/�/g, '').replace(/\s+/g, ' ').trim();
  if (!t || /^\?+$/.test(t)) return null; // a '?' placeholder polygon at -200 means no data
  return NAME_FIX[t] || t;
}
function ltName(raw, year, ctx) {
  const orig = cleanName(raw);
  if (!orig) return null;
  const tr = LT[orig] ?? LT[orig.replace(/-/g, ' ')] ?? LT[orig.replace(/ /g, '-')];
  const lt = typeof tr === 'function' ? tr(year, ctx) : tr;
  return { lt: lt || orig, orig: lt && lt !== orig ? orig : null };
}

function hue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}

// ---------- Border data: download once, index once -------------------------

// Parsed GeoJSON kept only for drawing (small LRU). The lookup index is kept for every year.
const gjCache = new Map();
const geoInflight = new Map();
const idxCache = new Map();

function ringHasF(a, x, y) { // a = Float32Array [x0,y0,x1,y1,...]
  let inside = false;
  for (let i = 0, j = a.length - 2; i < a.length; j = i, i += 2) {
    const xi = a[i], yi = a[i + 1], xj = a[j], yj = a[j + 1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function buildIndex(gj) {
  const out = [];
  gj.features.forEach((f, fi) => {
    const g = f.geometry;
    if (!g) return;
    const src = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    const polys = src.map((p) => {
      const bb = [Infinity, Infinity, -Infinity, -Infinity];
      const rings = p.map((r, ri) => {
        const a = new Float32Array(r.length * 2);
        for (let i = 0; i < r.length; i++) {
          const x = r[i][0], y = r[i][1];
          a[2 * i] = x; a[2 * i + 1] = y;
          if (ri === 0) { if (x < bb[0]) bb[0] = x; if (x > bb[2]) bb[2] = x; if (y < bb[1]) bb[1] = y; if (y > bb[3]) bb[3] = y; }
        }
        return a;
      });
      return { bb, rings };
    });
    out.push({ fi, name: cleanName(f.properties && f.properties.NAME), polys });
  });
  return out;
}

// The polity at a point. A named polygon beats an unnamed one that overlaps it.
function lookupStrict(idx, lat, lng) {
  let unnamed = null;
  for (const e of idx) {
    for (const p of e.polys) {
      const b = p.bb;
      if (lng < b[0] || lng > b[2] || lat < b[1] || lat > b[3]) continue;
      if (!ringHasF(p.rings[0], lng, lat)) continue;
      let hole = false;
      for (let k = 1; k < p.rings.length; k++) if (ringHasF(p.rings[k], lng, lat)) { hole = true; break; }
      if (hole) continue;
      if (e.name) return { e, approx: false };
      unnamed = unnamed || e;
      break;
    }
  }
  return unnamed ? { e: unnamed, approx: false } : null;
}

// Simplified coastlines miss many coastal towns in almost every year. For such a
// place the nearest named polygon within 25 km is used and marked approximate.
// An inland place that is missing only in a few years is a real data gap and stays empty.
const COAST_YEARS = HIST_YEARS.filter((y) => y >= 1279);
const coastCache = new Map();
function isCoastal(lat, lng) {
  const key = `${lat}|${lng}`;
  const c = coastCache.get(key);
  const ready = COAST_YEARS.filter((y) => idxCache.get(y));
  if (c && c.n === ready.length) return c.v;
  const miss = ready.filter((y) => !lookupStrict(idxCache.get(y), lat, lng)).length;
  const v = ready.length > 0 && miss / ready.length > 0.5;
  if (coastCache.size > 100) coastCache.clear();
  coastCache.set(key, { n: ready.length, v });
  return v;
}

function lookup(idx, lat, lng) {
  const hit = lookupStrict(idx, lat, lng);
  if (hit && hit.e.name) return hit;
  if (isCoastal(lat, lng)) {
    const near = nearest(idx, lat, lng, 25);
    if (near) return { e: near, approx: true };
  }
  return hit;
}

function nearest(idx, lat, lng, maxKm) {
  const k = Math.cos((lat * Math.PI) / 180);
  const pad = maxKm / 111;
  let best = null, bestD = pad;
  for (const e of idx) {
    if (!e.name) continue;
    for (const p of e.polys) {
      const b = p.bb;
      if (lng < b[0] - pad / Math.max(k, 0.1) || lng > b[2] + pad / Math.max(k, 0.1) || lat < b[1] - pad || lat > b[3] + pad) continue;
      for (const a of p.rings) {
        for (let i = 2; i < a.length; i += 2) {
          const ax = (a[i - 2] - lng) * k, ay = a[i - 1] - lat, bx = (a[i] - lng) * k, by = a[i + 1] - lat;
          const dx = bx - ax, dy = by - ay;
          const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)));
          const d = Math.hypot(ax + t * dx, ay + t * dy);
          if (d < bestD) { bestD = d; best = e; }
        }
      }
    }
  }
  return best;
}

function fetchGeo(year) {
  if (geoInflight.has(year)) return geoInflight.get(year);
  const p = fetch(histFile(year), { cache: 'force-cache' })
    .then((r) => { if (!r.ok) throw new Error(`${r.status} ${histFile(year)}`); return r.json(); })
    .then((gj) => { if (!idxCache.has(year)) idxCache.set(year, buildIndex(gj)); return gj; })
    .finally(() => geoInflight.delete(year));
  geoInflight.set(year, p);
  return p;
}

// For drawing: keep the parsed file in a 6-entry LRU.
async function loadHist(year) {
  if (gjCache.has(year)) { const gj = gjCache.get(year); gjCache.delete(year); gjCache.set(year, gj); return gj; }
  const gj = await fetchGeo(year);
  gjCache.set(year, gj);
  while (gjCache.size > 6) gjCache.delete(gjCache.keys().next().value);
  return gj;
}

// Build the index for every year in the background (4 downloads at a time).
let indexing = false;
function ensureIndex() {
  if (indexing) return;
  const queue = HIST_YEARS.filter((y) => !idxCache.has(y));
  if (!queue.length) return;
  indexing = true;
  const worker = async () => {
    for (let y; (y = queue.shift()) !== undefined;) {
      if (idxCache.has(y)) continue;
      try { await fetchGeo(y); } catch { idxCache.set(y, null); }
      refreshHistory();
    }
  };
  Promise.all(Array.from({ length: 4 }, worker)).finally(() => { indexing = false; refreshHistory(); refreshStops(); });
}

function hereAt(year) {
  if (!idxCache.has(year)) return undefined;
  const idx = idxCache.get(year);
  if (!idx) return { failed: true };
  const hit = lookup(idx, state.loc.lat, state.loc.lng);
  return hit ? { name: ltName(hit.e.name, year, placeCtx(state.loc.lat, state.loc.lng)), fi: hit.e.fi, approx: hit.approx } : { name: null };
}

// Where a point is: in the British Isles (bi), on the island of Ireland (ie; Kintyre and the sea off
// Pembrokeshire excluded), and in the later Free State (fs, from the 1938 data, which separates Éire from
// Northern Ireland; coastal places use the nearest 1938 polygon like every other year).
function placeCtx(lat, lng) {
  const bi = lat > 49.85 && lat < 61 && lng > -11 && lng < 1.8 && !(lat < 50.2 && lng > -1) && !(lat < 51.05 && lng > 1.4);
  const i10 = idxCache.get(2010);
  const h10 = i10 ? lookup(i10, lat, lng) : null;
  const now = (h10 && h10.e.name) || null;
  const ie = lat > 51.38 && lat < 55.46 && lng > -10.76 && lng < -5.39 && !(lat > 55.25 && lng > -6.05) && !(lat < 52.0 && lng > -6.0);
  if (!ie) return { ie: false, bi, now };
  const idx = idxCache.get(1938);
  const h = idx ? lookup(idx, lat, lng) : null;
  return { ie: true, bi, now, fs: h && h.e.name ? h.e.name === 'Ireland' : null };
}

// ---------- State ----------------------------------------------------------

const state = {
  loc: store.get('tm.loc') || { ...DEFAULT_LOC },
  wayback: [],
  stops: [],
  idx: 0,
  mode: 'compare',
  divider: 0.5,
  picking: false,
  history: [],
  famousSel: -1,
  openEvents: new Set(),
  filters: { hist: true, maps: true, events: true, ...(store.get('tm.filters') || {}) },
};

const inBox = (b, lat, lng) => lat >= b[0][0] && lat <= b[1][0] && lng >= b[0][1] && lng <= b[1][1];
function regionalFor(lat, lng) {
  return REGIONAL.filter((r) => (r.counties ? Object.values(r.counties) : r.covers || [r.cover || r.bounds]).some((b) => inBox(b, lat, lng))
    && (!r.country || inCountry(r.country, lat, lng)) && (!r.probe || probeOk(r, lat, lng)));
}

// Present-day country at a point, from the 2010 border data (true until that file is loaded).
function inCountry(name, lat, lng) {
  const idx = idxCache.get(2010);
  if (!idx) return true;
  const h = lookup(idx, lat, lng);
  return !!(h && h.e.name === name);
}

// Patchy services (e.g. the 1944 aerial photos): ask the server for a 4x4 image at the place.
// The first call answers "no"; when the server says yes, the timeline is rebuilt.
const probeCache = new Map();
function probeOk(r, lat, lng) {
  const k = `${r.id}|${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (probeCache.has(k)) return probeCache.get(k) === true;
  probeCache.set(k, null);
  const p = L.CRS.EPSG3857.project(L.latLng(lat, lng)), d = 20;
  fetch(`${r.url}/export?bbox=${p.x - d},${p.y - d},${p.x + d},${p.y + d}&bboxSR=3857&imageSR=3857&size=4,4&format=png&transparent=true&f=image`)
    .then((res) => res.blob()).then(createImageBitmap).then((bmp) => {
      const c = document.createElement('canvas');
      c.width = c.height = 4;
      const g = c.getContext('2d');
      g.drawImage(bmp, 0, 0);
      const ok = g.getImageData(2, 2, 1, 1).data[3] > 0;
      probeCache.set(k, ok);
      if (ok && state.loc.lat.toFixed(3) === lat.toFixed(3) && state.loc.lng.toFixed(3) === lng.toFixed(3)) refreshStops();
    })
    .catch(() => probeCache.set(k, false));
  return false;
}

function kmBetween(lat1, lng1, lat2, lng2) {
  const r = Math.PI / 180;
  const a = Math.sin(((lat2 - lat1) * r) / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(((lng2 - lng1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

// Events that concern a place (needs the 2010 and 1938 border data for country / Free State).
function eventsFor(lat, lng) {
  const c = placeCtx(lat, lng);
  return EVENTS.filter((e) => {
    if (e.scope === 'lt') return c.now === 'Lithuania';
    if (e.scope === 'ie') return c.ie;
    if (e.scope === 'ni') return c.ie && c.fs === false;
    if (e.scope === 'roi') return c.ie && c.fs === true;
    if (e.scope === 'near') return !!e.near && kmBetween(lat, lng, e.near[0], e.near[1]) <= e.near[2];
    return false;
  }).sort((a, b) => a.from - b.from || a.to - b.to);
}

// Rebuild the timeline for the same place (a map became available), keeping the selected stop.
function refreshStops() {
  const i = rebuildStops();
  state.idx = i;
  range.value = i;
  renderHistory();
}

function buildStops() {
  const hist = HIST_YEARS.map((y) => ({ year: y, kind: 'hist' }));
  const maps = regionalFor(state.loc.lat, state.loc.lng).map((r) => ({ year: r.year, kind: 'map', map: r }));
  const past = [...hist, ...maps].sort((a, b) => a.year - b.year || (a.kind === 'hist' ? -1 : 1));
  const sat = state.wayback.map((w) => ({ year: w.year, kind: 'sat', id: w.id, date: w.date, credit: w.credit }));
  return [...past, ...sat];
}
const stopKey = (s) => (s ? `${s.kind}|${s.year}|${s.map ? s.map.id : s.id || ''}` : '');

function rebuildStops() {
  const old = state.stops[state.idx];
  const cur = stopKey(old);
  state.stops = buildStops();
  range.max = state.stops.length - 1;
  let i = state.stops.findIndex((s) => stopKey(s) === cur);
  if (i < 0) i = nearestStop(old ? old.year : START_YEAR, (s) => s.kind === 'hist');
  renderTicks();
  return i;
}

function nearestStop(year, filter = () => true) {
  let best = 0, bd = Infinity;
  state.stops.forEach((s, i) => { if (!filter(s)) return; const d = Math.abs(s.year - year); if (d < bd) { bd = d; best = i; } });
  return best;
}

// ---------- Map ------------------------------------------------------------

const map = L.map('map', { zoomControl: false, worldCopyJump: true, minZoom: 2, maxZoom: 19 })
  .setView([state.loc.lat, state.loc.lng], 6);
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);
// Esri relief or imagery is on screen in almost every view, so its required credit sits in the prefix once.
map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a> | Powered by <a href="https://www.esri.com/">Esri</a>');
// Place names in the search and the location card come from OpenStreetMap, whatever base map is shown.
map.attributionControl.addAttribution('Vietovardžiai: <a href="https://nominatim.openstreetmap.org/">Nominatim</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>');

map.createPane('thenTiles').style.zIndex = 300;
// County sheets get their own pane so their paper margins blend only with each other (see .county-sheet).
map.createPane('thenCounties').style.zIndex = 301;
map.createPane('thenVec').style.zIndex = 410;
map.createPane('famousPane').style.zIndex = 620;
map.createPane('mePane').style.zIndex = 660;

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services';
// Esri basemaps through the owner's ArcGIS Location Platform API key. The key has only the Basemaps
// privilege, works only from https://audriusg2.github.io and http://localhost:8777, and expires on
// 2027-09-24 (renew it in the ArcGIS item "Laiko zemelapis"). Elsewhere the keyless endpoints are used.
const ESRI_KEY = 'AAPTaOrUz2Z_bzBjUQ3LaFk0VgA..8xbv2D65etBmihm5oSDCFN1GRl0eK1hiLbRa9WjOBYaagfQBxDt3Q5W7v0g0muOQcM4Rjbm3ui6AZp2WUm80fhN3yqjUSZS41qV18mAfdeAFNUCLF0x07vKkJOKGJIiraOi4Jz-ghAQMwDRYVQeBFWczQgPLL237tqc_WXB0DSxU-YJU-W8kD5X_I3w-8krbzoVgyhNjY4YfPEuD3Kxxchd1wiqe24ZmL7uxucglaNtBwcgNKsonkthwAT1_aF47qky3';
const ESRI_KEYED = location.hostname === 'audriusg2.github.io' || (location.hostname === 'localhost' && location.port === '8777');
const ESRI_API = 'https://ibasemaps-api.arcgis.com/arcgis/rest/services';
const esriTiles = (keyed, legacy) => (ESRI_KEYED ? `${ESRI_API}/${keyed}/MapServer/tile/{z}/{y}/{x}?token=${ESRI_KEY}` : `${ESRI}/${legacy}/MapServer/tile/{z}/{y}/{x}`);
const NOW_LAYERS = {
  osm: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }),
  sat: L.tileLayer(esriTiles('World_Imagery', 'World_Imagery'), {
    maxNativeZoom: 18, maxZoom: 19, attribution: 'Palydovas: Esri, Vantor, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
  }),
  topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxNativeZoom: 17, maxZoom: 19, attribution: 'Duomenys: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Stilius: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }),
};
let nowKey = store.get('tm.base') || 'osm';
if (!NOW_LAYERS[nowKey]) nowKey = 'osm';
NOW_LAYERS[nowKey].addTo(map);
$('#base-select').value = nowKey;

const reliefLayer = L.tileLayer(esriTiles('Elevation/World_Hillshade', 'World_Shaded_Relief'), {
  pane: 'thenTiles', maxNativeZoom: ESRI_KEYED ? 16 : 13, maxZoom: 19,
  attribution: ESRI_KEYED ? 'Reljefas: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FEMA, Intermap and the GIS user community' : 'Reljefas: &copy; 2014 Esri',
});

// Wayback releases lack z18–19 tiles in many places: fall back to z17 and upscale.
const WaybackLayer = L.TileLayer.extend({
  createTile(coords, done) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const load = (z) => {
      const d = coords.z - z, f = 1 << d, s = 256 / f;
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, (coords.x % f) * s, (coords.y % f) * s, s, s, 0, 0, 256, 256); done(null, c); };
      img.onerror = () => (z > 17 ? load(z - 1) : done(new Error('wayback tile missing'), c));
      img.src = L.Util.template(this._url, { x: coords.x >> d, y: coords.y >> d, z });
    };
    load(coords.z);
    return c;
  },
});

// ArcGIS "export" as 256px tiles in Web Mercator.
const ArcExportLayer = L.TileLayer.extend({
  getTileUrl(coords) {
    const size = this.getTileSize();
    const nw = coords.scaleBy(size);
    const se = nw.add(size);
    const a = map.options.crs.project(map.unproject(nw, coords.z));
    const b = map.options.crs.project(map.unproject(se, coords.z));
    const bbox = [a.x, b.y, b.x, a.y].join(',');
    const extra = this.options.params ? `&${this.options.params}` : '';
    return `${this._url}/export?bbox=${bbox}&bboxSR=3857&imageSR=3857&size=${size.x},${size.y}&format=${this.options.format || 'png32'}&transparent=true&f=image${extra}`;
  },
});

const BLANK_TILE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
function regionalLayer(r) {
  if (r._layer) return r._layer;
  // Hidden below the zoom the source serves; enlarged above its last real zoom.
  const common = { pane: 'thenTiles', minZoom: r.minZoom, maxZoom: 19, maxNativeZoom: r.maxZoom, errorTileUrl: BLANK_TILE };
  if (r.kind === 'counties') {
    // Each county sheet has opaque paper outside the county; 'darken' lets the neighbour show through it.
    r._layer = L.layerGroup(Object.entries(r.counties).map(([county, b], i) =>
      L.tileLayer(r.url, { ...common, pane: 'thenCounties', className: 'county-sheet', ...(i === 0 ? { attribution: r.attribution } : {}), county, bounds: L.latLngBounds(b) })));
  } else if (r.kind === 'stack') {
    // Several sub-layers of one atlas, the most detailed last so it is drawn on top.
    r._layer = L.layerGroup(r.subs.map(([sub, maxNative], i) =>
      L.tileLayer(r.url, { ...common, sub, maxNativeZoom: maxNative, bounds: L.latLngBounds(r.bounds), ...(i === 0 ? { attribution: r.attribution } : {}) })));
  } else if (r.kind === 'arcgis-export') {
    r._layer = new ArcExportLayer(r.url, { ...common, bounds: L.latLngBounds(r.bounds), attribution: r.attribution, format: r.format });
  } else {
    r._layer = L.tileLayer(r.url, { ...common, bounds: L.latLngBounds(r.bounds), attribution: r.attribution });
  }
  return r._layer;
}

let thenLayers = [];
function setThenTiles(layers) {
  if (layers.length === thenLayers.length && layers.every((l, i) => l === thenLayers[i])) return;
  thenLayers.forEach((l) => { if (!layers.includes(l)) map.removeLayer(l); });
  layers.forEach((l) => { if (!map.hasLayer(l)) l.addTo(map); });
  thenLayers = layers;
}

const histRenderer = L.canvas({ pane: 'thenVec', padding: 0.5 });
let histLayer = null;
const waybackLayers = {};
const HIST_ATTR = 'Istorinės sienos: <a href="https://github.com/aourednik/historical-basemaps">historical-basemaps</a>';

// ---------- Compare divider -----------------------------------------------

const stage = $('#stage');
const divider = $('#divider');
const knob = $('#divider-knob');
const range = $('#tl-range');

function dividerPx() { return Math.round(stage.clientWidth * state.divider); }

function updateClip() {
  const panes = [map.getPane('thenTiles'), map.getPane('thenCounties'), map.getPane('thenVec')];
  panes.forEach((p) => { p.style.display = state.mode !== 'now' ? '' : 'none'; });
  divider.hidden = state.mode !== 'compare';
  if (state.mode !== 'compare') { panes.forEach((p) => { p.style.clip = ''; }); return; }
  const nw = map.containerPointToLayerPoint([0, 0]);
  const se = map.containerPointToLayerPoint(map.getSize());
  const px = dividerPx();
  const x = nw.x + px;
  panes.forEach((p) => { p.style.clip = `rect(${nw.y}px, ${x}px, ${se.y}px, ${nw.x}px)`; });
  divider.style.left = `${px}px`;
  const pct = Math.round(state.divider * 100);
  knob.setAttribute('aria-valuenow', pct);
  knob.setAttribute('aria-valuetext', `${pct} %`);
  // Hide a side tag when its side is too narrow to hold it.
  const W = stage.clientWidth;
  const tt = $('#tag-then'), tn = $('#tag-now');
  tt.style.visibility = px >= tt.offsetWidth + 20 ? '' : 'hidden';
  tn.style.visibility = W - px >= tn.offsetWidth + 60 ? '' : 'hidden';
}
map.on('move zoom resize viewreset', updateClip);
// #stage is the 1fr grid row above #timeline, whose height changes with its text.
new ResizeObserver(() => map.invalidateSize({ pan: false })).observe(stage);
new ResizeObserver(() => divider.style.setProperty('--tag-bottom', `${$('#controls').offsetHeight + 54}px`)).observe($('#controls'));
if (document.fonts) document.fonts.ready.then(() => { updateClip(); renderTicks(); });

(function initDrag() {
  let dragging = false;
  const move = (e) => {
    if (!dragging) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) { dragging = false; return; }
    const r = stage.getBoundingClientRect();
    state.divider = Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width));
    updateClip();
  };
  const stop = () => { dragging = false; };
  knob.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true; knob.setPointerCapture(e.pointerId); e.preventDefault();
  });
  knob.addEventListener('pointermove', move);
  knob.addEventListener('pointerup', stop);
  knob.addEventListener('pointercancel', stop);
  knob.addEventListener('lostpointercapture', stop);
  knob.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -0.03, ArrowDown: -0.03, ArrowRight: 0.03, ArrowUp: 0.03 }[e.key];
    if (step) state.divider = Math.min(0.97, Math.max(0.03, state.divider + step));
    else if (e.key === 'Home') state.divider = 0.03;
    else if (e.key === 'End') state.divider = 0.97;
    else return;
    updateClip(); e.preventDefault(); e.stopPropagation();
  });
  L.DomEvent.disableClickPropagation(knob);
})();

// ---------- My location ----------------------------------------------------

const meMarker = L.marker([state.loc.lat, state.loc.lng], {
  pane: 'mePane', keyboard: false,
  icon: L.divIcon({ className: '', html: '<div class="me-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }),
}).addTo(map);
meMarker.bindTooltip('…', { permanent: true, direction: 'top', offset: [0, -14], className: 'here-tip' });

// Show the pin on the world copy nearest the view centre.
function nearCopy(lng) { const c = map.getCenter().lng; return lng + 360 * Math.round((c - lng) / 360); }
function placeMe() { meMarker.setLatLng([state.loc.lat, nearCopy(state.loc.lng)]); }
map.on('move', placeMe);

function renderLoc() {
  const { lat, lng, name, example } = state.loc;
  $('#loc-name').textContent = name || 'Pasirinkta vieta';
  $('#loc-coords').textContent = `${fmtCoord(lat, 'Š', 'P')}; ${fmtCoord(lng, 'R', 'V')}`;
  const note = $('#loc-note');
  note.classList.remove('warn', 'busy');
  note.textContent = example ? 'Pavyzdinė vieta. Paspausk „Rasti mane“ arba pasirink savo.' : 'Vietą perkelsi ir dešiniuoju pelės mygtuku žemėlapyje.';
  placeMe();
}

function stopPicking() {
  state.picking = false;
  document.body.classList.remove('picking');
  $('#btn-pick').textContent = 'Pasirinkti žemėlapyje';
  $('#btn-pick').setAttribute('aria-pressed', 'false');
}
const closeResults = () => { $('#search-results').hidden = true; };

function setLocation(lat, lng, name, opts = {}) {
  stopPicking();
  closeResults();
  lng = ((((lng + 180) % 360) + 360) % 360) - 180;
  state.loc = { lat, lng, name, example: !!opts.example };
  store.set('tm.loc', state.loc);
  renderLoc();
  if (opts.fly !== false) map.flyTo([lat, nearCopy(lng)], Math.max(map.getZoom(), opts.zoom || 6), { duration: 0.8 });
  const i = rebuildStops();
  cancelReverseGeocode();
  if (!name) reverseGeocodeSoon(lat, lng);
  setStop(i);
  computeHistory();
}

// Nominatim allows at most one request per second.
let geoTimer = 0, geoCtl = null, geoLast = 0;
function cancelReverseGeocode() {
  clearTimeout(geoTimer); geoTimer = 0;
  if (geoCtl) { geoCtl.abort(); geoCtl = null; }
}
function reverseGeocodeSoon(lat, lng) {
  const wait = Math.max(0, geoLast + 1100 - Date.now());
  geoTimer = setTimeout(() => {
    geoLast = Date.now();
    geoCtl = new AbortController();
    reverseGeocode(lat, lng, geoCtl.signal);
  }, wait);
}
async function reverseGeocode(lat, lng, signal) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&accept-language=lt&lat=${lat}&lon=${lng}`, { signal });
    if (!r.ok) return;
    const j = await r.json();
    const a = j.address || {};
    const nm = a.city || a.town || a.village || a.municipality || a.county || a.state || j.name || a.country || null;
    if (nm && state.loc.lat === lat && state.loc.lng === lng && !state.loc.name) {
      state.loc.name = a.country && nm !== a.country ? `${nm}, ${a.country}` : nm;
      store.set('tm.loc', state.loc);
      renderLoc();
    }
  } catch { /* aborted, offline or rate-limited: keep coordinates only */ }
}

$('#btn-locate').addEventListener('click', () => {
  const note = $('#loc-note');
  if (!navigator.geolocation) {
    note.classList.add('warn');
    note.textContent = 'Ši naršyklė nepalaiko vietos nustatymo. Ieškok vietos arba pasirink žemėlapyje.';
    return;
  }
  note.classList.remove('warn');
  note.classList.add('busy');
  note.textContent = 'Nustatoma vieta…';
  navigator.geolocation.getCurrentPosition(
    (p) => setLocation(p.coords.latitude, p.coords.longitude, null, { zoom: 12 }),
    (err) => {
      note.classList.remove('busy');
      note.classList.add('warn');
      note.textContent = err.code === 1
        ? 'Naršyklė neleido nustatyti vietos. Leisk tai adreso juostoje arba ieškok vietos pagal pavadinimą.'
        : 'Nepavyko nustatyti vietos. Ieškok pagal pavadinimą arba pasirink žemėlapyje.';
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
  );
});

$('#btn-pick').addEventListener('click', () => {
  if (state.picking) { stopPicking(); return; }
  state.picking = true;
  document.body.classList.add('picking');
  $('#btn-pick').textContent = 'Spausk žemėlapyje…';
  $('#btn-pick').setAttribute('aria-pressed', 'true');
});
map.on('click', (e) => { if (state.picking) setLocation(e.latlng.lat, e.latlng.lng, null, { fly: false }); });
map.on('contextmenu', (e) => setLocation(e.latlng.lat, e.latlng.lng, null, { fly: false }));

// Place search (OpenStreetMap Nominatim).
let searchToken = 0;
$('#search').addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = $('#search-input').value.trim();
  const list = $('#search-results');
  if (!q) return;
  const t = ++searchToken;
  list.hidden = false;
  list.innerHTML = '<li>Ieškoma…</li>';
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&accept-language=lt&q=${encodeURIComponent(q)}`);
    const rows = await r.json();
    if (t !== searchToken) return;
    if (!rows.length) { list.innerHTML = '<li>Nieko nerasta. Pabandyk kitą pavadinimą.</li>'; return; }
    list.innerHTML = rows.map((row, i) => `<li role="button" tabindex="0" data-i="${i}">${esc(row.display_name)}</li>`).join('');
    list.querySelectorAll('li').forEach((li) => {
      const pick = () => {
        const row = rows[+li.dataset.i];
        setLocation(+row.lat, +row.lon, row.display_name.split(',').slice(0, 2).join(','), { zoom: 12 });
      };
      li.addEventListener('click', pick);
      li.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
    });
  } catch {
    if (t === searchToken) list.innerHTML = '<li>Paieška nepasiekiama. Patikrink interneto ryšį.</li>';
  }
});
$('#search-input').addEventListener('input', (e) => { if (!e.target.value.trim()) closeResults(); });
$('#loc').addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeResults(); $('#search-input').focus(); } });
document.addEventListener('pointerdown', (e) => { if (!e.target.closest('#loc')) closeResults(); });

// ---------- Timeline -------------------------------------------------------

function stopLabel(s) {
  if (s.kind === 'sat') return String(s.year);
  return fmtYearShort(s.year);
}

// Tick labels in priority order; a label is skipped if it would overlap one already placed.
function renderTicks() {
  const n = state.stops.length;
  if (n < 2) return;
  const box = $('#tl-ticks');
  const width = box.clientWidth || 600;
  const want = [2026, -123000, 1000, 2014, 1500, 1, 1800, 500, -1000, 1945, -3000, 1300, 1900, -10000];
  const placed = [];
  for (const w of want) {
    const best = nearestStop(w, (s) => s.kind !== 'map');
    const s = state.stops[best];
    const label = stopLabel(s);
    const x = (best / (n - 1)) * width;
    const w2 = label.length * 6.6 + 14;
    let lo = x - w2 / 2, hi = x + w2 / 2, shift = '';
    if (lo < 0) { lo = x; hi = x + w2; shift = 'translateX(0)'; }
    else if (hi > width) { hi = x; lo = x - w2; shift = 'translateX(-100%)'; }
    if (placed.some((p) => p.i === best || (lo < p.hi + 4 && hi > p.lo - 4))) continue;
    placed.push({ i: best, label, sat: s.kind === 'sat', lo, hi, shift });
  }
  const maps = state.stops.map((s, i) => (s.kind === 'map' ? i : -1)).filter((i) => i >= 0);
  box.innerHTML = placed
    .map((o) => `<span class="${o.sat ? 'sat' : ''}" style="left:${(o.i / (n - 1)) * 100}%;${o.shift ? `transform:${o.shift}` : ''}">${esc(o.label)}</span>`)
    .join('') + maps.map((i) => `<i class="map-tick" style="left:${(i / (n - 1)) * 100}%" title="${esc(state.stops[i].map.t)}"></i>`).join('');
}
window.addEventListener('resize', () => { clearTimeout(renderTicks.t); renderTicks.t = setTimeout(renderTicks, 150); });

// Scrubbing updates the labels at once but loads data only after the thumb rests.
let stopTimer = 0;
function scheduleStop(i) {
  i = Math.max(0, Math.min(state.stops.length - 1, i));
  state.idx = i;
  range.value = i;
  showStopHeader(state.stops[i]);
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => { stopTimer = 0; setStop(i); }, 160);
}

function showStopHeader(s) {
  const yearText = s.kind === 'sat' ? `${s.year} m.` : s.kind === 'map' ? `${s.map.when} m.` : fmtYear(s.year);
  $('#tl-year').textContent = yearText;
  $('#tl-year').classList.toggle('sat', s.kind === 'sat');
  $('#tl-era').textContent = era(s.year, s.kind);
  $('#tag-then').textContent = `Tada · ${s.kind === 'map' ? s.map.when : stopLabel(s)}`;
  range.setAttribute('aria-valuetext', s.kind === 'sat' ? `${s.year} m., palydovo nuotrauka` : s.kind === 'map' ? `${s.map.when} m., ${s.map.t}` : fmtYear(s.year));
}

let loadToken = 0;
async function setStop(i) {
  clearTimeout(stopTimer); stopTimer = 0;
  i = Math.max(0, Math.min(state.stops.length - 1, i));
  state.idx = i;
  range.value = i;
  const s = state.stops[i];
  const token = ++loadToken;
  showStopHeader(s);
  updateClip();

  if (s.kind === 'sat') {
    removeHist();
    if (!waybackLayers[s.id]) {
      waybackLayers[s.id] = new WaybackLayer(
        `https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/${s.id}/{z}/{y}/{x}`,
        { pane: 'thenTiles', maxZoom: 19, attribution: `World Imagery Wayback ${s.date}: ${s.credit || 'Esri, Vantor, Earthstar Geographics, and the GIS User Community'}` },
      );
    }
    map.getPane('thenTiles').style.filter = 'none';
    setThenTiles([waybackLayers[s.id]]);
  } else if (s.kind === 'map') {
    removeHist();
    map.getPane('thenTiles').style.filter = 'none';
    setThenTiles([reliefLayer, regionalLayer(s.map)]);
    // Fly in to where the map is readable, unless you are already close enough.
    const want = s.map.zoom || 14;
    if (map.getZoom() < Math.max(want - 2, s.map.minZoom)) map.flyTo([state.loc.lat, nearCopy(state.loc.lng)], want, { duration: 0.8 });
  } else {
    map.getPane('thenTiles').style.filter = 'sepia(.35) saturate(.9)';
    setThenTiles([reliefLayer]);
    try {
      const gj = await loadHist(s.year);
      if (token !== loadToken) return;
      drawHist(gj, s.year);
    } catch {
      if (token !== loadToken) return;
      removeHist();
      $('#tl-here').textContent = 'Nepavyko įkelti šio laikotarpio duomenų.';
      meMarker.setTooltipContent(esc(`${fmtYearShort(s.year)}: nepavyko įkelti`));
      markHistoryCurrent();
      return;
    }
  }
  refreshHere();
  markHistoryCurrent();
  updateClip();
}

range.addEventListener('input', () => scheduleStop(+range.value));
$('#tl-prev').addEventListener('click', () => scheduleStop(state.idx - 1));
$('#tl-next').addEventListener('click', () => scheduleStop(state.idx + 1));
document.addEventListener('keydown', (e) => {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.target.closest('input, select, textarea, [role="tab"], [role="radio"], [role="slider"], .famous-list, .hist-list, #search-results')) return;
  if (e.key === 'ArrowLeft') { scheduleStop(state.idx - 1); e.preventDefault(); }
  if (e.key === 'ArrowRight') { scheduleStop(state.idx + 1); e.preventDefault(); }
  if (e.key === 'Escape' && document.body.classList.contains('panel-open')) setPanel(false, { focus: true });
});

function removeHist() {
  if (histLayer) { map.removeLayer(histLayer); histLayer = null; }
}

function styleFor(feature, here) {
  const n = cleanName(feature.properties && feature.properties.NAME);
  const f = feature === here;
  if (!n) return { renderer: histRenderer, color: '#8a8f8c', weight: f ? 2.2 : 0.6, fillColor: '#b9bdb9', fillOpacity: 0.12 };
  const h = hue(n);
  return {
    renderer: histRenderer,
    color: f ? '#6b3f00' : `hsl(${h} 30% 32%)`,
    weight: f ? 2.6 : 0.9,
    fillColor: `hsl(${h} 48% 58%)`,
    fillOpacity: f ? 0.62 : 0.36,
  };
}

function hereFeatureOf(gj, year) {
  const h = hereAt(year);
  return h && h.fi != null ? gj.features[h.fi] : null;
}

function drawHist(gj, year) {
  removeHist();
  const here = hereFeatureOf(gj, year);
  histLayer = L.geoJSON(gj, {
    pane: 'thenVec',
    style: (f) => styleFor(f, here),
    onEachFeature: (f, layer) => {
      const raw = f.properties && f.properties.NAME;
      const label = (ll) => {
        const nm = ltName(raw, year, ll && placeCtx(ll.lat, ll.lng));
        return nm ? `${esc(nm.lt)}${nm.orig ? ` <span class="orig">· ${esc(nm.orig)}</span>` : ''}` : 'Duomenų nėra';
      };
      let tip = label();
      layer.bindTooltip(tip, { sticky: true, className: 'poly-tip', direction: 'top', offset: [0, -8] });
      // Names such as 'England and Ireland' read differently in Ireland and in Britain.
      const orig = cleanName(raw);
      if (orig && typeof (LT[orig] ?? LT[orig.replace(/-/g, ' ')] ?? LT[orig.replace(/ /g, '-')]) === 'function') {
        layer.on('mousemove', (e) => {
          const t = label(e.latlng.wrap());
          if (t !== tip) { tip = t; layer.setTooltipContent(t); }
        });
      }
      layer.on('mouseover', (e) => {
        if (state.mode === 'compare' && e.containerPoint && e.containerPoint.x > dividerPx()) layer.closeTooltip();
      });
    },
  });
  // Set after construction: L.GeoJSON copies its options onto every polygon.
  histLayer.options.attribution = HIST_ATTR;
  histLayer.addTo(map);
  histLayer._year = year;
  histLayer._gj = gj;
  histLayer._here = here;
}

function hereHtml(h) {
  if (!h || !h.name) return '<span class="orig">Šio laikotarpio duomenų apie šią vietą nėra</span>';
  const n = h.name;
  return `${esc(n.lt)}${n.orig ? ` <span class="orig">· ${esc(n.orig)}</span>` : ''}${h.approx ? ' <span class="orig">(artimiausia sritis)</span>' : ''}`;
}

function refreshHere() {
  const s = state.stops[state.idx];
  if (!s) return;
  let html, tip;
  if (s.kind === 'sat') {
    html = `Palydovo nuotrauka <span class="orig">· ${esc(s.date)}</span>`;
    tip = `${s.year}: palydovo nuotrauka`;
  } else if (s.kind === 'map') {
    html = `${esc(s.map.t)} <span class="orig">· ${esc(s.map.when)} m.</span>`;
    tip = `${s.map.when}: ${s.map.short || s.map.t}`;
  } else {
    const h = hereAt(s.year);
    if (h === undefined) return;
    if (h.failed) { html = 'Nepavyko įkelti šio laikotarpio duomenų.'; tip = `${fmtYearShort(s.year)}: nepavyko įkelti`; }
    else { html = hereHtml(h); tip = `${fmtYearShort(s.year)}: ${h.name ? h.name.lt : 'duomenų nėra'}`; }
    if (histLayer && histLayer._year === s.year) {
      const here = hereFeatureOf(histLayer._gj, s.year);
      if (histLayer._here !== here) { histLayer._here = here; histLayer.setStyle((f) => styleFor(f, here)); }
    }
  }
  const y = s.kind === 'map' ? s.map.year : s.year;
  const ev = idxCache.has(2010) ? eventsFor(state.loc.lat, state.loc.lng).filter((e) => e.from <= y && e.to >= y) : [];
  if (ev.length) {
    const shown = ev.slice(-3).map((e) => `<b>${esc(e.t)}</b> <span class="orig">(${esc(e.when)})</span>`).join(' · ');
    const more = ev.length - 3;
    // Lithuanian numeral agreement: 1 įvykis, 2–9 įvykiai, 10–20 įvykių.
    const word = more % 10 === 1 && more % 100 !== 11 ? 'įvykis' : more % 10 >= 2 && (more % 100 < 10 || more % 100 > 20) ? 'įvykiai' : 'įvykių';
    html += `<div class="here-ev">Tuo metu: ${shown}${more > 0 ? ` <span class="orig">ir dar ${more} ${word}</span>` : ''}</div>`;
  }
  $('#tl-here').innerHTML = html;
  meMarker.setTooltipContent(esc(tip));
}

// ---------- "Kas čia buvo" history list -----------------------------------

function computeHistory() {
  const fill = $('#hist-progress').firstElementChild;
  fill.style.transition = 'none';
  fill.style.width = '0%';
  void fill.offsetWidth;
  fill.style.transition = '';
  refreshHistory();
  ensureIndex();
}

function refreshHistory() {
  state.history = [];
  for (const y of HIST_YEARS) {
    const h = hereAt(y);
    if (h === undefined) break; // keep the list in order: stop at the first year not indexed yet
    state.history.push({ year: y, name: h.name || null, approx: !!h.approx, failed: !!h.failed });
  }
  const done = HIST_YEARS.filter((y) => idxCache.has(y)).length;
  const bar = $('#hist-progress');
  bar.firstElementChild.style.width = `${(done / HIST_YEARS.length) * 100}%`;
  bar.classList.toggle('done', done === HIST_YEARS.length);
  renderHistory();
  if (state.stops[state.idx] && state.stops[state.idx].kind === 'hist') refreshHere();
}

function historyGroups() {
  const groups = [];
  for (const h of state.history) {
    const key = h.failed ? '\u0001failed' : h.name ? h.name.lt : '';
    const last = groups[groups.length - 1];
    if (last && last.key === key) { last.to = h.year; last.approx = last.approx || h.approx; }
    else groups.push({ key, from: h.year, to: h.year, name: h.name, approx: h.approx, failed: h.failed });
  }
  return groups;
}

function renderHistory() {
  const list = $('#hist-list');
  const fo = document.activeElement && document.activeElement.closest && document.activeElement.closest('#hist-list li');
  const fKey = fo ? fo.dataset.key : null;
  const f = state.filters;
  const rows = f.hist ? historyGroups().map((g) => ({ kind: 'hist', sort: g.from, g })) : [];
  const complete = state.history.length === HIST_YEARS.length;
  if (complete) {
    if (f.maps) regionalFor(state.loc.lat, state.loc.lng).forEach((m) => rows.push({ kind: 'map', sort: m.year + 0.5, m }));
    if (f.events) eventsFor(state.loc.lat, state.loc.lng).forEach((e) => rows.push({ kind: 'event', sort: e.from + 0.3, e }));
    rows.sort((a, b) => a.sort - b.sort);
    const sat = state.wayback;
    if (f.maps && sat.length) rows.push({ kind: 'sat', from: sat[0].year, to: sat[sat.length - 1].year });
  }
  const evCount = complete ? eventsFor(state.loc.lat, state.loc.lng).length : 0;
  $('#flt-events-n').textContent = evCount ? ` (${evCount})` : '';
  list.innerHTML = rows.map((r) => {
    if (r.kind === 'event') {
      const e = r.e;
      const open = state.openEvents.has(e.i);
      const wiki = e.w ? ` <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(e.w.replace(/ /g, '_'))}" hreflang="en" target="_blank" rel="noopener">Vikipedija (anglų k.) ↗</a>` : '';
      return `<li role="button" tabindex="0" class="event kind-${esc(e.kind)}${open ? ' open' : ''}" data-key="ev|${e.i}" aria-expanded="${open}">
        <span class="dot ev"></span>
        <span><div class="when">${esc(e.when)}</div><div class="what">${esc(e.t)}</div><div class="orig">${esc(EVENT_KIND[e.kind] || 'Įvykis')}</div>
        <div class="ev-d"${open ? '' : ' hidden'}>${esc(e.d)}${wiki}</div></span></li>`;
    }
    if (r.kind === 'map') {
      return `<li role="button" tabindex="0" class="map" data-key="map|${esc(r.m.id)}">
        <span class="dot" style="background:var(--then)"></span>
        <span><div class="when">${esc(r.m.when)}</div><div class="what">${esc(r.m.t)}</div><div class="orig">Senasis žemėlapis · ${esc(r.m.region)}</div></span></li>`;
    }
    if (r.kind === 'sat') {
      return `<li role="button" tabindex="0" data-key="sat">
        <span class="dot" style="background:var(--now)"></span>
        <span><div class="when">${r.from}–${r.to}</div><div class="what">Palydovų nuotraukos</div><div class="orig">Kiekvienų metų vaizdas iš kosmoso</div></span></li>`;
    }
    const g = r.g;
    const color = g.name ? `hsl(${hue(g.name.orig || g.name.lt)} 48% 52%)` : 'var(--line)';
    const what = g.failed ? 'Nepavyko įkelti' : g.name ? esc(g.name.lt) : 'Duomenų nėra';
    const sub = [g.name && g.name.orig ? esc(g.name.orig) : '', g.approx ? 'artimiausia sritis' : ''].filter(Boolean).join(' · ');
    return `<li role="button" tabindex="0" data-key="hist|${g.from}" data-year="${g.from}" data-to="${g.to}" class="${g.name ? '' : 'none'}">
      <span class="dot" style="background:${color}"></span>
      <span><div class="when">${esc(fmtSpan(g.from, g.to))}</div><div class="what">${what}</div>${sub ? `<div class="orig">${sub}</div>` : ''}</span></li>`;
  }).join('');
  list.querySelectorAll('li').forEach((li) => {
    const go = (ev) => {
      const [kind, id] = li.dataset.key.split('|');
      if (kind === 'ev') {
        if (ev && ev.target.closest('a')) return; // the Wikipedia link opens by itself
        const e = EVENTS[+id];
        const open = !state.openEvents.has(e.i);
        if (open) state.openEvents.add(e.i); else state.openEvents.delete(e.i);
        li.classList.toggle('open', open);
        li.setAttribute('aria-expanded', String(open));
        li.querySelector('.ev-d').hidden = !open;
        if (open) setStop(nearestStop(e.from, (s) => s.kind === 'hist'));
        return;
      }
      let i = -1;
      if (kind === 'sat') i = state.stops.findIndex((s) => s.kind === 'sat');
      else if (kind === 'map') i = state.stops.findIndex((s) => s.kind === 'map' && s.map.id === id);
      else i = state.stops.findIndex((s) => s.kind === 'hist' && s.year === +id);
      if (i < 0) return;
      setStop(i);
      if (kind !== 'map') map.flyTo([state.loc.lat, nearCopy(state.loc.lng)], Math.max(map.getZoom(), 6), { duration: 0.6 });
      if (mobile()) setPanel(false);
    };
    li.addEventListener('click', go);
    li.addEventListener('keydown', (e) => { if (e.target === li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); go(); } });
  });
  if (fKey) { const t = list.querySelector(`li[data-key="${CSS.escape(fKey)}"]`); if (t) t.focus({ preventScroll: true }); }
  markHistoryCurrent();
}

function markHistoryCurrent() {
  const s = state.stops[state.idx];
  if (!s) return;
  $$('#hist-list li').forEach((li) => {
    const [kind, id] = li.dataset.key.split('|');
    let on = false;
    if (kind === 'ev') { const e = EVENTS[+id]; const y = s.kind === 'map' ? s.map.year : s.year; on = !!e && e.from <= y && e.to >= y && s.kind !== 'sat'; }
    else if (kind === 'sat') on = s.kind === 'sat';
    else if (kind === 'map') on = s.kind === 'map' && s.map.id === id;
    else on = s.kind === 'hist' && s.year >= +li.dataset.year && s.year <= +li.dataset.to;
    li.classList.toggle('cur', on);
    if (on) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current');
  });
}

// ---------- Famous maps ----------------------------------------------------

const famousLayer = L.layerGroup().addTo(map);
const famousRenderer = L.svg({ pane: 'famousPane' });
const wikiThumbs = {};
const wikiThumbName = {};
const wikiLt = {};
const credits = {};

function brass() { return getComputedStyle(document.documentElement).getPropertyValue('--then').trim() || '#8f6118'; }

function drawFamousPins() {
  famousLayer.clearLayers();
  const fill = brass();
  FAMOUS.forEach((f, i) => {
    const m = L.circleMarker(f.ll, {
      renderer: famousRenderer, pane: 'famousPane', radius: 6,
      color: '#fff', weight: 2, fillColor: fill, fillOpacity: 0.95,
    });
    m.bindTooltip(`<b>${esc(f.when)}</b> · ${esc(f.t)}`, { className: 'poly-tip', direction: 'top', offset: [0, -6] });
    m.on('click', () => { if (!state.picking) selectFamous(i, { fly: false }); });
    famousLayer.addLayer(m);
  });
}

function renderFamousList() {
  $('#famous-list').innerHTML = FAMOUS.map((f, i) =>
    `<li role="button" tabindex="0" data-i="${i}" class="${i === state.famousSel ? 'cur' : ''}"><span class="when">${esc(f.when)}</span><span class="t">${esc(f.t)}</span></li>`,
  ).join('');
  $$('#famous-list li').forEach((li) => {
    const go = () => selectFamous(+li.dataset.i);
    li.addEventListener('click', go);
    li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
}

function imgUrl(f) {
  if (f.img) return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(f.img)}?width=800`;
  if (f.noThumb) return null;
  return f.w ? wikiThumbs[f.w] : null;
}
function imgFile(f) {
  if (f.img) return f.img;
  if (f.noThumb || !f.w) return null;
  return wikiThumbName[f.w] || null;
}

// Author and licence of a Commons image (many are CC BY-SA, which requires this credit).
async function loadCredit(name) {
  if (credits[name]) return credits[name];
  const url = 'https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
    action: 'query', titles: `File:${name}`, prop: 'imageinfo', iiprop: 'extmetadata',
    iiextmetadatafilter: 'Artist|LicenseShortName|LicenseUrl', format: 'json', formatversion: '2', origin: '*',
  });
  try {
    const q = (await (await fetch(url)).json()).query;
    const m = (q.pages[0].imageinfo || [{}])[0].extmetadata || {};
    const text = (html) => (html ? new DOMParser().parseFromString(html, 'text/html').body.textContent.replace(/\s+/g, ' ').trim() : '');
    // Commons often repeats the author (visible text plus a hidden copy): keep one.
    let artist = text(m.Artist && m.Artist.value);
    const half = artist.length / 2;
    if (Number.isInteger(half) && artist.slice(0, half) === artist.slice(half)) artist = artist.slice(0, half);
    if (/^unknown( author)?$/i.test(artist)) artist = 'autorius nežinomas';
    let lic = text(m.LicenseShortName && m.LicenseShortName.value);
    if (/^public domain$/i.test(lic)) lic = 'viešoji nuosavybė';
    credits[name] = { artist: artist.slice(0, 90), lic, url: m.LicenseUrl && m.LicenseUrl.value };
  } catch { credits[name] = { artist: '', lic: '' }; }
  return credits[name];
}

function creditHtml(name, c) {
  const page = `<a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(name.replace(/ /g, '_'))}" target="_blank" rel="noopener">Wikimedia Commons</a>`;
  if (!c) return `Paveikslas: ${page}`;
  const lic = c.lic ? (c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.lic)}</a>` : esc(c.lic)) : '';
  return ['Paveikslas', [c.artist ? esc(c.artist) : '', lic, page].filter(Boolean).join(' · ')].join(': ');
}

function wikiLink(f) {
  if (!f.w) return '';
  if (wikiLt[f.w]) return `<a href="https://lt.wikipedia.org/wiki/${encodeURIComponent(wikiLt[f.w].replace(/ /g, '_'))}" hreflang="lt" target="_blank" rel="noopener">Vikipedija ↗</a>`;
  return `<a href="https://en.wikipedia.org/wiki/${encodeURIComponent(f.w.replace(/ /g, '_'))}" hreflang="en" target="_blank" rel="noopener">Vikipedija (anglų k.) ↗</a>`;
}

function setCardImage(box, f) {
  const src = imgUrl(f);
  const credit = box.parentElement.querySelector('.credit');
  if (!src) {
    box.innerHTML = '<div class="noimg">Šio žemėlapio paveikslo čia nėra. Daugiau rasi Vikipedijoje.</div>';
    if (credit) credit.hidden = true;
    return;
  }
  box.innerHTML = `<img src="${esc(src)}" alt="${esc(f.t)}" loading="lazy">`;
  box.firstChild.addEventListener('error', () => { box.innerHTML = '<div class="noimg">Paveikslo įkelti nepavyko.</div>'; });
  const name = imgFile(f);
  if (credit && name) {
    credit.hidden = false;
    credit.innerHTML = creditHtml(name, credits[name]);
    loadCredit(name).then((c) => { if (FAMOUS[state.famousSel] === f) credit.innerHTML = creditHtml(name, c); });
  }
}

function selectFamous(i, opts = {}) {
  const f = FAMOUS[i];
  state.famousSel = i;
  showTab('famous');
  if (mobile()) setPanel(true);
  const card = $('#famous-card');
  card.hidden = false;
  card.innerHTML = `
    <div class="img"></div>
    <div class="credit" hidden></div>
    <div class="body">
      <div class="eyebrow">${esc(f.when)}</div>
      <h3>${esc(f.t)}</h3>
      <p>${esc(f.d)}</p>
      <div class="links">
        <a href="#" id="fam-go">Rodyti to meto sienas</a>
        ${wikiLink(f)}
      </div>
    </div>`;
  setCardImage(card.querySelector('.img'), f);
  card.querySelector('#fam-go').addEventListener('click', (e) => {
    e.preventDefault();
    goToFamousTime(f);
    if (mobile()) setPanel(false);
  });
  card.scrollIntoView({ block: 'nearest' });
  $$('#famous-list li').forEach((li) => {
    const on = +li.dataset.i === i;
    li.classList.toggle('cur', on);
    if (on) li.setAttribute('aria-current', 'true'); else li.removeAttribute('aria-current');
  });
  if (opts.fly !== false) map.flyTo(f.ll, Math.max(5, Math.min(map.getZoom(), 7)), { duration: 0.8 });
  goToFamousTime(f);
}

function goToFamousTime(f) {
  setStop(nearestStop(f.y, (s) => s.kind !== 'map'));
}

async function loadWikiThumbs() {
  const titles = [...new Set(FAMOUS.filter((f) => f.w).map((f) => f.w))];
  const alias = {}, byTitle = {}, ltByTitle = {};
  const chunks = [];
  for (let i = 0; i < titles.length; i += 50) chunks.push(titles.slice(i, i + 50));
  await Promise.all(chunks.map(async (chunk) => {
    const url = 'https://en.wikipedia.org/w/api.php?' + new URLSearchParams({
      action: 'query', titles: chunk.join('|'), prop: 'pageimages|langlinks', piprop: 'thumbnail|name', pithumbsize: '800',
      lllang: 'lt', lllimit: 'max', redirects: '1', format: 'json', formatversion: '2', origin: '*',
    });
    try {
      const q = (await (await fetch(url)).json()).query;
      if (!q) return;
      [...(q.normalized || []), ...(q.redirects || [])].forEach((r) => { alias[r.from] = r.to; });
      (q.pages || []).forEach((p) => {
        if (p.thumbnail) byTitle[p.title] = { src: p.thumbnail.source, name: p.pageimage };
        if (p.langlinks && p.langlinks[0]) ltByTitle[p.title] = p.langlinks[0].title;
      });
    } catch { /* offline or this batch failed */ }
  }));
  titles.forEach((t) => {
    let k = t;
    for (let n = 0; n < 3 && alias[k]; n++) k = alias[k];
    if (byTitle[k]) { wikiThumbs[t] = byTitle[k].src; wikiThumbName[t] = byTitle[k].name; }
    if (ltByTitle[k]) wikiLt[t] = ltByTitle[k];
  });
  // Update an open card in place, without re-selecting it.
  const sel = FAMOUS[state.famousSel];
  if (sel && !$('#famous-card').hidden) {
    const box = $('#famous-card .img');
    if (box && !box.querySelector('img')) setCardImage(box, sel);
    const old = $('#famous-card .links a[target]');
    if (old) old.outerHTML = wikiLink(sel);
  }
}

$('#chk-famous').addEventListener('change', (e) => {
  if (e.target.checked) famousLayer.addTo(map); else map.removeLayer(famousLayer);
});

// ---------- Panel, tabs, modes --------------------------------------------

function showTab(name, { focus = false } = {}) {
  $$('.tablist [role="tab"]').forEach((b) => {
    const on = b.dataset.tab === name;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
    if (on && focus) b.focus();
  });
  $$('.tab-body').forEach((b) => { b.hidden = b.dataset.body !== name; });
}
$$('.tablist [role="tab"]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
$('.tablist').addEventListener('keydown', (e) => {
  const tabs = $$('.tablist [role="tab"]');
  let i = tabs.findIndex((t) => t.classList.contains('on'));
  if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') i = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') i = 0;
  else if (e.key === 'End') i = tabs.length - 1;
  else return;
  showTab(tabs[i].dataset.tab, { focus: true });
  e.preventDefault();
});

function setPanel(open, { focus = false } = {}) {
  const wasInside = $('#panel').contains(document.activeElement);
  document.body.classList.toggle('panel-open', open);
  $('#btn-panel').setAttribute('aria-expanded', String(open));
  if (!mobile()) return;
  if (open && focus) ($('.tablist [role="tab"].on') || $('#btn-panel-close')).focus();
  if (!open && (focus || wasInside)) $('#btn-panel').focus();
}
$('#btn-panel').addEventListener('click', () => setPanel(!document.body.classList.contains('panel-open'), { focus: true }));
$('#btn-panel-close').addEventListener('click', () => setPanel(false, { focus: true }));

function setMode(m) {
  state.mode = m;
  $$('.seg button').forEach((b) => {
    const on = b.dataset.mode === m;
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  store.set('tm.mode', m);
  updateClip();
}
$$('.seg button').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
$('.seg').addEventListener('keydown', (e) => {
  const bs = $$('.seg button');
  let i = bs.findIndex((b) => b.dataset.mode === state.mode);
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i = (i + 1) % bs.length;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i = (i - 1 + bs.length) % bs.length;
  else if (e.key === 'Home') i = 0;
  else if (e.key === 'End') i = bs.length - 1;
  else return;
  setMode(bs[i].dataset.mode);
  bs[i].focus();
  e.preventDefault();
  e.stopPropagation();
});

$('#base-select').addEventListener('change', (e) => {
  map.removeLayer(NOW_LAYERS[nowKey]);
  nowKey = e.target.value;
  NOW_LAYERS[nowKey].addTo(map);
  store.set('tm.base', nowKey);
});

// ---------- Boot -----------------------------------------------------------

['hist', 'maps', 'events'].forEach((k) => {
  const box = $(`#flt-${k}`);
  box.checked = state.filters[k];
  box.addEventListener('change', () => { state.filters[k] = box.checked; store.set('tm.filters', state.filters); renderHistory(); });
});

(async function boot() {
  renderLoc();
  showTab('history');
  setPanel(false);
  try {
    state.wayback = await (await fetch('data/wayback.json')).json();
  } catch { state.wayback = []; /* no satellite archive: history only */ }
  state.stops = buildStops();
  range.max = state.stops.length - 1;
  renderTicks();
  drawFamousPins();
  renderFamousList();
  setMode(store.get('tm.mode') || 'compare');
  setStop(nearestStop(START_YEAR, (s) => s.kind === 'hist'));
  computeHistory();
  loadWikiThumbs();
})();
