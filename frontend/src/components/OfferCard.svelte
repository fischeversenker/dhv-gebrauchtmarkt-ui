<script lang="ts">
  import { tileView } from '../store';

  type PriceType = 'VB' | 'Fixed' | 'OnRequest' | 'HighestBid';
  type SellerType = 'private' | 'commercial';

  interface Offer {
    id: number;
    title: string;
    subtitle: string;
    thumbnailUrl: string;
    price?: number;
    priceType?: PriceType;
    url: string;
    shortDescription: string;
    sellerType: SellerType;
    sellerAddress?: {
      country?: string;
      city?: string;
    };
    postedDate: Date;
  }

  export let offer: Offer;

  let offerPostedDate = offer.postedDate.toLocaleDateString('de', { dateStyle: 'medium' });
</script>

<main>
  <a href={offer.url} target="_blank">
    <div class="card" class:card--compact={$tileView}>
      <div class="card-image">
        <figure class="image" class:is-1by1={$tileView}>
          <img src={offer.thumbnailUrl} alt={offer.title}>
        </figure>
      </div>

      <div class="card-content">
        <p class="title" class:is-4={!$tileView} class:is-5={$tileView}>{offer.title}</p>
        {#if offer.subtitle}
          <p class="subtitle has-text-grey" class:is-6={!$tileView} class:is-7={$tileView}>{offer.subtitle}</p>
        {/if}

        <div class="content">
          {offer.shortDescription}
        </div>

        <div class="tags">
          <span class="tag is-info">{offerPostedDate}</span>
          <span class="tag is-info">{offer.sellerAddress.city}</span>
          {#if offer.sellerAddress.country !== 'Deutschland'}
            <span class="tag is-info">{offer.sellerAddress.country}</span>
          {/if}
        </div>

        {#if offer.price || offer.priceType}
          <p class="title is-5">
            {#if offer.price}<strong>{offer.price} €</strong>{/if}
            {#if offer.priceType}<span class="has-text-grey">({offer.priceType})</span>{/if}
          </p>
        {/if}
      </div>
    </div>
  </a>
</main>

<style>
  .image img {
    max-height: 250px;
    object-fit: cover;
  }

  .card--compact .card-content {
    padding: 0.5rem;
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
    background-image: linear-gradient(to bottom, transparent 80%, white);
  }
</style>
