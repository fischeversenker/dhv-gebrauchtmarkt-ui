<script lang="ts">
  import type { OfferPreview } from '@types';

  export let offer: OfferPreview;

  const showSubtitle = offer.subtitle || offer.isExpired || !offer.isPublic;
  let offerPostedDate = offer.postedDate.toLocaleDateString('de', { dateStyle: 'medium' });
</script>

<a href={offer.path}>
  <div class="card">
    <div class="card-image">
      <figure class="image is-1by1">
        <img src={offer.thumbnailUrl} alt={offer.title} />
      </figure>
    </div>

    <div class="card-content">
      <p class="title is-5">
        {offer.title}
      </p>
      {#if showSubtitle}
        <p class="subtitle has-text-grey is-6">
          {#if !offer.isPublic || offer.isExpired}
            <i class="fa-solid fa-eye-slash" />
          {/if}
          {#if offer.subtitle}
            {offer.subtitle}
          {/if}
        </p>
      {/if}

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

      <p class="title is-5 price">
        {#if offer.price || offer.priceType}
          {#if offer.price}<strong>{offer.price} €</strong>{/if}
          {#if offer.priceType}<span class="has-text-grey">{offer.priceType}</span>{/if}
        {:else}
          <span class="has-text-grey is-size-6">(Keine Preisangabe)</span>
        {/if}
      </p>
    </div>
  </div>
</a>

<style>
  .card {
    container-type: inline-size;
  }

  .image img {
    max-height: 250px;
    object-fit: cover;
  }

  .card-content {
    padding: 1rem 0.5rem;
  }

  .card .content {
    word-break: break-word;
  }

  .content {
    position: relative;
    height: 9rem;
    overflow: hidden;
  }

  .content::after {
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

  .price {
    overflow: initial;
  }

  .tag {
    white-space: initial;
    min-height: 2em;
    height: auto;
  }

  /* If the container is larger than 700px */
  @container (inline-size > 300px) {
    .image {
      padding-top: 40%;
    }
    .content {
      height: auto;
    }
  }
</style>
