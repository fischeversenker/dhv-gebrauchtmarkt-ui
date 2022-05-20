<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy, onMount } from 'svelte';
  import { getOffer, type Offer } from '$lib/offers';
  import SingleOffer from '$lib/SingleOffer.svelte';

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

<svelte:head>
  <title>{offer?.title}</title>
</svelte:head>

<template>
  <section class="section">
    <div class="block">
      <a href="/">
        <span class="icon is-small">
          <i class="fa-solid fa-left-long" aria-hidden="true" />
        </span>
        <span>Zurück</span>
      </a>
    </div>

    {#if offer}
      <SingleOffer {offer} />
    {/if}
  </section>
</template>
