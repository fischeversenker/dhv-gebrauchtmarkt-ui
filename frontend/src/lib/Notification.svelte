<script lang="ts">
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { notification } from './store';

  const unsubscribeNotification = notification.subscribe((currentNotification) => {
    if (currentNotification === null) return;

    setTimeout(() => {
      $notification = null;
    }, currentNotification.duration || 5000);
  });

  function onNotificationClicked() {
    if ($notification?.callback) $notification.callback();
    $notification = null;
  }

  onDestroy(() => {
    unsubscribeNotification();
  });
</script>

<template>
  {#if $notification !== null}
    <div class="box" transition:fly={{ y: 400 }} on:click={onNotificationClicked}>
      <div class="notification" class:is-success={$notification.type === 'success'} class:is-danger={$notification.type === 'error'}>
        <button class="delete"></button>
        {$notification.message}
      </div>
    </div>
  {/if}
</template>

<style>
  .box {
    position: fixed;
    background-color: transparent;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: none;
  }
</style>
