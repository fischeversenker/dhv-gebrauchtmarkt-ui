<script lang="ts">
  import { fade, blur } from 'svelte/transition';
  import { offers, isLoadingMore, tileView, isLoading, TILE_VIEW_STORAGE_KEY } from '../store';
  import OfferCard from './OfferCard.svelte';

  function toggleTileView() {
    tileView.update(currentValue => {
      localStorage.setItem(TILE_VIEW_STORAGE_KEY, String(!currentValue));
      return !currentValue;
    });
  }
</script>


<template>
  <section class="section">
    <div class="block tile-view-toggle">
      <button class="button" on:click={toggleTileView}>
        <i class="fa-solid" class:fa-grip-vertical={!$tileView} class:fa-grip-lines={$tileView}></i>
      </button>
    </div>
    <div class:grid--active={$tileView}>
      {#each $offers as offer (offer.id)}
        <div class:block={!$tileView} transition:blur={{ duration: 400, amount: 20 }}>
          <OfferCard offer={offer} />
        </div>
      {:else}
        {#if $isLoading}
          <div class:block={!$tileView} in:fade>
            <progress class="progress is-info" max="100">0%</progress>
          </div>
        {:else}
          <div class="notification is-info">
            Zu deiner Suche wurden keine Angebote gefunden. Bitte passe die Filter an.
          </div>
        {/if}
      {/each}
    {#if $isLoadingMore}
      <div class:block={!$tileView} in:fade>
        <progress class="progress is-info" max="100">0%</progress>
      </div>
    {/if}
  </section>
</template>


<style>
  .grid--active {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 0.5rem;
  }

  .tile-view-toggle {
    text-align: right;
  }
</style>
