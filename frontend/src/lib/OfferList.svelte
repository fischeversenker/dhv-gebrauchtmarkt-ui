<script lang="ts">
  import { fade, blur } from 'svelte/transition';
  import { isLoadingMore, isLoading, homeOffersGotLoaded } from './store';
  import OfferPreviewCard from './OfferPreviewCard.svelte';
  import type { OfferPreview } from '../../../backend/src/types';

  export let offers: OfferPreview[];
</script>

<div class="grid">
  {#if offers}
    {#each offers as offer (offer.id)}
      <div in:blur={{ duration: 200, amount: 20 }}>
        <OfferPreviewCard {offer} />
      </div>
    {:else}
      {#if $isLoading}
        <div in:fade>
          <progress class="progress is-info" max="100">0%</progress>
        </div>
      {:else if $homeOffersGotLoaded}
        <div class="notification is-info">Zu deiner Suche wurden keine Angebote gefunden. Bitte passe die Filter an.</div>
      {/if}
    {/each}
  {/if}

  {#if $isLoadingMore}
    <div in:fade>
      <progress class="progress is-info" max="100">0%</progress>
    </div>
  {/if}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--column-count, 2), minmax(0, 1fr));
    grid-gap: 0.75rem;
  }
</style>
