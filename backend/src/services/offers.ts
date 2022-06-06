import { DOMParser, Element } from '../deps.ts';
import type { CommonOfferProperties, MusterData, Offer, OfferPreview, PriceType } from '../types.ts';

export function collectOfferPreviews(rawHtml: string): OfferPreview[] {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  if (!doc) {
    throw new Error('couldn\'t parse HTML');
  }

  const offerPreviewElements = doc.querySelectorAll('.gm_offer');
  const offerPreviews: OfferPreview[] = Array.from(offerPreviewElements).map((offerPreviewElementNode) => {
    return offerPreviewFromOfferElement(offerPreviewElementNode as Element);
  });
  return offerPreviews;
}

function commonOfferPropertiesFromOfferElement(
  offerElement: Element,
): Omit<CommonOfferProperties, 'title' | 'subtitle' | 'id' | 'url'> {
  const sellerElement = offerElement.querySelector('.gm_seller');
  const sellerType = sellerElement?.classList.contains('private') ? 'private' : 'commercial';
  const sellerTopElement = sellerElement?.querySelector('.top')!;
  sellerElement?.removeChild(sellerTopElement);
  const sellerAddressElements = sellerElement?.querySelectorAll('li');
  const sellerCountry = sellerAddressElements?.[0]?.textContent.replace(/Land:? /, '').trim();
  const sellerCity = sellerAddressElements?.[1]?.textContent.replace(/Ort:? /, '').trim();
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
    priceType = 'Auf Anfrage';
  } else if (priceString.includes('Höchstgebot')) {
    priceType = 'Höchstgebot';
  } else {
    price = Number(priceString);
    const priceTypeString = offerElement.querySelector('.gm_price_type')?.textContent?.trim()!;
    if (priceTypeString.includes('VB')) {
      priceType = 'VB';
    } else if (priceTypeString.includes('Fixpreis')) {
      priceType = 'Fixpreis';
    }
  }

  return {
    price,
    priceType,
    sellerType,
    sellerAddress,
    postedDate,
  };
}

function offerPreviewFromOfferElement(offerElement: Element): OfferPreview {
  const thumbnailUrl = offerElement.querySelector('.gm_offer_image img')?.getAttribute('src')!.replace(
    '/thumbnail/',
    '/medium/',
  )!;
  const descriptionElement = offerElement.querySelector('.gm_offer_description');
  const shortDescription = descriptionElement?.querySelector('.bodytext')?.innerHTML.trim()!;

  const rawTitle = descriptionElement?.querySelector('h2')?.textContent!;
  let title = rawTitle;
  let subtitle = undefined;
  if (rawTitle.includes('|')) {
    title = title.split('|')[0].trim();
    subtitle = rawTitle.split('|')[1].trim();
  }
  const url = offerElement.querySelector('.gm_offer_btn')?.getAttribute('href')!;
  const id = Number(url.match(/\/id\/(\d+)/)![1]);

  const commonOfferProperties = commonOfferPropertiesFromOfferElement(offerElement);

  return {
    ...commonOfferProperties,
    id,
    title,
    subtitle,
    thumbnailUrl,
    shortDescription,
    url: `https://www.dhv.de${url}`,
  };
}

export function collectOffer(rawHtml: string, id: string): Offer {
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
  if (!doc) {
    throw new Error('couldn\'t parse HTML');
  }

  const offerElement = doc.querySelector(`#gm_offer_id_${id}`);
  if (!offerElement) {
    throw new Error('couldn\'t find offer element');
  }

  const commonOfferProperties = commonOfferPropertiesFromOfferElement(offerElement as Element);

  const descriptionElement = offerElement.querySelector('.gm_offer_bodytext');
  const description = descriptionElement?.innerHTML.trim()!;

  const rawTitle = offerElement.querySelector('h1')?.textContent!;
  let title = rawTitle;
  let subtitle = undefined;
  if (rawTitle.includes('|')) {
    title = title.split('|')[0].trim();
    subtitle = rawTitle.split('|')[1].trim();
  }

  const imagesContainer = offerElement.querySelector('.gm_offer_image');
  const imageLinkNodes = imagesContainer?.querySelectorAll('.gm_lightbox');
  let thumbnailUrls: string[] = [];
  let imageUrls: string[] = [];
  if (imageLinkNodes) {
    imageUrls = Array.from(imageLinkNodes).map((imageLink) => (imageLink as Element).getAttribute('href')!);
    thumbnailUrls = Array.from(imageLinkNodes).map((imageLink) =>
      (imageLink as Element).querySelector('img')!.getAttribute('src')!
    );
  }

  const musterDataElement = offerElement.querySelector('.gm_offer_musterdaten');
  let musterData: MusterData | undefined = undefined;
  if (musterDataElement) {
    const rawDatabaseUrl = musterDataElement?.querySelector('.gm_offer_musterlink > a')?.getAttribute('href')!;
    const rawNormDataStrongElements = musterDataElement?.querySelectorAll('div > strong');
    const rawNormDataElements = Array.from(rawNormDataStrongElements).map((rawNormDataStrongElement) => {
      const label = rawNormDataStrongElement.textContent.trim();
      const parentElement = (rawNormDataStrongElement as Element).parentElement!;
      parentElement?.removeChild(rawNormDataStrongElement);
      const value = parentElement.textContent.trim();
      return { label, value };
    });

    const norm = rawNormDataElements.find((rawNormDataElement) => rawNormDataElement.label === 'Norm:');
    const certifier = rawNormDataElements.find((rawNormDataElement) => rawNormDataElement.label === 'Prüfstelle:');
    const classification = rawNormDataElements.find((rawNormDataElement) =>
      rawNormDataElement.label === 'Klassifizierung:'
    );
    const rawTakeoffWeight = rawNormDataElements.find((rawNormDataElement) =>
      rawNormDataElement.label === 'Startgewicht'
    );
    const takeoffWeightMatches = rawTakeoffWeight?.value.match(/von: (\d+) kg bis: (\d+) kg/);
    const takeoffWeight = { from: Number(takeoffWeightMatches?.[1]), to: Number(takeoffWeightMatches?.[2]) };

    musterData = {
      databaseUrl: rawDatabaseUrl ? `https://dhv.de${rawDatabaseUrl}` : undefined,
      certifier: certifier?.value,
      classification: classification?.value,
      norm: norm?.value,
      takeoffWeight,
    };
  }

  return {
    ...commonOfferProperties,
    id: Number(id),
    title,
    subtitle,
    thumbnailUrls,
    imageUrls,
    description,
    musterData,
    url: `https://www.dhv.de/db3/gebrauchtmarkt/anzeige/id/${id}`,
  };
}
