<script lang="ts">
  import { fade, blur } from 'svelte/transition';
  import {
    offers,
    isLoadingMore,
    isLoading,
    initialOffersGotLoaded
  } from './store';
  import OfferPreviewCard from './OfferPreviewCard.svelte';
</script>

<template>
  <section class="section">
    <div class="grid">
      {#each $offers as offer (offer.id)}
        <div in:blur={{ duration: 200, amount: 20 }}>
          <OfferPreviewCard {offer} />
        </div>
      {:else}
        {#if $isLoading}
          <div in:fade>
            <progress class="progress is-info" max="100">0%</progress>
          </div>
        {:else if $initialOffersGotLoaded}
          <div class="notification is-info">
            Zu deiner Suche wurden keine Angebote gefunden. Bitte passe die Filter an.
          </div>
        {/if}
      {/each}

      {#if $isLoadingMore}
        <div in:fade>
          <progress class="progress is-info" max="100">0%</progress>
        </div>
      {/if}
    </div>
  </section>
</template>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 0.5rem;
  }
</style>
