<script lang="ts">
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';
  import { fade } from 'svelte/transition';
  import LoginForm from './LoginForm.svelte';
  import { user, columnCount, COLUMN_COUNT_STORAGE_KEY } from './store';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let showLoginForm = false;
  let isAtHome = derived(page, ($page) => $page.route.id === '/' || $page.route.id === '/offers/mine');

  async function logout() {
    await fetch(`${import.meta.env.VITE_API_BASE}/logout`, {
      method: 'GET',
      credentials: 'include'
    });
    $user = null;
    goto('/');
  }

  onMount(async () => {
    const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE}/user`, {
      credentials: 'include'
    });
    if (loginResponse.ok) {
      $user = (await loginResponse.json()).username;
    }
  });

  function setViewMode(mode: 'list' | 'grid') {
    const newColumnCount = mode === 'list' ? 1 : 2;
    if (browser) localStorage.setItem(COLUMN_COUNT_STORAGE_KEY, newColumnCount.toString());
    $columnCount = newColumnCount;
  }
</script>

<nav class="navbar is-light has-shadow">
  <div class="navbar-menu py-0">
    <div class="navbar-start">
      {#if !$isAtHome}
        <div class="navbar-item">
          <a class="button is-info is-light" href="/">
            <span class="icon is-small">
              <i class="fa-solid fa-arrow-left" aria-hidden="true" />
            </span>
            <span>Zurück</span>
          </a>
        </div>
      {:else}
        <div class="navbar-item">
          <div class="field has-addons">
            <p class="control">
              <button class="button" class:is-primary={$columnCount === 1} on:click={() => setViewMode('list')}>
                <span class="icon is-small">
                  <i class="fas fa-bars"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button" class:is-primary={$columnCount === 2} on:click={() => setViewMode('grid')}>
                <span class="icon is-small">
                  <i class="fas fa-grip-vertical"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
      {/if}
    </div>
    <div class="navbar-end">
      {#if !$user}
        <a class="navbar-item" on:click={() => (showLoginForm = true)}>Login</a>
      {:else}
        <!-- <div class="navbar-item">{$user}</div> -->
        <a class="navbar-item" href="/offers/mine">Meine</a>
        <a class="navbar-item" href="/">Alle</a>
        <!-- svelte-ignore a11y-missing-attribute -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <a
          class="navbar-item"
          on:click={() => {
            logout();
          }}
        >
          <i class="fa-solid fa-power-off" />
        </a>
      {/if}
    </div>
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

<style>
  .navbar-menu {
    min-height: 56px;
    display: flex;
    align-items: stretch;
  }
  .navbar-start {
    justify-content: flex-start;
    display: flex;
  }
  .navbar-end {
    justify-content: flex-end;
    margin-left: auto;
    display: flex;
  }
  .navbar-item {
    align-items: center;
    display: flex;
  }
</style>
