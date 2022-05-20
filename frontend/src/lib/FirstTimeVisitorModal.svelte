<script lang="ts">
  import { browser } from '$app/env';
  import { firstTimeVisitor, FIRST_TIME_VISITOR_STORAGE_KEY } from './store';

  let isLargeWindow = browser && window.innerWidth >= 700;

  function onCloseModal() {
    firstTimeVisitor.update(() => {
      if (browser) localStorage.setItem(FIRST_TIME_VISITOR_STORAGE_KEY, 'false');
      return false;
    });
  }
</script>

<template>
  {#if $firstTimeVisitor}
    <div class="modal is-active">
      <div class="modal-background" on:click={onCloseModal}></div>
      <div class="modal-content">
        <div class="box">
          <article class="message is-info">
            <div class="message-header">
              <p>Info</p>
            </div>
            <div class="message-body">
              Dies ist ein privates Projekt um den <a href="https://www.dhv.de/db3/gebrauchtmarkt/anzeigen" target="_blank" rel="noopener">DHV Gebrauchtmarkt</a> für mobile Geräte zu optimieren. Alle Angebote auf dieser Seite stammen direkt von dort. Ich übernehme absolut keine Haftung für jegliche Inhalte der Angebote.
            </div>
          </article>

          {#if isLargeWindow}
            <article class="message is-warning">
              <div class="message-header">
                <p>Warnung</p>
              </div>
              <div class="message-body">
                <div class="block">
                  <p>Du scheinst diese Seite von einem Desktop-Geräte zu besuchen. Diese Seite ist ausschließelich für mobile Geräte optimiert.</p>
                  <p>Bitte wechsle zur offiziellen Seite des DHV Gebrauchtmarkts:</p>
                </div>
                <div class="block dhv-button">
                  <a class="button is-info" href="https://www.dhv.de/db3/gebrauchtmarkt/anzeigen" rel="noopener">Zum DHV Gebrauchtmarkt</a>
                </div>
              </div>
            </article>
          {/if}
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" on:click={onCloseModal}></button>
    </div>
  {/if}
</template>

<style>
  .dhv-button {
    text-align: center;
  }
</style>
