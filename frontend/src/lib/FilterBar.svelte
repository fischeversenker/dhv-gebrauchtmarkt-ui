<script lang="ts">
  import { filterCategory, filterSorting, filterSearchString } from './store';

  const categories = [
    {
      value: 0,
      label: '🌐 Alles'
    },
    {
      value: 1,
      label: '🪂 Gleitschirme'
    },
    {
      value: 11,
      label: '💺 Gurtzeuge'
    },
    {
      value: 4,
      label: '⛑️ Retter'
    },
    {
      value: 5,
      label: '📳 Zubehör'
    },
    {
      value: 13,
      label: '❔ Sonstiges'
    }
  ];

  const sortingOptions = [
    {
      value: 1,
      label: '⌚'
    },
    {
      value: 2,
      label: '💵⬆️'
    },
    {
      value: 3,
      label: '💵⬇️'
    }
  ];
</script>

<nav class="is-flex is-justify-content-space-between has-background-light m-0 px-2 py-2 category-select">
  <div class="control has-icons-left is-flex-grow-1">
    <input class="input" type="search" placeholder="Suche..." bind:value={$filterSearchString} />
    <span class="icon is-small is-left">
      <i class="fas fa-search" />
    </span>
  </div>
  <div class="control">
    <div class="select">
      <select bind:value={$filterCategory}>
        {#each categories as category}
          <option value={category.value}>{category.label}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="control">
    <div class="select">
      <select bind:value={$filterSorting}>
        {#each sortingOptions as sortingOption}
          <option value={sortingOption.value}>{sortingOption.label}</option>
        {/each}
      </select>
    </div>
  </div>
</nav>

<style>
  .category-select {
    position: fixed;
    bottom: 0;
    width: 100%;
    gap: 0.3rem;
    max-width: 800px;
  }
</style>
