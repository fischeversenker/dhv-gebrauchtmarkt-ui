<script lang="ts">
  import { goto } from '$app/navigation';
  import OfferList from '$lib/OfferList.svelte';
  import { getMyOffers } from '$lib/offers';
  import { homeOffersGotLoaded, offers, shouldInfinityScroll, user } from '$lib/store';
  import { onDestroy, onMount } from 'svelte';

  onMount(async () => {
    $offers = [];
    if (!$user) {
      offers.set([]);
      goto('/');
    }

    $shouldInfinityScroll = false;

    window.scrollTo({ top: 0 });
    const myOffers = await getMyOffers().catch((error) => {
      console.warn(error);
      return [];
    });
    offers.set(myOffers);
  });

  onDestroy(async () => {
    $offers = [];
    $homeOffersGotLoaded = false;
    $shouldInfinityScroll = true;
  });
</script>

<svelte:head>
  <title>Meine Angebote</title>
</svelte:head>

<section class="section">
  <OfferList offers={$offers} />
</section>

<style>
  .section {
    padding-inline: 0.7rem;
    padding-top: 1.5rem;
  }
</style>
