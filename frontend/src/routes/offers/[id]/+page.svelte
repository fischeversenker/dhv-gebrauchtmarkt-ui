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
  {#if data.offer}
    <SingleOffer offer={data.offer} />
  {/if}
</section>

<style>
  .section {
    padding-inline: 0.7rem;
    padding-top: 1.5rem;
  }
</style>
