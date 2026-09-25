# Laiko žemėlapis

Pamatyk savo vietą per visą istoriją: nuo 123 000 m. pr. Kr. iki šių metų palydovo nuotraukos.

Kairėje skirtuko pusėje rodoma praeitis, dešinėje – dabartinis žemėlapis toje pačioje vietoje. Skirtuką galima tempti.

**Svetainė:** https://audriusg2.github.io/laiko-zemelapis/

## Ką moka

- **Tavo vieta.** Mygtukas „Rasti mane“ naudoja naršyklės vietos nustatymą. Vietą taip pat galima surasti pagal pavadinimą, spustelėti žemėlapyje arba pasirinkti dešiniuoju pelės mygtuku.
- **Laiko juosta.** 54 istorinių sienų laikotarpiai nuo 123 000 m. pr. Kr. iki 2010 m., senieji tavo vietovės žemėlapiai ir palydovų nuotraukos kiekvieniems metams nuo 2014 m. iki dabar.
- **Senieji žemėlapiai.** Georeferencuoti seni žemėlapiai atsiranda laiko juostoje tik tada, kai jie dengia tavo vietą. Pavyzdžiui, Šiaurės Airijoje – Ordnance Survey žemėlapiai nuo 1830 m., Belfasto planai nuo 1685 m.; Lietuvoje – Rusijos trivierstis žemėlapis, tarpukario žemėlapiai ir Vilniaus planai.
- **Palyginimas.** Trys režimai: „Tik tada“, „Palyginti“ (skirtukas per vidurį) ir „Tik dabar“. Dabartinis žemėlapis gali būti gatvių, palydovo arba topografinis.
- **Kas čia buvo.** Sąrašas, kokiai valstybei ar kultūrai tavo vieta priklausė kiekvienu laikotarpiu ir kokie senieji žemėlapiai ją rodo. Paspaudus eilutę, žemėlapis persikelia į tą laiką.
- **Garsūs žemėlapiai.** 77 svarbiausi istorijos žemėlapiai nuo Pavlovo mamuto ilties iki Google Maps, tarp jų 18 Airijos žemėlapių: data, aprašymas lietuviškai, vaizdas ir vieta žemėlapyje.

## Dvi versijos

Kai kurių senųjų žemėlapių tiekėjai (Škotijos nacionalinė biblioteka, Karalienės universitetas Belfaste, Vrublevskių biblioteka, Trinity College Dublin) leidžia juos naudoti asmeniškai, bet viešai svetainei prašo leidimo. Todėl:

- **Svetainėje** rodomi tik atvirai licencijuoti arba viešosios nuosavybės senieji žemėlapiai (5 sluoksniai).
- **Paleidus kompiuteryje** rodomi visi 37 senieji žemėlapiai. Kuris žemėlapis kuriai grupei priklauso, nurodyta `regional.js` lauke `license`.

## Paleidimas kompiuteryje

Windows: dukart spustelėk `paleisti.vbs` (arba darbalaukio nuorodą „Laiko žemėlapis“). Jis paslėptame lange paleidžia vietinį serverį ir atidaro naršyklę.

Kitose sistemose:

```bash
python -m http.server 8777
```

Tada atsidaryk http://localhost:8777. Vietos nustatymas veikia per `localhost` arba HTTPS.

## Duomenų šaltiniai

| Kas | Šaltinis | Licencija |
|---|---|---|
| Istorinės sienos (`data/world_*.geojson`) | [historical-basemaps](https://github.com/aourednik/historical-basemaps), A. Ourednik | GPL-3.0 |
| Gatvių žemėlapis, vietų paieška | [OpenStreetMap](https://www.openstreetmap.org/copyright), Nominatim | ODbL |
| Palydovo nuotraukos, jų archyvas, reljefas | Esri World Imagery, World Imagery Wayback, World Shaded Relief | Esri naudojimo sąlygos |
| Topografinis žemėlapis | [OpenTopoMap](https://opentopomap.org) | CC-BY-SA |
| Senieji Airijos ir pasaulio žemėlapiai | [National Library of Scotland](https://maps.nls.uk/) | CC-BY, vieša svetainė – su leidimu |
| Belfasto, Omos ir Derio planai | Queen's University Belfast | be atviros licencijos |
| Lietuvos senieji žemėlapiai ir Vilniaus planai | [LMA Vrublevskių biblioteka](https://www.mab.lt/) | be atviros licencijos |
| Lietuvos ortofotografiniai žemėlapiai | [geoportal.lt](https://www.geoportal.lt/) | © NŽT, © SSVA; viešai svetainei – tik su leidimu |
| „Down Survey“ | [Trinity College Dublin](https://www.downsurvey.ie/) | be atviros licencijos |
| Belfastas 1685 ir 1791, Londonderio grafystė 1837, GSGS 3906, trivierstis 1872 | Wikimedia Commons, Wikimaps Warper, Map Warper | viešoji nuosavybė |
| Garsių žemėlapių vaizdai | Vikipedija ir Wikimedia Commons | pagal kiekvieno failo licenciją |
| Žemėlapio biblioteka | [Leaflet](https://leafletjs.com) | BSD-2-Clause |

Senovės laikotarpių sienos yra apytikslės: seniausiems laikams duomenų rinkinyje nurodomos archeologinės kultūros, o ne valstybės. Kai kuriems metams (pvz., 1100 ir 1200 m.) Lietuvos teritorijai duomenų nėra. Airija duomenyse iki 1930 m. nubraižyta kaip vienas plotas, todėl programėlė pavadinimus patikslina pagal tai, kurioje salos dalyje esi.

## Licencija

GPL-3.0, nes projekte platinami GPL-3.0 licencijuoti istorinių sienų duomenys. Žr. [LICENSE](LICENSE).
