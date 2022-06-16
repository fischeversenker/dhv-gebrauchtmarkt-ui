export type PriceType = 'VB' | 'Fixpreis' | 'Auf Anfrage' | 'Höchstgebot';
type SellerType = 'private' | 'commercial';

export interface CommonOfferProperties {
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
  path?: string;
}

export interface Offer extends CommonOfferProperties {
  description: string;
  thumbnailUrls: string[];
  imageUrls: string[];
  musterData?: MusterData;
}

export interface MusterData {
  databaseUrl?: string;
  norm?: string;
  certifier?: string;
  classification?: string;
  takeoffWeight?: {
    from?: number;
    to?: number;
  };
}
