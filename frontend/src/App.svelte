<script lang="ts">
  import 'bulma/css/bulma.css';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { writable } from 'svelte/store';
  import CategorySelect from './components/CategorySelect.svelte';
  import OfferCard from './components/OfferCard.svelte';
  import { isLoading, isLoadingMore, offers, selectedCategory } from './store';

  const initialOffersGotLoaded = writable(false);

  let currentOffset = 0;
  let itemsPerPage = 5;

  let footer: HTMLElement;

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.intersectionRatio >= 0.2) {
      loadMoreOffers();
    }
  }

  const observer = new IntersectionObserver(observerCallback, { threshold: 0.2 });

  async function getOffers(offset: number, category: number) {
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
    isLoadingMore.set(true);
    getOffers(currentOffset, $selectedCategory).then(newOffers => {
      offers.update((offers) => offers.concat(newOffers));
      isLoadingMore.set(false);
    });
  }

  const unsubscribeSelectedCategory = selectedCategory.subscribe(async (category) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentOffset = 0;
    offers.set(await getOffers(currentOffset, category));
    initialOffersGotLoaded.set(true);
  });

  const unsubscribeInitialOffersGotLoaded = initialOffersGotLoaded.subscribe((gotLoaded) => {
    if (gotLoaded) {
      observer.observe(footer);
    }
  });

  onDestroy(() => {
    unsubscribeSelectedCategory();
    unsubscribeInitialOffersGotLoaded();
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
    {#if $isLoadingMore}
      <div class="block" in:fade>
        <progress class="progress is-info" max="100">0%</progress>
      </div>
    {/if}
  </section>

  <footer class="footer" bind:this={footer}></footer>

  <CategorySelect />
</main>
