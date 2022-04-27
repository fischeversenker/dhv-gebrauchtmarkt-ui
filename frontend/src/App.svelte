<script lang="ts">
  import 'bulma/css/bulma.css';
  import { onDestroy } from 'svelte';
  import CategorySelect from './components/CategorySelect.svelte';
  import OfferCard from './components/OfferCard.svelte';
  import { isLoading, offers, selectedCategory } from './store';

  let currentOffset = 0;
  let itemsPerPage = 5;

  async function getOffers(offset = 0, category = 0) {
    isLoading.set(true);
    const receivedOffers = await fetch(`${process.env.API_BASE}/offers?offset=${offset}&itemsPerPage=${itemsPerPage}&category=${category}`).then(res => res.json());
    isLoading.set(false);
    return receivedOffers.map(offer => {
      return {
        ...offer,
        postedDate: new Date(offer.postedDate),
        thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png') ? '/images/gm_dummy.png' : offer.thumbnailUrl.replace('/thumbnail/', '/'),
      };
    });
  }

  function loadMoreOffers() {
    currentOffset += itemsPerPage;
    getOffers(currentOffset).then(newOffers => {
      offers.update((offers) => offers.concat(newOffers));
    });
  }

  const unsubscribeSelectedCategory = selectedCategory.subscribe(async (category) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentOffset = 0;
    offers.set(await getOffers(0, category));
  });

  onDestroy(() => {
    unsubscribeSelectedCategory();
  });
</script>

<main>
  <section class="section">
    <h1 class="title is-3">
      DHV Gebrauchtmarkt 2.0
    </h1>
  </section>

  <section class="section">
    {#each $offers as offer}
      <div class="block">
        <OfferCard offer={offer} />
      </div>
    {/each}
  </section>

  <section class="section">
    <button class="button is-primary is-fullwidth" class:is-loading={$isLoading} on:click={() => loadMoreOffers()}>Load more</button>
  </section>

  <CategorySelect />

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
