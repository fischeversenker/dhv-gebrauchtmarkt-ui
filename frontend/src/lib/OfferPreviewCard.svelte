<script lang="ts">
  import { tileView } from './store';
  import type { OfferPreview } from './offers';

  export let offer: OfferPreview;

  let offerPostedDate = offer.postedDate.toLocaleDateString('de', { dateStyle: 'medium' });
</script>

<template>
  <a href={`offers/${offer.id}`} sveltekit:noscroll>
    <div class="card" class:card--compact={$tileView}>
      <div class="card-image">
        <figure class="image" class:is-1by1={$tileView}>
          <img src={offer.thumbnailUrl} alt={offer.title} />
        </figure>
      </div>

      <div class="card-content">
        <p class="title" class:is-4={!$tileView} class:is-5={$tileView}>{offer.title}</p>
        {#if offer.subtitle}
          <p class="subtitle has-text-grey is-6">
            {offer.subtitle}
          </p>
        {/if}

        <div class="content">
          {@html offer.shortDescription}
        </div>

        <div class="tags">
          <span class="tag is-dark">{offerPostedDate}</span>
          {#if offer.sellerAddress}
            {#if offer.sellerAddress.city}
              <span class="tag is-info">{offer.sellerAddress.city}</span>
            {/if}
            {#if offer.sellerAddress.country && offer.sellerAddress.country !== 'Deutschland'}
              <span class="tag is-warning">{offer.sellerAddress.country}</span>
            {/if}
          {/if}
        </div>

        {#if offer.price || offer.priceType}
          <p class="title is-5">
            {#if offer.price}<strong>{offer.price} €</strong>{/if}
            {#if offer.priceType}<span class="has-text-grey">{offer.priceType}</span>{/if}
          </p>
        {/if}
      </div>
    </div>
  </a>
</template>

<style>
  .image img {
    max-height: 250px;
    object-fit: cover;
  }

  .card--compact .card-content {
    padding: 1rem 0.5rem;
  }

  .card .content {
    word-break: break-word;
  }

  .card--compact .content {
    position: relative;
    height: 9rem;
    overflow: hidden;
  }

  .card--compact .content::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, transparent 85%, white);
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
