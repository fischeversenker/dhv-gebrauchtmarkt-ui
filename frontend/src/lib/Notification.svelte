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

  function onCloseClicked() {
    $notification = null;
  }

  onDestroy(() => {
    unsubscribeNotification();
  });
</script>

<div>
  {#if $notification !== null}
    <div class="box" transition:fly={{ y: 400 }} on:click={onNotificationClicked} on:keydown={onNotificationClicked}>
      <div
        class="notification"
        class:is-info={$notification.type === 'info'}
        class:is-warning={$notification.type === 'warning'}
        class:is-success={$notification.type === 'success'}
        class:is-danger={$notification.type === 'error'}
      >
        <button class="delete" on:click={onCloseClicked} />
        {@html $notification.message}
      </div>
    </div>
  {/if}
</div>

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
