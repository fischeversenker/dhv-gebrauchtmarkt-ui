<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { getOffer, type Offer } from '../../lib/offers';
  import OfferCard from '../../lib/OfferCard.svelte';

  let offer: Offer | undefined;
  const unsubscribePage = page.subscribe(async (value) => {
    if (!value.params.id) return;

    offer = await getOffer(Number(value.params.id)).catch((error) => {
      console.warn(error);
      return undefined;
    });
  });

  onMount(() => {
    window.scrollTo({ top: 0 });
  });

  onDestroy(() => {
    unsubscribePage();
  });
</script>

<template>
  <section class="section">
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="/">
            <span class="icon is-small">
              <i class="fas fa-home" aria-hidden="true" />
            </span>
            <span>Home</span>
          </a>
        </li>
        <li class="is-active"><a href="./" aria-current="page">{offer?.title}</a></li>
      </ul>
    </nav>

    {#if offer}
      <OfferCard {offer} />
    {/if}
  </section>
</template>
