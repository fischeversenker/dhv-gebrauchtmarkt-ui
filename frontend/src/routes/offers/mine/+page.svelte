<script lang="ts">
	import { onMount } from 'svelte';
	import { getMyOffers } from '$lib/offers';
	import type { OfferPreview } from '@types';
	import OfferList from '$lib/OfferList.svelte';

	let offers: OfferPreview[] = [];

	onMount(async () => {
		window.scrollTo({ top: 0 });
		offers = await getMyOffers().catch((error) => {
			console.warn(error);
			return [];
		});
	});
</script>

<svelte:head>
	<title>Meine Angebote</title>
</svelte:head>

<template>
	<section class="section">
		<div class="block">
			<a href="/">
				<span class="icon is-small">
					<i class="fa-solid fa-left-long" aria-hidden="true" />
				</span>
				<span>Zurück</span>
			</a>
		</div>

		<OfferList {offers} />
	</section>
</template>
