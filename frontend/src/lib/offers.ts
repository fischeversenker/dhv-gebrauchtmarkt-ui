import { get } from 'svelte/store';
import { filterCategory, filterSearchString, isLoading, itemsPerPage, offers } from './store';

type PriceType = 'VB' | 'Fixed' | 'OnRequest' | 'HighestBid';
type SellerType = 'private' | 'commercial';

interface CommonOfferProperties {
  id: number;
  url: string;
  title: string;
  subtitle?: string;
  price?: number;
  priceType?: PriceType;
  sellerType: SellerType;
  sellerAddress?: {
    country?: string;
    city?: string;
  };
  postedDate: Date;
}

export interface OfferPreview extends CommonOfferProperties {
  thumbnailUrl: string;
  shortDescription: string;
}

interface MusterData {
  databaseUrl?: string;
  norm?: string;
  certifier?: string;
  classification?: string;
  takeoffWeight?: {
    from?: number;
    to?: number;
  }
}

export interface Offer extends CommonOfferProperties {
  description: string;
  imageUrls: string[];
  musterData?: MusterData;
}

export async function getOffers(offset: number): Promise<OfferPreview[]> {
  isLoading.set(true);
  const receivedOffers = await fetch(
    `${import.meta.env.VITE_API_BASE}/offers?search=${get(
      filterSearchString
    )}&offset=${offset}&itemsPerPage=${get(itemsPerPage)}&category=${get(filterCategory)}`
  ).then((res) => res.json());
  isLoading.set(false);

  return receivedOffers.map((offer: OfferPreview) => {
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
  if (!id || Number.isNaN(id)) {
    throw new Error(`Invalid offer id: ${id}`);
  }
  const offer = await fetch(`${import.meta.env.VITE_API_BASE}/offers/${id}`).then((res) => res.json()) as Offer;
  if (!offer) {
    throw new Error(`Wasn't able to find offer with ID ${id}`);
  }

  return {
    ...offer,
    postedDate: new Date(offer.postedDate),
    imageUrls: offer.imageUrls.length > 0
      ? offer.imageUrls
      : ['/images/gm_dummy.png']
  };
}
