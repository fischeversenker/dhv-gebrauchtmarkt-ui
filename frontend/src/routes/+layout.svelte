<script lang="ts">
  import { onMount } from 'svelte';
  import 'bulma/bulma.sass';

  import Notification from '$lib/Notification.svelte';
  import FirstTimeVisitorModal from '$lib/FirstTimeVisitorModal.svelte';
  import { clearPendingNotifications, connectToIndexedDb } from '$lib/indexed-db';

  let worker: ServiceWorker | null = null;

  onMount(async () => {
    await connectToIndexedDb();

    if (!worker && document.visibilityState === 'visible') {
      navigator.serviceWorker.ready.then((registration) => {
        clearPendingNotifications();

        worker = registration.active;
        registration.getNotifications({ tag: 'new-offers' }).then((notifications) => {
          notifications.forEach((notification) => notification.close());
        });
      });
    }
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/fontawesome.min.css" />
  <link rel="stylesheet" href="/css/solid.min.css" />
  <link rel="stylesheet" href="/css/brands.min.css" />
</svelte:head>

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
