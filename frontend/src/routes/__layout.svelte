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
