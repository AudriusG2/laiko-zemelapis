# Laiko žemėlapis

Pamatyk savo vietą per visą istoriją: nuo 123 000 m. pr. Kr. iki šių metų palydovo nuotraukos.

Kairėje skirtuko pusėje rodoma praeitis, dešinėje – dabartinis žemėlapis toje pačioje vietoje. Skirtuką galima tempti.

## Ką moka

- **Tavo vieta.** Mygtukas „Rasti mane“ naudoja naršyklės vietos nustatymą. Vietą taip pat galima surasti pagal pavadinimą, spustelėti žemėlapyje arba pasirinkti dešiniuoju pelės mygtuku.
- **Laiko juosta.** 54 istorinių sienų laikotarpiai nuo 123 000 m. pr. Kr. iki 2010 m. ir palydovų nuotraukos kiekvieniems metams nuo 2014 m. iki dabar.
- **Palyginimas.** Trys režimai: „Tik tada“, „Palyginti“ (skirtukas per vidurį) ir „Tik dabar“. Dabartinis žemėlapis gali būti gatvių, palydovo arba topografinis.
- **Kas čia buvo.** Sąrašas, kokiai valstybei ar kultūrai tavo vieta priklausė kiekvienu laikotarpiu. Paspaudus eilutę, žemėlapis persikelia į tą laiką.
- **Garsūs žemėlapiai.** Beveik 60 svarbiausių istorijos žemėlapių nuo Pavlovo mamuto ilties iki Google Maps: data, aprašymas lietuviškai, vaizdas ir vieta žemėlapyje.

## Paleidimas kompiuteryje

Reikia bet kokio statinio serverio, nes naršyklė neleidžia įkelti duomenų atidarius failą tiesiogiai.

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
| Garsių žemėlapių vaizdai | Vikipedija ir Wikimedia Commons | pagal kiekvieno failo licenciją |
| Žemėlapio biblioteka | [Leaflet](https://leafletjs.com) | BSD-2-Clause |

Senovės laikotarpių sienos yra apytikslės: seniausiems laikams duomenų rinkinyje nurodomos archeologinės kultūros, o ne valstybės. Kai kuriems metams (pvz., 1100 ir 1200 m.) Lietuvos teritorijai duomenų nėra.

## Licencija

GPL-3.0, nes projekte platinami GPL-3.0 licencijuoti istorinių sienų duomenys. Žr. [LICENSE](LICENSE).
