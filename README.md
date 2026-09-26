# Laiko žemėlapis

Pamatyk savo vietą per visą istoriją: nuo 123 000 m. pr. Kr. iki šių metų palydovo nuotraukos.

Kairėje skirtuko pusėje rodoma praeitis, dešinėje – dabartinis žemėlapis toje pačioje vietoje. Skirtuką galima tempti.

**Svetainė:** https://audriusg2.github.io/laiko-zemelapis/

## Ką moka

- **Tavo vieta.** Mygtukas „Rasti mane“ naudoja naršyklės vietos nustatymą. Vietą taip pat galima surasti pagal pavadinimą, spustelėti žemėlapyje arba pasirinkti dešiniuoju pelės mygtuku.
- **Laiko juosta.** 54 istorinių sienų laikotarpiai nuo 123 000 m. pr. Kr. iki 2010 m., senieji tavo vietovės žemėlapiai ir palydovų nuotraukos kiekvieniems metams nuo 2014 m. iki dabar.
- **Senieji žemėlapiai.** Georeferencuoti seni žemėlapiai atsiranda laiko juostoje tik tada, kai jie dengia tavo vietą. Pavyzdžiui, Šiaurės Airijoje – Ordnance Survey žemėlapiai nuo 1830 m., Belfasto planai nuo 1685 m.; Lietuvoje – LDK XVI a. rekonstrukcija, Rusijos trijų varstų žemėlapis, tarpukario žemėlapiai ir Vilniaus planai.
- **Žemėlapiai iš Allmaps.** Kai pasirenki vietą, programėlė [Allmaps](https://allmaps.org/) duomenų bazėje ieško visų bibliotekų georeferencijuotų žemėlapių, dengiančių tą tašką (David Rumsey, Škotijos nacionalinė biblioteka, Stanfordas, Leideno ir kitos bibliotekos), ir įdeda juos į laiko juostą su metais, biblioteka ir nuoroda į originalą. Rezultatai savaitę saugomi naršyklėje.
- **Visi NLS lapai.** Didžiojoje Britanijoje ir Airijoje sąraše „Kas čia buvo“ rodomi visi Škotijos nacionalinės bibliotekos skenuoti lapai, dengiantys tavo vietą (OS 6 ir 1 colio, karo meto, vokiečių jūrlapiai ir kt.), su nuoroda į skeną.
- **Daugiau paieškos.** Nuorodos į OldMapsOnline, jo istorinius regionus, NLS žemėlapių paiešką ir Allmaps atsidaro jau nukreiptos į tavo vietą ir laiką.
- **Palyginimas.** Trys režimai: „Tik tada“, „Palyginti“ (skirtukas per vidurį) ir „Tik dabar“. Dabartinis žemėlapis gali būti gatvių, palydovo arba topografinis.
- **Kas čia buvo.** Sąrašas, kokiai valstybei ar kultūrai tavo vieta priklausė kiekvienu laikotarpiu ir kokie senieji žemėlapiai ją rodo. Paspaudus eilutę, žemėlapis persikelia į tą laiką.
- **Istoriniai įvykiai.** 111 patikrintų įvykių Lietuvai ir Airijai bei Šiaurės Airijai: valstybės kūrimasis, okupacijos, trėmimai, Holokaustas, partizanų karas, Didysis badas, „Neramumai“ ir vietiniai įvykiai (pvz., Danganone, Deryje, Kaune, Vilniuje). Po laiko juosta rodoma, kas tuo metu vyko tavo vietovėje.
- **Garsūs žemėlapiai.** 83 svarbiausi istorijos žemėlapiai nuo Pavlovo mamuto ilties iki Google Maps, tarp jų 18 Airijos žemėlapių, „Įdomybių knygos“ pasaulio žemėlapis, 1920 m. National Geographic Europos žemėlapis ir Worldmapper kartogramos (Lietuvos, JK ir Airijos gyventojai, emigracija iš Lietuvos): data, aprašymas lietuviškai, vaizdas ir vieta žemėlapyje.

## Dvi versijos

Kai kurių senųjų žemėlapių tiekėjai (Škotijos nacionalinė biblioteka, Karalienės universitetas Belfaste, Vrublevskių biblioteka, Trinity College Dublin, geoportal.lt) leidžia juos naudoti asmeniškai, bet viešai svetainei prašo leidimo. Todėl:

- **Svetainėje** rodomi tik atvirai licencijuoti, nekomercinei naudai leidžiami (CC BY-NC) arba viešosios nuosavybės senieji žemėlapiai (9 nuolatiniai sluoksniai ir tokie pat Allmaps žemėlapiai).
- **Paleidus kompiuteryje** rodomi visi 44 senieji žemėlapiai ir visi Allmaps radiniai. Kuris žemėlapis kuriai grupei priklauso, nurodyta `regional.js` lauke `license`.

## Paleidimas kompiuteryje

Windows: dukart spustelėk `paleisti.vbs` (arba darbalaukio nuorodą „Laiko žemėlapis“). Jis paslėptame lange paleidžia vietinį serverį ir atidaro naršyklę.

Kitose sistemose:

```bash
python -m http.server 8777
```

Tada atsidaryk http://localhost:8777. Vietos nustatymas veikia per `localhost` arba HTTPS.

## ArcGIS raktas

Esri palydovo nuotraukos ir reljefas gaunami su nemokamos ArcGIS Location Platform paskyros API raktu (tik „Basemaps“ teisė). Raktas veikia tik iš https://audriusg2.github.io ir http://localhost:8777 ir galioja iki **2027-09-24**. Prieš tą datą ArcGIS paskyroje, elemente „Laiko zemelapis“, sukurk naują raktą ir pakeisk `ESRI_KEY` faile `app.js`.

## Duomenų šaltiniai

| Kas | Šaltinis | Licencija |
|---|---|---|
| Istorinės sienos (`data/world_*.geojson`) | [historical-basemaps](https://github.com/aourednik/historical-basemaps), A. Ourednik | GPL-3.0 |
| Gatvių žemėlapis, vietų paieška | [OpenStreetMap](https://www.openstreetmap.org/copyright), Nominatim | ODbL |
| Palydovo nuotraukos, jų archyvas, reljefas | Esri World Imagery, World Imagery Wayback, World Hillshade (ArcGIS Location Platform raktas) | Esri naudojimo sąlygos |
| Topografinis žemėlapis | [OpenTopoMap](https://opentopomap.org) | CC-BY-SA |
| Senieji Airijos ir pasaulio žemėlapiai | [National Library of Scotland](https://maps.nls.uk/) | CC-BY, vieša svetainė – su leidimu |
| Belfasto, Omos ir Derio planai | Queen's University Belfast | be atviros licencijos |
| Lietuvos senieji žemėlapiai ir Vilniaus planai | [LMA Vrublevskių biblioteka](https://www.mab.lt/) | be atviros licencijos |
| LDK XVI a. (J. Jakubowski) ir „Rejon Wilno“ 1925 | Marijus Pileckas, VDU (ArcGIS Online); skenai – Archiwum Map WIG | be leidimo viešai neplatinti |
| Popple 1733, Melish 1816, Cassini, Niujorkas 1836 | [David Rumsey Map Collection](https://www.davidrumsey.com/) (ArcGIS Online) | CC BY-NC-SA 3.0 |
| Vietos žemėlapiai iš bibliotekų | [Allmaps](https://allmaps.org/) API ir plytelės; aprašai iš bibliotekų IIIF manifestų | georeferencija CC0, skenai – pagal kiekvienos bibliotekos licenciją |
| Skenuotų lapų sąrašas | [NLS Map Finder](https://maps.nls.uk/geo/find/) (WFS) | nuorodos į NLS svetainę |
| Lietuvos ortofotografiniai žemėlapiai | [geoportal.lt](https://www.geoportal.lt/) | © NŽT, © SSVA; viešai svetainei – tik su leidimu |
| „Down Survey“ | [Trinity College Dublin](https://www.downsurvey.ie/) | be atviros licencijos |
| Belfastas 1685 ir 1791, Londonderio grafystė 1837, GSGS 3906, trijų varstų žemėlapis 1872 | Wikimedia Commons, Wikimaps Warper, Map Warper | viešoji nuosavybė |
| Garsių žemėlapių vaizdai | Vikipedija ir Wikimedia Commons; nuorodos į [Digital Bodleian](https://digital.bodleian.ox.ac.uk/) | pagal kiekvieno failo licenciją |
| Kartogramos | [Worldmapper](https://worldmapper.org/) (B. Hennig) | CC BY-NC-SA 4.0 |
| Istoriniai įvykiai (`events.js`) | sudaryta pagal Vikipediją, VLE ir kitus šaltinius, faktai patikrinti | GPL-3.0 (kaip visas projektas) |
| Žemėlapio biblioteka | [Leaflet](https://leafletjs.com) | BSD-2-Clause |

Senovės laikotarpių sienos yra apytikslės: seniausiems laikams duomenų rinkinyje nurodomos archeologinės kultūros, o ne valstybės. Kai kuriems metams (pvz., 1100 ir 1200 m.) Lietuvos teritorijai duomenų nėra. Airija duomenyse iki 1930 m. nubraižyta kaip vienas plotas, todėl programėlė pavadinimus patikslina pagal tai, kurioje salos dalyje esi.

## Licencija

GPL-3.0, nes projekte platinami GPL-3.0 licencijuoti istorinių sienų duomenys. Žr. [LICENSE](LICENSE).
