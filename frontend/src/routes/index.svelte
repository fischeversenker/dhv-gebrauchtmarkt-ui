<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { browser } from '$app/env';
  import { debounce } from 'lodash';
  import {
    offers,
    filterCategory,
    initialOffersGotLoaded,
    offersOffset,
    filterSearchString
  } from '$lib/store';
  import { getOffers } from '$lib/offers';
  import FilterBar from '$lib/FilterBar.svelte';
  import InifinityLoadingFooter from '$lib/InfinityLoadingFooter.svelte';
  import OfferList from '$lib/OfferList.svelte';

  let unsubscribeSelectedCategory: Unsubscriber;
  let unsubscribeFilterSearchString: Unsubscriber;

  if (browser) {
    unsubscribeSelectedCategory = filterCategory.subscribe(async () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      $offersOffset = 0;
      offers.set(await getOffers($offersOffset));
      initialOffersGotLoaded.set(true);
    });

    let initialSearchStringFired = false;
    unsubscribeFilterSearchString = filterSearchString.subscribe(
      debounce(async () => {
        if (!initialSearchStringFired) {
          initialSearchStringFired = true;
          return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        $offersOffset = 0;
        offers.set(await getOffers($offersOffset));
      }, 500)
    );
  }

  onDestroy(() => {
    unsubscribeSelectedCategory?.();
    unsubscribeFilterSearchString?.();
  });

  export const prerender = true;
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<OfferList />

<InifinityLoadingFooter />

<FilterBar />
