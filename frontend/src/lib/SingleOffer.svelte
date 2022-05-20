<script lang="ts">
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import type { Offer } from './offers';

  export let offer: Offer;

  let showImageModal = writable(false);
  let imageIndex = writable(0);

  let offerPostedDate = offer.postedDate.toLocaleDateString('de', { dateStyle: 'medium' });

  function onImageOverlayClicked(event: MouseEvent) {
    const windowWidth = window.innerWidth;
    if (event.clientX < windowWidth / 2) {
      $imageIndex = ($imageIndex - 1 + offer.imageUrls.length) % offer.imageUrls.length;
    } else {
      $imageIndex = ($imageIndex + 1) % offer.imageUrls.length;
    }
  }

  function onThumbnailClicked(index: number) {
    $imageIndex = index;
    $showImageModal = true;
  }
</script>

<template>
  <div class="block">
    <p class="title is-4">{offer.title}</p>
    {#if offer.subtitle}
      <p class="subtitle has-text-grey is-6">
        {offer.subtitle}
      </p>
    {/if}
  </div>

  <div class="block">
    <figure class="image header-image" on:click={() => onThumbnailClicked(0)}>
      <img src={offer.thumbnailUrls[0]} alt={offer.title} />
    </figure>
  </div>

  <div class="block">
    <div class="columns is-variable is-1 is-mobile">
      {#each offer.thumbnailUrls as imageUrl, index}
        {#if index > 0}
          <div class="column">
            <figure class="image thumbnail-image is-1by1" on:click={() => onThumbnailClicked(index)}>
              <img src={imageUrl} alt={offer.title} />
            </figure>
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <div class="block">
    <div class="offer-description">
      {@html offer.description}
    </div>
  </div>

  <div class="block">
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

  <div class="block">
    <a class="button is-info is-light is-fullwidth" href={offer.url} target="_blank">Im DHV-Gebrauchtmarkt anzeigen</a>
  </div>

  {#if $showImageModal}
    <div class="modal is-active" transition:fade={{ duration: 100 }}>
      <div class="modal-background" on:click={() => $showImageModal = false}></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{offer.title}</p>
          <button class="delete" aria-label="close" on:click={() => $showImageModal = false}></button>
        </header>
        <section class="modal-card-body">
          <div class="image">
            <img src={offer.imageUrls[$imageIndex]} alt={`${offer.title}, Bild #${$imageIndex}`}>
            <div class="image-overlay" on:click={onImageOverlayClicked}></div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <div>Bild {$imageIndex + 1} von {offer.imageUrls.length}</div>
        </footer>
      </div>
    </div>
  {/if}
</template>

<style>
  .header-image img {
    max-height: 250px;
    object-fit: cover;
  }

  .thumbnail-image img {
    object-fit: cover;
  }

  .columns .column,
  .columns .image {
    max-height: 150px;
    overflow: hidden;
  }

  .offer-description {
    word-break: break-word;
  }

  .modal-card-title {
    width: 94%;
  }

  .modal-card-body .image {
    position: relative;
  }

  .modal-card-body .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
