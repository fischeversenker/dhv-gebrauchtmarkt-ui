<script lang="ts">
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
    <div class="card">
      <div class="card-image">
        <figure class="image">
          <img src={offer.thumbnailUrl} alt={offer.title}>
        </figure>
      </div>

      <div class="card-content">
        <p class="title is-4">{offer.title}</p>
        {#if offer.subtitle}
          <p class="subtitle is-6 has-text-grey">{offer.subtitle}</p>
        {/if}

        <div class="content">
          {offer.shortDescription}
        </div>

        {#if offer.price || offer.priceType}
          <p class="title is-5">
            {#if offer.price}<strong>{offer.price} €</strong>{/if}
            {#if offer.priceType}<span class="has-text-grey">({offer.priceType})</span>{/if}
          </p>
        {/if}

        <div class="tags">
          <span class="tag is-info">{offerPostedDate}</span>
          <span class="tag is-info">{offer.sellerAddress.city}, {offer.sellerAddress.country}</span>
        </div>
      </div>
    </div>
  </a>
</main>

<style>
  .image img {
    max-height: 250px;
    object-fit: cover;
  }
</style>
