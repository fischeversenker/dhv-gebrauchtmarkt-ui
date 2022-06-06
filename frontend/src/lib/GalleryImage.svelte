<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let src: string;
  export let alt: string;
  export let index: number;
  export let count: number;

  let touchStartX: number;
  let imageOffsetX: number = 0;

  function onImageTouchStart(event: TouchEvent) {
    touchStartX = event.touches[0].clientX;
  }

  function onImageTouchMove(event: TouchEvent) {
    imageOffsetX = event.touches[0].clientX - touchStartX;
  }

  function onImageTouchEnd(event: TouchEvent) {
    const touchEnd = event.changedTouches[0].clientX;

    if (touchStartX < touchEnd) {
      dispatch('showPrevious')
    } else {
      dispatch('showNext')
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
</script>

<div class="image">
  <img class="image-image" src={src} alt={alt} style:--offset-x={imageOffsetX}>
  <div class="image-overlay" on:click|preventDefault={onImageOverlayClicked} on:touchstart|preventDefault={onImageTouchStart} on:touchmove={onImageTouchMove} on:touchend={onImageTouchEnd}></div>
  <div class="image-count">{index}/{count}</div>
</div>

<style>
  .image {
    position: relative;
  }

  .image-image {
    transform: translateX(calc(var(--offset-x) * 1px));
    transition: transform .2s ease-out;
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
    right: .5rem;
    top: .5rem;
    padding: .1rem .5rem;
    background-color: rgba(255, 255, 255, 0.7);
    color: black;
  }
</style>
