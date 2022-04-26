<script lang="ts">
  import 'bulma/css/bulma.css';
  import { onMount } from 'svelte';
  import Offer from './components/Offer.svelte';

  let offers = [];

  async function getOffers() {
    return [{"id":123005,"title":"Ozone Alpina 2 MS 2014 neuer Check","subtitle":"sehr guter Zustand","thumbnailUrl":"/dbresources/db3/img/dhv/gebrauchtmarkt/gm_dummy.png","shortDescription":"Biete einen gebrauchten aber sehr guten Alpina 2 in der Größe MS aus dem Jahr 2014 an. Mein Vorgänger hatte ca. 100h draufgeflogen und bei mir sind...","price":1250,"priceType":"VB","sellerType":"private","sellerAddress":{"country":"Deutschland","city":"87629 Füssen"},"url":"https://www.dhv.de/db3/gebrauchtmarkt/anzeige/id/123005","postedDate":"2022-04-25T22:00:00.000Z"},{"id":123004,"title":"Skywalk Cayenne 6 XXS","subtitle":"Top Zustand!!!","thumbnailUrl":"https://www.dhv.de/dbfiles/gm/images/2022/04/thumbnail/16510015971014img123004.jpg","shortDescription":"Zum Verkauf steht hier ein Skywalk Cayenne 6 XXS mit nur sehr wenigen Flugstunden. Keine Beschädigungen oder Reparaturen - Zustand ist neuwertig.\n\nP...","price":1890,"sellerType":"private","sellerAddress":{"country":"Deutschland","city":"8"},"url":"https://www.dhv.de/db3/gebrauchtmarkt/anzeige/id/123004","postedDate":"2022-04-25T22:00:00.000Z"},{"id":123000,"title":"Dudek Nemo 4 M","subtitle":"Idealer Anfängerschirm","thumbnailUrl":"https://www.dhv.de/dbfiles/gm/images/2022/04/thumbnail/16509956751114img123000.jpg","shortDescription":"Dudek Nemo 4 M in Rot-Orange, \n\nBj 07-2018, NP 2400,-€, Check bis 07-22, Startgewicht 70-110 kg, (mein Körpergewicht von 75kg ist ideal), 25m² Fläch...","price":1350,"priceType":"VB","sellerType":"private","sellerAddress":{"country":"Deutschland","city":"51469 Bergisch Gladbach"},"url":"https://www.dhv.de/db3/gebrauchtmarkt/anzeige/id/123000","postedDate":"2022-04-25T22:00:00.000Z"},{"id":122998,"title":"ICH SUCHE: SALEWA HIKE X-ALPS RUCKSACK // SKYWALK RANGE 2 XALPS","thumbnailUrl":"/dbresources/db3/img/dhv/gebrauchtmarkt/gm_dummy.png","shortDescription":"Ich suche primär den Salewa Hike X Alps Rucksack \nGgf auch ein Range 2 Xalps größe M<br>","price":1000,"priceType":"VB","sellerType":"private","sellerAddress":{"country":"Deutschland","city":"82467 Garmisch-Partenkirchen"},"url":"https://www.dhv.de/db3/gebrauchtmarkt/anzeige/id/122998","postedDate":"2022-04-25T22:00:00.000Z"},{"id":122997,"title":"NOVA Aonic M","subtitle":"90 - 110 Kg","thumbnailUrl":"https://www.dhv.de/dbfiles/gm/images/2022/04/thumbnail/16509923892028img122997.jpg","shortDescription":"Angeboten wird hier mein Nova Aonic aus 1. Hand.\n\nErstflug: 05/2020<br>\nTrimmtuning: 01/2021<br>\nNächster Check: 02/2023<br>Leider muss ich mich aus persönliche...","price":2690,"sellerType":"private","sellerAddress":{"country":"Deutschland","city":"71 Raum Stuttgart"},"url":"https://www.dhv.de/db3/gebrauchtmarkt/anzeige/id/122997","postedDate":"2022-04-25T22:00:00.000Z"}];
    // return fetch('http://localhost:8000/offers').then(res => res.json());
  }

  onMount(async () => {
    const res = await getOffers();
    offers = res.map(offer => {
      return {
        ...offer,
        postedDate: new Date(offer.postedDate),
        thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png') ? '/images/gm_dummy.png' : offer.thumbnailUrl.replace('/thumbnail/', '/'),
      };
    });
  });
</script>

<main>
  <section class="section">
    <div class="container">
      <p class="title is-1">
        DHV Gebrauchtmarkt 2.0
      </p>
    </div>
  </section>
  <section class="section">
    {#each offers as offer}
      <div class="block">
        <Offer offer={offer} />
      </div>
    {/each}
  </section>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
        is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
      </p>
    </div>
  </footer>
</main>
