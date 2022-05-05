<script lang="ts">
  import { fade } from 'svelte/transition';
  import { offers, isLoadingMore, tileView } from '../store';
  import OfferCard from './OfferCard.svelte';
</script>

<main>
  <section class="section">
    <div class="block tile-view-toggle">
      <button class="button" on:click={() => $tileView = !$tileView}>
        {$tileView ? 'Listenansicht' : 'Kachelansicht'}
      </button>
    </div>
    <div class:grid--active={$tileView}>
      {#each $offers as offer}
        <div class="block">
          <OfferCard offer={offer} />
        </div>
      {/each}
    {#if $isLoadingMore}
      <div class="block" in:fade>
        <progress class="progress is-info" max="100">0%</progress>
      </div>
    {/if}
  </section>
</main>


<style>
  .grid--active {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 0.5rem;
    padding: 2rem 0.5rem;
  }

  .tile-view-toggle {
    text-align: right;
  }
</style>
