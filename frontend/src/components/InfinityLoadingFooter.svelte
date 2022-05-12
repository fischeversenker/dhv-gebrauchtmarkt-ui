<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getOffers } from '../offers';
  import { initialOffersGotLoaded, isLoadingMore, itemsPerPage, offers, offersOffset } from '../store';

  let footer: HTMLElement;
  let lastTrigger = Date.now();

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.intersectionRatio >= 0.2) {
      loadMoreOffers();
    }
  }

  const observer = new IntersectionObserver(observerCallback, { threshold: 0.2 });

  function loadMoreOffers() {
    if (Date.now() - lastTrigger < 300) {
      return;
    }

    $offersOffset += $itemsPerPage;
    isLoadingMore.set(true);
    lastTrigger = Date.now();
    getOffers($offersOffset).then(newOffers => {
      offers.update((offers) => offers.concat(newOffers));
      isLoadingMore.set(false);
    });
  }

  const unsubscribeInitialOffersGotLoaded = initialOffersGotLoaded.subscribe((gotLoaded) => {
    if (gotLoaded) {
      observer.observe(footer);
    }
  });

  onDestroy(() => {
    unsubscribeInitialOffersGotLoaded();
  });
</script>


<main>
  <footer class="footer" bind:this={footer}></footer>
</main>
