<script lang="ts">
  import type { Offer } from './offers';

  export let offer: Offer;

  let offerPostedDate = offer.postedDate.toLocaleDateString('de', { dateStyle: 'medium' });
</script>

<template>
  <div class="card">
    <div class="card-image">
      <figure class="image">
        <img src={offer.imageUrls[0]} alt={offer.title} />
      </figure>
    </div>

    <div class="card-content">
      <p class="title is-4">{offer.title}</p>
      {#if offer.subtitle}
        <p class="subtitle has-text-grey is-6">
          {offer.subtitle}
        </p>
      {/if}

      <div class="content">
        {@html offer.description}
      </div>

      <div class="tags">
        <span class="tag is-info">{offerPostedDate}</span>
        {#if offer.sellerAddress}
          {#if offer.sellerAddress.city}
            <span class="tag is-info">{offer.sellerAddress.city}</span>
          {/if}
          {#if offer.sellerAddress.country && offer.sellerAddress.country !== 'Deutschland'}
            <span class="tag is-info">{offer.sellerAddress.country}</span>
          {/if}
        {/if}
      </div>

      {#if offer.price || offer.priceType}
        <p class="title is-5">
          {#if offer.price}<strong>{offer.price} €</strong>{/if}
          {#if offer.priceType}<span class="has-text-grey">{offer.priceType}</span>{/if}
        </p>
      {/if}

      <a class="button is-info is-light is-fullwidth" href={offer.url} target="_blank">Im DHV-Gebrauchtmarkt anzeigen</a>
    </div>
  </div>
</template>

<style>
  .image img {
    max-height: 250px;
    object-fit: cover;
  }

  .card .content {
    word-break: break-word;
  }
</style>
