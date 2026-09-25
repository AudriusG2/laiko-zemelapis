/* Regional georeferenced historical maps and extra famous maps for Laiko žemėlapis.

   Each map appears as an extra point on the timeline only when your location is
   inside its coverage. license:
     'open'  — openly licensed or public domain: shown everywhere, including the public website;
     'local' — the provider allows personal/local use, or asks to be contacted before use on a
               public website: shown only when the app runs on this computer (localhost / file).
   kind: 'xyz' (plain tiles), 'counties' (one XYZ tileset per county, {county} in the URL),
         'arcgis-export' (ArcGIS MapServer export as 256 px tiles).
   year = representative year for ordering on the timeline; when = the real date range.
   minZoom/maxZoom = the zooms the source really serves; zoom = where the map flies when chosen.
   cover = the area where the map is worth offering, when it is smaller than the image bounds.
*/

const NLS = 'Reproduced with the permission of the <a href="https://maps.nls.uk/">National Library of Scotland</a>';
const LMAVB = '© <a href="https://www.mab.lt/">Lietuvos mokslų akademijos Vrublevskių biblioteka</a>, sukūrė UAB HNIT-BALTIC';
const QUB = "Queen's University Belfast (GIS Research &amp; Teaching Unit); © Crown copyright, LPS/OSNI (MOU203)";
const AGOL_LT = 'https://tiles.arcgis.com/tiles/kla6QEoN1wAmqwT1/arcgis/rest/services';
const AGOL_QUB = 'https://tiles.arcgis.com/tiles/HRuPlEcokYlz4mdz/arcgis/rest/services';
const NLS_OS = 'https://mapseries-tilesets.s3.amazonaws.com/os';

const COUNTIES_E1 = {"antrim":[[54.4536,-6.7152],[55.3174,-5.635]],"armagh":[[54.0344,-6.8872],[54.5598,-6.2705]],"carlow":[[52.4426,-7.1453],[52.9679,-6.404]],"cavan":[[53.7495,-8.0825],[54.3332,-6.7234]],"clare":[[52.5251,-9.9763],[53.1699,-8.3722]],"cork":[[51.4026,-10.2372],[52.3923,-7.8193]],"donegal":[[54.4123,-8.8696],[55.3996,-6.8732]],"down":[[54.049,-6.4647],[54.69,-5.3949]],"dublin":[[53.1434,-6.659],[53.669,-5.911]],"fermanagh":[[54.0935,-8.2875],[54.6203,-7.0681]],"galway":[[52.8731,-10.2927],[53.7445,-7.9264]],"kerry":[[51.6763,-10.6245],[52.6044,-9.044]],"kildare":[[52.8519,-7.1731],[53.4925,-6.4225]],"kilkenny":[[52.2135,-7.7855],[52.9123,-6.9049]],"kings":[[52.8378,-8.1169],[53.4225,-6.9286]],"leitrim":[[53.783,-8.4556],[54.4823,-7.5431]],"limerick":[[52.2385,-9.4255],[52.7641,-8.1132]],"londonderry":[[54.6241,-7.4383],[55.2084,-6.3113]],"longford":[[53.5133,-8.087],[53.9821,-7.3283]],"louth":[[53.6841,-6.763],[54.1521,-6.0046]],"mayo":[[53.4659,-10.3099],[54.3922,-8.5078]],"meath":[[53.3392,-7.3464],[53.9228,-6.1501]],"monaghan":[[53.8786,-7.3791],[54.4623,-6.4701]],"queens":[[52.78,-7.7844],[53.2499,-6.8971]],"roscommon":[[53.2549,-8.9142],[54.1258,-7.8623]],"sligo":[[53.894,-9.2],[54.4772,-8.1378]],"tipperary":[[52.1952,-8.4875],[53.1805,-7.3167]],"tyrone":[[54.2859,-7.9404],[54.9837,-6.4089]],"waterford":[[51.8968,-8.2365],[52.3648,-6.9378]],"westmeath":[[53.2735,-7.9868],[53.799,-6.9411]],"wexford":[[52.0914,-7.0297],[52.8453,-6.1493]],"wicklow":[[52.6758,-6.869],[53.2583,-5.9811]]};
const COUNTIES_R1 = {"antrim":[[54.4536,-6.7152],[55.3174,-5.635]],"armagh":[[54.0344,-6.8872],[54.5598,-6.2705]],"carlow":[[52.4426,-7.1453],[52.9679,-6.404]],"cavan":[[53.7495,-8.0825],[54.3332,-6.7234]],"clare":[[52.5251,-9.9763],[53.1699,-8.3722]],"cork":[[51.4026,-10.2372],[52.3923,-7.8193]],"donegal":[[54.4123,-8.8696],[55.3996,-6.8732]],"down":[[54.049,-6.4647],[54.69,-5.3949]],"dublin":[[53.1434,-6.659],[53.669,-5.911]],"fermanagh":[[54.0935,-8.2875],[54.6203,-7.0681]],"galway":[[52.8731,-10.2927],[53.7445,-7.9264]],"kerry":[[51.6763,-10.6245],[52.6044,-9.044]],"kildare":[[52.8519,-7.1731],[53.4925,-6.4225]],"kilkenny":[[52.2135,-7.7855],[52.9123,-6.9049]],"kings":[[52.8378,-8.1169],[53.4225,-6.9286]],"leitrim":[[53.783,-8.4556],[54.4823,-7.5431]],"limerick":[[52.2385,-9.4255],[52.7641,-8.1132]],"londonderry":[[54.6241,-7.4383],[55.2084,-6.3113]],"longford":[[53.5133,-8.087],[53.9821,-7.3283]],"louth":[[53.6841,-6.763],[54.1521,-6.0046]],"mayo":[[53.4659,-10.3099],[54.3922,-8.5078]],"meath":[[53.3392,-7.3464],[53.9228,-6.1501]],"monaghan":[[53.8787,-7.3785],[54.4623,-6.4697]],"queens":[[52.78,-7.7844],[53.2499,-6.8971]],"roscommon":[[53.2549,-8.9142],[54.1258,-7.8623]],"sligo":[[53.894,-9.2],[54.4772,-8.1378]],"tipperary":[[52.1952,-8.4875],[53.1805,-7.3167]],"tyrone":[[54.2859,-7.9404],[54.9837,-6.4089]],"waterford":[[51.8968,-8.2365],[52.3648,-6.9378]],"westmeath":[[53.2735,-7.9868],[53.799,-6.9411]],"wexford":[[52.0914,-7.0297],[52.8453,-6.1493]],"wicklow":[[52.6758,-6.869],[53.2583,-5.9811]]};
const COUNTIES_E2 = {"antrim":[[54.4536,-6.7152],[55.3174,-5.635]],"armagh":[[54.0344,-6.8872],[54.5598,-6.2705]],"carlow":[[52.4426,-7.1453],[52.9679,-6.404]],"cavan":[[53.7495,-8.0825],[54.3332,-6.7234]],"clare":[[52.5251,-9.9763],[53.1699,-8.3722]],"cork":[[51.4026,-10.2372],[52.3923,-7.8193]],"donegal":[[54.4123,-8.8696],[55.3996,-6.8732]],"down":[[54.049,-6.4647],[54.69,-5.3949]],"dublin":[[53.1434,-6.659],[53.669,-5.911]],"fermanagh":[[54.0935,-8.2875],[54.6203,-7.0681]],"galway":[[52.8731,-10.2927],[53.7445,-7.9264]],"kerry":[[51.6763,-10.6245],[52.6044,-9.044]],"kildare":[[52.8519,-7.1731],[53.4925,-6.4225]],"kilkenny":[[52.2135,-7.7855],[52.9123,-6.9049]],"kings":[[52.8378,-8.1169],[53.4225,-6.9286]],"leitrim":[[53.783,-8.4556],[54.4823,-7.5431]],"limerick":[[52.2385,-9.4255],[52.7641,-8.1132]],"londonderry":[[54.6241,-7.4383],[55.2084,-6.3113]],"longford":[[53.5133,-8.087],[53.9821,-7.3283]],"louth":[[53.6841,-6.763],[54.1521,-6.0046]],"mayo":[[53.4659,-10.3099],[54.3922,-8.5078]],"meath":[[53.3392,-7.3464],[53.9228,-6.1501]],"monaghan":[[53.8786,-7.3791],[54.4623,-6.4701]],"queens":[[52.78,-7.7844],[53.2499,-6.8971]],"roscommon":[[53.2549,-8.9142],[54.1258,-7.8623]],"sligo":[[53.894,-9.2],[54.4772,-8.1378]],"tipperary":[[52.1952,-8.4875],[53.1805,-7.3167]],"tyrone":[[54.2859,-7.9404],[54.9837,-6.4089]],"waterford":[[51.8968,-8.2365],[52.3648,-6.9378]],"westmeath":[[53.2735,-7.9868],[53.799,-6.9411]],"wexford":[[52.0914,-7.0297],[52.8453,-6.1493]],"wicklow":[[52.6758,-6.869],[53.2583,-5.9811]]};
const IRELAND = [[51.38, -10.76], [55.56, -4.9]];

window.REGIONAL_MAPS = [
  // ---- World (National Library of Scotland) ----
  { id: 'arrowsmith-1790', year: 1790, when: '1790', t: 'Arrowsmitho pasaulio žemėlapis', short: 'Arrowsmith 1790', region: 'Pasaulis',
    kind: 'xyz', url: 'https://mapseries-tilesets.s3.amazonaws.com/mapdata3/100611144/{z}/{x}/{y}.png', bounds: [[-72.48, -180], [82.09, 180]],
    minZoom: 2, maxZoom: 8, zoom: 7, license: 'local', attribution: `Aaron Arrowsmith, Chart of the World (1790). ${NLS}` },
  { id: 'bartholomew-1881', year: 1881, when: '1881', t: 'Bartholomew pasaulio žemėlapis', short: 'Bartholomew 1881', region: 'Pasaulis',
    kind: 'xyz', url: 'https://mapseries-tilesets.s3.amazonaws.com/bartholomew-world/{z}/{x}/{y}.png', bounds: [[-60.54, -170.6], [78.16, 180]],
    minZoom: 2, maxZoom: 7, zoom: 6, license: 'local', attribution: `Bartholomew, world map (1881). ${NLS}` },
  { id: 'times-atlas-1920', year: 1920, when: '1920', t: '„Times Survey Atlas“ žemėlapis', short: 'Times atlasas 1920', region: 'Pasaulis',
    kind: 'xyz', url: 'https://mapseries-tilesets.s3.amazonaws.com/tsa/layer_04/{z}/{x}/{y}.png', bounds: [[-47.78, -135.6], [64.15, 180]],
    minZoom: 4, maxZoom: 10, zoom: 8, license: 'local', attribution: `Times Survey Atlas of the World (1920). ${NLS}` },
  { id: 'imw', year: 1930, when: '1912–1955', t: 'Tarptautinis pasaulio žemėlapis 1:1 000 000', short: 'IMW 1:1 000 000', region: 'Pasaulis',
    kind: 'xyz', url: 'https://geo.nls.uk/mapdata3/imw/{z}/{x}/{y}.png', bounds: [[-56.04, -180], [80.21, 180]],
    minZoom: 4, maxZoom: 11, zoom: 9, license: 'local', attribution: `International Map of the World 1:1 000 000. ${NLS}` },

  // ---- Ireland and Northern Ireland ----
  { id: 'down-survey', year: 1658, when: '1656–1658', t: 'Petty „Down Survey“ grafysčių žemėlapiai', short: 'Down Survey', region: 'Airija',
    kind: 'xyz', url: 'https://www.downsurvey.ie/down-survey-of-ireland-data-prep/data/output/tiles/ds/{z}/{x}/{-y}.png', bounds: [[51.39, -10.56], [55.43, -5.34]],
    minZoom: 7, maxZoom: 14, zoom: 11, license: 'local',
    attribution: 'Down Survey (Petty, <i>Hiberniae Delineatio</i>, apie 1660–1675 m. kopija) © <a href="https://www.downsurvey.ie/">Trinity College Dublin</a>' },
  { id: 'belfast-1685', year: 1685, when: '1685', t: 'Thomo Phillipso Belfasto planas', short: 'Belfastas 1685', region: 'Belfastas',
    kind: 'xyz', url: 'https://warper.wmflabs.org/maps/tile/3625/{z}/{x}/{y}.png', bounds: [[54.5937, -5.9449], [54.608, -5.9131]],
    minZoom: 14, maxZoom: 18, zoom: 16, license: 'open',
    attribution: 'Thomas Phillips, Belfast (1685), British Library, viešoji nuosavybė; georeferencija <a href="https://warper.wmflabs.org/maps/3625">Wikimaps Warper</a>' },
  { id: 'belfast-1791', year: 1791, when: '1791', t: 'Jameso Williamsono Belfasto žemėlapis', short: 'Belfastas 1791', region: 'Belfastas',
    kind: 'xyz', url: 'https://mapwarper.net/maps/tile/108888/{z}/{x}/{y}.png', bounds: [[54.5803, -5.9632], [54.6209, -5.8931]],
    minZoom: 13, maxZoom: 16, zoom: 15, license: 'open',
    attribution: 'James Williamson, A Map of the Town and Environs of Belfast (1791), viešoji nuosavybė; <a href="https://mapwarper.net/maps/108888">Map Warper</a>' },
  { id: 'belfast-1832', year: 1833, when: '1832–1833', t: 'Belfasto Ordnance Survey planas (1-asis leidimas)', short: 'Belfastas 1832', region: 'Belfastas',
    kind: 'xyz', url: `${AGOL_QUB}/OS_1STED_BELFAST/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.572, -5.9491], [54.6306, -5.9091]],
    minZoom: 13, maxZoom: 18, zoom: 15, license: 'local', attribution: QUB },
  { id: 'os6-e1', year: 1835, when: '1829–1842', t: 'Ordnance Survey šešių colių žemėlapis, 1-asis leidimas', short: 'OS 6 colių, 1 leid.', region: 'Airija',
    kind: 'counties', url: `${NLS_OS}/{county}/{z}/{x}/{y}.png`, counties: COUNTIES_E1, bounds: IRELAND,
    minZoom: 10, maxZoom: 17, zoom: 15, license: 'local', attribution: `OS Six-Inch Ireland, 1st edition. ${NLS}` },
  { id: 'londonderry-1837', year: 1837, when: '1837', t: 'Londonderio grafystės žemėlapis', short: 'Londonderio gr. 1837', region: 'Londonderio grafystė',
    kind: 'xyz', url: 'https://warper.wmflabs.org/maps/tile/2290/{z}/{x}/{y}.png', bounds: [[54.4888, -7.4895], [55.3142, -6.3591]],
    cover: [[54.6241, -7.4383], [55.2084, -6.3113]], minZoom: 8, maxZoom: 11, zoom: 10, license: 'open',
    attribution: 'County Londonderry (1837), Wikimedia Commons, viešoji nuosavybė; georeferencija <a href="https://warper.wmflabs.org/maps/2290">Wikimaps Warper</a>' },
  { id: 'omagh-1854', year: 1854, when: '1854', t: 'Omos Ordnance Survey planas', short: 'Oma 1854', region: 'Oma',
    kind: 'xyz', url: `${AGOL_QUB}/Omagh1854/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.5957, -7.3203], [54.607, -7.2813]],
    minZoom: 14, maxZoom: 17, zoom: 15, license: 'local', attribution: QUB },
  { id: 'os6-r1', year: 1855, when: '1838–1865', t: 'Ordnance Survey šešių colių žemėlapis, 1-oji peržiūra', short: 'OS 6 colių, peržiūra', region: 'Airija',
    kind: 'counties', url: `${NLS_OS}/{county}1/{z}/{x}/{y}.png`, counties: COUNTIES_R1, bounds: IRELAND,
    minZoom: 10, maxZoom: 17, zoom: 15, license: 'local', attribution: `OS Six-Inch Ireland, 1st revision. ${NLS}` },
  { id: 'os1-hills', year: 1870, when: '1859–1895', t: 'Ordnance Survey vieno colio žemėlapis (su reljefu)', short: 'OS 1 colio', region: 'Airija',
    kind: 'xyz', url: `${NLS_OS}/ireland_1inch_1st_hills/{z}/{x}/{y}.png`, bounds: [[51.2647, -10.7471], [55.5449, -4.9171]],
    minZoom: 7, maxZoom: 15, zoom: 12, license: 'local', attribution: `OS One-inch Ireland (Hills), 1859–1895. ${NLS}` },
  { id: 'os1-2nd', year: 1900, when: '1898–1902', t: 'Ordnance Survey vieno colio žemėlapis, 2-asis leidimas', short: 'OS 1 colio, 2 leid.', region: 'Airija',
    kind: 'xyz', url: `${NLS_OS}/ireland_1inch_2nd_outline/{z}/{x}/{y}.png`, bounds: [[51.2654, -10.7613], [55.554, -4.9037]],
    minZoom: 7, maxZoom: 15, zoom: 12, license: 'local', attribution: `OS One-inch Ireland, 2nd edition, 1898–1902. ${NLS}` },
  { id: 'belfast-1901', year: 1901, when: '1901', t: 'Belfasto Ordnance Survey planas (3-iasis leidimas)', short: 'Belfastas 1901', region: 'Belfastas',
    kind: 'xyz', url: `${AGOL_QUB}/Sixinch_Belfast_1901_web/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.5636, -5.9934], [54.6502, -5.8119]],
    minZoom: 11, maxZoom: 15, zoom: 15, license: 'local', attribution: QUB },
  { id: 'derry-1904', year: 1904, when: '1904', t: 'Derio 25 colių Ordnance Survey planas', short: 'Deris 1904', region: 'Deris',
    kind: 'xyz', url: `${AGOL_QUB}/os_25in_1904/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.9898, -7.3375], [55.0001, -7.3052]],
    minZoom: 14, maxZoom: 19, zoom: 16, license: 'local', attribution: QUB },
  { id: 'os6-e2', year: 1905, when: '1888–1915', t: 'Ordnance Survey šešių colių žemėlapis, 1888–1915 m. leidimas', short: 'OS 6 colių, ~1900', region: 'Airija',
    kind: 'counties', url: `${NLS_OS}/{county}_2nd/{z}/{x}/{y}.png`, counties: COUNTIES_E2, bounds: IRELAND,
    minZoom: 10, maxZoom: 17, zoom: 15, license: 'local', attribution: `OS Six-Inch Ireland, 1888–1915. ${NLS}` },
  { id: 'omagh-1906', year: 1906, when: '1906', t: 'Omos Ordnance Survey planas', short: 'Oma 1906', region: 'Oma',
    kind: 'xyz', url: `${AGOL_QUB}/Omagh1906/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.5926, -7.3213], [54.61, -7.2612]],
    minZoom: 13, maxZoom: 17, zoom: 15, license: 'local', attribution: QUB },
  { id: 'belfast-1923', year: 1923, when: '1923', t: 'Belfasto gatvių planas', short: 'Belfastas 1923', region: 'Belfastas',
    kind: 'xyz', url: `${AGOL_QUB}/Sixinch_Belfast_1923_web/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.5674, -5.9887], [54.6412, -5.8133]],
    minZoom: 10, maxZoom: 18, zoom: 15, license: 'local', attribution: QUB },
  { id: 'bartholomew-ie-1940', year: 1940, when: '1940', t: 'Bartholomew ketvirčio colio Airijos žemėlapis', short: 'Bartholomew 1940', region: 'Airija',
    kind: 'xyz', url: 'https://mapseries-tilesets.s3.amazonaws.com/ireland/bartholomew/{z}/{x}/{y}.png', bounds: [[51.31, -10.67], [55.45, -5.36]],
    minZoom: 6, maxZoom: 12, zoom: 10, license: 'local', attribution: `Bartholomew Quarter-Inch Ireland (1940). ${NLS}` },
  { id: 'gsgs3906', year: 1941, when: '1940–1943', t: 'Karo žinybos žemėlapis 1:25 000 (GSGS 3906)', short: 'GSGS 3906', region: 'Airija',
    kind: 'xyz', url: 'https://mapwarper.net/layers/tile/101/{z}/{x}/{y}.png', bounds: [[51.39, -10.7], [55.51, -5.37]],
    minZoom: 8, maxZoom: 16, zoom: 14, license: 'open',
    attribution: 'War Office GSGS 3906 (apie 1900–1915 m. OS žemėlapių perspaudas), Glucksman Map Library, TCD; <a href="https://mapwarper.net/layers/101">Map Warper</a>' },
  { id: 'gsgs4136', year: 1942, when: '1941–1943', t: 'Karo žinybos vieno colio žemėlapis (GSGS 4136)', short: 'GSGS 4136', region: 'Airija',
    kind: 'xyz', url: 'https://mapseries-tilesets.s3.amazonaws.com/ireland/gsgs4136/{z}/{x}/{y}.png', bounds: [[51.4, -10.74], [55.41, -5.31]],
    minZoom: 6, maxZoom: 14, zoom: 12, license: 'local', attribution: `War Office GSGS 4136 One-Inch Ireland, 1941–1943. ${NLS}` },
  { id: 'belfast-raf-1952', year: 1952, when: '1952', t: 'Belfasto aerofotografija (RAF)', short: 'Belfastas 1952', region: 'Belfastas',
    kind: 'xyz', url: `${AGOL_QUB}/Belfast_RAF_1952/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.594, -6.0005], [54.6149, -5.9138]],
    minZoom: 12, maxZoom: 18, zoom: 15, license: 'local', attribution: QUB },

  // ---- Lithuania ----
  { id: 'vilnius-1840', year: 1840, when: '1840', t: 'Vilniaus miesto planas', short: 'Vilnius 1840', region: 'Vilnius',
    kind: 'xyz', url: `${AGOL_LT}/71918p1/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.6629, 25.251], [54.7124, 25.3174]],
    minZoom: 12, maxZoom: 17, zoom: 15, license: 'local', attribution: LMAVB },
  { id: 'vtk-1872', year: 1872, when: '~1872', t: 'Rusijos trivierstis žemėlapis (Vilniaus lapas)', short: 'Trivierstis 1872', region: 'Vilniaus kraštas',
    kind: 'xyz', url: 'https://mapwarper.net/maps/tile/109188/{z}/{x}/{y}.png', bounds: [[54.3938, 24.4864], [55.0489, 25.8804]],
    minZoom: 9, maxZoom: 14, zoom: 12, license: 'open',
    attribution: 'Trivierstis karinis topografinis žemėlapis (XIII eilė, 4 lapas), viešoji nuosavybė; <a href="https://mapwarper.net/maps/109188">Map Warper</a>' },
  { id: 'rus-126k', year: 1874, when: '1874', t: 'Rusijos imperijos trivierstis žemėlapis', short: 'Trivierstis 1874', region: 'Lietuva',
    kind: 'xyz', url: `${AGOL_LT}/Rusiski_126000/MapServer/tile/{z}/{y}/{x}`, bounds: [[52.83, 20.51], [57.01, 29.44]],
    minZoom: 7, maxZoom: 14, zoom: 11, license: 'local', attribution: LMAVB },
  { id: 'de-ruslands', year: 1916, when: '1914–1921', t: 'Vokiečių „Karte des westlichen Russlands“ 1:100 000', short: 'Vokiečių 1:100 000', region: 'Lietuva',
    kind: 'xyz', url: `${AGOL_LT}/Vokiski_100000_Ruslands/MapServer/tile/{z}/{y}/{x}`, bounds: [[53.746, 20.813], [56.512, 26.851]],
    minZoom: 8, maxZoom: 14, zoom: 12, license: 'local', attribution: LMAVB },
  { id: 'vilnius-pharus', year: 1917, when: '~1916', t: 'Vilniaus planas („Pharus-Plan Wilna“)', short: 'Vilnius ~1916', region: 'Vilnius',
    kind: 'xyz', url: `${AGOL_LT}/344062p1/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.6483, 25.23], [54.7262, 25.3307]],
    minZoom: 12, maxZoom: 17, zoom: 15, license: 'local', attribution: LMAVB },
  { id: 'ober-ost-1918', year: 1918, when: '1918', t: 'Vokiečių „Verwaltungsgebiet Litauen“ 1:300 000', short: 'Ober Ost 1918', region: 'Lietuva',
    kind: 'xyz', url: `${AGOL_LT}/Vokiski_300000_Generalstabes_der_Armee_1dalis/MapServer/tile/{z}/{y}/{x}`, bounds: [[52.028, 20.708], [57.862, 27.647]],
    minZoom: 6, maxZoom: 12, zoom: 9, license: 'local', attribution: LMAVB },
  { id: 'wig-100k', year: 1930, when: '1926–1935', t: 'Lenkijos WIG taktinis žemėlapis 1:100 000', short: 'WIG 1:100 000', region: 'Vilniaus kraštas',
    kind: 'xyz', url: `${AGOL_LT}/Lenkiski_100000/MapServer/tile/{z}/{y}/{x}`, bounds: [[53.99, 22.82], [55.26, 27.36]],
    minZoom: 8, maxZoom: 14, zoom: 12, license: 'local', attribution: LMAVB },
  { id: 'lt-25k', year: 1934, when: '1927–1940', t: 'Lietuvos kariuomenės topografinis žemėlapis 1:25 000', short: 'Lietuvos 1:25 000', region: 'Lietuva',
    kind: 'xyz', url: `${AGOL_LT}/Lietuviski_25000/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.29, 23.33], [55.51, 25.01]],
    minZoom: 10, maxZoom: 15, zoom: 14, license: 'local', attribution: LMAVB },
  { id: 'lt-100k', year: 1936, when: '1933–1940', t: 'Lietuvos kariuomenės topografinis žemėlapis 1:100 000', short: 'Lietuvos 1:100 000', region: 'Lietuva',
    kind: 'xyz', url: `${AGOL_LT}/Lietuviski_100000/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.2, 20.9], [56.3, 25.55]],
    minZoom: 8, maxZoom: 14, zoom: 12, license: 'local', attribution: LMAVB },
  { id: 'vilnius-1937', year: 1937, when: '1937', t: 'Vilniaus planas („Plan miasta Wilna“)', short: 'Vilnius 1937', region: 'Vilnius',
    kind: 'xyz', url: `${AGOL_LT}/179431p1r/MapServer/tile/{z}/{y}/{x}`, bounds: [[54.6542, 25.2262], [54.7216, 25.3229]],
    minZoom: 12, maxZoom: 17, zoom: 15, license: 'local', attribution: LMAVB },
  { id: 'de-grossblatt', year: 1942, when: '1940–1944', t: 'Vokiečių „Karte des Deutschen Reiches“ 1:100 000', short: 'Vokiečių 1940–1944', region: 'Lietuva',
    kind: 'xyz', url: `${AGOL_LT}/Vokiski_100000_Gro%C3%9Fblatter/MapServer/tile/{z}/{y}/{x}`, bounds: [[53.743, 20.791], [56.779, 26.364]],
    minZoom: 8, maxZoom: 14, zoom: 12, license: 'local', attribution: LMAVB },
  { id: 'ort-1944', year: 1944, when: '1944', t: 'Lietuvos aerofotografijos', short: 'Aerofoto 1944', region: 'Lietuva',
    kind: 'arcgis-export', url: 'https://www.geoportal.lt/mapproxy/gisc_ort_1944/MapServer', format: 'png', bounds: [[54.15, 21.03], [56.4, 26.43]],
    minZoom: 10, maxZoom: 15, zoom: 15, license: 'local',
    attribution: '1944 m. Lietuvos ortofotografiniai žemėlapiai © SSVA, <a href="https://www.geoportal.lt/">geoportal.lt</a>' },
  { id: 'ort10lt-1995', year: 1997, when: '1995–1999', t: 'Pirmasis Lietuvos ortofotografinis žemėlapis (ORT10LT)', short: 'ORT10LT 1995–1999', region: 'Lietuva',
    kind: 'arcgis-export', url: 'https://www.geoportal.lt/arcgis/rest/services/NZT/ORT10LT_1995_2001/MapServer', format: 'jpg', bounds: [[53.88, 20.93], [56.46, 26.84]],
    minZoom: 8, maxZoom: 17, zoom: 16, license: 'open',
    attribution: 'ORT10LT 1995–1999 © Nacionalinė žemės tarnyba, © VšĮ SSVA (<a href="https://www.geoportal.lt/">geoportal.lt</a>), CC BY 4.0' },
  { id: 'ort10lt-2005', year: 2005, when: '2005–2006', t: 'Lietuvos ortofotografinis žemėlapis (ORT10LT, spalvotas)', short: 'ORT10LT 2005–2006', region: 'Lietuva',
    kind: 'arcgis-export', url: 'https://www.geoportal.lt/arcgis/rest/services/NZT/ORT10LT_2005_2006/MapServer', format: 'jpg', bounds: [[53.88, 20.93], [56.46, 26.84]],
    minZoom: 8, maxZoom: 18, zoom: 16, license: 'open',
    attribution: 'ORT10LT 2005–2006 © Nacionalinė žemės tarnyba, © VšĮ SSVA (<a href="https://www.geoportal.lt/">geoportal.lt</a>), CC BY 4.0' },
];

// Famous maps of Ireland and Northern Ireland (fact-checked). Merged into the main list by year.
window.EXTRA_FAMOUS = [
  {"y": 150, "when": "~150 m.", "t": "Ptolemėjo Airijos žemėlapis", "d": "Klaudijus Ptolemėjas „Geografijoje“ Airijoje nurodo 15 upių, 6 iškyšulius, 10 gyvenviečių ir 16 genčių; pavyzdžiui, Logijos upės žiotys tapatinamos su Belfasto įlanka. Pats Ptolemėjas Airijoje beveik neabejotinai nebuvo ir rėmėsi karių, pirklių bei keliautojų pasakojimais, tačiau žemėlapis laikomas stebėtinai tiksliu. Tai seniausias žinomas Airijos žemėlapis, išlikęs tik viduramžių nuorašuose.", "ll": [53.49, -7.562], "w": "Ptolemy's map of Ireland"},
  {"y": 1200, "when": "~1200 m.", "t": "Geraldo Velsiečio Europos žemėlapis", "d": "Dvasininkas Geraldas Velsietis (Giraldus Cambrensis) 1183 ir 1185–1186 m. lankėsi Airijoje ir apie 1188 m. parašė „Topographia Hibernica“. Rankraštyje su jo veikalais yra schematiškas Europos žemėlapis: Airija ir Britanija beveik apsuptos žemyno, pietryčiai viršuje, Airijoje pažymėtas Dublinas. Rankraštis (MS 700) saugomas Airijos nacionalinėje bibliotekoje Dubline.", "ll": [53.3411, -6.2544], "w": "Topographia Hibernica", "img": "NLI700 Expugnatio Hibernica f48r.jpg"},
  {"y": 1564, "when": "~1564 m.", "t": "Nowello Anglijos ir Airijos žemėlapis", "d": "Laurence’as Nowellas apie 1564 m. nubraižė nedidelį kišeninį Anglijos ir Airijos žemėlapį savo globėjui, Elžbietos I valstybės sekretoriui Williamui Cecilui, kuris, kaip teigiama, jį visada nešiojosi. Tai vienas pirmųjų Britanijos salų žemėlapių, nekopijavusių XIV a. Gough žemėlapio. Nowellas taip pat pirmasis tiksliai nukartografavo rytinę Airijos pakrantę.", "ll": [51.5294, -0.1269], "w": "Laurence Nowell", "img": "A General Description of England and Ireland.jpg"},
  {"y": 1599, "when": "1599 m.", "t": "Boazio Airijos žemėlapis", "d": "Italų kartografo Baptistos Boazio sudarytą didelį dviejų lapų Airijos žemėlapį su provincijomis, grafystėmis, miškais ir stambių žemvaldžių valdomis Londone išleido Johnas Sudbury. Žinomi tik trys šio leidimo egzemplioriai, tačiau sumažinta jo versija vėliau buvo įtraukta į Ortelijaus atlaso „Theatrum Orbis Terrarum“ leidimus.", "ll": [53.4239, -7.9407], "w": "Giovanni Battista Boazio", "img": "Irlandiæ accurata descriptio, by Baptista Boazio.png"},
  {"y": 1602, "when": "1602 m.", "t": "Bartletto Dungannono ir Tullyhogue žemėlapis", "d": "Anglų kartografas Richardas Bartlettas lydėjo lordo Mountjoy kariuomenę Olsteryje Devynerių metų karo metu. Šiame žemėlapyje nupiešta Dungannono pilis, kurią tais metais sudegino pasitraukdamas Tairono grafas, ir akmeninis O’Neillų inauguracijos sostas Tullyhogue prie Kukstauno, kurį Mountjoy 1602 m. sudaužė. Manoma, kad 1603 m. Tirkonelyje (dab. Donegolas) vietiniai Bartlettui nukirto galvą, nes, pasak Johno Davieso, nenorėjo, kad jų kraštas būtų „atrastas“.", "ll": [54.61, -6.7231], "w": "Tullyhogue Fort", "img": "Dungannon Castle and the stone chair at Tullyhogue, Co. Tyrone.png"},
  {"y": 1609, "when": "1609 m.", "t": "Olsterio plantacijos žemėlapiai (Bodley Survey)", "d": "Po grafų pabėgimo (1607 m.) konfiskuotos šešios Olsterio grafystės (Arma, Kavanas, Kolreinas, Donegolas, Fermana ir Tironas) 1609 m. buvo nukartografuotos Josiaso Bodley vadovaujamų matininkų, kad žemę būtų galima išdalyti anglų ir škotų kolonistams bei daliai airių. Žemė dažniausiai ne matuota vietoje, o aprašyta remiantis vietinių gyventojų žiniomis, tačiau pažymėtos townland ir baronijų ribos tapo vėlesnės žemėvaldos pagrindu. Paveiksle – Onilando baronijos dalis šiaurinėje Armos grafystėje, kur dabar yra Portadaunas ir Lerganas.", "ll": [54.44, -6.4], "w": "Bodley Survey"},
  {"y": 1610, "when": "1610 m.", "t": "Johno Speedo Airijos žemėlapis", "d": "Anglų kartografas Johnas Speedas atlase „The Theatre of the Empire of Great Britaine“ (1611–1612 m.) paskelbė bendrą Airijos žemėlapį ir keturių jos provincijų, tarp jų Olsterio, žemėlapius. Leinsterio žemėlapio kampe įdėtas Dublino planas yra seniausias išlikęs šio miesto žemėlapis. Plokštes Amsterdame graviravo Jodocus Hondius.", "ll": [53.3429, -6.2675], "w": "John Speed", "img": "The Kingdome of Irland (BM 1870,0514.2830.+).jpg"},
  {"y": 1622, "when": "1622 m.", "t": "Thomo Raveno Derio planas", "d": "1622 m. seras Thomas Phillipsas parengė kritišką Londono gildijų kolonizuotos Londonderio grafystės apžvalgą, o kartografas Thomas Ravenas nubraižė gildijų valdų ir miestų planus. Derio plane matyti 1613–1619 m. pastatytos miesto sienos ir gatvės jų viduje. Originalai saugomi Lambeto rūmų bibliotekoje Londone.", "ll": [54.9958, -7.3219], "w": "Derry city walls", "img": "The plat of the Cittie of Londonderrie as it stands built and fortyfied (27114684854).jpg"},
  {"y": 1657, "when": "1656–1658 m.", "t": "Williamo Petty „Down Survey“", "d": "Po Kromvelio užkariavimo Williamas Petty išmatavo iš airių katalikų konfiskuotas žemes, kad jas būtų galima išdalyti parlamento kreditoriams ir kareiviams. Tai laikoma pirmuoju išsamiu visos šalies žemės matavimu pasaulyje, o 1685 m. iš jo medžiagos išleistas pirmasis spausdintas Airijos atlasas „Hiberniae Delineatio“. Paveiksle – Tairono grafystės Strabano baronijos žemėlapis.", "ll": [54.83, -7.47], "w": "Down Survey", "img": "Down Survey - MS 72871.6 - f.40 - The Barony of Strabane in the Countie of Tyrone - A Higgins - 1656-59 - Map.png"},
  {"y": 1685, "when": "1685 m.", "t": "Thomo Phillipso Belfasto planas", "d": "Karo inžinierius Thomas Phillipsas 1684–1685 m. Ormondo hercogo pavedimu apžiūrėjo Airijos uostus bei įtvirtinimus ir nubraižė jų planus. Belfasto plane matyti pilis, miesto bažnyčia, Aukštąja gatve (High Street) tekanti Farseto upė ir paties Phillipso siūloma citadelė į šiaurę nuo miesto. Dėl didelės kainos jo pasiūlymai beveik nebuvo įgyvendinti.", "ll": [54.6, -5.926], "w": "Thomas Phillips (engineer)", "img": "Ground Plan of Belfast (1685).png"},
  {"y": 1760, "when": "1760 m.", "t": "Rocque’o Armos grafystės žemėlapis", "d": "Prancūzų kilmės kartografas Johnas Rocque’as 1754–1760 m. dirbo Dubline: 1756 m. išleido pirmąjį išsamų spausdintą Dublino planą, taip pat sudarė Dublino ir Armos grafysčių žemėlapius. Armos grafystės žemėlapyje (1760 m.) pridėti Armos ir Niūrio miestų planai.", "ll": [54.3499, -6.6546], "w": "John Rocque", "img": "A Topographical Map of the County of Armagh to which is anex'd the Plans of Newry and Armagh - by John Rocque ; To the most Revd. Father in God George, Lord Archbishop of Armagh. Primate and Metropolitan of all... - btv1b530571925.jpg"},
  {"y": 1778, "when": "1778 m.", "t": "Tayloro ir Skinnerio kelių žemėlapiai", "d": "George’as Tayloras ir Andrew Skinneris 1777 m. išmatavo pagrindinius Airijos kelius, o 1778 m. išleido juostinių kelių žemėlapių knygą; 1783 m. išėjo pataisytas leidimas. Kiekvienas maršrutas nubraižytas siaura juosta su pakelės miestais, dvarais ir jų savininkų pavardėmis. Paveiksle – Tandragee apylinkės Armos grafystėje.", "ll": [54.356, -6.415], "w": "History of roads in Ireland", "img": "Taylor and Skinner Map of Tandragee Area.png"},
  {"y": 1833, "when": "1829–1846 m.", "t": "Pirmasis Ordnance Survey šešių colių žemėlapis", "d": "Airija tapo pirmąja šalimi, visa nukartografuota stambiu 6 colių į mylią (1:10 560) masteliu. Trianguliacija rėmėsi 1827–1828 m. prie Foilo įlankos (Lough Foyle) išmatuota beveik 8 mylių bazine linija, o pirmiausia, 1833 m., išleisti Londonderio grafystės lapai. Lauko darbai baigti 1842 m., o visi lapai išspausdinti iki 1846 m.", "ll": [55.1, -6.98], "w": "Ordnance Survey Ireland", "img": "Ordnance Survey Six-Inch Sheet 46 Tyrone, Published 1837.jpg"},
  {"y": 1838, "when": "1837–1838 m.", "t": "Harnesso srautų žemėlapiai", "d": "Karo inžinierius Henry Drury Harnessas Airijos geležinkelių komisijai nubraižė gyventojų tankumo, keleivių ir krovinių srautų žemėlapius. Linijų storis juose rodo, kiek keleivių ar krovinių pervežama kiekvienu keliu ir kanalu, o miestai pažymėti gyventojų skaičiui proporcingais apskritimais. Tai vieni pirmųjų srautų ir proporcingų simbolių žemėlapių, tačiau jų naujovės beveik šimtmetį liko nepastebėtos.", "ll": [53.3498, -6.2603], "w": "Henry Drury Harness", "img": "Harness Ireland Railroad Map 1838.png"},
  {"y": 1839, "when": "1839 m.", "t": "Griffitho geologinis Airijos žemėlapis", "d": "Geologas Richardas Griffithas kelis dešimtmečius rinko duomenis ir sudarė pirmąjį visos Airijos geologinį žemėlapį. Didesnio mastelio (1 colis – 4 mylios) leidimas išėjo 1839 m., patikslintas – 1855 m. Vėlesni tyrimai parodė, kad daug patikslinimų atliko jo darbuotojas Patrickas Ganly.", "ll": [53.3377, -6.255], "w": "Sir Richard Griffith, 1st Baronet", "img": "Composite map of) Sheets 1-6. A General Map Of Ireland to Accompany the Report of the Railway Commissioners shewing the (IA dr composite-map-of-sheets-1-6-a-general-map-of-ireland-to-accompany-the-rep-10485007).jpg"},
  {"y": 1855, "when": "1847–1864 m.", "t": "Griffitho vertinimo žemėlapiai", "d": "Visos Airijos žemės ir pastatų vertinimas vietiniams mokesčiams nustatyti, paskelbtas 1847–1864 m. Kiekvienas sklypas turi numerį, pažymėtą vertinimo žemėlapyje – Ordnance Survey šešių colių (miestuose – stambesnio mastelio) žemėlapio kopijoje, todėl galima rasti konkretaus XIX a. vidurio žemės naudotojo sklypą. Šiaurės Airijos grafysčių vertinimo knygos ir žemėlapiai saugomi PRONI archyve Belfaste.", "ll": [54.604, -5.911], "w": "Griffith's Valuation", "img": "Dm4244 Griffith's Valuation detail Clashmealcon.jpg"},
  {"y": 1922, "when": "1922 m.", "t": "Šiaurės Airijos Ordnance Survey (OSNI)", "d": "Nuo 1922 m. sausio 1 d. Šiaurės Airija turi savo kartografijos tarnybą – Ordnance Survey of Northern Ireland, o likusios salos (netrukus – Airijos laisvosios valstybės) tarnyba įkurta tų pačių metų balandžio 1 d. Abi tęsė iki tol visą salą kartografavusios britų Ordnance Survey darbą. 2008 m. OSNI tapo Land & Property Services dalimi.", "ll": [54.597, -5.93], "w": "Ordnance Survey of Northern Ireland", "img": "Ordnance Survey One-Inch Sheet 6 Belfast, Published 1963.jpg"},
  {"y": 1925, "when": "1925 m.", "t": "Airijos sienų komisijos žemėlapis", "d": "Pagal 1921 m. Anglų ir airių sutartį sudaryta komisija 1924–1925 m. sprendė, kur tiksliai turi eiti siena tarp Airijos laisvosios valstybės ir Šiaurės Airijos. Jos žemėlapyje siūlyti nedideli pakeitimai abiem kryptimis: Pietų Arma su Krosmaglenu atitektų Laisvajai valstybei, o Rytų Donegolo miesteliai prie Derio – Šiaurės Airijai. Kai 1925 m. lapkritį siūlymai nutekėjo į laikraštį „The Morning Post“, vyriausybės susitarė sienos nekeisti, o ataskaita paskelbta tik 1969 m.", "ll": [54.0773, -6.6088], "w": "Irish Boundary Commission", "img": "Irish Boundary Commission final report map (1925).jpg"}
];
