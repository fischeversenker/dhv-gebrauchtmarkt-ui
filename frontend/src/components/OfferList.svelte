<script lang="ts">
  import { fade } from 'svelte/transition';
  import { offers, isLoadingMore } from '../store';
  import OfferCard from './OfferCard.svelte';

  let tileView = false;
</script>

<main>
  <section class="section">
    {#each $offers as offer}
      <div class="block">
        <OfferCard offer={offer} />
      </div>
    {/each}
  </section>
  <section class="section">
    {#if $isLoadingMore}
      <div class="block" in:fade>
        <progress class="progress is-info" max="100">0%</progress>
      </div>
    {/if}
  </section>
</main>
