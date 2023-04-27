<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import { user } from './store';

  const dispatch = createEventDispatcher();

  let isLoading = writable(false);

  let username = '';
  let password = '';

  let error = false;

  async function onSubmit() {
    $isLoading = true;
    const loginForm = new FormData();
    loginForm.append('uid', username);
    loginForm.append('pwd', password);
    // this request will set a cookie with our dhv session id
    const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
      body: loginForm,
      method: 'POST',
      credentials: 'include'
    });

    $isLoading = false;

    if (loginResponse.ok) {
      dispatch('close');
      $user = username;
    } else {
      error = true;
    }
  }

  function onCancelClicked() {
    dispatch('close');
  }
</script>

<form on:submit|preventDefault={onSubmit}>
  <div class="field">
    <label class="label" for="username">Username</label>
    <div class="control" class:is-loading={$isLoading}>
      <input class="input" id="username" type="text" placeholder="pilot1" required bind:value={username} />
    </div>
  </div>

  <div class="field">
    <label class="label" for="password">Passwort</label>
    <div class="control" class:is-loading={$isLoading}>
      <input class="input" id="password" type="password" required bind:value={password} />
    </div>
  </div>

  {#if error}
    <p class="content has-text-danger">Login fehlgeschlagen! Bitte Username und Passwort überprüfen.</p>
  {/if}

  <div class="field is-grouped">
    <div class="control">
      <button type="submit" class="button is-link" disabled={$isLoading}>Login</button>
    </div>
    <div class="control">
      <button class="button is-link is-light" disabled={$isLoading} on:click={onCancelClicked}>Abbrechen</button>
    </div>
  </div>
</form>
