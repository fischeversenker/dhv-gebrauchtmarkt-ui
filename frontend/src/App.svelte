<script lang="ts">
  import 'bulma/css/bulma.css';
  import { onMount } from 'svelte';
  import Offer from './components/Offer.svelte';

  let offers = [];

  onMount(async () => {
    const res = await fetch('http://localhost:8000/offers').then(res => res.json());
    offers = res.map(offer => {
      return {
        ...offer,
        postedDate: new Date(offer.postedDate),
      };
    });
  });
</script>

<main>
  <section class="section">
    <div class="container">
      <p class="title is-1">
        DHV Gebrauchtmarkt 2.0
      </p>
    </div>
  </section>
  <section class="section">
    {#each offers as offer}
      <div class="block">
        <Offer offer={offer} />
      </div>
    {/each}
  </section>
  <footer class="footer">
    <div class="content has-text-centered">
      <p>
        <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
        is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
      </p>
    </div>
  </footer>
</main>
