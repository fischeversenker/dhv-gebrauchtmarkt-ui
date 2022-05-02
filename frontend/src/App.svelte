<script lang="ts">
  import 'bulma/css/bulma.css';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import CategorySelect from './components/CategorySelect.svelte';
  import InifinityLoadingFooter from './components/InfinityLoadingFooter.svelte';
  import OfferCard from './components/OfferCard.svelte';
  import { isLoadingMore, offers, filterCategory, initialOffersGotLoaded, offersOffset } from './store';
  import { getOffers } from './offers';

  const unsubscribeSelectedCategory = filterCategory.subscribe(async (category) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $offersOffset = 0;
    offers.set(await getOffers($offersOffset));
    initialOffersGotLoaded.set(true);
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
    {#if $isLoadingMore}
      <div class="block" in:fade>
        <progress class="progress is-info" max="100">0%</progress>
      </div>
    {/if}
  </section>

  <InifinityLoadingFooter />

  <CategorySelect />
</main>
