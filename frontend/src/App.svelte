<script lang="ts">
  import 'bulma/css/bulma.css';
  import { onMount } from 'svelte';
  import Offer from './components/Offer.svelte';

  let offers = [];

  let currentOffset = 0;
  let selectedCategory = 0;
  let isLoading = false;
  let itemsPerPage = 5;

  let categories = [
    {
      value: 0,
      label: 'All',
    },
    {
      value: 1,
      label: 'Gleitschirme',
    },
    {
      value: 11,
      label: 'Gurtzeuge',
    },
    {
      value: 4,
      label: 'Retter',
    }
  ];

  async function getOffers(offset = 0) {
    isLoading = true;
    const receivedOffers = await fetch(`http://localhost:8000/offers?offset=${offset}&itemsPerPage=${itemsPerPage}&category=${selectedCategory}`).then(res => res.json());
    isLoading = false;
    return receivedOffers.map(offer => {
      return {
        ...offer,
        postedDate: new Date(offer.postedDate),
        thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png') ? '/images/gm_dummy.png' : offer.thumbnailUrl.replace('/thumbnail/', '/'),
      };
    });
  }

  async function setCategory(category: number) {
    if (selectedCategory === category)
      return;

    selectedCategory = category;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    offers = await getOffers();
  }

  function loadMoreOffers() {
    currentOffset += itemsPerPage;
    getOffers(currentOffset).then(newOffers => {
      offers = offers.concat(newOffers);
    });
  }

  onMount(async () => {
    offers = await getOffers();
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

  <section class="section">
    <button class="button is-primary is-fullwidth" class:is-loading={isLoading} on:click={() => loadMoreOffers()}>Load more</button>
  </section>

  <nav class="level is-mobile has-background-light m-0 px-5 py-4 category-select">
    {#each categories as category}
      <div class="level-item">
        <button class="button" class:is-info={selectedCategory === category.value} class:is-loading={isLoading} on:click={() => setCategory(category.value)}>{category.label}</button>
      </div>
    {/each}
  </nav>

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

<style>
  .category-select {
    position: fixed;
    width: 100%;
    bottom: 0;
    box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%)
  }
</style>
