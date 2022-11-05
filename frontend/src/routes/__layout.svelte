<script>
  import { onMount } from 'svelte';
  import 'bulma/bulma.sass';
  import Notification from '$lib/Notification.svelte';
  import FirstTimeVisitorModal from '$lib/FirstTimeVisitorModal.svelte';
  import { connectToIndexedDb } from '$lib/indexed-db';

  connectToIndexedDb();

  onMount(() => {
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.getNotifications({ tag: 'new-offers' }).then((notifications) => {
            notifications.forEach((notification) => notification.close());
          });
        });
      }
    });
  });
</script>

<main>
  <slot />

  <FirstTimeVisitorModal />
  <Notification />
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
