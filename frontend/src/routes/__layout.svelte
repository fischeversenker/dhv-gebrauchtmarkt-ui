<script>
  import 'bulma/bulma.sass';
  import Notification from '$lib/Notification.svelte';
  import FirstTimeVisitorModal from '$lib/FirstTimeVisitorModal.svelte';
  import { connect } from '$lib/idb';

  connect();
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
