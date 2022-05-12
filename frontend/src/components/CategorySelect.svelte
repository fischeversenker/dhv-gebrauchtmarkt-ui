<script lang="ts">
  import { isLoading, filterCategory, filterSearchString } from "../store";

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
      if (category === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      filterCategory.set(0);
      return;
    }

    filterCategory.set(category);
  }
</script>


<main>
  <nav class="level is-mobile has-background-light m-0 px-5 py-4 category-select">
    <div class="level-item">
      <p class="control has-icons-left">
        <input class="input" type="search" placeholder="Search..." bind:value={$filterSearchString} />
        <span class="icon is-small is-left">
          <i class="fas fa-search"></i>
        </span>
      </p>
    </div>
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
