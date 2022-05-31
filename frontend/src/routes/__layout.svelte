<script>
  import 'bulma/bulma.sass';
  import Notification from '$lib/Notification.svelte';
  import FirstTimeVisitorModal from '$lib/FirstTimeVisitorModal.svelte';
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
