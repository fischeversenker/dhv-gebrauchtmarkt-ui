import { get } from 'svelte/store';
import { filterCategory, filterSearchString, isLoading, itemsPerPage, offers } from './store';

type PriceType = 'VB' | 'Fixed' | 'OnRequest' | 'HighestBid';
type SellerType = 'private' | 'commercial';

export interface OfferPreview {
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

export interface Offer extends OfferPreview {
  description: string;
}

export async function getOffers(offset: number): Promise<OfferPreview[]> {
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

export async function getOffer(id: number): Promise<Offer> {
  const offer = get(offers).find((offer) => offer.id === id);
  // const offer = await fetch(`${import.meta.env.VITE_API_BASE}/offers/${id}`).then((res) => res.json()) as Offer;
  if (!offer) {
    throw new Error(`Wasn't able to find offer with ID ${id}`);
  }

  return {
    ...offer,
    description: 'my description'
  };
}
