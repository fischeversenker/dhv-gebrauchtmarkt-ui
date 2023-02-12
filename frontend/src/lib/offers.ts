import { get } from 'svelte/store';
import { filterCategory, filterSearchString, isLoading, itemsPerPage } from './store';
import type { OfferPreview, Offer } from '@types';
import { addSeenOffer } from './indexed-db';

export interface ContactFormResult {
	name: string;
	email: string;
	phone: string;
	message: string;
	sendToMe: boolean;
}

interface OfferContactData extends ContactFormResult {
	offerId: number;
}

export async function getOffers(offset: number): Promise<OfferPreview[]> {
	isLoading.set(true);
	const receivedOffers = await fetch(
		`${import.meta.env.VITE_API_BASE}/offers?search=${get(
			filterSearchString
		)}&offset=${offset}&itemsPerPage=${get(itemsPerPage)}&category=${get(filterCategory)}`
	).then((res) => res.json());
	isLoading.set(false);

	addSeenOffer(receivedOffers.map((offer: OfferPreview) => offer.id));

	return receivedOffers.map((offer: OfferPreview) => {
		return {
			...offer,
			path: `/offers/${offer.id}`,
			postedDate: new Date(offer.postedDate),
			thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png')
				? '/images/gm_dummy.png'
				: offer.thumbnailUrl
		};
	});
}

export async function getOffer(id: number): Promise<Offer> {
	if (!id || Number.isNaN(id)) {
		throw new Error(`Invalid offer id: ${id}`);
	}

	isLoading.set(true);
	const offer = (await fetch(`${import.meta.env.VITE_API_BASE}/offers/${id}`).then((res) =>
		res.json()
	)) as Offer;
	isLoading.set(false);

	if (!offer) {
		throw new Error(`Wasn't able to find offer with ID ${id}`);
	}

	return {
		...offer,
		postedDate: new Date(offer.postedDate),
		thumbnailUrls: offer.thumbnailUrls.length > 0 ? offer.thumbnailUrls : ['/images/gm_dummy.png'],
		imageUrls: offer.imageUrls.length > 0 ? offer.imageUrls : ['/images/gm_dummy.png']
	};
}

export async function getMyOffers() {
	isLoading.set(true);
	const receivedOffers = (await fetch(`${import.meta.env.VITE_API_BASE}/offers/mine`, {
		credentials: 'include'
	}).then((res) => res.json())) as OfferPreview[];
	isLoading.set(false);

	return receivedOffers.map((offer: OfferPreview) => {
		return {
			...offer,
			path: `/offers/${offer.id}`,
			postedDate: new Date(offer.postedDate),
			thumbnailUrl: offer.thumbnailUrl.includes('_dummy.png')
				? '/images/gm_dummy.png'
				: offer.thumbnailUrl
		};
	});
}

export async function contactOffer(
	data: OfferContactData
): Promise<{ success: boolean; message: string }> {
	const res = await fetch(`${import.meta.env.VITE_API_BASE}/offers/${data.offerId}/contact`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	return res.json();
}
