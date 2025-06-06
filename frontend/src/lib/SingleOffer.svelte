<script lang="ts">
  import type { Offer } from '@types';
  import { onDestroy, onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import ContactForm from './ContactForm.svelte';
  import GalleryImage from './GalleryImage.svelte';
  import { contactOffer, deleteOffer, attemptToFetchMusterdata as attemptToFetchMusterdataFn, type ContactFormResult } from './offers';
  import { myOffers, notification } from './store';

  export let offer: Offer;

  let showImageModal = writable(false);
  let imageIndex = writable(0);

  let showContactForm = writable(false);
  let showDeleteForm = writable(false);

  let offerPostedDate = offer.postedDate.toLocaleDateString('de', { dateStyle: 'medium' });

  let attemptToFetchMusterdataFailed = false;

  const isMyOffer = $myOffers.has(offer.id);
  const showSubtitle = offer.subtitle || offer.isExpired || !offer.isPublic;

  function onShowNextImage() {
    $imageIndex = ($imageIndex + 1) % offer.imageUrls.length;
  }

  function onShowPreviousImage() {
    $imageIndex = ($imageIndex - 1 + offer.imageUrls.length) % offer.imageUrls.length;
  }

  function onThumbnailClicked(index: number) {
    $imageIndex = index;
    $showImageModal = true;
    window.history.pushState({ image: index }, '');
  }

  function onImageModalClose({ pop = true }: { pop?: boolean } = { pop: true }) {
    $showImageModal = false;
    if (pop) {
      window.history.back();
    }
  }

  function hasMusterData() {
    if (!offer.musterData) return false;

    const hasClassification = offer.musterData.classification && offer.musterData.classification.length > 0;
    const hasTakeoffWeight = offer.musterData.takeoffWeight && offer.musterData.takeoffWeight.from && offer.musterData.takeoffWeight.to;
    const hasDatabaseUrl = offer.musterData.databaseUrl && offer.musterData.databaseUrl !== 'undefined';

    return hasClassification && hasTakeoffWeight && hasDatabaseUrl;
  }

  async function attemptToFetchMusterdata() {
    const result = await attemptToFetchMusterdataFn(offer.title);
    if (result.success) {
      offer.musterData = result.musterData;
    } else {
      attemptToFetchMusterdataFailed = true;
    }
  }

  async function onContactFormSubmitted(event: CustomEvent<ContactFormResult>) {
    const result = await contactOffer({
      offerId: offer.id,
      name: event.detail.name,
      email: event.detail.email,
      phone: event.detail.phone,
      message: event.detail.message,
      sendToMe: event.detail.sendToMe
    }).catch(error => {
        return { success: false, message: "Da ist leider etwas schiefgelaufen. Bitte probiere es direkt über den offiziellen DHV Gebrauchtmarkt." };
      });

    $showContactForm = false;

    $notification = {
      type: result.success ? 'success' : 'error',
      message: result.message
    };
  }

  async function onDeleteConfirmClicked() {
    await deleteOffer(offer.id);
    $showDeleteForm = false;
    window.history.back();
  }

  function onPopState() {
    onImageModalClose({ pop: false });
  }

  onMount(() => {
    window.addEventListener('popstate', onPopState);
  });

  onDestroy(() => {
    window.removeEventListener('popstate', onPopState);
  });
</script>

<div>
  <div class="block">
    <p class="title is-4">
      {#if !offer.isPublic || offer.isExpired}
        <i class="fa-solid fa-eye-slash" />
      {/if}
      {offer.title}
    </p>
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

  {#if offer.musterData && hasMusterData()}
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
      <a
        class="button is-info is-light is-fullwidth mt-4"
        href={offer.musterData.databaseUrl}
        title="DHV Musterprüfung"
        target="_blank"
        rel="noreferrer"
      >
        In DHV-Gerätedatenbank anzeigen
      </a>
      <hr />
    </div>
  {:else}
    {#if attemptToFetchMusterdataFailed}
      <div class="notification is-danger is-light is-fullwidth"><center>Technische Daten konnten leider nicht geladen werden :(</center></div>
    {:else}
      <button class="button is-light is-fullwidth mb-4" type="button" on:click={() => attemptToFetchMusterdata()}>Technische Daten nachladen</button>
    {/if}
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

    <p class="title is-4">
      {#if offer.price || offer.priceType}
        {#if offer.price}<strong>{offer.price} €</strong>{/if}
        {#if offer.priceType}<span class="has-text-grey">{offer.priceType}</span>{/if}
      {:else}
        (Keine Preisangabe)
      {/if}
    </p>
  </div>

  <div class="block">
    {#if !isMyOffer}
      <button class="button is-primary is-fullwidth mb-4" on:click={() => ($showContactForm = true)}>Anbieter kontaktieren</button>
    {/if}
    <a class="button is-info is-light is-fullwidth" href={offer.url} target="_blank" rel="noreferrer">Im DHV-Gebrauchtmarkt anzeigen</a>
    {#if isMyOffer}
      <button class="button is-danger is-fullwidth mt-4" on:click={() => ($showDeleteForm = true)}>Angebot löschen</button>
    {/if}
  </div>

  {#if $showImageModal}
    <div class="modal is-active" transition:fade={{ duration: 100 }}>
      <div class="modal-background" on:click={() => onImageModalClose()} />
      <div class="modal-content">
        <GalleryImage
          src={offer.imageUrls[$imageIndex]}
          alt={`${offer.title}, Bild #${$imageIndex}`}
          index={$imageIndex + 1}
          count={offer.imageUrls.length}
          on:showNext={onShowNextImage}
          on:showPrevious={onShowPreviousImage}
        />
      </div>
      <button class="modal-close is-large" aria-label="close" on:click={() => onImageModalClose()} />
    </div>
  {/if}

  {#if $showContactForm}
    <div class="modal is-active" transition:fade={{ duration: 100 }}>
      <div class="modal-background" on:click={() => ($showContactForm = false)} />
      <div class="modal-content">
        <div class="box">
          <ContactForm on:submit={(event) => onContactFormSubmitted(event)} on:cancel={() => ($showContactForm = false)} />
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" on:click={() => ($showContactForm = false)} />
    </div>
  {/if}

  {#if $showDeleteForm}
    <div class="modal is-active" transition:fade={{ duration: 100 }}>
      <div class="modal-background" on:click={() => ($showDeleteForm = false)} />
      <div class="modal-content">
        <div class="box">
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-danger" on:click={() => (onDeleteConfirmClicked())}>Angebot endgültig löschen</button>
            </div>
            <div class="control">
              <button class="button is-link is-light" on:click={() => ($showDeleteForm = false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" on:click={() => ($showDeleteForm = false)} />
    </div>
  {/if}
</div>

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
</style>
