<script lang="ts">
	import { onMount } from 'svelte';
	import SingleOffer from '$lib/SingleOffer.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		window.scrollTo({ top: 0 });
	});
</script>

<svelte:head>
	<title>{data.offer?.title}</title>
</svelte:head>

<section class="section">
	<div class="block">
		<a href="/">
			<span class="icon is-small">
				<i class="fa-solid fa-left-long" aria-hidden="true" />
			</span>
			<span>Zurück</span>
		</a>
	</div>

	{#if data.offer}
		<SingleOffer offer={data.offer} />
	{/if}
</section>
