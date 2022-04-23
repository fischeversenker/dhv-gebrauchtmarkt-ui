interface Offer {
  title: string;
  thumbnail: string;
  price: number;
  priceType: string;
  url: string;
  shortDescription: string;
  sellerType: 'private' | 'commercial';
  sellerAddress?: {
    country?: string;
    city?: string;
  };
}

export function collectOffers(rawHtml: string): Offer[] {
  // turn raw HTML offers into list of offers
  return [];
}
