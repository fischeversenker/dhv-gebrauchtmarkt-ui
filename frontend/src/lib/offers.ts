import { get } from 'svelte/store';
import { filterCategory, filterSearchString, isLoading, itemsPerPage } from './store';

export async function getOffers(offset: number) {
  isLoading.set(true);
  const receivedOffers = await fetch(
    `${import.meta.env.VITE_API_BASE}/offers?search=${get(
      filterSearchString
    )}&offset=${offset}&itemsPerPage=${get(itemsPerPage)}&category=${get(filterCategory)}`
  ).then((res) => res.json());
  isLoading.set(false);

  return receivedOffers.map((offer: Offer) => {
    return {
      ...offer,
      postedDate: new Date(offer.postedDate),
      thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png')
        ? '/images/gm_dummy.png'
        : offer.thumbnailUrl.replace('/thumbnail/', '/')
    };
  });
}

type PriceType = 'VB' | 'Fixed' | 'OnRequest' | 'HighestBid';
type SellerType = 'private' | 'commercial';

export interface Offer {
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
