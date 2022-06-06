<script lang="ts">
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import { contactOffer, type ContactFormResult } from './offers';
  import type { Offer} from '@types';
  import { notification } from './store';
  import ContactForm from './ContactForm.svelte';

  export let offer: Offer;

  let showImageModal = writable(false);
  let imageIndex = writable(0);

  let showContactForm = writable(false);

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

  async function onContactFormSubmitted(event: CustomEvent<ContactFormResult>) {
    const result = await contactOffer({
      offerId: offer.id,
      name: event.detail.name,
      email: event.detail.email,
      phone: event.detail.phone,
      message: event.detail.message,
      sendToMe: event.detail.sendToMe,
    });

    $showContactForm = false;

    $notification = {
      type: result.success ? 'success' : 'error',
      message: result.message,
    };
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
      <img src={offer.imageUrls[0]} alt={offer.title} />
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

  {#if offer.musterData}
    <div class="block">
      <table class="table is-narrow is-striped is-fullwidth">
        <tr>
          <th>Klassifizierung</th>
          <td>{offer.musterData.classification}</td>
        </tr>
        <tr>
          <th>Startgewicht</th>
          <td>{offer.musterData.takeoffWeight?.from} - {offer.musterData.takeoffWeight?.to} kg</td>
        </tr>
      </table>
      <a class="button is-info is-light is-fullwidth mt-4" href={offer.musterData.databaseUrl} title="DHV Musterprüfung" target="_blank" rel="noopener">
        In DHV-Gerätedatenbank anzeigen
      </a>
      <hr>
    </div>
  {/if}

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
    <div class="button is-primary is-fullwidth mb-4" on:click={() => $showContactForm = true}>Anbieter kontaktieren</div>
    <a class="button is-info is-light is-fullwidth" href={offer.url} target="_blank">Im DHV-Gebrauchtmarkt anzeigen</a>
  </div>

  {#if $showImageModal}
    <div class="modal is-active" transition:fade={{ duration: 100 }}>
      <div class="modal-background" on:click={() => $showImageModal = false}></div>
      <div class="modal-content">
        <div class="image">
          <img src={offer.imageUrls[$imageIndex]} alt={`${offer.title}, Bild #${$imageIndex}`}>
          <div class="image-overlay" on:click={onImageOverlayClicked}></div>
          <div class="image-count">{$imageIndex + 1}/{offer.imageUrls.length}</div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" on:click={() => $showImageModal = false}></button>
    </div>
  {/if}

  {#if $showContactForm}
  <div class="modal is-active" transition:fade={{ duration: 100 }}>
    <div class="modal-background" on:click={() => $showContactForm = false}></div>
    <div class="modal-content">
      <div class="box">
        <ContactForm on:submit={(event) => onContactFormSubmitted(event)} on:cancel={() => $showContactForm = false} />
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => $showContactForm = false}></button>
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

  .modal-content .image {
    position: relative;
  }

  .modal-content .image .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .modal-content .image .image-count {
    position: absolute;
    left: .5rem;
    bottom: .5rem;
    padding: .1rem .5rem;
    background-color: rgba(255, 255, 255, 0.7);
    color: black;
  }
</style>
