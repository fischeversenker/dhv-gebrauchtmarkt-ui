import { DOMParser, Element } from 'https://deno.land/x/deno_dom@v0.1.22-alpha/deno-dom-wasm.ts';

type PriceType = 'VB' | 'Fixed' | 'OnRequest' | 'HighestBid';
type SellerType = 'private' | 'commercial';

interface Offer {
  id: number;
  title: string;
  subtitle?: string;
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

export function collectOffers(rawHtml: string): unknown[] {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  if (!doc) {
    throw new Error('couldn\'t parse HTML');
  }

  const offerElements = doc.querySelectorAll('.gm_offer');
  const offers: Offer[] = Array.from(offerElements).map((offerElementNode) => {
    const offerElement = offerElementNode as Element;
    return offerFromOfferElement(offerElement);
  });
  return offers;
}

function offerFromOfferElement(offerElement: Element): Offer {
  const thumbnailUrl = offerElement.querySelector('.gm_offer_image img')?.getAttribute('src')!;
  const descriptionElement = offerElement.querySelector('.gm_offer_description');
  const shortDescription = descriptionElement?.querySelector('.bodytext')?.innerHTML.replace('<br />', '\n').replace(
    '<br>',
    '\n',
  ).trim()!;

  const rawTitle = descriptionElement?.querySelector('h2')?.textContent!;
  let title = rawTitle;
  let subtitle = undefined;
  if (rawTitle.includes('|')) {
    title = title.split('|')[0].trim();
    subtitle = rawTitle.split('|')[1].trim();
  }
  const url = offerElement.querySelector('.gm_offer_btn')?.getAttribute('href')!;
  const id = Number(url.match(/\/id\/(\d+)/)![1]);

  const sellerElement = offerElement.querySelector('.gm_seller');
  const sellerType = sellerElement?.classList.contains('private') ? 'private' : 'commercial';
  const sellerTopElement = sellerElement?.querySelector('.top')!;
  sellerElement?.removeChild(sellerTopElement);
  const sellerAddressElements = sellerElement?.querySelectorAll('li');
  const sellerCountry = sellerAddressElements?.[0]?.textContent.replace('Land: ', '').trim();
  const sellerCity = sellerAddressElements?.[1]?.textContent.replace('Ort: ', '').trim();
  const postedDateString = sellerAddressElements?.[2]?.textContent.replace('Online seit: ', '')!;
  const postedDateParts = postedDateString.split('.').map((part) => Number(part.trim()));
  const postedDate = new Date(postedDateParts[2], postedDateParts[1] - 1, postedDateParts[0]);

  const sellerAddress = {
    country: sellerCountry,
    city: sellerCity,
  };

  const priceString = offerElement.querySelector('.gm_price')?.textContent?.trim()?.replace('€', '')?.trim()!;
  let price: number | undefined = undefined;
  let priceType: PriceType | undefined = undefined;
  if (priceString.includes('Auf Anfrage')) {
    priceType = 'OnRequest';
    price = undefined;
  } else if (priceString.includes('Höchstgebot')) {
    priceType = 'HighestBid';
  } else {
    price = Number(priceString);
    const priceTypeString = offerElement.querySelector('.gm_price_type')?.textContent?.trim()!;
    if (priceTypeString.includes('VB')) {
      priceType = 'VB';
    } else if (priceTypeString.includes('Fixpreis')) {
      priceType = 'Fixed';
    }
  }

  return {
    id,
    title,
    subtitle,
    thumbnailUrl,
    shortDescription,
    price,
    priceType,
    sellerType,
    sellerAddress,
    url: `https://www.dhv.de${url}`,
    postedDate,
  };
}
