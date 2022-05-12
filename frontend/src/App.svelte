<script lang="ts">
  import { onDestroy } from 'svelte';
  import { debounce } from 'lodash';
  import { offers, filterCategory, initialOffersGotLoaded, offersOffset, filterSearchString } from './store';
  import { getOffers } from './offers';
  import CategorySelect from './components/CategorySelect.svelte';
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
