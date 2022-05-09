<script lang="ts">
  import { onDestroy } from 'svelte';
  import { offers, filterCategory, initialOffersGotLoaded, offersOffset } from './store';
  import { getOffers } from './offers';
  import CategorySelect from './components/CategorySelect.svelte';
  import InifinityLoadingFooter from './components/InfinityLoadingFooter.svelte';
  import OfferList from './components/OfferList.svelte';

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

  <OfferList />

  <InifinityLoadingFooter />

  <CategorySelect />
</main>

<style lang="scss" global>
  @import 'bulma/bulma.sass';
</style>
