import { get } from 'svelte/store';
import { filterCategory, isLoading, itemsPerPage } from './store';

export async function getOffers(offset: number) {
  isLoading.set(true);
  const receivedOffers = await fetch(`${process.env.API_BASE}/offers?search=&offset=${offset}&itemsPerPage=${get(itemsPerPage)}&category=${get(filterCategory)}`).then(res => res.json());
  isLoading.set(false);

  return receivedOffers.map(offer => {
    return {
      ...offer,
      postedDate: new Date(offer.postedDate),
      thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png') ? '/images/gm_dummy.png' : offer.thumbnailUrl.replace('/thumbnail/', '/'),
    };
  });
}
