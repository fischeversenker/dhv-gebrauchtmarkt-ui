<script lang="ts">
  type PriceType = 'VB' | 'Fixed' | 'OnRequest' | 'HighestBid';
  type SellerType = 'private' | 'commercial';

  interface Offer {
    id: number;
    title: string;
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
  <a href={offer.url}>
    <div class="card">
      <div class="card-image">
        <figure class="image">
          <img src={offer.thumbnailUrl.replace('/thumbnail/', '/')} alt={offer.title}>
        </figure>
      </div>
      <div class="card-content">
        <p class="title is-5">{offer.title}</p>
        <p class="subtitle is-5 is-primary">
          {#if offer.price}<strong>{offer.price} €</strong>{/if}
          {#if offer.priceType}<span class="has-text-grey">({offer.priceType})</span>{/if}
        </p>

        <div class="content">
          {offer.shortDescription}
        </div>

        <div class="tags">
          <span class="tag is-info">{offerPostedDate}</span>
          <span class="tag is-info">{offer.sellerAddress.city}, {offer.sellerAddress.country}</span>
        </div>
      </div>
    </div>
  </a>
</main>
