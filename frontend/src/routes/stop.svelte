<script lang="ts">
  import { browser } from '$app/env';
  import {
      notification
  } from '$lib/store';
  import { Client } from "@pusher/push-notifications-web";
  import { onMount } from 'svelte';

  onMount(() => {
    const beamsClient = new Client({
      instanceId: import.meta.env.VITE_PUSHER_INSTANCE_ID,
    });

    beamsClient.stop().then(() => {
      $notification = {
        message: 'Du erhältst nun keine Benachrichtigungen mehr.',
        type: 'success'
      }
    })
    .then(() => {
      setTimeout(() => {
        if (browser) {
          window.location.href = '/';
        }
      }, 5000);
    })
    .catch(console.error);
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<template>
</template>
