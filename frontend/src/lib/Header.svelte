<script lang="ts">
  import { fade } from 'svelte/transition';
  import LoginForm from './LoginForm.svelte';
  import { offers, offersOffset, shouldInfinityScroll, user } from './store';
  import { getMyOffers, getOffers } from './offers';
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  let showLoginForm = false;
  let isAtHome = derived(page, ($page) => $page.route.id === '/');

  const loginEnabled = false;

  async function getMineOffers() {
    $shouldInfinityScroll = false;
    const myOffers = await getMyOffers();
    offers.set(myOffers);
  }

  async function getAllOffers() {
    $offersOffset = 0;
    $shouldInfinityScroll = true;
    $offers = await getOffers(0);
  }
</script>

<nav class="navbar is-light has-shadow">
  <div class="navbar-brand">
    {#if !$isAtHome}
      <div class="navbar-item">
        <a class="button" href="/">
          <span class="icon is-small">
            <i class="fa-solid fa-arrow-left" aria-hidden="true" />
          </span>
          <span>Zurück</span>
        </a>
      </div>
    {/if}

    {#if loginEnabled}
      {#if !$user}
        <a class="navbar-item" on:click={() => (showLoginForm = true)}>Login</a>
      {:else}
        <div class="navbar-item">{$user}</div>
        <a
          class="navbar-item"
          on:click={() => {
            /* logout */
          }}
        >
          <i class="fa-solid fa-power-off" />
        </a>
      {/if}
      <a class="navbar-item" on:click={async () => await getMineOffers()}>My Offers</a>
      <a class="navbar-item" on:click={async () => await getAllOffers()}>All Offers</a>
    {/if}
  </div>
</nav>

{#if showLoginForm}
  <div class="modal is-active" transition:fade={{ duration: 100 }}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-background" on:click={() => (showLoginForm = false)} />
    <div class="modal-content">
      <div class="box">
        <LoginForm on:close={() => (showLoginForm = false)} />
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" on:click={() => (showLoginForm = false)} />
  </div>
{/if}
