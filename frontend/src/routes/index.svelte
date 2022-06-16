<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { browser } from '$app/env';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { debounce } from 'lodash-es';
  import {
    offers,
    filterCategory,
    initialOffersGotLoaded,
    offersOffset,
    filterSearchString,
    subscribeButSkipFirst,
    indexScrollTop
  } from '$lib/store';
  import { getOffers } from '$lib/offers';
  import FilterBar from '$lib/FilterBar.svelte';
  import InifinityLoadingFooter from '$lib/InfinityLoadingFooter.svelte';
  import OfferList from '$lib/OfferList.svelte';

  let unsubscribeSelectedCategory: Unsubscriber;
  let unsubscribeFilterSearchString: Unsubscriber;

  unsubscribeSelectedCategory = subscribeButSkipFirst(filterCategory, async () => {
    if (browser) window.scrollTo({ top: 0, behavior: 'smooth' });
    $offersOffset = 0;
    $offers = await getOffers($offersOffset);
  });

  unsubscribeFilterSearchString = subscribeButSkipFirst(
    filterSearchString,
    debounce(async () => {
      if (browser) window.scrollTo({ top: 0, behavior: 'smooth' });
      $offersOffset = 0;
      $offers = await getOffers($offersOffset);
    }, 500)
  );

  beforeNavigate(() => {
    $indexScrollTop = window.scrollY;
  });

  afterNavigate(() => {
    window.scrollTo({ top: $indexScrollTop });
  });

  onMount(async () => {
    if ($initialOffersGotLoaded) return;
    $offers = await getOffers($offersOffset);
    $initialOffersGotLoaded = true;
  });

  onDestroy(() => {
    unsubscribeSelectedCategory?.();
    unsubscribeFilterSearchString?.();
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<template>
  <OfferList offers={$offers} />

  <InifinityLoadingFooter />

  <FilterBar />
</template>
