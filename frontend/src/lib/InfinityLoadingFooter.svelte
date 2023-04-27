<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { Unsubscriber } from 'svelte/store';
  import { getOffers } from './offers';
  import { initialOffersGotLoaded, isLoadingMore, itemsPerPage, notification, offers, offersOffset, shouldInfinityScroll } from './store';

  let footer: HTMLElement;
  let lastTrigger = Date.now();

  let unsubscribeInitialOffersGotLoaded: Unsubscriber;

  function loadMoreOffers() {
    if (Date.now() - lastTrigger < 300) return;

    $offersOffset += $itemsPerPage;
    $isLoadingMore = true;
    lastTrigger = Date.now();
    getOffers($offersOffset).then((moreOffers) => {
      let hasNewOffers = false;
      const newOffers = moreOffers.filter((offer) => {
        const isDuplicate = $offers.some((o) => o.id === offer.id);
        hasNewOffers = hasNewOffers || isDuplicate;
        return !isDuplicate;
      });
      if (hasNewOffers) {
        $notification = {
          message: 'Es gibt neue Angebote. Tippe hier um die Seite neu zu laden.',
          type: 'success',
          callback: () => location.reload(),
          duration: 5000
        };
      }
      offers.update((offers) => offers.concat(newOffers));
      $isLoadingMore = false;
    });
  }

  onMount(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.intersectionRatio >= 0.2 && $shouldInfinityScroll) {
        loadMoreOffers();
      }
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

<footer class="footer" bind:this={footer} />
