<script lang="ts">
  import { browser } from '$app/env';
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { getOffers } from './offers';
  import {
    initialOffersGotLoaded,
    isLoadingMore,
    itemsPerPage,
    offers,
    offersOffset
  } from './store';

  let footer: HTMLElement;
  let lastTrigger = Date.now();

  let unsubscribeInitialOffersGotLoaded: Unsubscriber;

  function loadMoreOffers() {
    if (Date.now() - lastTrigger < 300) return;

    $offersOffset += $itemsPerPage;
    $isLoadingMore = true;
    lastTrigger = Date.now();
    getOffers($offersOffset).then((moreOffers) => {
      // remove existing offers
      // TODO: show toast "new offers available" if there are new offers
      const newOffers = moreOffers.filter(
        (offer) => !$offers.some((o) => o.id === offer.id)
      );
      offers.update((offers) => offers.concat(newOffers));
      $isLoadingMore = false;
    });
  }

  onMount(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.intersectionRatio >= 0.2) loadMoreOffers();
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.2 });
    unsubscribeInitialOffersGotLoaded = initialOffersGotLoaded.subscribe((gotLoaded) => {
      if (gotLoaded) observer.observe(footer);
    });
  });

  onDestroy(() => {
    unsubscribeInitialOffersGotLoaded?.();
  });
</script>

<template>
  <footer class="footer" bind:this={footer} />
</template>
