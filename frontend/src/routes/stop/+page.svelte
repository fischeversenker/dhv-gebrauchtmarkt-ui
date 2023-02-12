<script lang="ts">
  import { browser } from '$app/environment';
  import { notification, reactedToNotificationRequest, REACTED_TO_NOTIFICATION_REQUEST_KEY } from '$lib/store';
  import { Client } from '@pusher/push-notifications-web';
  import { onMount } from 'svelte';

  onMount(() => {
    const beamsClient = new Client({
      instanceId: import.meta.env.VITE_PUSHER_INSTANCE_ID
    });

    beamsClient
      .stop()
      .then(() => {
        $notification = {
          message: 'Du erhältst nun keine Benachrichtigungen mehr.',
          type: 'success'
        };

        reactedToNotificationRequest.update(() => {
          if (browser) localStorage.removeItem(REACTED_TO_NOTIFICATION_REQUEST_KEY);
          return true;
        });

        setTimeout(() => {
          if (browser) {
            window.location.href = '/';
          }
        }, 2000);
      })
      .catch(console.error);
  });
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
