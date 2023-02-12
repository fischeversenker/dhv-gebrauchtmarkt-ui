<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';

  const dispatch = createEventDispatcher();

  export let src: string;
  export let alt: string;
  export let index: number;
  export let count: number;

  let loading = writable(false);
  let touchStartX: number;
  let imageOffsetX = 0;

  function onImageTouchStart(event: TouchEvent) {
    if (count === 1) return;
    touchStartX = event.touches[0].clientX;
  }

  function onImageTouchMove(event: TouchEvent) {
    if (count === 1) return;
    imageOffsetX = event.touches[0].clientX - touchStartX;
  }

  function onImageTouchEnd(event: TouchEvent) {
    if (count === 1) return;
    const touchEnd = event.changedTouches[0].clientX;

    $loading = true;
    if (touchStartX < touchEnd) {
      dispatch('showPrevious');
    } else {
      dispatch('showNext');
    }

    touchStartX = -1;
    imageOffsetX = 0;
  }

  function onImageOverlayClicked(event: MouseEvent) {
    const windowWidth = window.innerWidth;
    if (event.clientX < windowWidth / 2) {
      dispatch('showPrevious');
    } else {
      dispatch('showNext');
    }
  }

  function onImageLoaded() {
    $loading = false;
  }
</script>

<div class="image" class:loading={$loading}>
  <img class="image-image" {src} {alt} style:--offset-x={imageOffsetX} on:load={onImageLoaded} />
  <div
    class="image-overlay"
    on:click|preventDefault={onImageOverlayClicked}
    on:touchstart|preventDefault={onImageTouchStart}
    on:touchmove={onImageTouchMove}
    on:touchend={onImageTouchEnd}
  />
  <div class="image-count">{index}/{count}</div>
</div>

<style>
  .image {
    position: relative;
    transition: opacity 0.2s ease-out;
  }

  .image.loading {
    opacity: 0.4;
    pointer-events: none;
  }

  .image-image {
    transform: translateX(calc(var(--offset-x) * 1px));
    transition: transform 0.2s ease-out;
  }

  .image .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .image .image-count {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    padding: 0.1rem 0.5rem;
    background-color: rgba(255, 255, 255, 0.7);
    color: black;
  }
</style>
