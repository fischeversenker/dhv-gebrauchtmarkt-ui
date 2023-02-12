import { getOffer } from '$lib/offers';

/** @type {import('./$types').PageLoad} */
export async function load({ params }: { params: { id?: string } }) {
	if (!params.id) return {};
	const offer = await getOffer(Number(params.id));

	return {
		offer
	};
}

export const prerender = false;
export const ssr = false;
export const csr = true;
