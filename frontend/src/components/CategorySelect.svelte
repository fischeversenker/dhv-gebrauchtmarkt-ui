<script lang="ts">
  import { isLoading, filterCategory } from "../store";

  let categories = [
    {
      value: 0,
      label: 'Alle',
    },
    {
      value: 1,
      label: 'Gleitschirme',
    },
    {
      value: 11,
      label: 'Gurtzeuge',
    },
    {
      value: 4,
      label: 'Retter',
    }
  ];

  async function setCategory(category: number) {
    if ($filterCategory === category) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    filterCategory.set(category);
  }
</script>

<main>
  <nav class="level is-mobile has-background-light m-0 px-5 py-4 category-select">
    {#each categories as category}
      <div class="level-item">
        <button class="button" class:is-info={$filterCategory === category.value} class:is-loading={$isLoading} on:click={() => setCategory(category.value)}>{category.label}</button>
      </div>
    {/each}
  </nav>
</main>

<style>
  .category-select {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
</style>
