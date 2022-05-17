<script lang="ts">
  import { browser } from '$app/env';
  import { onDestroy } from 'svelte';
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

  if (browser) {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.intersectionRatio >= 0.2) loadMoreOffers();
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.2 });
    unsubscribeInitialOffersGotLoaded = initialOffersGotLoaded.subscribe((gotLoaded) => {
      if (gotLoaded) observer.observe(footer);
    });
  }

  function loadMoreOffers() {
    if (Date.now() - lastTrigger < 300) return;

    $offersOffset += $itemsPerPage;
    isLoadingMore.set(true);
    lastTrigger = Date.now();
    getOffers($offersOffset).then((newOffers) => {
      offers.update((offers) => offers.concat(newOffers));
      $isLoadingMore = false;
    });
  }

  onDestroy(() => {
    unsubscribeInitialOffersGotLoaded?.();
  });
</script>

<template>
  <footer class="footer" bind:this={footer} />
</template>
