<script lang="ts">
  import { onDestroy } from 'svelte';
  import { debounce } from 'lodash';
  import { offers, filterCategory, initialOffersGotLoaded, offersOffset, filterSearchString } from './store';
  import { getOffers } from './offers';
  import FilterBar from './components/FilterBar.svelte';
  import InifinityLoadingFooter from './components/InfinityLoadingFooter.svelte';
  import OfferList from './components/OfferList.svelte';

  const unsubscribeSelectedCategory = filterCategory.subscribe(async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $offersOffset = 0;
    offers.set(await getOffers($offersOffset));
    initialOffersGotLoaded.set(true);
  });

  let initialSearchStringFired = false;
  const unsubscribeFilterSearchString = filterSearchString.subscribe(debounce(async () => {
    if (!initialSearchStringFired) {
      initialSearchStringFired = true;
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    $offersOffset = 0;
    offers.set(await getOffers($offersOffset));
  }, 500));

  onDestroy(() => {
    unsubscribeSelectedCategory();
    unsubscribeFilterSearchString();
  });
</script>


<main>
  <OfferList />

  <InifinityLoadingFooter />

  <FilterBar />
</main>


<style lang="scss" global>
  @import 'bulma/bulma.sass';
</style>
