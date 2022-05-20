<script>
  import 'bulma/bulma.sass';
  import Notification from '$lib/Notification.svelte';
</script>

<main>
  <slot />

  <Notification />
</main>
